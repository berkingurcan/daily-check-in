import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { useCluster } from '@/components/cluster/cluster-provider'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { AppConfig } from '@/constants/app-config'
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Snackbar from 'react-native-snackbar'
import { CheckInConfirmModal } from './checkin-confirm-modal'
import { CheckInButton } from './checkin-ui-button'
import { CheckInHabitSetup } from './checkin-ui-habit-setup'
import { CheckInProgressGrid } from './checkin-ui-progress-grid'
import { MintSuccessModal } from './mint-success-modal'
import { DailyBadge, HABIT_CATEGORIES, HabitCategory, getDayBadge } from './types'
import { useCheckInTransaction } from './use-checkin-transaction'
import { useHabitStorage } from './use-habit-storage'

export function CheckInFeature() {
  const { account } = useMobileWallet()
  const { selectedCluster } = useCluster()
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
    deleteHabit,
  } = useHabitStorage()

  const [refreshing, setRefreshing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  // Mint success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [mintResult, setMintResult] = useState<{
    mintAddress: string
    signature: string
    dayNumber: number
    badge: DailyBadge
  } | null>(null)

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
    } catch {
      Snackbar.show({
        text: 'Failed to create habit',
        duration: Snackbar.LENGTH_SHORT,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleReset = () => {
    Alert.alert('Reset Journey', 'Are you sure you want to reset your progress? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await deleteHabit()
        },
      },
    ])
  }

  const handleCheckInPress = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmCheckIn = async () => {
    const dayNumber = getCurrentDayNumber()
    if (!dayNumber || !habit) return

    setIsConfirming(true)
    try {
      const result = await checkInMutation.mutateAsync({
        dayNumber,
        habitName: habit.name,
      })
      await recordCheckIn(dayNumber, result.signature, result.feePaid, result.mintAddress)
      setShowConfirmModal(false)

      // Show mint success modal
      const badge = getDayBadge(dayNumber, habit.name)
      setMintResult({
        mintAddress: result.mintAddress,
        signature: result.signature,
        dayNumber,
        badge,
      })
      setShowSuccessModal(true)
    } catch (error: any) {
      Snackbar.show({
        text: error?.message || 'Check-in failed. Please try again.',
        duration: Snackbar.LENGTH_LONG,
      })
    } finally {
      setIsConfirming(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setMintResult(null)
  }

  const currentDay = getCurrentDayNumber()
  const fee = currentDay ? AppConfig.getCheckInFee(currentDay) : 0

  // Determine network for explorer links
  const getNetwork = (): 'devnet' | 'mainnet-beta' | 'testnet' => {
    if (selectedCluster.name.toLowerCase().includes('mainnet')) return 'mainnet-beta'
    if (selectedCluster.name.toLowerCase().includes('testnet')) return 'testnet'
    return 'devnet'
  }

  // Not connected state
  if (!account) {
    return (
      <AppPage>
        <View style={styles.connectContainer}>
          <LinearGradient
            colors={['rgba(0, 217, 181, 0.1)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.connectGradient}
          />
          <View style={styles.connectIconContainer}>
            <UiIconSymbol name="wallet.pass.fill" size={48} color={Colors.primary.default} />
          </View>
          <AppText variant="h3" style={styles.connectTitle}>
            Connect Your Wallet
          </AppText>
          <AppText variant="body" color="secondary" style={styles.connectSubtitle}>
            Connect your Solana wallet to start your 12-day habit journey
          </AppText>
          <WalletUiButtonConnect />
        </View>
      </AppPage>
    )
  }

  // Loading state
  if (loading) {
    return (
      <AppPage>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner} />
          <AppText variant="body" color="secondary">
            Loading your journey...
          </AppText>
        </View>
      </AppPage>
    )
  }

  // No habit created yet
  if (!habit) {
    return (
      <AppPage>
        <CheckInHabitSetup onCreateHabit={handleCreateHabit} isLoading={isCreating} />
      </AppPage>
    )
  }

  const todayCheckIn = getTodayCheckIn()
  const progress = getProgress()
  const journeyComplete = isJourneyComplete()
  const categoryInfo = HABIT_CATEGORIES.find((c) => c.value === habit.category)

  return (
    <AppPage>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary.default} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Habit Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleReset} hitSlop={12} style={styles.resetButton}>
            <UiIconSymbol name="arrow.counterclockwise" size={20} color={Colors.text.tertiary} />
          </TouchableOpacity>
          <View style={styles.habitHeader}>
            <AppText variant="h2">{habit.name}</AppText>
            <View style={styles.categoryBadge}>
              <UiIconSymbol name={categoryInfo?.icon as any} size={14} color={Colors.primary.default} />
              <AppText variant="caption" color="primary">
                {categoryInfo?.label || habit.category}
              </AppText>
            </View>
          </View>
          <View style={styles.resetButtonPlaceholder} />
        </View>

        {/* Progress Summary */}
        <View style={styles.progressSummary}>
          <ProgressItem value={progress.completed} label="Completed" />
          <View style={styles.progressDivider} />
          <ProgressItem value={`${progress.percentage}%`} label="Progress" highlight />
          <View style={styles.progressDivider} />
          <ProgressItem value={progress.total - progress.completed} label="Remaining" />
        </View>

        {/* Main Action Area */}
        {journeyComplete ? (
          <View style={styles.completeContainer}>
            <LinearGradient
              colors={Colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.completeIconBg}
            >
              <UiIconSymbol name="trophy.fill" size={48} color={Colors.text.inverse} />
            </LinearGradient>
            <AppText variant="h2" style={styles.completeTitle}>
              Journey Complete!
            </AppText>
            <AppText variant="body" color="secondary" style={styles.completeText}>
              You finished your 12-day challenge with {progress.completed} successful check-ins. Amazing dedication!
            </AppText>
          </View>
        ) : (
          <View style={styles.checkInSection}>
            <CheckInButton
              dayNumber={currentDay}
              onCheckIn={handleCheckInPress}
              isLoading={checkInMutation.isPending}
              isCompleted={todayCheckIn?.completed || false}
              isDisabled={!todayCheckIn}
            />
          </View>
        )}

        {/* Progress Grid */}
        <CheckInProgressGrid checkIns={habit.checkIns} currentDayNumber={currentDay} />
      </ScrollView>

      {/* Confirmation Modal */}
      <CheckInConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmCheckIn}
        dayNumber={currentDay}
        fee={fee}
        loading={isConfirming}
      />

      {/* Mint Success Modal */}
      {mintResult && (
        <MintSuccessModal
          visible={showSuccessModal}
          onClose={handleSuccessModalClose}
          dayNumber={mintResult.dayNumber}
          badge={mintResult.badge}
          mintAddress={mintResult.mintAddress}
          signature={mintResult.signature}
          network={getNetwork()}
        />
      )}
    </AppPage>
  )
}

function ProgressItem({ value, label, highlight }: { value: string | number; label: string; highlight?: boolean }) {
  return (
    <View style={styles.progressItem}>
      <AppText variant="h3" style={[styles.progressNumber, highlight && styles.progressNumberHighlight]}>
        {value}
      </AppText>
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing['2xl'],
  },
  connectGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  connectIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  connectTitle: {
    textAlign: 'center',
  },
  connectSubtitle: {
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: Colors.border.subtle,
    borderTopColor: Colors.primary.default,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  resetButton: {
    padding: Spacing.xs,
  },
  resetButtonPlaceholder: {
    width: 28, // Matches icon size + padding
  },
  habitHeader: {
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary.muted,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  progressSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  progressItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  progressNumber: {
    color: Colors.text.primary,
  },
  progressNumberHighlight: {
    color: Colors.primary.default,
  },
  progressDivider: {
    width: 1,
    backgroundColor: Colors.border.default,
  },
  checkInSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  completeContainer: {
    alignItems: 'center',
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.xl,
    padding: Spacing['3xl'],
    gap: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  completeIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowPrimary,
  },
  completeTitle: {
    color: Colors.semantic.success,
    textAlign: 'center',
  },
  completeText: {
    textAlign: 'center',
    lineHeight: 24,
  },
})

