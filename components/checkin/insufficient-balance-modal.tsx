/**
 * Insufficient Balance Modal
 * Professional modal to inform users when they don't have enough SOL to mint
 */

import { AppText } from '@/components/app-text'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking'
import React, { useEffect, useRef } from 'react'
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native'
import Snackbar from 'react-native-snackbar'

interface InsufficientBalanceModalProps {
    visible: boolean
    onClose: () => void
    currentBalance: number // in lamports
    requiredAmount: number // in SOL
    walletAddress: string
    network?: 'devnet' | 'mainnet-beta' | 'testnet'
}

const ESTIMATED_TX_FEE = 0.02 // SOL for NFT mint transaction fees (includes rent)

export function InsufficientBalanceModal({
    visible,
    onClose,
    currentBalance,
    requiredAmount,
    walletAddress,
    network = 'devnet',
}: InsufficientBalanceModalProps) {
    const scaleAnim = useRef(new Animated.Value(0.95)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

    const balanceInSol = currentBalance / LAMPORTS_PER_SOL
    const totalRequired = requiredAmount + ESTIMATED_TX_FEE
    const deficit = Math.max(0, totalRequired - balanceInSol)

    useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0.95)
            fadeAnim.setValue(0)

            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 200,
                    friction: 20,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start()
        }
    }, [visible])

    const handleCopyAddress = async () => {
        await Clipboard.setStringAsync(walletAddress)
        Snackbar.show({
            text: 'Wallet address copied!',
            duration: Snackbar.LENGTH_SHORT,
        })
    }

    const handleOpenFaucet = () => {
        if (network === 'devnet') {
            Linking.openURL('https://faucet.solana.com/')
        }
    }

    const formatSol = (amount: number) => {
        return amount.toFixed(4)
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Pressable style={styles.card}>
                        {/* Top accent line - warning color */}
                        <View style={styles.accentLine} />

                        {/* Content */}
                        <View style={styles.content}>
                            {/* Warning icon */}
                            <View style={styles.iconContainer}>
                                <View style={styles.iconBg}>
                                    <UiIconSymbol name="exclamationmark.triangle.fill" size={32} color={Colors.semantic.warning} />
                                </View>
                            </View>

                            {/* Title */}
                            <AppText style={styles.title}>Insufficient Balance</AppText>

                            {/* Subtitle */}
                            <AppText style={styles.subtitle}>
                                You need more SOL to mint your check-in NFT badge
                            </AppText>

                            {/* Balance breakdown */}
                            <View style={styles.balanceCard}>
                                <View style={styles.balanceRow}>
                                    <View style={styles.balanceLabel}>
                                        <UiIconSymbol name="wallet.pass" size={14} color={Colors.text.tertiary} />
                                        <AppText style={styles.balanceLabelText}>Your Balance</AppText>
                                    </View>
                                    <AppText style={styles.balanceValue}>{formatSol(balanceInSol)} SOL</AppText>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.balanceRow}>
                                    <View style={styles.balanceLabel}>
                                        <UiIconSymbol name="sparkles" size={14} color={Colors.text.tertiary} />
                                        <AppText style={styles.balanceLabelText}>Mint Fee</AppText>
                                    </View>
                                    <AppText style={styles.balanceValue}>{formatSol(requiredAmount)} SOL</AppText>
                                </View>

                                <View style={styles.balanceRow}>
                                    <View style={styles.balanceLabel}>
                                        <UiIconSymbol name="network" size={14} color={Colors.text.tertiary} />
                                        <AppText style={styles.balanceLabelText}>Network Fee</AppText>
                                    </View>
                                    <AppText style={styles.balanceValueSecondary}>~{formatSol(ESTIMATED_TX_FEE)} SOL</AppText>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.balanceRow}>
                                    <View style={styles.balanceLabel}>
                                        <UiIconSymbol name="arrow.up.circle.fill" size={14} color={Colors.semantic.error} />
                                        <AppText style={styles.deficitLabelText}>Amount Needed</AppText>
                                    </View>
                                    <AppText style={styles.deficitValue}>+{formatSol(deficit)} SOL</AppText>
                                </View>
                            </View>

                            {/* Info text */}
                            <View style={styles.infoBox}>
                                <UiIconSymbol name="info.circle" size={14} color={Colors.text.tertiary} />
                                <AppText style={styles.infoText}>
                                    {network === 'devnet'
                                        ? 'Get free devnet SOL from the Solana faucet to test minting.'
                                        : 'Transfer SOL to your wallet to continue.'}
                                </AppText>
                            </View>

                            {/* Action buttons */}
                            <View style={styles.buttons}>
                                {network === 'devnet' && (
                                    <TouchableOpacity
                                        onPress={handleOpenFaucet}
                                        style={styles.primaryButton}
                                        activeOpacity={0.85}
                                    >
                                        <UiIconSymbol name="drop.fill" size={16} color={Colors.text.inverse} />
                                        <AppText style={styles.primaryButtonText}>GET DEVNET SOL</AppText>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    onPress={handleCopyAddress}
                                    style={[styles.secondaryButton, network !== 'devnet' && styles.fullWidthButton]}
                                    activeOpacity={0.7}
                                >
                                    <UiIconSymbol name="doc.on.doc" size={14} color={Colors.primary.default} />
                                    <AppText style={styles.secondaryButtonText}>COPY ADDRESS</AppText>
                                </TouchableOpacity>
                            </View>

                            {/* Close button */}
                            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                                <AppText style={styles.closeButtonText}>Close</AppText>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: Spacing.xl,
    },
    container: {
        width: '100%',
        maxWidth: 360,
    },
    card: {
        backgroundColor: Colors.surface.default,
        borderRadius: BorderRadius['2xl'],
        borderWidth: 1,
        borderColor: Colors.border.default,
        overflow: 'hidden',
        ...Shadows.xl,
    },
    accentLine: {
        height: 4,
        backgroundColor: Colors.semantic.warning,
    },
    content: {
        padding: Spacing['2xl'],
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: Spacing.lg,
    },
    iconBg: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.semantic.warningMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    balanceCard: {
        width: '100%',
        backgroundColor: Colors.background.secondary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border.subtle,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    balanceLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    balanceLabelText: {
        fontSize: 13,
        color: Colors.text.secondary,
    },
    balanceValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        fontFamily: 'monospace',
    },
    balanceValueSecondary: {
        fontSize: 14,
        color: Colors.text.tertiary,
        fontFamily: 'monospace',
    },
    deficitLabelText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.semantic.error,
    },
    deficitValue: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.semantic.error,
        fontFamily: 'monospace',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border.subtle,
        marginVertical: Spacing.xs,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
        backgroundColor: Colors.semantic.infoMuted,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.xl,
        width: '100%',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        color: Colors.text.secondary,
    },
    buttons: {
        width: '100%',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.primary.default,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
    },
    primaryButtonText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
        color: Colors.text.inverse,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border.default,
        backgroundColor: Colors.background.secondary,
    },
    fullWidthButton: {
        paddingVertical: Spacing.lg,
    },
    secondaryButtonText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        color: Colors.primary.default,
    },
    closeButton: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.xl,
    },
    closeButtonText: {
        fontSize: 14,
        color: Colors.text.tertiary,
    },
})
