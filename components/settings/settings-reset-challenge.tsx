import { AppText } from '@/components/app-text'
import { useHabitStorage } from '@/components/checkin/use-habit-storage'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { BorderRadius, Colors, Spacing } from '@/constants/theme'
import { useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'

export function SettingsResetChallenge() {
    const { habit, deleteHabit } = useHabitStorage()
    const [isResetting, setIsResetting] = useState(false)

    const handleReset = () => {
        Alert.alert(
            'Reset Challenge',
            'Are you sure you want to reset your challenge? This will delete all your progress and you will need to start over.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        setIsResetting(true)
                        try {
                            await deleteHabit()
                        } catch (error) {
                            console.error('Failed to reset challenge:', error)
                        } finally {
                            setIsResetting(false)
                        }
                    },
                },
            ]
        )
    }

    if (!habit) {
        return null
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <UiIconSymbol name="arrow.counterclockwise" size={20} color={Colors.semantic.error} />
                <AppText variant="h4">Reset Challenge</AppText>
            </View>

            <View style={styles.content}>
                <AppText variant="bodySm" color="secondary" style={styles.description}>
                    Reset your current challenge to start fresh. This will delete all your progress and check-in history.
                </AppText>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleReset}
                    disabled={isResetting}
                    activeOpacity={0.7}
                >
                    <UiIconSymbol name="trash.fill" size={16} color={Colors.text.inverse} />
                    <AppText variant="button" style={styles.resetButtonText}>
                        {isResetting ? 'Resetting...' : 'Reset Challenge'}
                    </AppText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    content: {
        backgroundColor: Colors.surface.default,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        gap: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border.subtle,
    },
    description: {
        lineHeight: 20,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.semantic.error,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
    },
    resetButtonText: {
        color: Colors.text.inverse,
    },
})
