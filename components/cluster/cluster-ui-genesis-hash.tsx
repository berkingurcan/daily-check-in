import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import { AppText } from '@/components/app-text'
import { ellipsify } from '@/utils/ellipsify'
import { Cluster } from '@/components/cluster/cluster'
import { Colors } from '@/constants/theme'

export function ClusterUiGenesisHash({ selectedCluster }: { selectedCluster: Cluster }) {
  const { connection } = useMobileWallet()
  const query = useQuery({
    queryKey: ['get-genesis-hash', { selectedCluster }],
    queryFn: () => connection.getGenesisHash(),
  })

  if (query.isLoading) {
    return <ActivityIndicator size="small" color={Colors.primary.default} />
  }

  return (
    <AppText variant="mono" style={{ fontSize: 12 }}>
      {ellipsify(query.data, 8)}
    </AppText>
  )
}
