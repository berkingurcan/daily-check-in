/**
 * NFT Minting Service
 * Creates real NFTs using SPL Token with Metaplex-compatible metadata
 */

import { AppConfig } from '@/constants/app-config'
import {
    createCreateMasterEditionV3Instruction,
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata'
import {
    createAssociatedTokenAccountInstruction,
    createInitializeMintInstruction,
    createMintToInstruction,
    getAssociatedTokenAddress,
    getMinimumBalanceForRentExemptMint,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import { BadgeMetadata, DailyBadge } from './types'

// Treasury wallet address for mint fees (from environment)
export const TREASURY_WALLET = AppConfig.commissionWallet

export interface NFTMintResult {
    mintAddress: string
    tokenAccount: string
    signature: string
}

export interface NFTMintParams {
    connection: Connection
    payer: PublicKey
    dayNumber: number
    badge: DailyBadge
    mintFee: number
    habitName: string
}

/**
 * Find Metadata PDA for a mint
 */
function findMetadataPda(mint: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    )
    return pda
}

/**
 * Find Master Edition PDA for a mint
 */
function findMasterEditionPda(mint: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
            Buffer.from('edition'),
        ],
        TOKEN_METADATA_PROGRAM_ID
    )
    return pda
}

/**
 * Build the transaction for minting an NFT badge
 * This creates:
 * 1. A new mint account (the NFT)
 * 2. An associated token account for the user
 * 3. Mints 1 token to the user (making it an NFT)
 * 4. Creates Metaplex Metadata for the mint
 * 5. Creates Master Edition (limiting supply to 1)
 * 6. Transfers the mint fee to treasury
 */
export async function buildNFTMintTransaction({
    connection,
    payer,
    dayNumber,
    badge,
    mintFee,
    habitName,
}: NFTMintParams): Promise<{
    transaction: Transaction
    mintKeypair: Keypair
    tokenAccount: PublicKey
    latestBlockhash: { blockhash: string; lastValidBlockHeight: number }
    minContextSlot: number
}> {
    // Generate a new keypair for the NFT mint
    const mintKeypair = Keypair.generate()

    // Get the user's associated token account for this NFT
    const tokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        payer
    )

    // Get rent exemption amount for mint
    const lamportsForMint = await getMinimumBalanceForRentExemptMint(connection)

    // Get latest blockhash
    const {
        context: { slot: minContextSlot },
        value: latestBlockhash,
    } = await connection.getLatestBlockhashAndContext()

    // Find PDAs
    const metadataPDA = findMetadataPda(mintKeypair.publicKey)
    const masterEditionPDA = findMasterEditionPda(mintKeypair.publicKey)

    // Build the transaction with all instructions
    const transaction = new Transaction()

    // 1. Create the mint account
    transaction.add(
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: lamportsForMint,
            programId: TOKEN_PROGRAM_ID,
        })
    )

    // 2. Initialize the mint (0 decimals for NFT, payer is mint authority)
    transaction.add(
        createInitializeMintInstruction(
            mintKeypair.publicKey,
            0, // 0 decimals for NFT
            payer, // Mint authority
            payer // Freeze authority (needed for Master Edition)
        )
    )

    // 3. Create associated token account for the user
    transaction.add(
        createAssociatedTokenAccountInstruction(
            payer, // Payer
            tokenAccount, // ATA address
            payer, // Owner
            mintKeypair.publicKey // Mint
        )
    )

    // 4. Mint 1 token to the user (making it an NFT)
    transaction.add(
        createMintToInstruction(
            mintKeypair.publicKey, // Mint
            tokenAccount, // Destination
            payer, // Mint authority
            1 // Amount (1 for NFT)
        )
    )

    // 5. Create Metaplex Metadata
    // Metadata hosted on IPFS via Pinata
    const metadataUri = `https://rose-smoggy-sparrow-317.mypinata.cloud/ipfs/bafybeibc3tx5ega3646dbmztvmaw3rb4ucssl2iiaz62rrb47nghpb3fau/day${dayNumber}.json`

    transaction.add(
        createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataPDA,
                mint: mintKeypair.publicKey,
                mintAuthority: payer,
                payer: payer,
                updateAuthority: payer,
            },
            {
                createMetadataAccountArgsV3: {
                    data: {
                        name: badge.name,
                        symbol: AppConfig.symbol,
                        uri: metadataUri,
                        sellerFeeBasisPoints: 500, // 5%
                        creators: [
                            {
                                address: TREASURY_WALLET,
                                verified: false,
                                share: 100,
                            },
                        ],
                        collection: null,
                        uses: null,
                    },
                    isMutable: true,
                    collectionDetails: null,
                },
            }
        )
    )

    // 6. Create Master Edition
    transaction.add(
        createCreateMasterEditionV3Instruction(
            {
                edition: masterEditionPDA,
                mint: mintKeypair.publicKey,
                updateAuthority: payer,
                mintAuthority: payer,
                payer: payer,
                metadata: metadataPDA,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
            {
                createMasterEditionArgs: {
                    maxSupply: 0, // 0 = unlimited prints disabled, unique NFT
                },
            }
        )
    )

    // 7. Transfer mint fee to treasury
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: TREASURY_WALLET,
            lamports: Math.floor(mintFee * LAMPORTS_PER_SOL),
        })
    )

    // Set transaction metadata
    transaction.recentBlockhash = latestBlockhash.blockhash
    transaction.feePayer = payer

    // Partially sign with the mint keypair (required for creating the mint account)
    transaction.partialSign(mintKeypair)

    return {
        transaction,
        mintKeypair,
        tokenAccount,
        latestBlockhash,
        minContextSlot,
    }
}

/**
 * Generate Metaplex-compatible metadata for the badge
 */
export function generateBadgeMetadata(
    dayNumber: number,
    badge: DailyBadge,
    walletAddress: string,
    mintAddress: string,
    mintFee: number,
    habitName: string
): BadgeMetadata {
    return {
        name: badge.name,
        symbol: AppConfig.symbol,
        description: badge.description,
        image: 'https://rose-smoggy-sparrow-317.mypinata.cloud/ipfs/bafybeiad5qxyc23qb57xz362sybn5snzla253h355c4rcotjozinsdg5le',
        external_url: AppConfig.uri,
        attributes: [
            { trait_type: 'Day', value: dayNumber.toString() },
            { trait_type: 'Habit', value: habitName },
            { trait_type: 'Mint Fee', value: `${mintFee} SOL` },
            { trait_type: 'Completed By', value: walletAddress },
            { trait_type: 'Completed Date', value: new Date().toISOString().split('T')[0] },
        ],
        properties: {
            files: [
                {
                    uri: 'https://rose-smoggy-sparrow-317.mypinata.cloud/ipfs/bafybeiad5qxyc23qb57xz362sybn5snzla253h355c4rcotjozinsdg5le',
                    type: 'image/png',
                },
            ],
            category: 'image',
            creators: [
                {
                    address: TREASURY_WALLET.toBase58(),
                    share: 100,
                },
            ],
        },
        seller_fee_basis_points: 500, // 5% royalty
    }
}
