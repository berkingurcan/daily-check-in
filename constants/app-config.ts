import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import { Cluster } from '@/components/cluster/cluster'
import { ClusterNetwork } from '@/components/cluster/cluster-network'

const getNetworkFromEnv = (): ClusterNetwork => {
  const network = process.env.EXPO_PUBLIC_SOLANA_NETWORK || 'devnet'
  switch (network) {
    case 'mainnet-beta':
      return ClusterNetwork.Mainnet
    case 'testnet':
      return ClusterNetwork.Testnet
    default:
      return ClusterNetwork.Devnet
  }
}

const getEndpoint = (network: ClusterNetwork): string => {
  const customEndpoint = process.env.EXPO_PUBLIC_CUSTOM_RPC_ENDPOINT
  if (customEndpoint) return customEndpoint

  switch (network) {
    case ClusterNetwork.Mainnet:
      return clusterApiUrl('mainnet-beta')
    case ClusterNetwork.Testnet:
      return clusterApiUrl('testnet')
    default:
      return clusterApiUrl('devnet')
  }
}

export class AppConfig {
  static name = 'Daily Check-In'
  static uri = 'https://dailycheckin.app'

  static defaultNetwork = getNetworkFromEnv()

  static commissionWallet = new PublicKey(
    process.env.EXPO_PUBLIC_COMMISSION_WALLET || '11111111111111111111111111111111',
  )

  static totalDays = 12

  static getCheckInFee = (dayNumber: number): number => {
    return dayNumber * 0.01
  }

  static clusters: Cluster[] = [
    {
      id: 'solana:devnet',
      name: 'Devnet',
      endpoint: getEndpoint(ClusterNetwork.Devnet),
      network: ClusterNetwork.Devnet,
    },
    {
      id: 'solana:testnet',
      name: 'Testnet',
      endpoint: getEndpoint(ClusterNetwork.Testnet),
      network: ClusterNetwork.Testnet,
    },
    {
      id: 'solana:mainnet-beta',
      name: 'Mainnet',
      endpoint: getEndpoint(ClusterNetwork.Mainnet),
      network: ClusterNetwork.Mainnet,
    },
  ]
}
