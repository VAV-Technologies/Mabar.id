import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  ScrollView,
  Tabs,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ticket, Clock, MapPin, ChevronRight, Disc3 } from '@tamagui/lucide-icons';

type VoucherStatus = 'active' | 'used' | 'expired';

interface MockVoucher {
  id: string;
  placeName: string;
  discount: string;
  expiresAt: Date;
  status: VoucherStatus;
  code: string;
}

// Mock data
const mockVouchers: MockVoucher[] = [
  {
    id: '1',
    placeName: 'Kopi Kenangan',
    discount: '15% OFF',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    status: 'active',
    code: 'MABAR2024XYZ',
  },
  {
    id: '2',
    placeName: 'Sate Khas Senayan',
    discount: 'Rp 25K OFF',
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
    status: 'active',
    code: 'MABAR2024ABC',
  },
  {
    id: '3',
    placeName: 'Anomali Coffee',
    discount: 'Free Drink',
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // expired
    status: 'expired',
    code: 'MABAR2024DEF',
  },
];

function formatTimeLeft(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
}

function VoucherCard({ voucher }: { voucher: MockVoucher }) {
  const { t } = useTranslation();
  const isExpired = voucher.status === 'expired';
  const isUsed = voucher.status === 'used';

  return (
    <Card
      backgroundColor="$card"
      borderRadius="$4"
      marginBottom="$3"
      overflow="hidden"
      pressStyle={{ opacity: 0.8 }}
      onPress={() => router.push(`/voucher/${voucher.id}`)}
      opacity={isExpired || isUsed ? 0.6 : 1}
    >
      {/* Ticket Design */}
      <XStack>
        {/* Left side - Discount */}
        <YStack
          backgroundColor="$primary"
          padding="$4"
          width={100}
          justifyContent="center"
          alignItems="center"
        >
          <Ticket size={24} color="white" />
          <Text
            fontSize="$5"
            fontWeight="bold"
            color="white"
            textAlign="center"
            marginTop="$2"
          >
            {voucher.discount}
          </Text>
        </YStack>

        {/* Perforated edge */}
        <YStack width={1} backgroundColor="$background" />

        {/* Right side - Details */}
        <YStack flex={1} padding="$4">
          <Text fontSize="$5" fontWeight="bold" color="$color" numberOfLines={1}>
            {voucher.placeName}
          </Text>

          <XStack alignItems="center" marginTop="$2" space="$1">
            <Clock size={14} color={isExpired ? '$error' : '$warning'} />
            <Text
              fontSize="$3"
              color={isExpired ? '$error' : '$warning'}
              fontWeight="500"
            >
              {isExpired
                ? t('voucher.card.expired')
                : isUsed
                ? t('voucher.card.used')
                : formatTimeLeft(voucher.expiresAt)}
            </Text>
          </XStack>

          <XStack alignItems="center" marginTop="$2" space="$1">
            <Text fontSize="$2" color="$textMuted">
              {t('voucher.card.code')}: {voucher.code}
            </Text>
          </XStack>
        </YStack>

        <YStack justifyContent="center" paddingRight="$3">
          <ChevronRight size={20} color="$textMuted" />
        </YStack>
      </XStack>
    </Card>
  );
}

function EmptyState({ type }: { type: VoucherStatus }) {
  const { t } = useTranslation();

  const emptyMessages: Record<VoucherStatus, string> = {
    active: t('voucher.empty.noActiveVouchers'),
    used: t('voucher.empty.noUsedVouchers'),
    expired: t('voucher.empty.noExpiredVouchers'),
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
      <Ticket size={48} color="$textMuted" />
      <Text fontSize="$5" color="$textSecondary" textAlign="center" marginTop="$4">
        {emptyMessages[type]}
      </Text>
      {type === 'active' && (
        <>
          <Text fontSize="$3" color="$textMuted" textAlign="center" marginTop="$2">
            {t('voucher.empty.spinToGet')}
          </Text>
          <Button
            size="$4"
            backgroundColor="$primary"
            color="white"
            marginTop="$4"
            onPress={() => router.push('/(tabs)/spin')}
            icon={<Disc3 size={18} />}
          >
            {t('voucher.empty.goSpin')}
          </Button>
        </>
      )}
    </YStack>
  );
}

export default function WalletScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<VoucherStatus>('active');

  const filteredVouchers = mockVouchers.filter((v) => v.status === activeTab);

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top}
    >
      {/* Header */}
      <YStack padding="$4" paddingBottom="$2">
        <Text fontSize="$7" fontWeight="bold" color="$color">
          {t('voucher.screen.wallet')}
        </Text>
      </YStack>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as VoucherStatus)}
        flexDirection="column"
        flex={1}
      >
        <Tabs.List
          paddingHorizontal="$4"
          backgroundColor="transparent"
        >
          <Tabs.Tab
            flex={1}
            value="active"
            backgroundColor={activeTab === 'active' ? '$primary' : '$card'}
            borderRadius="$4"
          >
            <Text color={activeTab === 'active' ? 'white' : '$color'}>
              {t('voucher.tabs.active')}
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            value="used"
            backgroundColor={activeTab === 'used' ? '$primary' : '$card'}
            borderRadius="$4"
            marginLeft="$2"
          >
            <Text color={activeTab === 'used' ? 'white' : '$color'}>
              {t('voucher.tabs.used')}
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            value="expired"
            backgroundColor={activeTab === 'expired' ? '$primary' : '$card'}
            borderRadius="$4"
            marginLeft="$2"
          >
            <Text color={activeTab === 'expired' ? 'white' : '$color'}>
              {t('voucher.tabs.expired')}
            </Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value={activeTab} flex={1}>
          {filteredVouchers.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            <ScrollView
              flex={1}
              padding="$4"
              contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
            >
              {filteredVouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} />
              ))}
            </ScrollView>
          )}
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}
