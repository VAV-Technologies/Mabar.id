import { create } from 'zustand';
import * as Location from 'expo-location';
import type { Coordinates, SearchArea } from '@mabar/shared/types';
import { SPIN_CONFIG } from '@mabar/shared/constants';

interface LocationState {
  // Current user location
  currentLocation: Coordinates | null;
  locationError: string | null;
  isLoadingLocation: boolean;
  hasLocationPermission: boolean;

  // Search area for spin
  searchArea: SearchArea | null;
  radiusKm: number;

  // Actions
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Coordinates | null>;
  setSearchArea: (area: SearchArea) => void;
  setRadius: (radiusKm: number) => void;
  clearSearchArea: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  locationError: null,
  isLoadingLocation: false,
  hasLocationPermission: false,
  searchArea: null,
  radiusKm: SPIN_CONFIG.DEFAULT_RADIUS_KM,

  requestLocationPermission: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      set({ hasLocationPermission: hasPermission });

      if (!hasPermission) {
        set({ locationError: 'Location permission denied' });
      }

      return hasPermission;
    } catch (error) {
      set({
        hasLocationPermission: false,
        locationError: error instanceof Error ? error.message : 'Failed to request permission',
      });
      return false;
    }
  },

  getCurrentLocation: async () => {
    const { hasLocationPermission } = get();

    if (!hasLocationPermission) {
      const granted = await get().requestLocationPermission();
      if (!granted) return null;
    }

    try {
      set({ isLoadingLocation: true, locationError: null });

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      set({
        currentLocation: coords,
        isLoadingLocation: false,
      });

      // Auto-set search area if not set
      const { searchArea, radiusKm } = get();
      if (!searchArea) {
        set({
          searchArea: {
            ...coords,
            radiusKm,
          },
        });
      }

      return coords;
    } catch (error) {
      set({
        isLoadingLocation: false,
        locationError: error instanceof Error ? error.message : 'Failed to get location',
      });
      return null;
    }
  },

  setSearchArea: (area) => {
    set({ searchArea: area });
  },

  setRadius: (radiusKm) => {
    const { searchArea } = get();
    set({ radiusKm });

    if (searchArea) {
      set({
        searchArea: {
          ...searchArea,
          radiusKm,
        },
      });
    }
  },

  clearSearchArea: () => {
    set({ searchArea: null });
  },
}));
