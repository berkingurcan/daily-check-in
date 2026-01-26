import React from 'react'
import { AppText } from '@/components/app-text'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme'

interface BaseButtonProps {
  label: string
  onPress?: () => void
  variant?: 'gradient' | 'outline'
}

export function BaseButton({ label, onPress, variant = 'gradient' }: BaseButtonProps) {
  if (variant === 'outline') {
    return (
      <TouchableOpacity style={styles.outlineButton} onPress={onPress} activeOpacity={0.7}>
        <UiIconSymbol name="wallet.pass.fill" size={20} color={Colors.primary.default} />
        <AppText variant="button" style={styles.outlineText}>
          {label}
        </AppText>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={Colors.gradient.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        <UiIconSymbol name="wallet.pass.fill" size={20} color={Colors.text.inverse} />
        <AppText variant="button" style={styles.gradientText}>
          {label}
        </AppText>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  gradientText: {
    color: Colors.text.inverse,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary.default,
    backgroundColor: Colors.primary.muted,
  },
  outlineText: {
    color: Colors.primary.default,
  },
})
