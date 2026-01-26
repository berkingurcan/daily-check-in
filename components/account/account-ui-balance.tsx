import { PublicKey } from '@solana/web3.js'
import { useGetBalance } from '@/components/account/use-get-balance'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { Colors, Spacing } from '@/constants/theme'

export function AccountUiBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address })

  return (
    <View style={styles.container}>
      {query.isLoading ? (
        <ActivityIndicator size="small" color={Colors.primary.default} />
      ) : (
        <View style={styles.balanceRow}>
          <AppText variant="h1" style={styles.balanceValue}>
            {query.data ? lamportsToSol(query.data) : '0'}
          </AppText>
          <AppText variant="h3" color="secondary" style={styles.currency}>
            SOL
          </AppText>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  balanceValue: {
    color: Colors.text.primary,
  },
  currency: {
    marginBottom: 2,
  },
})
