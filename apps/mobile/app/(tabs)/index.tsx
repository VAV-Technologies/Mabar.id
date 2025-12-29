import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Card,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Star, Ticket, ChevronRight, Disc3 } from '@tamagui/lucide-icons';

import { useAuthStore } from '@/lib/store/auth';

// Get time-based greeting
function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const greetingKey = getGreetingKey();
  const firstName = user?.firstName || 'there';

  // Mock data - replace with real data from API
  const stats = {
    streak: 5,
    points: 2450,
    activeVouchers: 3,
    expiringSoon: 1,
    spinsLeft: 2,
  };

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 100,
      }}
    >
      <YStack padding="$4" space="$6">
        {/* Header */}
        <YStack>
          <Text fontSize="$5" color="$textSecondary">
            {t(`home.greeting.${greetingKey}`)},
          </Text>
          <Text fontSize="$8" fontWeight="bold" color="$color">
            {firstName}!
          </Text>
        </YStack>

        {/* Hero Section */}
        <Card
          backgroundColor="$primary"
          padding="$5"
          borderRadius="$6"
          pressStyle={{ scale: 0.98 }}
          onPress={() => router.push('/(tabs)/spin')}
        >
          <YStack alignItems="center" space="$4">
            <Text fontSize="$6" fontWeight="bold" color="white" textAlign="center">
              {t('home.hero.title')}
            </Text>
            <Text fontSize="$4" color="white" opacity={0.9} textAlign="center">
              {t('home.hero.subtitle')}
            </Text>
            <Button
              size="$5"
              backgroundColor="white"
              color="$primary"
              fontWeight="bold"
              marginTop="$2"
              icon={<Disc3 size={20} />}
            >
              {t('home.hero.spinButton')}
            </Button>
          </YStack>
        </Card>

        {/* Stats Grid */}
        <XStack space="$3">
          {/* Streak Card */}
          <Card flex={1} backgroundColor="$card" padding="$4" borderRadius="$4">
            <YStack space="$2">
              <XStack alignItems="center" space="$2">
                <Flame size={20} color="$warning" />
                <Text fontSize="$3" color="$textSecondary">
                  {t('home.stats.currentStreak')}
                </Text>
              </XStack>
              <Text fontSize="$7" fontWeight="bold" color="$color">
                {stats.streak} {t('home.stats.days')}
              </Text>
            </YStack>
          </Card>

          {/* Points Card */}
          <Card flex={1} backgroundColor="$card" padding="$4" borderRadius="$4">
            <YStack space="$2">
              <XStack alignItems="center" space="$2">
                <Star size={20} color="$warning" />
                <Text fontSize="$3" color="$textSecondary">
                  {t('home.stats.points')}
                </Text>
              </XStack>
              <Text fontSize="$7" fontWeight="bold" color="$color">
                {stats.points.toLocaleString()}
              </Text>
            </YStack>
          </Card>
        </XStack>

        {/* Vouchers Card */}
        <Card
          backgroundColor="$card"
          padding="$4"
          borderRadius="$4"
          pressStyle={{ opacity: 0.8 }}
          onPress={() => router.push('/(tabs)/wallet')}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" space="$3">
              <YStack
                backgroundColor="$primary"
                padding="$3"
                borderRadius="$3"
              >
                <Ticket size={24} color="white" />
              </YStack>
              <YStack>
                <Text fontSize="$5" fontWeight="bold" color="$color">
                  {stats.activeVouchers} {t('home.stats.activeVouchers')}
                </Text>
                {stats.expiringSoon > 0 && (
                  <Text fontSize="$3" color="$warning">
                    {stats.expiringSoon} {t('home.stats.expiringSoon')}
                  </Text>
                )}
              </YStack>
            </XStack>
            <ChevronRight size={24} color="$textMuted" />
          </XStack>
        </Card>

        {/* Spins Left Card */}
        <Card
          backgroundColor="$card"
          padding="$4"
          borderRadius="$4"
          pressStyle={{ opacity: 0.8 }}
          onPress={() => router.push('/(tabs)/spin')}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" space="$3">
              <YStack
                backgroundColor="$info"
                padding="$3"
                borderRadius="$3"
              >
                <Disc3 size={24} color="white" />
              </YStack>
              <YStack>
                <Text fontSize="$5" fontWeight="bold" color="$color">
                  {stats.spinsLeft} {t('home.stats.spinsLeft')}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {t('home.stats.today')}
                </Text>
              </YStack>
            </XStack>
            <ChevronRight size={24} color="$textMuted" />
          </XStack>
        </Card>

        {/* Recent Discoveries Section */}
        <YStack space="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="bold" color="$color">
              {t('home.sections.recentDiscoveries')}
            </Text>
            <Text fontSize="$3" color="$primary">
              {t('home.sections.seeAll')}
            </Text>
          </XStack>

          {/* Empty State */}
          <Card
            backgroundColor="$card"
            padding="$6"
            borderRadius="$4"
            alignItems="center"
          >
            <Text fontSize="$5" color="$textSecondary" textAlign="center">
              {t('home.empty.noDiscoveries')}
            </Text>
            <Text fontSize="$3" color="$textMuted" textAlign="center" marginTop="$2">
              {t('home.empty.startSpinning')}
            </Text>
          </Card>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
