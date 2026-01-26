/**
 * Check-In Transaction Hook
 * Now mints an NFT badge for each check-in
 */

import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { AppConfig } from '@/constants/app-config'
import { PublicKey, TransactionSignature } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { buildNFTMintTransaction, generateBadgeMetadata } from './nft-minting-service'
import { BadgeMetadata, getDayBadge, MintedBadge } from './types'

interface CheckInTransactionInput {
  dayNumber: number
  habitName: string
}

interface CheckInTransactionResult {
  signature: string
  feePaid: number
  mintAddress: string
  badge: MintedBadge
}

export function useCheckInTransaction({ address }: { address: PublicKey }) {
  const { connection, signAndSendTransaction } = useMobileWallet()
  const invalidateBalance = useGetBalanceInvalidate({ address })

  return useMutation({
    mutationKey: ['checkin-transaction', { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async (input: CheckInTransactionInput): Promise<CheckInTransactionResult> => {
      const fee = AppConfig.getCheckInFee(input.dayNumber)
      const badge = getDayBadge(input.dayNumber, input.habitName)

      try {
        // Build NFT mint transaction
        const { transaction, mintKeypair, latestBlockhash, minContextSlot } =
          await buildNFTMintTransaction({
            connection,
            payer: address,
            dayNumber: input.dayNumber,
            badge,
            mintFee: fee,
            habitName: input.habitName,
          })

        // Sign and send transaction
        const signature: TransactionSignature = await signAndSendTransaction(
          transaction,
          minContextSlot
        )

        // Confirm transaction
        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        // Generate metadata for the minted badge
        const metadata = generateBadgeMetadata(
          input.dayNumber,
          badge,
          address.toBase58(),
          mintKeypair.publicKey.toBase58(),
          fee,
          input.habitName
        ) as BadgeMetadata

        const mintedBadge: MintedBadge = {
          day: input.dayNumber,
          mintAddress: mintKeypair.publicKey.toBase58(),
          transactionSignature: signature,
          mintedAt: new Date().toISOString(),
          metadata,
        }

        return {
          signature,
          feePaid: fee,
          mintAddress: mintKeypair.publicKey.toBase58(),
          badge: mintedBadge,
        }
      } catch (error: unknown) {
        console.error('Check-in NFT mint failed:', error)
        throw error
      }
    },
    onSuccess: async () => {
      await invalidateBalance()
    },
    onError: (error) => {
      console.error('Check-in transaction error:', error)
    },
  })
}

