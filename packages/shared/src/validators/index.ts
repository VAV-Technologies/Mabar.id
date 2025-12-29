import { z } from 'zod';

// Auth validators
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

// Profile validators
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  language: z.enum(['en', 'id']).optional(),
  theme: z.enum(['dark', 'light', 'cream']).optional(),
});

// Location validators
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const searchAreaSchema = coordinatesSchema.extend({
  radiusKm: z.number().min(1).max(10),
});

// Place filter validators
export const placeFiltersSchema = z.object({
  category: z.enum(['cafe', 'restaurant', 'bar', 'bakery', 'all']).optional(),
  radiusKm: z.number().min(1).max(10).optional(),
  minRating: z.number().min(0).max(5).optional(),
  priceLevel: z.array(z.number().min(1).max(4)).optional(),
});

// Spin validators
export const performSpinSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusKm: z.number().min(1).max(10),
  category: z.enum(['cafe', 'restaurant', 'bar', 'bakery', 'all']).optional(),
});

// Type exports from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CoordinatesInput = z.infer<typeof coordinatesSchema>;
export type SearchAreaInput = z.infer<typeof searchAreaSchema>;
export type PlaceFiltersInput = z.infer<typeof placeFiltersSchema>;
export type PerformSpinInput = z.infer<typeof performSpinSchema>;
