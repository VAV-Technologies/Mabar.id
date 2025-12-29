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
  Checkbox,
  Label,
} from 'tamagui';
import { Mail, Lock, Eye, EyeOff, User, Check } from '@tamagui/lucide-icons';

import { useAuthStore } from '@/lib/store/auth';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { signUpWithEmail, isLoading, error, clearError } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleRegister = async () => {
    setLocalError('');
    clearError();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setLocalError(t('auth.errors.requiredField'));
      return;
    }

    if (password.length < 8) {
      setLocalError(t('auth.errors.passwordTooShort'));
      return;
    }

    if (password !== confirmPassword) {
      setLocalError(t('auth.errors.passwordsDontMatch'));
      return;
    }

    if (!agreeTerms) {
      setLocalError('Please agree to the terms and conditions');
      return;
    }

    try {
      await signUpWithEmail(email.trim(), password, firstName.trim(), lastName.trim());
      router.replace('/(tabs)');
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
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 40 }}
      >
        <YStack flex={1} padding="$6" justifyContent="center">
          {/* Header */}
          <YStack alignItems="center" marginBottom="$6">
            <Text fontSize="$10" fontWeight="bold" color="$primary" marginBottom="$2">
              MABAR
            </Text>
            <Text fontSize="$7" fontWeight="bold" color="$color" marginBottom="$2">
              {t('auth.register.title')}
            </Text>
            <Text fontSize="$4" color="$textSecondary">
              {t('auth.register.subtitle')}
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
          <YStack space="$4" marginBottom="$4">
            {/* Name Row */}
            <XStack space="$4">
              <YStack flex={1} space="$2">
                <Text fontSize="$3" color="$textSecondary" fontWeight="500">
                  {t('auth.register.firstName')}
                </Text>
                <XStack
                  alignItems="center"
                  backgroundColor="$backgroundHover"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                  paddingHorizontal="$4"
                >
                  <User size={20} color="$textMuted" />
                  <Input
                    flex={1}
                    placeholder="John"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholderTextColor="$placeholderColor"
                  />
                </XStack>
              </YStack>

              <YStack flex={1} space="$2">
                <Text fontSize="$3" color="$textSecondary" fontWeight="500">
                  {t('auth.register.lastName')}
                </Text>
                <XStack
                  alignItems="center"
                  backgroundColor="$backgroundHover"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                  paddingHorizontal="$4"
                >
                  <Input
                    flex={1}
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholderTextColor="$placeholderColor"
                  />
                </XStack>
              </YStack>
            </XStack>

            {/* Email Input */}
            <YStack space="$2">
              <Text fontSize="$3" color="$textSecondary" fontWeight="500">
                {t('auth.register.email')}
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
                {t('auth.register.password')}
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

            {/* Confirm Password Input */}
            <YStack space="$2">
              <Text fontSize="$3" color="$textSecondary" fontWeight="500">
                {t('auth.register.confirmPassword')}
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
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  borderWidth={0}
                  backgroundColor="transparent"
                  placeholderTextColor="$placeholderColor"
                />
              </XStack>
            </YStack>

            {/* Terms Checkbox */}
            <XStack alignItems="center" space="$3">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                backgroundColor={agreeTerms ? '$primary' : '$backgroundHover'}
                borderColor="$borderColor"
              >
                <Checkbox.Indicator>
                  <Check size={16} color="white" />
                </Checkbox.Indicator>
              </Checkbox>
              <Label htmlFor="terms" flex={1}>
                <Text fontSize="$3" color="$textSecondary">
                  {t('auth.register.agreeTerms')}{' '}
                  <Text color="$primary">{t('auth.register.termsOfService')}</Text>
                  {' '}{t('auth.register.and')}{' '}
                  <Text color="$primary">{t('auth.register.privacyPolicy')}</Text>
                </Text>
              </Label>
            </XStack>
          </YStack>

          {/* Register Button */}
          <Button
            size="$5"
            backgroundColor="$primary"
            color="white"
            onPress={handleRegister}
            disabled={isLoading}
            marginBottom="$6"
          >
            {isLoading ? t('common.buttons.loading') : t('common.buttons.signUp')}
          </Button>

          {/* Sign In Link */}
          <XStack justifyContent="center" space="$2">
            <Text color="$textSecondary">
              {t('auth.register.hasAccount')}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Text color="$primary" fontWeight="bold">
                {t('auth.register.signInHere')}
              </Text>
            </Link>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
