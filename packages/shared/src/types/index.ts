// User types
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  language: Language;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
}

export type Language = 'en' | 'id';
export type Theme = 'dark' | 'light' | 'cream';

// Place types
export interface Place {
  id: string;
  googlePlaceId: string | null;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  category: PlaceCategory;
  rating: number | null;
  priceLevel: number | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export type PlaceCategory = 'cafe' | 'restaurant' | 'bar' | 'bakery';

// Voucher types
export interface VoucherTemplate {
  id: string;
  placeId: string;
  discountType: DiscountType;
  discountValue: number;
  titleEn: string;
  titleId: string;
  descriptionEn: string | null;
  descriptionId: string | null;
  termsEn: string | null;
  termsId: string | null;
  minPurchase: number | null;
  maxDiscount: number | null;
  validFor: VoucherValidFor;
  validityHours: number;
  isActive: boolean;
  createdAt: string;
}

export type DiscountType = 'percentage' | 'fixed' | 'freebie';
export type VoucherValidFor = 'dine_in' | 'takeaway' | 'both';

export interface UserVoucher {
  id: string;
  userId: string;
  voucherTemplateId: string;
  placeId: string;
  code: string;
  status: VoucherStatus;
  claimedAt: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
  // Joined data
  voucherTemplate?: VoucherTemplate;
  place?: Place;
}

export type VoucherStatus = 'active' | 'used' | 'expired';

// Spin types
export interface SpinHistory {
  id: string;
  userId: string;
  placeId: string;
  voucherId: string | null;
  latitude: number;
  longitude: number;
  radiusKm: number;
  spunAt: string;
  // Joined data
  place?: Place;
  voucher?: UserVoucher;
}

export interface DailySpinStatus {
  spinsUsed: number;
  maxSpins: number;
  spinsRemaining: number;
}

// Location types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface SearchArea extends Coordinates {
  radiusKm: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
}

// Filter types
export interface PlaceFilters {
  category?: PlaceCategory | 'all';
  radiusKm?: number;
  minRating?: number;
  priceLevel?: number[];
}
