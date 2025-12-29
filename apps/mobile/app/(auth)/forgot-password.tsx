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
  ScrollView,
} from 'tamagui';
import { Mail, ArrowLeft, CheckCircle } from '@tamagui/lucide-icons';

import { useAuthStore } from '@/lib/store/auth';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    setLocalError('');
    clearError();

    if (!email.trim()) {
      setLocalError(t('auth.errors.requiredField'));
      return;
    }

    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      // Error is handled in store
    }
  };

  const displayError = localError || error;

  if (success) {
    return (
      <YStack flex={1} backgroundColor="$background" padding="$6" justifyContent="center" alignItems="center">
        <YStack
          backgroundColor="$success"
          padding="$4"
          borderRadius="$full"
          marginBottom="$6"
        >
          <CheckCircle size={48} color="white" />
        </YStack>
        <Text fontSize="$7" fontWeight="bold" color="$color" textAlign="center" marginBottom="$3">
          {t('auth.forgotPassword.success')}
        </Text>
        <Text fontSize="$4" color="$textSecondary" textAlign="center" marginBottom="$8">
          {email}
        </Text>
        <Button
          size="$5"
          backgroundColor="$primary"
          color="white"
          onPress={() => router.replace('/(auth)/login')}
        >
          {t('auth.forgotPassword.backToLogin')}
        </Button>
      </YStack>
    );
  }

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
        <YStack flex={1} padding="$6">
          {/* Back Button */}
          <Link href="/(auth)/login" asChild>
            <Button
              size="$4"
              chromeless
              alignSelf="flex-start"
              marginBottom="$6"
            >
              <ArrowLeft size={24} color="$color" />
            </Button>
          </Link>

          <YStack flex={1} justifyContent="center">
            {/* Header */}
            <YStack marginBottom="$8">
              <Text fontSize="$8" fontWeight="bold" color="$color" marginBottom="$2">
                {t('auth.forgotPassword.title')}
              </Text>
              <Text fontSize="$4" color="$textSecondary">
                {t('auth.forgotPassword.subtitle')}
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
            </YStack>

            {/* Reset Button */}
            <Button
              size="$5"
              backgroundColor="$primary"
              color="white"
              onPress={handleResetPassword}
              disabled={isLoading}
              marginBottom="$6"
            >
              {isLoading ? t('common.buttons.loading') : t('auth.forgotPassword.sendLink')}
            </Button>

            {/* Back to Login Link */}
            <XStack justifyContent="center">
              <Link href="/(auth)/login" asChild>
                <Text color="$primary" fontWeight="bold">
                  {t('auth.forgotPassword.backToLogin')}
                </Text>
              </Link>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
