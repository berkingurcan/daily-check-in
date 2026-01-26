import { PropsWithChildren } from 'react'
import { Theme, ThemeProvider } from '@react-navigation/native'
import { Colors } from '@/constants/colors'

// Aurora Flow custom theme for React Navigation
const AuroraFlowTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.aurora.primary.default,
    background: Colors.aurora.background.primary,
    card: Colors.aurora.background.secondary,
    text: Colors.aurora.text.primary,
    border: Colors.aurora.border.default,
    notification: Colors.aurora.accent.default,
  },
  fonts: {
    regular: {
      fontFamily: 'Inter_400Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Inter_500Medium',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'SpaceGrotesk_700Bold',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'SpaceGrotesk_700Bold',
      fontWeight: '700',
    },
  },
}

export function useAppTheme() {
  return {
    colorScheme: 'dark' as const,
    isDark: true,
    theme: AuroraFlowTheme,
  }
}

export function AppTheme({ children }: PropsWithChildren) {
  const { theme } = useAppTheme()

  return <ThemeProvider value={theme}>{children}</ThemeProvider>
}
