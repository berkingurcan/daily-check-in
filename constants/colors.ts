/**
 * Dark/Modern theme with gradient accents for Daily Check-In
 */

const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

export const Colors = {
  light: {
    background: '#fff',
    backgroundSecondary: '#f5f5f5',
    border: '#e0e0e0',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    text: '#11181C',
    textSecondary: '#687076',
    tint: tintColorLight,
  },
  dark: {
    background: '#0A0A0F',
    backgroundSecondary: '#12121A',
    border: '#1E1E2E',
    icon: '#8B8B9E',
    tabIconDefault: '#8B8B9E',
    tabIconSelected: tintColorDark,
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    tint: tintColorDark,
  },
  brand: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradientStart: '#8B5CF6',
    gradientEnd: '#06B6D4',
  },
  checkIn: {
    completed: '#10B981',
    missed: '#EF4444',
    pending: '#3B3B4F',
    today: '#8B5CF6',
    todayGlow: 'rgba(139, 92, 246, 0.3)',
  },
}
