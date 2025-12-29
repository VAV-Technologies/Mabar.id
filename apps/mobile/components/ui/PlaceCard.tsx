import { router } from 'expo-router';
import {
  YStack,
  XStack,
  Text,
  Card,
  Image,
} from 'tamagui';
import { Star, MapPin, DollarSign } from '@tamagui/lucide-icons';
import type { Place } from '@mabar/shared/types';

interface PlaceCardProps {
  place: Place;
  distance?: number;
  onPress?: () => void;
}

export function PlaceCard({ place, distance, onPress }: PlaceCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/place/${place.id}`);
    }
  };

  const renderPriceLevel = (level: number | null) => {
    if (!level) return null;
    return Array.from({ length: level }, (_, i) => (
      <DollarSign key={i} size={12} color="$success" />
    ));
  };

  return (
    <Card
      backgroundColor="$card"
      borderRadius="$4"
      overflow="hidden"
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
      onPress={handlePress}
    >
      {/* Image */}
      {place.photoUrl && (
        <Image
          source={{ uri: place.photoUrl }}
          width="100%"
          height={120}
        />
      )}

      {/* Content */}
      <YStack padding="$3" space="$2">
        <Text fontSize="$4" fontWeight="bold" color="$color" numberOfLines={1}>
          {place.name}
        </Text>

        <XStack alignItems="center" space="$3">
          {/* Rating */}
          {place.rating && (
            <XStack alignItems="center" space="$1">
              <Star size={14} color="$warning" fill="$warning" />
              <Text fontSize="$3" color="$color">{place.rating}</Text>
            </XStack>
          )}

          {/* Price Level */}
          {place.priceLevel && (
            <XStack alignItems="center">
              {renderPriceLevel(place.priceLevel)}
            </XStack>
          )}

          {/* Category */}
          <Text fontSize="$2" color="$textMuted" textTransform="capitalize">
            {place.category}
          </Text>
        </XStack>

        {/* Address */}
        {place.address && (
          <XStack alignItems="center" space="$1">
            <MapPin size={12} color="$textMuted" />
            <Text fontSize="$2" color="$textSecondary" numberOfLines={1} flex={1}>
              {place.address}
            </Text>
          </XStack>
        )}

        {/* Distance */}
        {distance !== undefined && (
          <Text fontSize="$2" color="$primary" fontWeight="500">
            {distance < 1 ? `${Math.round(distance * 1000)}m away` : `${distance.toFixed(1)}km away`}
          </Text>
        )}
      </YStack>
    </Card>
  );
}
