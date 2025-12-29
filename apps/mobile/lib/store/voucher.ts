import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { UserVoucher, VoucherStatus } from '@mabar/shared/types';

interface VoucherState {
  // Vouchers
  vouchers: UserVoucher[];
  isLoading: boolean;
  error: string | null;

  // Active voucher for viewing
  activeVoucher: UserVoucher | null;

  // Actions
  fetchVouchers: (status?: VoucherStatus) => Promise<void>;
  fetchVoucherById: (id: string) => Promise<UserVoucher | null>;
  claimVoucher: (placeId: string, templateId: string) => Promise<UserVoucher | null>;
  useVoucher: (voucherId: string) => Promise<boolean>;
  setActiveVoucher: (voucher: UserVoucher | null) => void;
  clearError: () => void;
}

export const useVoucherStore = create<VoucherState>((set, get) => ({
  vouchers: [],
  isLoading: false,
  error: null,
  activeVoucher: null,

  fetchVouchers: async (status) => {
    try {
      set({ isLoading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoading: false });
        return;
      }

      let query = supabase
        .from('user_vouchers')
        .select(`
          *,
          voucher_template:voucher_templates(*),
          place:places(*)
        `)
        .eq('user_id', user.id)
        .order('claimed_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      const vouchers: UserVoucher[] = (data || []).map((v: any) => ({
        id: v.id,
        userId: v.user_id,
        voucherTemplateId: v.voucher_template_id,
        placeId: v.place_id,
        code: v.code,
        status: v.status,
        claimedAt: v.claimed_at,
        expiresAt: v.expires_at,
        usedAt: v.used_at,
        createdAt: v.created_at,
        voucherTemplate: v.voucher_template ? {
          id: v.voucher_template.id,
          placeId: v.voucher_template.place_id,
          discountType: v.voucher_template.discount_type,
          discountValue: v.voucher_template.discount_value,
          titleEn: v.voucher_template.title_en,
          titleId: v.voucher_template.title_id,
          descriptionEn: v.voucher_template.description_en,
          descriptionId: v.voucher_template.description_id,
          termsEn: v.voucher_template.terms_en,
          termsId: v.voucher_template.terms_id,
          minPurchase: v.voucher_template.min_purchase,
          maxDiscount: v.voucher_template.max_discount,
          validFor: v.voucher_template.valid_for,
          validityHours: v.voucher_template.validity_hours,
          isActive: v.voucher_template.is_active,
          createdAt: v.voucher_template.created_at,
        } : undefined,
        place: v.place ? {
          id: v.place.id,
          googlePlaceId: v.place.google_place_id,
          name: v.place.name,
          address: v.place.address,
          latitude: v.place.latitude,
          longitude: v.place.longitude,
          category: v.place.category,
          rating: v.place.rating,
          priceLevel: v.place.price_level,
          photoUrl: v.place.photo_url,
          isActive: v.place.is_active,
          createdAt: v.place.created_at,
        } : undefined,
      }));

      set({ vouchers, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vouchers',
      });
    }
  },

  fetchVoucherById: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from('user_vouchers')
        .select(`
          *,
          voucher_template:voucher_templates(*),
          place:places(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const voucher: UserVoucher = {
        id: data.id,
        userId: data.user_id,
        voucherTemplateId: data.voucher_template_id,
        placeId: data.place_id,
        code: data.code,
        status: data.status,
        claimedAt: data.claimed_at,
        expiresAt: data.expires_at,
        usedAt: data.used_at,
        createdAt: data.created_at,
        voucherTemplate: data.voucher_template,
        place: data.place,
      };

      set({ activeVoucher: voucher, isLoading: false });
      return voucher;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch voucher',
      });
      return null;
    }
  },

  claimVoucher: async (placeId, templateId) => {
    try {
      set({ isLoading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoading: false, error: 'Not authenticated' });
        return null;
      }

      const { data: voucherId, error } = await supabase.rpc('claim_voucher', {
        p_user_id: user.id,
        p_place_id: placeId,
        p_template_id: templateId,
      });

      if (error) throw error;

      // Fetch the newly created voucher
      const voucher = await get().fetchVoucherById(voucherId);

      // Refresh vouchers list
      await get().fetchVouchers();

      set({ isLoading: false });
      return voucher;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to claim voucher',
      });
      return null;
    }
  },

  useVoucher: async (voucherId) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase.rpc('use_voucher', {
        p_voucher_id: voucherId,
      });

      if (error) throw error;

      // Update local state
      const { vouchers } = get();
      const updatedVouchers = vouchers.map((v) =>
        v.id === voucherId
          ? { ...v, status: 'used' as VoucherStatus, usedAt: new Date().toISOString() }
          : v
      );

      set({
        vouchers: updatedVouchers,
        isLoading: false,
        activeVoucher: null,
      });

      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to use voucher',
      });
      return false;
    }
  },

  setActiveVoucher: (voucher) => {
    set({ activeVoucher: voucher });
  },

  clearError: () => {
    set({ error: null });
  },
}));
