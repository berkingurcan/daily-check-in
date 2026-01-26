import { View, type ViewProps } from 'react-native'
import React from 'react'
import { Colors, Spacing } from '@/constants/theme'

export function AppView({ style, ...otherProps }: ViewProps) {
  return <View style={[{ backgroundColor: Colors.background.primary, gap: Spacing.sm }, style]} {...otherProps} />
}
