import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Coffee, UtensilsCrossed, Wine, Croissant } from '@tamagui/lucide-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type Category = 'all' | 'cafe' | 'restaurant' | 'bar' | 'bakery';

const categories: { key: Category; icon: React.ReactNode; labelKey: string }[] = [
  { key: 'all', icon: <MapPin size={20} />, labelKey: 'spin.filters.all' },
  { key: 'cafe', icon: <Coffee size={20} />, labelKey: 'spin.filters.cafe' },
  { key: 'restaurant', icon: <UtensilsCrossed size={20} />, labelKey: 'spin.filters.restaurant' },
  { key: 'bar', icon: <Wine size={20} />, labelKey: 'spin.filters.bar' },
  { key: 'bakery', icon: <Croissant size={20} />, labelKey: 'spin.filters.bakery' },
];

const radiusOptions = [1, 3, 5, 10];

export default function SpinScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedRadius, setSelectedRadius] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3);

  const rotation = useSharedValue(0);

  const animatedWheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleSpin = async () => {
    if (spinsLeft <= 0 || isSpinning) return;

    setIsSpinning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate the wheel
    const randomRotation = 1440 + Math.random() * 720; // 4-6 full rotations
    rotation.value = withSequence(
      withTiming(rotation.value + randomRotation, {
        duration: 4000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      setSpinsLeft((prev) => prev - 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // TODO: Show result modal
    }, 4000);
  };

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
    >
      {/* Header */}
      <YStack padding="$4" paddingBottom="$2">
        <Text fontSize="$7" fontWeight="bold" color="$color" textAlign="center">
          {t('spin.screen.title')}
        </Text>
        <Text fontSize="$4" color="$textSecondary" textAlign="center" marginTop="$1">
          {t('spin.wheel.spinsLeft', { count: spinsLeft })}
        </Text>
      </YStack>

      {/* Category Filter */}
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        space="$2"
        justifyContent="center"
        flexWrap="wrap"
      >
        {categories.map((cat) => (
          <Button
            key={cat.key}
            size="$3"
            backgroundColor={selectedCategory === cat.key ? '$primary' : '$card'}
            borderRadius="$full"
            onPress={() => setSelectedCategory(cat.key)}
            icon={cat.icon}
          >
            <Text
              color={selectedCategory === cat.key ? 'white' : '$color'}
              fontSize="$3"
            >
              {t(cat.labelKey)}
            </Text>
          </Button>
        ))}
      </XStack>

      {/* Radius Filter */}
      <XStack paddingHorizontal="$4" space="$2" justifyContent="center">
        {radiusOptions.map((radius) => (
          <Button
            key={radius}
            size="$3"
            backgroundColor={selectedRadius === radius ? '$primary' : '$card'}
            borderRadius="$4"
            onPress={() => setSelectedRadius(radius)}
          >
            <Text
              color={selectedRadius === radius ? 'white' : '$color'}
              fontSize="$3"
            >
              {radius} km
            </Text>
          </Button>
        ))}
      </XStack>

      {/* Spin Wheel */}
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Animated.View style={animatedWheelStyle}>
          <Card
            width={280}
            height={280}
            borderRadius={140}
            backgroundColor="$card"
            borderWidth={8}
            borderColor="$primary"
            justifyContent="center"
            alignItems="center"
            elevation={10}
          >
            <YStack
              position="absolute"
              width="100%"
              height="100%"
              justifyContent="center"
              alignItems="center"
            >
              {/* Wheel segments - simplified for now */}
              <Text fontSize="$8" fontWeight="bold" color="$primary">
                MABAR
              </Text>
              <Text fontSize="$4" color="$textSecondary" marginTop="$2">
                {isSpinning ? t('spin.wheel.spinning') : t('spin.wheel.spinButton')}
              </Text>
            </YStack>

            {/* Wheel pointer */}
            <YStack
              position="absolute"
              top={-20}
              width={0}
              height={0}
              borderLeftWidth={15}
              borderRightWidth={15}
              borderBottomWidth={25}
              borderLeftColor="transparent"
              borderRightColor="transparent"
              borderBottomColor="$primary"
            />
          </Card>
        </Animated.View>
      </YStack>

      {/* Spin Button */}
      <YStack padding="$4" paddingBottom="$6">
        <Button
          size="$6"
          backgroundColor={spinsLeft > 0 ? '$primary' : '$secondary'}
          color="white"
          fontWeight="bold"
          fontSize="$6"
          onPress={handleSpin}
          disabled={spinsLeft <= 0 || isSpinning}
          borderRadius="$6"
        >
          {isSpinning
            ? t('spin.wheel.spinning')
            : spinsLeft > 0
            ? t('spin.wheel.spinButton')
            : t('spin.wheel.noSpinsLeft')}
        </Button>
      </YStack>
    </YStack>
  );
}
