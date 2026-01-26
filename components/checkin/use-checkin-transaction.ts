import { PublicKey, TransactionSignature } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { createTransaction } from '@/components/account/create-transaction'
import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { AppConfig } from '@/constants/app-config'

interface CheckInTransactionInput {
  dayNumber: number
}

interface CheckInTransactionResult {
  signature: string
  feePaid: number
}

export function useCheckInTransaction({ address }: { address: PublicKey }) {
  const { connection, signAndSendTransaction } = useMobileWallet()
  const invalidateBalance = useGetBalanceInvalidate({ address })

  return useMutation({
    mutationKey: ['checkin-transaction', { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async (input: CheckInTransactionInput): Promise<CheckInTransactionResult> => {
      const fee = AppConfig.getCheckInFee(input.dayNumber)
      let signature: TransactionSignature = ''

      try {
        const { transaction, latestBlockhash, minContextSlot } = await createTransaction({
          address,
          destination: AppConfig.commissionWallet,
          amount: fee,
          connection,
        })

        signature = await signAndSendTransaction(transaction, minContextSlot)

        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        return { signature, feePaid: fee }
      } catch (error: unknown) {
        console.error('Check-in transaction failed:', error)
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
