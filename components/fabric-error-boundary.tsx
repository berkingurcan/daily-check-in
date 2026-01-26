/**
 * Fabric Error Boundary
 * Catches and handles React Native Fabric architecture exceptions
 * that occur during rapid navigation transitions and modal animations.
 *
 * The RetryableMountingLayerException is a known Fabric issue that occurs when:
 * - Components unmount while animations are running
 * - Navigation transitions happen during state changes
 * - Modal visibility changes rapidly
 *
 * These exceptions are typically benign (hence "Retryable") and the app
 * continues to function normally. This boundary prevents app crashes.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class FabricErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a Fabric-related error that can be safely ignored
    const isFabricError =
      error.message?.includes('RetryableMountingLayerException') ||
      error.message?.includes('Unable to find viewState') ||
      error.message?.includes('Surface stopped') ||
      error.name?.includes('RetryableMountingLayerException')

    if (isFabricError) {
      // Don't update state for Fabric errors - let the app continue
      console.warn('[FabricErrorBoundary] Caught Fabric error:', error.message)
      return { hasError: false, error: null }
    }

    // For other errors, show the error state
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const isFabricError =
      error.message?.includes('RetryableMountingLayerException') ||
      error.message?.includes('Unable to find viewState') ||
      error.message?.includes('Surface stopped') ||
      error.name?.includes('RetryableMountingLayerException')

    if (isFabricError) {
      // Log but don't crash for Fabric errors
      console.warn('[FabricErrorBoundary] Fabric error caught and suppressed:', {
        error: error.message,
        componentStack: errorInfo.componentStack,
      })
      // Reset state to allow recovery
      this.setState({ hasError: false, error: null })
      return
    }

    // Log other errors normally
    console.error('[FabricErrorBoundary] Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Only show fallback for non-Fabric errors
      return this.props.fallback || <View style={styles.fallback} />
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
  },
})
