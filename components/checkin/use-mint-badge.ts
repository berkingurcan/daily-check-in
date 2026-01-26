/**
 * Badge Minting Hook
 * Handles real NFT minting for daily check-in badges
 */

import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { AppConfig } from '@/constants/app-config'
import { PublicKey, TransactionSignature } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import {
    buildNFTMintTransaction,
    generateBadgeMetadata,
    TREASURY_WALLET,
} from './nft-minting-service'
import { BadgeMetadata, getDayBadge, MintedBadge } from './types'

export { TREASURY_WALLET }

export interface MintBadgeInput {
    dayNumber: number
    habitName: string
}

export interface MintBadgeResult {
    badge: MintedBadge
    signature: TransactionSignature
    mintAddress: string
    feePaid: number
}

export function useMintBadge({ address }: { address: PublicKey }) {
    const { connection, signAndSendTransaction } = useMobileWallet()
    const invalidateBalance = useGetBalanceInvalidate({ address })

    return useMutation({
        mutationKey: ['mint-badge', { endpoint: connection.rpcEndpoint, address }],
        mutationFn: async (input: MintBadgeInput): Promise<MintBadgeResult> => {
            const badge = getDayBadge(input.dayNumber, input.habitName)
            const mintFee = AppConfig.getCheckInFee(input.dayNumber)

            // Build the NFT mint transaction
            const { transaction, mintKeypair, tokenAccount, latestBlockhash, minContextSlot } =
                await buildNFTMintTransaction({
                    connection,
                    payer: address,
                    dayNumber: input.dayNumber,
                    badge,
                    mintFee,
                    habitName: input.habitName,
                })

            // Sign and send the transaction (wallet will prompt user)
            const signature = await signAndSendTransaction(transaction, minContextSlot)

            // Confirm the transaction
            await connection.confirmTransaction(
                { signature, ...latestBlockhash },
                'confirmed'
            )

            // Generate badge metadata
            const metadata = generateBadgeMetadata(
                input.dayNumber,
                badge,
                address.toBase58(),
                mintKeypair.publicKey.toBase58(),
                mintFee,
                input.habitName
            ) as BadgeMetadata

            // Create badge record
            const mintedBadge: MintedBadge = {
                day: input.dayNumber,
                mintAddress: mintKeypair.publicKey.toBase58(),
                transactionSignature: signature,
                mintedAt: new Date().toISOString(),
                metadata,
            }

            return {
                badge: mintedBadge,
                signature,
                mintAddress: mintKeypair.publicKey.toBase58(),
                feePaid: mintFee,
            }
        },
        onSuccess: async () => {
            await invalidateBalance()
        },
        onError: (error) => {
            console.error(`Badge mint failed: ${error}`)
        },
    })
}

/**
 * Check if user can afford to mint
 */
export function canAffordMint(
    balance: number,
    mintFee: number,
    estimatedTxFee: number = 0.02 // ~0.02 SOL for NFT mint transaction fees (includes rent)
): boolean {
    return balance >= mintFee + estimatedTxFee
}

/**
 * Format mint fee for display
 */
export function formatMintFee(mintFee: number): string {
    return `${mintFee.toFixed(4)} SOL`
}
