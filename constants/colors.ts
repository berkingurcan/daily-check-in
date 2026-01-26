/**
 * Aurora Flow Theme Colors
 * Re-exports from the design system for backward compatibility
 */

import { Colors as ThemeColors, LegacyColors } from './theme'

// Export legacy color structure for backward compatibility
export const Colors = {
  ...LegacyColors,
  // Also expose new organized colors
  aurora: ThemeColors,
}
