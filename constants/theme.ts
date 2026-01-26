/**
 * Aurora Flow Design System
 * A modern, professional theme following 2025/2026 UI trends
 * Features: Mesh gradients, organic shapes, calming tech aesthetic
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const Colors = {
  // Core backgrounds
  background: {
    primary: '#050510',
    secondary: '#0C0C1D',
    tertiary: '#141428',
    elevated: '#1A1A32',
  },

  // Surface colors for cards, modals, etc.
  surface: {
    default: '#141428',
    elevated: '#1A1A32',
    overlay: 'rgba(20, 20, 40, 0.95)',
  },

  // Border colors
  border: {
    default: '#2A2A4A',
    subtle: '#1E1E38',
    focus: '#00D9B5',
  },

  // Primary brand color - Aurora Teal
  primary: {
    default: '#00D9B5',
    light: '#33E3C7',
    dark: '#00A88C',
    muted: 'rgba(0, 217, 181, 0.15)',
    glow: 'rgba(0, 217, 181, 0.4)',
  },

  // Secondary - Soft Lavender
  secondary: {
    default: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
    muted: 'rgba(167, 139, 250, 0.15)',
    glow: 'rgba(167, 139, 250, 0.4)',
  },

  // Accent - Warm Coral
  accent: {
    default: '#FF7B72',
    light: '#FFA099',
    dark: '#E5534B',
    muted: 'rgba(255, 123, 114, 0.15)',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    tertiary: '#6B7280',
    inverse: '#050510',
    link: '#00D9B5',
  },

  // Semantic colors
  semantic: {
    success: '#34D399',
    successMuted: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',
    warningMuted: 'rgba(251, 191, 36, 0.15)',
    error: '#F87171',
    errorMuted: 'rgba(248, 113, 113, 0.15)',
    info: '#60A5FA',
    infoMuted: 'rgba(96, 165, 250, 0.15)',
  },

  // Check-in specific colors
  checkIn: {
    completed: '#34D399',
    completedGlow: 'rgba(52, 211, 153, 0.4)',
    missed: '#F87171',
    missedGlow: 'rgba(248, 113, 113, 0.3)',
    pending: '#2A2A4A',
    today: '#00D9B5',
    todayGlow: 'rgba(0, 217, 181, 0.5)',
  },

  // Gradient presets
  gradient: {
    primary: ['#00D9B5', '#A78BFA'] as const,
    aurora: ['#00D9B5', '#A78BFA', '#FF7B72'] as const,
    surface: ['rgba(20, 20, 40, 0.8)', 'rgba(12, 12, 29, 0.95)'] as const,
    glow: ['rgba(0, 217, 181, 0.3)', 'rgba(167, 139, 250, 0.1)'] as const,
  },

  // Tab bar specific
  tabBar: {
    background: '#0C0C1D',
    border: '#1E1E38',
    active: '#00D9B5',
    inactive: '#6B7280',
  },
} as const

// Legacy support - map to old color structure
export const LegacyColors = {
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    border: '#E5E5E5',
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#00D9B5',
    text: '#111827',
    textSecondary: '#6B7280',
    tint: '#00D9B5',
  },
  dark: {
    background: Colors.background.primary,
    backgroundSecondary: Colors.background.secondary,
    border: Colors.border.default,
    icon: Colors.text.tertiary,
    tabIconDefault: Colors.tabBar.inactive,
    tabIconSelected: Colors.tabBar.active,
    text: Colors.text.primary,
    textSecondary: Colors.text.secondary,
    tint: Colors.primary.default,
  },
  brand: {
    primary: Colors.primary.default,
    secondary: Colors.secondary.default,
    success: Colors.semantic.success,
    warning: Colors.semantic.warning,
    error: Colors.semantic.error,
    gradientStart: Colors.gradient.primary[0],
    gradientEnd: Colors.gradient.primary[1],
  },
  checkIn: Colors.checkIn,
}

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const Typography = {
  // Font families
  family: {
    heading: 'SpaceGrotesk',
    body: 'Inter',
    mono: 'SpaceMono',
  },

  // Font sizes following 8pt grid
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
    '5xl': 48,
  },

  // Line heights
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },

  // Predefined text styles
  styles: {
    // Headings - Space Grotesk
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

    // Body - Inter
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

    // Labels
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

    // Buttons
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

    // Mono (for addresses, code)
    mono: {
      fontFamily: 'SpaceMono',
      fontSize: 14,
      lineHeight: 20,
    },
  },
} as const

// =============================================================================
// SPACING
// =============================================================================

export const Spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const BorderRadius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const

// =============================================================================
// SHADOWS
// =============================================================================

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  // Glow effects
  glowPrimary: {
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glowSecondary: {
    shadowColor: Colors.secondary.default,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glowSuccess: {
    shadowColor: Colors.semantic.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
} as const

// =============================================================================
// ANIMATION
// =============================================================================

export const Animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    easeInOut: 'ease-in-out',
  },
} as const

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const Components = {
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    padding: {
      sm: Spacing.md,
      md: Spacing.lg,
      lg: Spacing.xl,
    },
    borderRadius: BorderRadius.lg,
  },
  input: {
    height: 52,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  badge: {
    height: 28,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  progressCircle: {
    size: 48,
    borderRadius: 24,
  },
  checkInButton: {
    size: 180,
    borderRadius: 90,
  },
} as const
