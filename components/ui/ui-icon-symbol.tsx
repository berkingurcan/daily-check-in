// Fallback for using MaterialIcons on Android and web.
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolViewProps } from 'expo-symbols'
import { ComponentProps } from 'react'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

type UiIconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>
export type UiIconSymbolName = keyof typeof MAPPING

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation and settings
  'gearshape.fill': 'settings',
  'wallet.pass.fill': 'account-balance-wallet',
  'ladybug.fill': 'bug-report',
  'checkmark.circle.fill': 'check-circle',
  'info.circle.fill': 'info',
  'info.circle': 'info-outline',
  'xmark': 'close',
  'checkmark': 'check',
  'checkmark.seal.fill': 'verified',
  'bolt.fill': 'bolt',
  'trophy.fill': 'emoji-events',
  'doc.on.doc': 'content-copy',
  'wrench.and.screwdriver': 'build',
  'arrow.counterclockwise': 'refresh',
  'trash.fill': 'delete',
  'arrow.up.right': 'open-in-new',
  'link': 'link',

  // Category icons for habits
  'book.fill': 'menu-book',
  'dumbbell.fill': 'fitness-center',
  'figure.run': 'directions-run',
  'person.2.fill': 'people',
  'heart.fill': 'favorite',
  'paintbrush.fill': 'brush',
  'star.fill': 'star',
  'clock.fill': 'schedule',
  'moon.fill': 'dark-mode',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'target': 'adjust',
  'play.fill': 'play-arrow',
  'exclamationmark.circle.fill': 'error',
  'photo': 'photo',
  'arrow.up.right.square': 'open-in-new',
} as UiIconMapping

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function UiIconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: UiIconSymbolName
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />
}
