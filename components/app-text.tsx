import { StyleSheet, Text, type TextProps } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Colors } from '@/constants/colors'

export type AppTextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'bodyLg'
  | 'body'
  | 'bodySm'
  | 'bodyXs'
  | 'labelLg'
  | 'label'
  | 'labelSm'
  | 'buttonLg'
  | 'button'
  | 'buttonSm'
  | 'caption'
  | 'mono'
  // Legacy support
  | 'default'
  | 'title'
  | 'defaultSemiBold'
  | 'subtitle'
  | 'link'

export type AppTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  variant?: AppTextVariant
  type?: AppTextVariant // Legacy alias
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'error' | 'link'
}

export function AppText({ style, lightColor, darkColor, variant, type, color, ...rest }: AppTextProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  // Use variant or fallback to type for legacy support
  const effectiveVariant = variant || type || 'body'

  // Determine text color based on color prop
  const getColor = () => {
    if (color) {
      switch (color) {
        case 'primary':
          return Colors.aurora.primary.default
        case 'secondary':
          return Colors.aurora.text.secondary
        case 'tertiary':
          return Colors.aurora.text.tertiary
        case 'accent':
          return Colors.aurora.accent.default
        case 'success':
          return Colors.aurora.semantic.success
        case 'error':
          return Colors.aurora.semantic.error
        case 'link':
          return Colors.aurora.primary.default
        default:
          return textColor
      }
    }
    return textColor
  }

  return <Text style={[{ color: getColor() }, styles[effectiveVariant] || styles.body, style]} {...rest} />
}

const styles = StyleSheet.create({
  // New typography system - Headings (Space Grotesk)
  h1: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0,
  },

  // Body text (Inter)
  bodyLg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  bodySm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  bodyXs: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
  },

  // Labels (Inter Medium)
  labelLg: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    lineHeight: 20,
  },
  labelSm: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
  },

  // Button text (Space Grotesk)
  buttonLg: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  button: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  buttonSm: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
  },

  // Caption
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },

  // Monospace (for addresses, code)
  mono: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    lineHeight: 20,
  },

  // Legacy support - mapped to new system
  default: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  defaultSemiBold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 22,
  },
  subtitle: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 20,
    lineHeight: 26,
  },
  link: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    lineHeight: 22,
  },
})
