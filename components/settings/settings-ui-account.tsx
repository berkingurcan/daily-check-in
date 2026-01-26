import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { ellipsify } from '@/utils/ellipsify'
import { AppText } from '@/components/app-text'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { WalletUiButtonDisconnect } from '@/components/solana/wallet-ui-button-disconnect'
import { View, StyleSheet } from 'react-native'
import { Colors, Spacing, BorderRadius } from '@/constants/theme'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export function SettingsUiAccount() {
  const { account } = useMobileWallet()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UiIconSymbol name="person.circle.fill" size={20} color={Colors.text.secondary} />
        <AppText variant="h4">Account</AppText>
      </View>

      <View style={styles.content}>
        {account ? (
          <View style={styles.connectedState}>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <AppText variant="body">Connected</AppText>
            </View>
            <AppText variant="mono" color="secondary" style={styles.address}>
              {ellipsify(account.address.toString(), 8)}
            </AppText>
            <WalletUiButtonDisconnect />
          </View>
        ) : (
          <View style={styles.disconnectedState}>
            <AppText variant="body" color="secondary">
              No wallet connected
            </AppText>
            <WalletUiButtonConnect />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  content: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  connectedState: {
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.semantic.success,
  },
  address: {
    fontSize: 13,
  },
  disconnectedState: {
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
})
