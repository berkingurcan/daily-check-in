/**
 * Aurora Flow theme color hook
 * Dark mode optimized for the Aurora Flow design system
 */

import { Colors } from '@/constants/colors'

type ThemeColorName = keyof typeof Colors.light & keyof typeof Colors.dark

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ThemeColorName) {
  // Aurora Flow is dark mode by default
  const colorFromProps = props.dark

  if (colorFromProps) {
    return colorFromProps
  }

  return Colors.dark[colorName]
}
