/**
 * Mint Success Modal
 * Displays NFT minting success with badge details and explorer links
 */

import { AppText } from '@/components/app-text'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme'
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
import { DailyBadge } from './types'

interface MintSuccessModalProps {
    visible: boolean
    onClose: () => void
    dayNumber: number
    badge: DailyBadge
    mintAddress: string
    signature: string
    network?: 'devnet' | 'mainnet-beta' | 'testnet'
}

export function MintSuccessModal({
    visible,
    onClose,
    dayNumber,
    badge,
    mintAddress,
    signature,
    network = 'devnet',
}: MintSuccessModalProps) {
    const scaleAnim = useRef(new Animated.Value(0.95)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

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

    const handleViewOnExplorer = () => {
        const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`
        const url = `https://explorer.solana.com/tx/${signature}${cluster}`
        Linking.openURL(url)
    }

    const handleViewNFT = () => {
        const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`
        const url = `https://explorer.solana.com/address/${mintAddress}${cluster}`
        Linking.openURL(url)
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
                        {/* Top accent line */}
                        <View style={styles.accentLine} />

                        {/* Content */}
                        <View style={styles.content}>
                            {/* Success icon */}
                            <View style={styles.successIcon}>
                                <UiIconSymbol name="checkmark.seal.fill" size={48} color={Colors.semantic.success} />
                            </View>

                            {/* Success badge */}
                            <View style={styles.successBadge}>
                                <AppText style={styles.successText}>NFT MINTED</AppText>
                            </View>

                            {/* Day indicator */}
                            <AppText style={styles.dayIndicator}>
                                DAY {String(dayNumber).padStart(2, '0')}
                            </AppText>

                            {/* Badge name */}
                            <AppText style={styles.badgeName}>{badge.name}</AppText>

                            {/* Description */}
                            <AppText style={styles.description}>{badge.description}</AppText>

                            {/* Mint address */}
                            <View style={styles.addressContainer}>
                                <AppText style={styles.addressLabel}>MINT ADDRESS</AppText>
                                <AppText style={styles.address}>
                                    {mintAddress.slice(0, 8)}...{mintAddress.slice(-8)}
                                </AppText>
                            </View>

                            {/* Action buttons */}
                            <View style={styles.buttons}>
                                <TouchableOpacity
                                    onPress={handleViewNFT}
                                    style={styles.linkButton}
                                    activeOpacity={0.7}
                                >
                                    <UiIconSymbol name="photo" size={14} color={Colors.primary.default} />
                                    <AppText style={styles.linkButtonText}>VIEW NFT</AppText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleViewOnExplorer}
                                    style={styles.linkButton}
                                    activeOpacity={0.7}
                                >
                                    <UiIconSymbol name="arrow.up.right.square" size={14} color={Colors.primary.default} />
                                    <AppText style={styles.linkButtonText}>EXPLORER</AppText>
                                </TouchableOpacity>
                            </View>

                            {/* Done button */}
                            <TouchableOpacity onPress={onClose} style={styles.doneButton} activeOpacity={0.85}>
                                <AppText style={styles.doneButtonText}>CONTINUE</AppText>
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
        maxWidth: 340,
    },
    card: {
        backgroundColor: Colors.surface.default,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.border.default,
        overflow: 'hidden',
        ...Shadows.xl,
    },
    accentLine: {
        height: 4,
        backgroundColor: Colors.semantic.success,
    },
    content: {
        padding: Spacing['2xl'],
        alignItems: 'center',
    },
    successIcon: {
        marginBottom: Spacing.md,
    },
    successBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.lg,
    },
    successText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        color: Colors.semantic.success,
    },
    dayIndicator: {
        fontSize: 12,
        letterSpacing: 3,
        color: Colors.text.tertiary,
        marginBottom: Spacing.xs,
    },
    badgeName: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: Colors.text.secondary,
        marginBottom: Spacing.xl,
    },
    addressContainer: {
        width: '100%',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        backgroundColor: Colors.background.secondary,
        borderRadius: BorderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    addressLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        color: Colors.text.tertiary,
    },
    address: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: Colors.text.secondary,
    },
    buttons: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
        width: '100%',
    },
    linkButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border.default,
        backgroundColor: Colors.background.secondary,
    },
    linkButtonText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1,
        color: Colors.primary.default,
    },
    doneButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.primary.default,
    },
    doneButtonText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: Colors.text.inverse,
    },
})
