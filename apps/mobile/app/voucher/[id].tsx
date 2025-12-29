import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Share, Linking } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  ScrollView,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Ticket,
  Clock,
  MapPin,
  Navigation,
  Share2,
  CheckCircle,
} from '@tamagui/lucide-icons';
import QRCode from 'react-native-qrcode-svg';

export default function VoucherDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Mock voucher data - replace with real data
  const voucher = {
    id,
    code: 'MABAR2024XYZ',
    discount: '15% OFF',
    placeName: 'Kopi Kenangan',
    placeAddress: 'Jl. Sudirman No. 45, Jakarta Pusat',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'active',
    terms: [
      t('voucher.details.minPurchase') + ': Rp 50,000',
      t('voucher.details.maxDiscount') + ': Rp 25,000',
      t('voucher.details.validFor') + ' ' + t('voucher.details.both'),
      t('voucher.details.notCombined'),
    ],
    latitude: -6.2088,
    longitude: 106.8456,
  };

  const formatTimeLeft = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    if (diff <= 0) return t('voucher.card.expired');
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${voucher.latitude},${voucher.longitude}`;
    Linking.openURL(url);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${voucher.discount} voucher for ${voucher.placeName}! Code: ${voucher.code}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleUseVoucher = () => {
    Alert.alert(
      t('voucher.confirm.useTitle'),
      t('voucher.confirm.useMessage'),
      [
        { text: t('common.buttons.cancel'), style: 'cancel' },
        {
          text: t('voucher.actions.markAsUsed'),
          onPress: () => {
            // TODO: Mark voucher as used in database
            router.back();
          },
        },
      ]
    );
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        paddingBottom="$4"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="$6" fontWeight="bold" color="$color">
          {t('voucher.screen.title')}
        </Text>
        <Button
          size="$4"
          circular
          backgroundColor="$card"
          onPress={() => router.back()}
        >
          <X size={20} color="$color" />
        </Button>
      </XStack>

      <ScrollView
        flex={1}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Voucher Card */}
        <Card
          backgroundColor="$card"
          borderRadius="$6"
          overflow="hidden"
          marginBottom="$4"
        >
          {/* Header */}
          <YStack backgroundColor="$primary" padding="$5" alignItems="center">
            <Ticket size={32} color="white" />
            <Text fontSize="$8" fontWeight="bold" color="white" marginTop="$2">
              {voucher.discount}
            </Text>
            <Text fontSize="$5" color="white" opacity={0.9} marginTop="$1">
              {voucher.placeName}
            </Text>
          </YStack>

          {/* QR Code */}
          <YStack padding="$5" alignItems="center" backgroundColor="white">
            <QRCode
              value={voucher.code}
              size={180}
              backgroundColor="white"
              color="#000000"
            />
            <Text
              fontSize="$5"
              fontWeight="bold"
              color="#000000"
              marginTop="$4"
              letterSpacing={2}
            >
              {voucher.code}
            </Text>
          </YStack>

          {/* Expiry */}
          <XStack
            padding="$4"
            justifyContent="center"
            alignItems="center"
            space="$2"
            backgroundColor="$backgroundHover"
          >
            <Clock size={18} color="$warning" />
            <Text fontSize="$4" color="$warning" fontWeight="500">
              {t('voucher.card.expiresIn')}: {formatTimeLeft(voucher.expiresAt)}
            </Text>
          </XStack>
        </Card>

        {/* Place Info */}
        <Card backgroundColor="$card" padding="$4" borderRadius="$4" marginBottom="$4">
          <XStack alignItems="flex-start" space="$3">
            <MapPin size={20} color="$textSecondary" />
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="bold" color="$color">
                {voucher.placeName}
              </Text>
              <Text fontSize="$3" color="$textSecondary" marginTop="$1">
                {voucher.placeAddress}
              </Text>
            </YStack>
          </XStack>
        </Card>

        {/* Terms & Conditions */}
        <Card backgroundColor="$card" padding="$4" borderRadius="$4" marginBottom="$4">
          <Text fontSize="$4" fontWeight="bold" color="$color" marginBottom="$3">
            {t('voucher.details.termsConditions')}
          </Text>
          {voucher.terms.map((term, index) => (
            <XStack key={index} alignItems="flex-start" space="$2" marginBottom="$2">
              <Text color="$textSecondary">•</Text>
              <Text fontSize="$3" color="$textSecondary" flex={1}>
                {term}
              </Text>
            </XStack>
          ))}
        </Card>

        {/* Action Buttons */}
        <XStack space="$3" marginBottom="$4">
          <Button
            flex={1}
            size="$5"
            backgroundColor="$card"
            borderWidth={1}
            borderColor="$borderColor"
            onPress={handleGetDirections}
            icon={<Navigation size={18} />}
          >
            <Text color="$color">{t('voucher.actions.getDirections')}</Text>
          </Button>
          <Button
            flex={1}
            size="$5"
            backgroundColor="$card"
            borderWidth={1}
            borderColor="$borderColor"
            onPress={handleShare}
            icon={<Share2 size={18} />}
          >
            <Text color="$color">{t('voucher.actions.shareWithFriends')}</Text>
          </Button>
        </XStack>

        {/* Use Voucher Button */}
        <Button
          size="$5"
          backgroundColor="$primary"
          color="white"
          fontWeight="bold"
          onPress={handleUseVoucher}
          icon={<CheckCircle size={20} />}
        >
          {t('voucher.actions.useVoucher')}
        </Button>

        {/* Hint */}
        <Text
          fontSize="$3"
          color="$textMuted"
          textAlign="center"
          marginTop="$4"
        >
          {t('voucher.actions.showToStaff')}
        </Text>
      </ScrollView>
    </YStack>
  );
}
