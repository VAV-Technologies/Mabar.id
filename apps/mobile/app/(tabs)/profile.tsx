import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  ScrollView,
  Avatar,
  Separator,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Palette,
  Globe,
  Bell,
  MapPin,
  Users,
  History,
  HelpCircle,
  Info,
  Star,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Coffee,
} from '@tamagui/lucide-icons';

import { useAuthStore } from '@/lib/store/auth';
import { useThemeStore } from '@/lib/store/theme';
import { changeLanguage, getCurrentLanguage } from '@/lib/i18n';
import type { Theme, Language } from '@mabar/shared/types';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

function MenuItem({ icon, label, value, onPress, showChevron = true, danger = false }: MenuItemProps) {
  return (
    <Button
      backgroundColor="transparent"
      justifyContent="flex-start"
      paddingVertical="$4"
      paddingHorizontal="$4"
      onPress={onPress}
      pressStyle={{ backgroundColor: '$backgroundHover' }}
    >
      <XStack flex={1} alignItems="center" space="$3">
        <YStack
          width={40}
          height={40}
          borderRadius="$3"
          backgroundColor={danger ? '$error' : '$card'}
          justifyContent="center"
          alignItems="center"
        >
          {icon}
        </YStack>
        <Text flex={1} fontSize="$4" color={danger ? '$error' : '$color'}>
          {label}
        </Text>
        {value && (
          <Text fontSize="$3" color="$textSecondary" marginRight="$2">
            {value}
          </Text>
        )}
        {showChevron && <ChevronRight size={20} color="$textMuted" />}
      </XStack>
    </Button>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const currentLanguage = getCurrentLanguage();

  // Mock stats
  const stats = {
    placesVisited: 12,
    vouchersUsed: 8,
    streakDays: 5,
  };

  const handleThemeChange = () => {
    const themes: Theme[] = ['dark', 'light', 'cream'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const handleLanguageChange = async () => {
    const newLang: Language = currentLanguage === 'en' ? 'id' : 'en';
    await changeLanguage(newLang);
  };

  const handleSignOut = () => {
    Alert.alert(
      t('profile.logout.title'),
      t('profile.logout.confirm'),
      [
        { text: t('common.buttons.cancel'), style: 'cancel' },
        {
          text: t('common.buttons.signOut'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const themeIcon = theme === 'dark' ? <Moon size={20} color="$color" /> :
                    theme === 'light' ? <Sun size={20} color="$color" /> :
                    <Coffee size={20} color="$color" />;

  const themeLabel = t(`profile.theme.${theme}`);
  const languageLabel = currentLanguage === 'en' ? 'English' : 'Bahasa Indonesia';

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 100,
      }}
    >
      {/* Header */}
      <YStack padding="$4" alignItems="center">
        <Avatar circular size="$10" marginBottom="$3">
          <Avatar.Image
            source={{ uri: user?.avatarUrl || undefined }}
          />
          <Avatar.Fallback backgroundColor="$primary" justifyContent="center" alignItems="center">
            <User size={40} color="white" />
          </Avatar.Fallback>
        </Avatar>
        <Text fontSize="$6" fontWeight="bold" color="$color">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text fontSize="$4" color="$textSecondary">
          {user?.email}
        </Text>
      </YStack>

      {/* Stats */}
      <XStack paddingHorizontal="$4" space="$3" marginBottom="$4">
        <Card flex={1} backgroundColor="$card" padding="$3" borderRadius="$4" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$primary">
            {stats.placesVisited}
          </Text>
          <Text fontSize="$2" color="$textSecondary" textAlign="center">
            {t('profile.stats.placesVisited')}
          </Text>
        </Card>
        <Card flex={1} backgroundColor="$card" padding="$3" borderRadius="$4" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$primary">
            {stats.vouchersUsed}
          </Text>
          <Text fontSize="$2" color="$textSecondary" textAlign="center">
            {t('profile.stats.vouchersUsed')}
          </Text>
        </Card>
        <Card flex={1} backgroundColor="$card" padding="$3" borderRadius="$4" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$primary">
            {stats.streakDays}
          </Text>
          <Text fontSize="$2" color="$textSecondary" textAlign="center">
            {t('profile.stats.streakDays')}
          </Text>
        </Card>
      </XStack>

      {/* Menu Sections */}
      <YStack paddingHorizontal="$4">
        {/* Preferences */}
        <Text fontSize="$3" color="$textMuted" marginBottom="$2" marginLeft="$4">
          {t('profile.settings.preferences').toUpperCase()}
        </Text>
        <Card backgroundColor="$card" borderRadius="$4" marginBottom="$4" overflow="hidden">
          <MenuItem
            icon={themeIcon}
            label={t('profile.menu.theme')}
            value={themeLabel}
            onPress={handleThemeChange}
          />
          <Separator />
          <MenuItem
            icon={<Globe size={20} color="$color" />}
            label={t('profile.menu.language')}
            value={languageLabel}
            onPress={handleLanguageChange}
          />
          <Separator />
          <MenuItem
            icon={<Bell size={20} color="$color" />}
            label={t('profile.menu.notifications')}
            onPress={() => {}}
          />
        </Card>

        {/* General */}
        <Text fontSize="$3" color="$textMuted" marginBottom="$2" marginLeft="$4">
          GENERAL
        </Text>
        <Card backgroundColor="$card" borderRadius="$4" marginBottom="$4" overflow="hidden">
          <MenuItem
            icon={<History size={20} color="$color" />}
            label={t('profile.menu.history')}
            onPress={() => {}}
          />
          <Separator />
          <MenuItem
            icon={<Users size={20} color="$color" />}
            label={t('profile.menu.inviteFriends')}
            onPress={() => {}}
          />
          <Separator />
          <MenuItem
            icon={<HelpCircle size={20} color="$color" />}
            label={t('profile.menu.helpSupport')}
            onPress={() => {}}
          />
          <Separator />
          <MenuItem
            icon={<Info size={20} color="$color" />}
            label={t('profile.menu.about')}
            onPress={() => {}}
          />
          <Separator />
          <MenuItem
            icon={<Star size={20} color="$color" />}
            label={t('profile.menu.rateApp')}
            onPress={() => {}}
          />
        </Card>

        {/* Logout */}
        <Card backgroundColor="$card" borderRadius="$4" overflow="hidden">
          <MenuItem
            icon={<LogOut size={20} color="$error" />}
            label={t('profile.logout.title')}
            onPress={handleSignOut}
            showChevron={false}
            danger
          />
        </Card>
      </YStack>

      {/* Version */}
      <Text fontSize="$2" color="$textMuted" textAlign="center" marginTop="$6">
        Mabar v1.0.0
      </Text>
    </ScrollView>
  );
}
