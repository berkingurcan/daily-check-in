import { AppText } from '@/components/app-text'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

interface CheckInConfirmModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  dayNumber: number
  fee: number
  loading?: boolean
}

export function CheckInConfirmModal({
  visible,
  onClose,
  onConfirm,
  dayNumber,
  fee,
  loading = false,
}: CheckInConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={loading ? undefined : onClose}>
        <View style={styles.overlay}>
          <BlurView intensity={25} tint="dark" style={styles.blur} />
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Gradient accent at top */}
              <LinearGradient
                colors={Colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.topAccent}
              />

              {/* Close button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={loading} activeOpacity={0.7}>
                <UiIconSymbol name="xmark" size={14} color={Colors.text.tertiary} />
              </TouchableOpacity>

              {/* Icon */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={Colors.gradient.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <UiIconSymbol name="checkmark.seal.fill" size={32} color={Colors.text.inverse} />
                </LinearGradient>
              </View>

              {/* Title */}
              <AppText variant="h3" style={styles.title}>
                Confirm Check-In
              </AppText>

              {/* Day badge */}
              <View style={styles.dayBadge}>
                <AppText variant="labelSm" style={styles.dayBadgeText}>
                  Day {dayNumber}
                </AppText>
              </View>

              {/* Message */}
              <AppText variant="body" color="secondary" style={styles.message}>
                You are about to mint an NFT badge and record your check-in on the blockchain.
              </AppText>

              {/* Info message */}
              <View style={styles.feeCard}>
                <View style={styles.feeInfo}>
                  <UiIconSymbol name="info.circle" size={14} color={Colors.text.tertiary} />
                  <AppText variant="caption" color="tertiary">
                    Minting an NFT badge requires network transaction fees
                  </AppText>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading} activeOpacity={0.7}>
                  <AppText variant="button" style={styles.cancelButtonText}>
                    Cancel
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  disabled={loading}
                  activeOpacity={0.85}
                  style={styles.confirmButton}
                >
                  <LinearGradient
                    colors={Colors.gradient.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmButtonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={Colors.text.inverse} />
                    ) : (
                      <>
                        <UiIconSymbol name="checkmark" size={18} color={Colors.text.inverse} />
                        <AppText variant="button" style={styles.confirmButtonText}>
                          Confirm
                        </AppText>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius['2xl'],
    paddingTop: Spacing['3xl'],
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
    marginHorizontal: Spacing.xl,
    maxWidth: 360,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
    ...Shadows.xl,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
    ...Shadows.glowPrimary,
  },
  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  dayBadge: {
    backgroundColor: Colors.primary.muted,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  dayBadgeText: {
    color: Colors.primary.default,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  feeCard: {
    width: '100%',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  feeAmount: {
    color: Colors.primary.default,
  },
  feeDivider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginVertical: Spacing.md,
  },
  feeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    minHeight: 48,
  },
  cancelButtonText: {
    color: Colors.text.secondary,
  },
  confirmButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  confirmButtonText: {
    color: Colors.text.inverse,
  },
})
