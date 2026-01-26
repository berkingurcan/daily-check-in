import { Colors } from '@/constants/theme'

export function useWalletUiTheme() {
  return {
    backgroundColor: Colors.surface.default,
    listBackgroundColor: Colors.background.secondary,
    borderColor: Colors.border.default,
    textColor: Colors.text.primary,
    primaryColor: Colors.primary.default,
    secondaryColor: Colors.text.secondary,
  }
}
