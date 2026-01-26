import { useRouter } from 'expo-router'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors, Spacing } from '@/constants/theme'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

interface ActionButtonProps {
  icon: string
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'accent'
}

function ActionButton({ icon, label, onPress, variant = 'secondary' }: ActionButtonProps) {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: Colors.primary.muted,
          icon: Colors.primary.default,
        }
      case 'accent':
        return {
          bg: Colors.accent.muted,
          icon: Colors.accent.default,
        }
      default:
        return {
          bg: Colors.secondary.muted,
          icon: Colors.secondary.default,
        }
    }
  }

  const colors = getColors()

  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
        <UiIconSymbol name={icon as any} size={22} color={colors.icon} />
      </View>
      <AppText variant="labelSm">{label}</AppText>
    </TouchableOpacity>
  )
}

export function AccountUiButtons() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <ActionButton
        icon="arrow.down.circle.fill"
        label="Airdrop"
        onPress={() => router.navigate('/(tabs)/account/airdrop')}
        variant="primary"
      />
      <ActionButton
        icon="arrow.up.circle.fill"
        label="Send"
        onPress={() => router.navigate('/(tabs)/account/send')}
        variant="secondary"
      />
      <ActionButton
        icon="qrcode"
        label="Receive"
        onPress={() => router.navigate('/(tabs)/account/receive')}
        variant="accent"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing['3xl'],
  },
  actionButton: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
