import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppText } from '@/components/app-text'
import { Cluster } from '@/components/cluster/cluster'
import { ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/theme'

export function ClusterUiVersion({ selectedCluster }: { selectedCluster: Cluster }) {
  const { connection } = useMobileWallet()
  const query = useQuery({
    queryKey: ['get-version', { selectedCluster }],
    queryFn: () =>
      connection.getVersion().then((version) => {
        return {
          core: version['solana-core'],
          features: version['feature-set'],
        }
      }),
  })

  if (query.isLoading) {
    return <ActivityIndicator size="small" color={Colors.primary.default} />
  }

  return (
    <AppText variant="mono" style={{ fontSize: 12 }}>
      {query.data?.core}
    </AppText>
  )
}
