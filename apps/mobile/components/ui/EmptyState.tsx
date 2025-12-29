import { YStack, Text, Button } from 'tamagui';
import type { IconProps } from '@tamagui/lucide-icons';

interface EmptyStateProps {
  icon?: React.ComponentType<IconProps>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
    >
      {Icon && <Icon size={48} color="$textMuted" />}
      <Text
        fontSize="$5"
        fontWeight="bold"
        color="$color"
        textAlign="center"
        marginTop={Icon ? '$4' : 0}
      >
        {title}
      </Text>
      {description && (
        <Text
          fontSize="$4"
          color="$textSecondary"
          textAlign="center"
          marginTop="$2"
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          size="$4"
          backgroundColor="$primary"
          color="white"
          marginTop="$4"
          onPress={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </YStack>
  );
}
