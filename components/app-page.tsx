import React, { PropsWithChildren } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppView } from '@/components/app-view'
import type { ViewProps } from 'react-native'
import { Spacing } from '@/constants/theme'

export function AppPage({ children, ...props }: PropsWithChildren<ViewProps>) {
  return (
    <AppView style={{ flex: 1 }} {...props}>
      <SafeAreaView style={{ flex: 1, gap: Spacing.lg, paddingHorizontal: Spacing.lg }}>{children}</SafeAreaView>
    </AppView>
  )
}
