import { useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  Spinner,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, Navigation, Coffee, UtensilsCrossed } from '@tamagui/lucide-icons';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState(3);

  // Mock places data
  const mockPlaces = [
    { id: '1', name: 'Kopi Kenangan', latitude: -6.2088, longitude: 106.8456, category: 'cafe' },
    { id: '2', name: 'Sate Senayan', latitude: -6.2345, longitude: 106.7987, category: 'restaurant' },
    { id: '3', name: 'Anomali Coffee', latitude: -6.2612, longitude: 106.8145, category: 'cafe' },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setIsLoading(false);
    })();
  }, []);

  const handleCenterOnUser = async () => {
    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
        <Text marginTop="$4" color="$textSecondary">
          Getting your location...
        </Text>
      </YStack>
    );
  }

  if (errorMsg) {
    return (
      <YStack flex={1} backgroundColor="$background" justifyContent="center" alignItems="center" padding="$4">
        <MapPin size={48} color="$error" />
        <Text fontSize="$5" fontWeight="bold" color="$color" textAlign="center" marginTop="$4">
          Location Access Required
        </Text>
        <Text fontSize="$4" color="$textSecondary" textAlign="center" marginTop="$2">
          {errorMsg}
        </Text>
      </YStack>
    );
  }

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: -6.2088,
        longitude: 106.8456,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <YStack flex={1} backgroundColor="$background">
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Search radius circle */}
        {location && (
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={radiusKm * 1000}
            fillColor="rgba(255, 107, 53, 0.1)"
            strokeColor="rgba(255, 107, 53, 0.5)"
            strokeWidth={2}
          />
        )}

        {/* Place markers */}
        {mockPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
          />
        ))}
      </MapView>

      {/* Top overlay */}
      <YStack
        position="absolute"
        top={insets.top + 10}
        left="$4"
        right="$4"
      >
        <Card backgroundColor="$card" padding="$3" borderRadius="$4">
          <Text fontSize="$5" fontWeight="bold" color="$color" textAlign="center">
            {t('spin.map.foundPlaces', { count: mockPlaces.length })}
          </Text>
          <Text fontSize="$3" color="$textSecondary" textAlign="center" marginTop="$1">
            {t('spin.map.dragToMove')}
          </Text>
        </Card>
      </YStack>

      {/* Radius selector */}
      <YStack
        position="absolute"
        top={insets.top + 100}
        right="$4"
      >
        <Card backgroundColor="$card" padding="$2" borderRadius="$4">
          <YStack space="$2">
            {[1, 3, 5, 10].map((km) => (
              <Button
                key={km}
                size="$3"
                backgroundColor={radiusKm === km ? '$primary' : 'transparent'}
                borderRadius="$2"
                onPress={() => setRadiusKm(km)}
              >
                <Text
                  color={radiusKm === km ? 'white' : '$color'}
                  fontSize="$2"
                  fontWeight="bold"
                >
                  {km}km
                </Text>
              </Button>
            ))}
          </YStack>
        </Card>
      </YStack>

      {/* Center on user button */}
      <Button
        position="absolute"
        bottom={insets.bottom + 120}
        right="$4"
        size="$5"
        circular
        backgroundColor="$card"
        borderWidth={1}
        borderColor="$borderColor"
        onPress={handleCenterOnUser}
      >
        <Navigation size={24} color="$primary" />
      </Button>

      {/* Confirm selection button */}
      <YStack
        position="absolute"
        bottom={insets.bottom + 100}
        left="$4"
        right="$4"
      >
        <Button
          size="$5"
          backgroundColor="$primary"
          color="white"
          fontWeight="bold"
          borderRadius="$4"
        >
          {t('spin.map.confirmSelection')}
        </Button>
      </YStack>
    </YStack>
  );
}
