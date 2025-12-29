import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

/**
 * Hook that calls a callback when the screen comes into focus
 * Useful for refreshing data when navigating back to a screen
 */
export function useRefreshOnFocus(callback: () => void) {
  useFocusEffect(
    useCallback(() => {
      callback();
    }, [callback])
  );
}
