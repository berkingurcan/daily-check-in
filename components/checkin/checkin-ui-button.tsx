import { AppText } from '@/components/app-text'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { BorderRadius, Colors, Components, Shadows, Spacing } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'

interface CheckInButtonProps {
  dayNumber: number
  onCheckIn: () => void
  onNextDay?: () => void
  isLoading: boolean
  isCompleted: boolean
  isDisabled: boolean
  isAdvancing?: boolean
  isLastDay?: boolean
}

export function CheckInButton({
  dayNumber,
  onCheckIn,
  onNextDay,
  isLoading,
  isCompleted,
  isDisabled,
  isAdvancing,
  isLastDay,
}: CheckInButtonProps) {
  if (isCompleted) {
    return (
      <View style={styles.completedContainer}>
        <View style={[styles.button, styles.completedButton]}>
          <View style={styles.completedIconContainer}>
            <UiIconSymbol name="checkmark" size={40} color={Colors.text.inverse} />
          </View>
          <AppText variant="h4" style={styles.completedText}>
            Day {dayNumber}
          </AppText>
          <AppText variant="bodySm" style={styles.completedSubtext}>
            Complete
          </AppText>
        </View>
        {!isLastDay && onNextDay && (
          <TouchableOpacity
            style={styles.nextDayButton}
            onPress={onNextDay}
            disabled={isAdvancing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(0, 217, 181, 0.15)', 'rgba(0, 217, 181, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextDayGradient}
            >
              {isAdvancing ? (
                <ActivityIndicator size="small" color={Colors.primary.default} />
              ) : (
                <>
                  <UiIconSymbol name="arrow.right.circle.fill" size={20} color={Colors.primary.default} />
                  <AppText variant="label" color="primary">
                    Continue to Day {dayNumber + 1}
                  </AppText>
                  <UiIconSymbol name="chevron.right" size={16} color={Colors.primary.default} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
        {isLastDay && (
          <View style={styles.helperContainer}>
            <UiIconSymbol name="trophy.fill" size={14} color={Colors.semantic.success} />
            <AppText variant="caption" color="success">
              Final day complete!
            </AppText>
          </View>
        )}
      </View>
    )
  }

  if (isDisabled) {
    return (
      <View style={styles.disabledContainer}>
        <View style={[styles.button, styles.disabledButton]}>
          <UiIconSymbol name="moon.fill" size={32} color={Colors.text.tertiary} />
          <AppText variant="label" color="tertiary" style={styles.disabledText}>
            Not Available
          </AppText>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCheckIn} disabled={isLoading} activeOpacity={0.85}>
        <LinearGradient
          colors={Colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, styles.activeButton]}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.text.inverse} />
          ) : (
            <>
              <View style={styles.buttonContent}>
                <AppText variant="h2" style={styles.buttonText}>
                  Check In
                </AppText>
                <View style={styles.mintBadge}>
                  <AppText variant="labelSm" style={styles.mintBadgeText}>
                    MINT YOUR EARLY NFT
                  </AppText>
                </View>
                <View style={styles.dayBadge}>
                  <AppText variant="labelSm" style={styles.dayBadgeText}>
                    Day {dayNumber}
                  </AppText>
                </View>
              </View>
              <View style={styles.pulseRing} />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

const BUTTON_SIZE = Components.checkInButton.size

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  completedContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  disabledContainer: {
    alignItems: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    ...Shadows.glowPrimary,
  },
  completedButton: {
    backgroundColor: Colors.checkIn.completed,
    ...Shadows.glowSuccess,
  },
  disabledButton: {
    backgroundColor: Colors.surface.default,
    borderWidth: 2,
    borderColor: Colors.border.subtle,
  },
  buttonContent: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buttonText: {
    color: Colors.text.inverse,
    letterSpacing: -0.5,
  },
  mintBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mintBadgeText: {
    color: Colors.text.inverse,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  dayBadgeText: {
    color: Colors.text.inverse,
  },
  pulseRing: {
    position: 'absolute',
    width: BUTTON_SIZE + 20,
    height: BUTTON_SIZE + 20,
    borderRadius: (BUTTON_SIZE + 20) / 2,
    borderWidth: 2,
    borderColor: Colors.primary.glow,
    opacity: 0.5,
  },
  completedIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  completedText: {
    color: Colors.text.inverse,
  },
  completedSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  disabledText: {
    marginTop: Spacing.sm,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  nextDayButton: {
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primary.muted,
  },
  nextDayGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minWidth: 220,
  },
})
