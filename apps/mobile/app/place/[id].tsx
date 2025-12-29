import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  ScrollView,
  Image,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Navigation,
  Phone,
  Globe,
  Disc3,
} from '@tamagui/lucide-icons';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Mock place data - replace with real data from API
  const place = {
    id,
    name: 'Kopi Kenangan',
    address: 'Jl. Sudirman No. 45, Jakarta Pusat',
    category: 'cafe',
    rating: 4.5,
    priceLevel: 2,
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    openNow: true,
    openingHours: '07:00 - 22:00',
    phone: '+62 21 1234 5678',
    website: 'https://kopikenangan.com',
    latitude: -6.2088,
    longitude: 106.8456,
    description: 'Kopi Kenangan is one of Indonesia\'s fastest-growing coffee chains, known for its affordable yet high-quality coffee beverages.',
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${place.phone}`);
  };

  const handleWebsite = () => {
    if (place.website) {
      Linking.openURL(place.website);
    }
  };

  const renderPriceLevel = (level: number) => {
    return Array.from({ length: 4 }, (_, i) => (
      <DollarSign
        key={i}
        size={14}
        color={i < level ? '$success' : '$textMuted'}
      />
    ));
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header Image */}
      <YStack position="relative">
        <Image
          source={{ uri: place.photoUrl }}
          width="100%"
          height={250}
        />
        <Button
          position="absolute"
          top={insets.top + 10}
          right={16}
          size="$4"
          circular
          backgroundColor="$card"
          onPress={() => router.back()}
        >
          <X size={20} color="$color" />
        </Button>
      </YStack>

      <ScrollView
        flex={1}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Main Info */}
        <YStack padding="$4">
          <Text fontSize="$7" fontWeight="bold" color="$color">
            {place.name}
          </Text>

          <XStack alignItems="center" space="$3" marginTop="$2">
            {/* Rating */}
            <XStack alignItems="center" space="$1">
              <Star size={16} color="$warning" fill="$warning" />
              <Text fontSize="$4" fontWeight="bold" color="$color">
                {place.rating}
              </Text>
            </XStack>

            {/* Price Level */}
            <XStack alignItems="center">
              {renderPriceLevel(place.priceLevel)}
            </XStack>

            {/* Category */}
            <Card
              backgroundColor="$primary"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="white" textTransform="capitalize">
                {place.category}
              </Text>
            </Card>
          </XStack>

          {/* Address */}
          <XStack alignItems="flex-start" space="$2" marginTop="$4">
            <MapPin size={18} color="$textSecondary" />
            <Text fontSize="$4" color="$textSecondary" flex={1}>
              {place.address}
            </Text>
          </XStack>

          {/* Opening Hours */}
          <XStack alignItems="center" space="$2" marginTop="$3">
            <Clock size={18} color={place.openNow ? '$success' : '$error'} />
            <Text fontSize="$4" color={place.openNow ? '$success' : '$error'}>
              {place.openNow ? 'Open' : 'Closed'}
            </Text>
            <Text fontSize="$4" color="$textSecondary">
              • {place.openingHours}
            </Text>
          </XStack>
        </YStack>

        {/* Description */}
        <YStack paddingHorizontal="$4" paddingBottom="$4">
          <Text fontSize="$5" fontWeight="bold" color="$color" marginBottom="$2">
            About
          </Text>
          <Text fontSize="$4" color="$textSecondary" lineHeight={24}>
            {place.description}
          </Text>
        </YStack>

        {/* Action Buttons */}
        <YStack paddingHorizontal="$4" space="$3">
          <XStack space="$3">
            <Button
              flex={1}
              size="$5"
              backgroundColor="$card"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={handleGetDirections}
              icon={<Navigation size={18} />}
            >
              <Text color="$color">Directions</Text>
            </Button>
            <Button
              flex={1}
              size="$5"
              backgroundColor="$card"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={handleCall}
              icon={<Phone size={18} />}
            >
              <Text color="$color">Call</Text>
            </Button>
          </XStack>

          {place.website && (
            <Button
              size="$5"
              backgroundColor="$card"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={handleWebsite}
              icon={<Globe size={18} />}
            >
              <Text color="$color">Visit Website</Text>
            </Button>
          )}
        </YStack>

        {/* Spin to Get Voucher */}
        <YStack padding="$4" marginTop="$4">
          <Card
            backgroundColor="$primary"
            padding="$4"
            borderRadius="$4"
            pressStyle={{ scale: 0.98 }}
            onPress={() => router.push('/(tabs)/spin')}
          >
            <XStack alignItems="center" justifyContent="center" space="$3">
              <Disc3 size={24} color="white" />
              <YStack>
                <Text fontSize="$5" fontWeight="bold" color="white">
                  Get a voucher for this place!
                </Text>
                <Text fontSize="$3" color="white" opacity={0.9}>
                  Spin the wheel and win discounts
                </Text>
              </YStack>
            </XStack>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
