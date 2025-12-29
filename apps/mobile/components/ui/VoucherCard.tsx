import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  YStack,
  XStack,
  Text,
  Card,
} from 'tamagui';
import { Ticket, Clock, ChevronRight } from '@tamagui/lucide-icons';
import type { UserVoucher } from '@mabar/shared/types';
import { getCurrentLanguage } from '@/lib/i18n';

interface VoucherCardProps {
  voucher: UserVoucher;
  onPress?: () => void;
}

function formatTimeLeft(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
}

function getDiscountText(voucher: UserVoucher): string {
  const template = voucher.voucherTemplate;
  if (!template) return 'Discount';

  const lang = getCurrentLanguage();
  return lang === 'id' ? template.titleId : template.titleEn;
}

export function VoucherCard({ voucher, onPress }: VoucherCardProps) {
  const { t } = useTranslation();

  const isExpired = voucher.status === 'expired' || new Date(voucher.expiresAt) < new Date();
  const isUsed = voucher.status === 'used';
  const placeName = voucher.place?.name || 'Unknown Place';

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/voucher/${voucher.id}`);
    }
  };

  return (
    <Card
      backgroundColor="$card"
      borderRadius="$4"
      overflow="hidden"
      pressStyle={{ opacity: 0.8 }}
      onPress={handlePress}
      opacity={isExpired || isUsed ? 0.6 : 1}
    >
      <XStack>
        {/* Left side - Discount */}
        <YStack
          backgroundColor="$primary"
          padding="$4"
          width={90}
          justifyContent="center"
          alignItems="center"
        >
          <Ticket size={20} color="white" />
          <Text
            fontSize="$3"
            fontWeight="bold"
            color="white"
            textAlign="center"
            marginTop="$1"
            numberOfLines={2}
          >
            {getDiscountText(voucher)}
          </Text>
        </YStack>

        {/* Perforated edge */}
        <YStack width={1} backgroundColor="$background" />

        {/* Right side - Details */}
        <YStack flex={1} padding="$3" justifyContent="center">
          <Text fontSize="$4" fontWeight="bold" color="$color" numberOfLines={1}>
            {placeName}
          </Text>

          <XStack alignItems="center" marginTop="$2" space="$1">
            <Clock
              size={14}
              color={isExpired ? '$error' : isUsed ? '$textMuted' : '$warning'}
            />
            <Text
              fontSize="$3"
              color={isExpired ? '$error' : isUsed ? '$textMuted' : '$warning'}
              fontWeight="500"
            >
              {isExpired
                ? t('voucher.card.expired')
                : isUsed
                ? t('voucher.card.used')
                : formatTimeLeft(voucher.expiresAt)}
            </Text>
          </XStack>

          <Text fontSize="$2" color="$textMuted" marginTop="$1">
            {t('voucher.card.code')}: {voucher.code}
          </Text>
        </YStack>

        <YStack justifyContent="center" paddingRight="$3">
          <ChevronRight size={18} color="$textMuted" />
        </YStack>
      </XStack>
    </Card>
  );
}
