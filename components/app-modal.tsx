import React from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { AppText } from '@/components/app-text'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme'

export type ModalVariant = 'default' | 'warning' | 'success' | 'error'

interface ModalButton {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'destructive'
  loading?: boolean
}

interface AppModalProps {
  visible: boolean
  onClose: () => void
  title: string
  message?: string
  icon?: string
  variant?: ModalVariant
  buttons?: ModalButton[]
  children?: React.ReactNode
  closeOnBackdrop?: boolean
}

export function AppModal({
  visible,
  onClose,
  title,
  message,
  icon,
  variant = 'default',
  buttons = [],
  children,
  closeOnBackdrop = true,
}: AppModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          iconColor: Colors.semantic.warning,
          iconBg: Colors.semantic.warningMuted,
        }
      case 'success':
        return {
          iconColor: Colors.semantic.success,
          iconBg: Colors.semantic.successMuted,
        }
      case 'error':
        return {
          iconColor: Colors.semantic.error,
          iconBg: Colors.semantic.errorMuted,
        }
      default:
        return {
          iconColor: Colors.primary.default,
          iconBg: Colors.primary.muted,
        }
    }
  }

  const variantStyles = getVariantStyles()

  const renderButton = (button: ModalButton, index: number) => {
    const isLast = index === buttons.length - 1

    if (button.variant === 'primary') {
      return (
        <TouchableOpacity
          key={index}
          onPress={button.onPress}
          disabled={button.loading}
          activeOpacity={0.85}
          style={[styles.button, styles.buttonPrimary, !isLast && styles.buttonMargin]}
        >
          <LinearGradient
            colors={Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {button.loading ? (
              <ActivityIndicator size="small" color={Colors.text.inverse} />
            ) : (
              <AppText variant="button" style={styles.buttonPrimaryText}>
                {button.label}
              </AppText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )
    }

    if (button.variant === 'destructive') {
      return (
        <TouchableOpacity
          key={index}
          onPress={button.onPress}
          disabled={button.loading}
          activeOpacity={0.7}
          style={[styles.button, styles.buttonDestructive, !isLast && styles.buttonMargin]}
        >
          {button.loading ? (
            <ActivityIndicator size="small" color={Colors.semantic.error} />
          ) : (
            <AppText variant="button" style={styles.buttonDestructiveText}>
              {button.label}
            </AppText>
          )}
        </TouchableOpacity>
      )
    }

    // Secondary (default)
    return (
      <TouchableOpacity
        key={index}
        onPress={button.onPress}
        disabled={button.loading}
        activeOpacity={0.7}
        style={[styles.button, styles.buttonSecondary, !isLast && styles.buttonMargin]}
      >
        {button.loading ? (
          <ActivityIndicator size="small" color={Colors.text.secondary} />
        ) : (
          <AppText variant="button" style={styles.buttonSecondaryText}>
            {button.label}
          </AppText>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={closeOnBackdrop ? onClose : undefined}>
        <View style={styles.overlay}>
          <BlurView intensity={20} tint="dark" style={styles.blur} />
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Close button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                <UiIconSymbol name="xmark" size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>

              {/* Icon */}
              {icon && (
                <View style={[styles.iconContainer, { backgroundColor: variantStyles.iconBg }]}>
                  <UiIconSymbol name={icon as any} size={28} color={variantStyles.iconColor} />
                </View>
              )}

              {/* Title */}
              <AppText variant="h3" style={styles.title}>
                {title}
              </AppText>

              {/* Message */}
              {message && (
                <AppText variant="body" color="secondary" style={styles.message}>
                  {message}
                </AppText>
              )}

              {/* Custom content */}
              {children}

              {/* Buttons */}
              {buttons.length > 0 && <View style={styles.buttonContainer}>{buttons.map(renderButton)}</View>}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

// Confirmation Modal - Specialized variant for confirm/cancel actions
interface ConfirmModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  variant?: ModalVariant
  icon?: string
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'default',
  icon,
}: ConfirmModalProps) {
  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title={title}
      message={message}
      variant={variant}
      icon={icon}
      closeOnBackdrop={!loading}
      buttons={[
        {
          label: cancelLabel,
          onPress: onClose,
          variant: 'secondary',
        },
        {
          label: confirmLabel,
          onPress: onConfirm,
          variant: 'primary',
          loading,
        },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    padding: Spacing['2xl'],
    marginHorizontal: Spacing.xl,
    maxWidth: 340,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Shadows.xl,
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
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: Spacing.sm,
  },
  button: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  buttonMargin: {
    marginRight: Spacing.sm,
  },
  buttonPrimary: {},
  buttonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    color: Colors.text.inverse,
  },
  buttonSecondary: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  buttonSecondaryText: {
    color: Colors.text.secondary,
  },
  buttonDestructive: {
    backgroundColor: Colors.semantic.errorMuted,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.semantic.error,
  },
  buttonDestructiveText: {
    color: Colors.semantic.error,
  },
})
