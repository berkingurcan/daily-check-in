import React from 'react'
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'
import { AppConfig } from '@/constants/app-config'

interface CheckInButtonProps {
  dayNumber: number
  onCheckIn: () => void
  isLoading: boolean
  isCompleted: boolean
  isDisabled: boolean
}

export function CheckInButton({
  dayNumber,
  onCheckIn,
  isLoading,
  isCompleted,
  isDisabled,
}: CheckInButtonProps) {
  const fee = AppConfig.getCheckInFee(dayNumber)

  if (isCompleted) {
    return (
      <View style={styles.completedContainer}>
        <View style={[styles.button, styles.completedButton]}>
          <AppText style={styles.completedText}>Day {dayNumber} Complete!</AppText>
          <AppText style={styles.checkIcon}>✓</AppText>
        </View>
        <AppText style={styles.helperText}>Come back tomorrow for Day {dayNumber + 1}</AppText>
      </View>
    )
  }

  if (isDisabled) {
    return (
      <View style={styles.disabledContainer}>
        <View style={[styles.button, styles.disabledButton]}>
          <AppText style={styles.disabledText}>Not Available Today</AppText>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCheckIn} disabled={isLoading} activeOpacity={0.8}>
        <LinearGradient
          colors={[Colors.brand.gradientStart, Colors.brand.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.dark.text} />
          ) : (
            <>
              <AppText style={styles.buttonText}>Check In</AppText>
              <AppText style={styles.dayText}>Day {dayNumber}</AppText>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.feeContainer}>
        <AppText style={styles.feeLabel}>Transaction Fee</AppText>
        <AppText style={styles.feeAmount}>{fee.toFixed(2)} SOL</AppText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  completedContainer: {
    alignItems: 'center',
    gap: 8,
  },
  disabledContainer: {
    alignItems: 'center',
  },
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  completedButton: {
    backgroundColor: Colors.checkIn.completed,
    shadowColor: Colors.checkIn.completed,
  },
  disabledButton: {
    backgroundColor: Colors.checkIn.pending,
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    opacity: 0.9,
    marginTop: 4,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  checkIcon: {
    fontSize: 32,
    color: Colors.dark.text,
    marginTop: 8,
  },
  disabledText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  helperText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  feeContainer: {
    backgroundColor: Colors.dark.backgroundSecondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  feeLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
})
