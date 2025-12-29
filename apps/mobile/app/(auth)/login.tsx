import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  YStack,
  XStack,
  Text,
  Input,
  Button,
  Separator,
  ScrollView,
} from 'tamagui';
import { Mail, Lock, Eye, EyeOff } from '@tamagui/lucide-icons';

import { useAuthStore } from '@/lib/store/auth';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signInWithEmail, signInWithGoogle, signInWithApple, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLogin = async () => {
    setLocalError('');
    clearError();

    if (!email.trim()) {
      setLocalError(t('auth.errors.requiredField'));
      return;
    }

    if (!password) {
      setLocalError(t('auth.errors.requiredField'));
      return;
    }

    try {
      await signInWithEmail(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled in store
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Error is handled in store
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signInWithApple();
    } catch (err) {
      // Error is handled in store
    }
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        flex={1}
        backgroundColor="$background"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <YStack flex={1} padding="$6" justifyContent="center">
          {/* Header */}
          <YStack alignItems="center" marginBottom="$8">
            <Text fontSize="$10" fontWeight="bold" color="$primary" marginBottom="$2">
              MABAR
            </Text>
            <Text fontSize="$8" fontWeight="bold" color="$color" marginBottom="$2">
              {t('auth.login.title')}
            </Text>
            <Text fontSize="$4" color="$textSecondary">
              {t('auth.login.subtitle')}
            </Text>
          </YStack>

          {/* Error Message */}
          {displayError && (
            <YStack
              backgroundColor="$error"
              padding="$3"
              borderRadius="$4"
              marginBottom="$4"
              opacity={0.9}
            >
              <Text color="white" textAlign="center">
                {displayError}
              </Text>
            </YStack>
          )}

          {/* Form */}
          <YStack space="$4" marginBottom="$6">
            {/* Email Input */}
            <YStack space="$2">
              <Text fontSize="$3" color="$textSecondary" fontWeight="500">
                {t('auth.login.email')}
              </Text>
              <XStack
                alignItems="center"
                backgroundColor="$backgroundHover"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$borderColor"
                paddingHorizontal="$4"
              >
                <Mail size={20} color="$textMuted" />
                <Input
                  flex={1}
                  placeholder="email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  borderWidth={0}
                  backgroundColor="transparent"
                  placeholderTextColor="$placeholderColor"
                />
              </XStack>
            </YStack>

            {/* Password Input */}
            <YStack space="$2">
              <Text fontSize="$3" color="$textSecondary" fontWeight="500">
                {t('auth.login.password')}
              </Text>
              <XStack
                alignItems="center"
                backgroundColor="$backgroundHover"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$borderColor"
                paddingHorizontal="$4"
              >
                <Lock size={20} color="$textMuted" />
                <Input
                  flex={1}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  borderWidth={0}
                  backgroundColor="transparent"
                  placeholderTextColor="$placeholderColor"
                />
                <Button
                  size="$2"
                  chromeless
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="$textMuted" />
                  ) : (
                    <Eye size={20} color="$textMuted" />
                  )}
                </Button>
              </XStack>
            </YStack>

            {/* Forgot Password */}
            <XStack justifyContent="flex-end">
              <Link href="/(auth)/forgot-password" asChild>
                <Text color="$primary" fontSize="$3">
                  {t('auth.login.forgotPassword')}
                </Text>
              </Link>
            </XStack>
          </YStack>

          {/* Login Button */}
          <Button
            size="$5"
            backgroundColor="$primary"
            color="white"
            onPress={handleLogin}
            disabled={isLoading}
            marginBottom="$6"
          >
            {isLoading ? t('common.buttons.loading') : t('common.buttons.signIn')}
          </Button>

          {/* Divider */}
          <XStack alignItems="center" marginBottom="$6">
            <Separator flex={1} />
            <Text marginHorizontal="$4" color="$textMuted" fontSize="$3">
              {t('auth.social.orContinueWith')}
            </Text>
            <Separator flex={1} />
          </XStack>

          {/* Social Login */}
          <XStack space="$4" marginBottom="$8">
            <Button
              flex={1}
              size="$5"
              backgroundColor="$secondary"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <Text>{t('auth.social.google')}</Text>
            </Button>
            <Button
              flex={1}
              size="$5"
              backgroundColor="$secondary"
              borderWidth={1}
              borderColor="$borderColor"
              onPress={handleAppleLogin}
              disabled={isLoading}
            >
              <Text>{t('auth.social.apple')}</Text>
            </Button>
          </XStack>

          {/* Sign Up Link */}
          <XStack justifyContent="center" space="$2">
            <Text color="$textSecondary">
              {t('auth.login.noAccount')}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Text color="$primary" fontWeight="bold">
                {t('auth.login.signUpHere')}
              </Text>
            </Link>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
