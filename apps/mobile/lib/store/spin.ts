import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Place, PlaceCategory, DailySpinStatus, SearchArea } from '@mabar/shared/types';
import { SPIN_CONFIG } from '@mabar/shared/constants';

interface SpinState {
  // Spin status
  dailyStatus: DailySpinStatus | null;
  isLoadingStatus: boolean;

  // Places for spin
  availablePlaces: Place[];
  isLoadingPlaces: boolean;
  selectedPlace: Place | null;

  // Spin state
  isSpinning: boolean;
  spinResult: Place | null;

  // Filters
  categoryFilter: PlaceCategory | 'all';

  // Actions
  fetchDailyStatus: () => Promise<void>;
  fetchNearbyPlaces: (area: SearchArea, category?: PlaceCategory | 'all') => Promise<void>;
  performSpin: (area: SearchArea) => Promise<Place | null>;
  setCategoryFilter: (category: PlaceCategory | 'all') => void;
  clearSpinResult: () => void;
}

export const useSpinStore = create<SpinState>((set, get) => ({
  dailyStatus: null,
  isLoadingStatus: false,
  availablePlaces: [],
  isLoadingPlaces: false,
  selectedPlace: null,
  isSpinning: false,
  spinResult: null,
  categoryFilter: 'all',

  fetchDailyStatus: async () => {
    try {
      set({ isLoadingStatus: true });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoadingStatus: false });
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      // Get or create daily spin record
      const { data, error } = await supabase
        .from('user_daily_spins')
        .select('spins_used, max_spins')
        .eq('user_id', user.id)
        .eq('spin_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found, which is fine
        throw error;
      }

      const status: DailySpinStatus = {
        spinsUsed: data?.spins_used || 0,
        maxSpins: data?.max_spins || SPIN_CONFIG.DEFAULT_MAX_DAILY_SPINS,
        spinsRemaining: (data?.max_spins || SPIN_CONFIG.DEFAULT_MAX_DAILY_SPINS) - (data?.spins_used || 0),
      };

      set({ dailyStatus: status, isLoadingStatus: false });
    } catch (error) {
      console.error('Error fetching daily status:', error);
      set({
        isLoadingStatus: false,
        dailyStatus: {
          spinsUsed: 0,
          maxSpins: SPIN_CONFIG.DEFAULT_MAX_DAILY_SPINS,
          spinsRemaining: SPIN_CONFIG.DEFAULT_MAX_DAILY_SPINS,
        },
      });
    }
  },

  fetchNearbyPlaces: async (area, category = 'all') => {
    try {
      set({ isLoadingPlaces: true });

      const { data, error } = await supabase.rpc('get_nearby_places', {
        lat: area.latitude,
        lng: area.longitude,
        radius_km: area.radiusKm,
        category_filter: category === 'all' ? null : category,
      });

      if (error) throw error;

      const places: Place[] = (data || []).map((p: any) => ({
        id: p.id,
        googlePlaceId: null,
        name: p.name,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        category: p.category,
        rating: p.rating,
        priceLevel: p.price_level,
        photoUrl: p.photo_url,
        isActive: true,
        createdAt: new Date().toISOString(),
      }));

      set({ availablePlaces: places, isLoadingPlaces: false });
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      set({ isLoadingPlaces: false, availablePlaces: [] });
    }
  },

  performSpin: async (area) => {
    const { dailyStatus, availablePlaces, categoryFilter } = get();

    if (!dailyStatus || dailyStatus.spinsRemaining <= 0) {
      return null;
    }

    if (availablePlaces.length === 0) {
      await get().fetchNearbyPlaces(area, categoryFilter);
      const { availablePlaces: refreshedPlaces } = get();
      if (refreshedPlaces.length === 0) {
        return null;
      }
    }

    try {
      set({ isSpinning: true });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isSpinning: false });
        return null;
      }

      // Use the spin (update daily count)
      const { data: spinCheck } = await supabase.rpc('check_and_use_spin', {
        p_user_id: user.id,
      });

      if (!spinCheck?.[0]?.can_spin) {
        set({ isSpinning: false });
        return null;
      }

      // Random selection
      const { availablePlaces: places } = get();
      const randomIndex = Math.floor(Math.random() * places.length);
      const selectedPlace = places[randomIndex];

      // Record spin history
      await supabase.from('spin_history').insert({
        user_id: user.id,
        place_id: selectedPlace.id,
        latitude: area.latitude,
        longitude: area.longitude,
        radius_km: area.radiusKm,
      });

      // Update local state
      set({
        isSpinning: false,
        spinResult: selectedPlace,
        selectedPlace,
        dailyStatus: {
          ...dailyStatus,
          spinsUsed: dailyStatus.spinsUsed + 1,
          spinsRemaining: dailyStatus.spinsRemaining - 1,
        },
      });

      return selectedPlace;
    } catch (error) {
      console.error('Error performing spin:', error);
      set({ isSpinning: false });
      return null;
    }
  },

  setCategoryFilter: (category) => {
    set({ categoryFilter: category });
  },

  clearSpinResult: () => {
    set({ spinResult: null, selectedPlace: null });
  },
}));
