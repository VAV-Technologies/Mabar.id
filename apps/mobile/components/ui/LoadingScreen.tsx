import { YStack, Spinner, Text } from 'tamagui';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="$background"
    >
      <Spinner size="large" color="$primary" />
      <Text marginTop="$4" color="$textSecondary" fontSize="$4">
        {message}
      </Text>
    </YStack>
  );
}
