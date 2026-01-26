import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import Snackbar from 'react-native-snackbar'
import { AppPage } from '@/components/app-page'
import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { Colors } from '@/constants/colors'
import { useHabitStorage } from './use-habit-storage'
import { useCheckInTransaction } from './use-checkin-transaction'
import { CheckInHabitSetup } from './checkin-ui-habit-setup'
import { CheckInButton } from './checkin-ui-button'
import { CheckInProgressGrid } from './checkin-ui-progress-grid'
import { HabitCategory, HABIT_CATEGORIES } from './types'

export function CheckInFeature() {
  const { account } = useMobileWallet()
  const {
    habit,
    loading,
    createHabit,
    recordCheckIn,
    getTodayCheckIn,
    getCurrentDayNumber,
    getProgress,
    isJourneyComplete,
    refresh,
  } = useHabitStorage()

  const [refreshing, setRefreshing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const checkInMutation = useCheckInTransaction({
    address: account?.address!,
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  const handleCreateHabit = async (name: string, category: HabitCategory) => {
    setIsCreating(true)
    try {
      await createHabit(name, category)
      Snackbar.show({
        text: 'Habit created! Start your Day 1 check-in.',
        duration: Snackbar.LENGTH_LONG,
      })
    } catch (error) {
      Snackbar.show({
        text: 'Failed to create habit',
        duration: Snackbar.LENGTH_SHORT,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleCheckIn = async () => {
    const dayNumber = getCurrentDayNumber()
    if (!dayNumber) return

    Alert.alert(
      'Confirm Check-In',
      `You are about to check in for Day ${dayNumber}.\n\nThis will send ${(dayNumber * 0.01).toFixed(2)} SOL as a commitment fee.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const result = await checkInMutation.mutateAsync({ dayNumber })
              await recordCheckIn(dayNumber, result.signature, result.feePaid)
              Snackbar.show({
                text: `Day ${dayNumber} check-in complete!`,
                duration: Snackbar.LENGTH_LONG,
              })
            } catch (error: any) {
              Snackbar.show({
                text: error?.message || 'Check-in failed. Please try again.',
                duration: Snackbar.LENGTH_LONG,
              })
            }
          },
        },
      ]
    )
  }

  if (!account) {
    return (
      <AppPage>
        <AppView style={styles.connectContainer}>
          <AppText style={styles.connectTitle}>Connect Your Wallet</AppText>
          <AppText style={styles.connectSubtitle}>
            Connect your Solana wallet to start your 12-day habit journey
          </AppText>
          <WalletUiButtonConnect />
        </AppView>
      </AppPage>
    )
  }

  if (loading) {
    return (
      <AppPage>
        <AppView style={styles.loadingContainer}>
          <AppText>Loading...</AppText>
        </AppView>
      </AppPage>
    )
  }

  if (!habit) {
    return (
      <AppPage>
        <CheckInHabitSetup onCreateHabit={handleCreateHabit} isLoading={isCreating} />
      </AppPage>
    )
  }

  const todayCheckIn = getTodayCheckIn()
  const currentDay = getCurrentDayNumber()
  const progress = getProgress()
  const journeyComplete = isJourneyComplete()
  const categoryInfo = HABIT_CATEGORIES.find((c) => c.value === habit.category)

  return (
    <AppPage>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.habitHeader}>
          <AppText style={styles.habitName}>{habit.name}</AppText>
          <View style={styles.categoryBadge}>
            <AppText style={styles.categoryText}>{categoryInfo?.label || habit.category}</AppText>
          </View>
        </View>

        <View style={styles.progressSummary}>
          <View style={styles.progressItem}>
            <AppText style={styles.progressNumber}>{progress.completed}</AppText>
            <AppText style={styles.progressLabel}>Completed</AppText>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <AppText style={styles.progressNumber}>{progress.percentage}%</AppText>
            <AppText style={styles.progressLabel}>Progress</AppText>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <AppText style={styles.progressNumber}>{progress.total - progress.completed}</AppText>
            <AppText style={styles.progressLabel}>Remaining</AppText>
          </View>
        </View>

        {journeyComplete ? (
          <View style={styles.completeContainer}>
            <AppText style={styles.completeEmoji}>🎉</AppText>
            <AppText style={styles.completeTitle}>Journey Complete!</AppText>
            <AppText style={styles.completeText}>
              You finished your 12-day challenge with {progress.completed} successful check-ins.
            </AppText>
          </View>
        ) : (
          <View style={styles.checkInSection}>
            <CheckInButton
              dayNumber={currentDay}
              onCheckIn={handleCheckIn}
              isLoading={checkInMutation.isPending}
              isCompleted={todayCheckIn?.completed || false}
              isDisabled={!todayCheckIn}
            />
          </View>
        )}

        <CheckInProgressGrid checkIns={habit.checkIns} currentDayNumber={currentDay} />
      </ScrollView>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 24,
    paddingBottom: 24,
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  connectSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitHeader: {
    alignItems: 'center',
    gap: 8,
  },
  habitName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  categoryBadge: {
    backgroundColor: Colors.brand.primary + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.brand.primary,
    fontWeight: '500',
  },
  progressSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
    gap: 4,
  },
  progressNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  progressDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
  },
  checkInSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  completeContainer: {
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 16,
    padding: 32,
    gap: 12,
  },
  completeEmoji: {
    fontSize: 64,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.checkIn.completed,
  },
  completeText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
})
