import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppText } from '@/components/app-text'
import { ellipsify } from '@/utils/ellipsify'
import { AppPage } from '@/components/app-page'
import { AccountUiButtons } from './account-ui-buttons'
import { AccountUiBalance } from '@/components/account/account-ui-balance'
import { AccountUiTokenAccounts } from '@/components/account/account-ui-token-accounts'
import { RefreshControl, ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useCallback, useState } from 'react'
import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { PublicKey } from '@solana/web3.js'
import { useGetTokenAccountsInvalidate } from '@/components/account/use-get-token-accounts'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { Colors, Spacing, BorderRadius } from '@/constants/theme'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { LinearGradient } from 'expo-linear-gradient'
import Clipboard from '@react-native-clipboard/clipboard'
import Snackbar from 'react-native-snackbar'

export function AccountFeature() {
  const { account } = useMobileWallet()
  const [refreshing, setRefreshing] = useState(false)
  const invalidateBalance = useGetBalanceInvalidate({ address: account?.address as PublicKey })
  const invalidateTokenAccounts = useGetTokenAccountsInvalidate({
    address: account?.address as PublicKey,
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([invalidateBalance(), invalidateTokenAccounts()])
    setRefreshing(false)
  }, [invalidateBalance, invalidateTokenAccounts])

  const copyAddress = () => {
    if (account?.address) {
      Clipboard.setString(account.address.toString())
      Snackbar.show({
        text: 'Address copied to clipboard',
        duration: Snackbar.LENGTH_SHORT,
      })
    }
  }

  if (!account) {
    return (
      <AppPage>
        <View style={styles.connectContainer}>
          <LinearGradient
            colors={['rgba(167, 139, 250, 0.1)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.connectGradient}
          />
          <View style={styles.connectIconContainer}>
            <UiIconSymbol name="wallet.pass.fill" size={48} color={Colors.secondary.default} />
          </View>
          <AppText variant="h3" style={styles.connectTitle}>
            Connect Your Wallet
          </AppText>
          <AppText variant="body" color="secondary" style={styles.connectSubtitle}>
            View your balance and manage your tokens
          </AppText>
          <WalletUiButtonConnect />
        </View>
      </AppPage>
    )
  }

  return (
    <AppPage>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary.default} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          />
          <AppText variant="caption" color="secondary">
            Total Balance
          </AppText>
          <AccountUiBalance address={account.address} />

          <TouchableOpacity onPress={copyAddress} style={styles.addressContainer}>
            <AppText variant="mono" color="secondary" style={styles.addressText}>
              {ellipsify(account.address.toString(), 8)}
            </AppText>
            <UiIconSymbol name="doc.on.doc" size={14} color={Colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <AccountUiButtons />

        {/* Token Accounts */}
        <View style={styles.tokensSection}>
          <View style={styles.sectionHeader}>
            <AppText variant="h4">Tokens</AppText>
          </View>
          <AccountUiTokenAccounts address={account.address} />
        </View>
      </ScrollView>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing['2xl'],
  },
  connectGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  connectIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.secondary.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  connectTitle: {
    textAlign: 'center',
  },
  connectSubtitle: {
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 24,
  },
  balanceCard: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    overflow: 'hidden',
  },
  balanceGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    opacity: 0.1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  addressText: {
    fontSize: 13,
  },
  tokensSection: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
