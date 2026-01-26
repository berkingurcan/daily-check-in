import { AppText } from '@/components/app-text'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { HABIT_CATEGORIES, HabitCategory, TOTAL_DAYS } from './types'

interface HabitSetupProps {
  onCreateHabit: (name: string, category: HabitCategory) => Promise<void>
  isLoading: boolean
}

export function CheckInHabitSetup({ onCreateHabit, isLoading }: HabitSetupProps) {
  const [habitName, setHabitName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!habitName.trim()) {
      setError('Please enter a habit name')
      return
    }
    if (!selectedCategory) {
      setError('Please select a category')
      return
    }
    setError('')
    await onCreateHabit(habitName.trim(), selectedCategory)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={Colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <UiIconSymbol name="target" size={36} color={Colors.text.inverse} />
        </LinearGradient>
        <AppText variant="h2" style={styles.title}>
          Start Your Journey
        </AppText>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Commit to a habit for {TOTAL_DAYS} days. Each check-in is recorded on-chain as proof of your dedication.
        </AppText>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Habit Name Input */}
        <View style={styles.inputGroup}>
          <AppText variant="label">What habit will you build?</AppText>
          <TextInput
            style={styles.input}
            placeholder="e.g., Morning workout, Read 30 min..."
            placeholderTextColor={Colors.text.tertiary}
            value={habitName}
            onChangeText={setHabitName}
            maxLength={50}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <AppText variant="label">Category</AppText>
          <View style={styles.categoryGrid}>
            {HABIT_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.value
              return (
                <TouchableOpacity
                  key={category.value}
                  style={[styles.categoryButton, isSelected && styles.categorySelected]}
                  onPress={() => setSelectedCategory(category.value)}
                  activeOpacity={0.7}
                >
                  <UiIconSymbol
                    name={category.icon as any}
                    size={22}
                    color={isSelected ? Colors.primary.default : Colors.text.tertiary}
                  />
                  <AppText variant="caption" style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                    {category.label}
                  </AppText>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Error message */}
        {error ? (
          <View style={styles.errorContainer}>
            <UiIconSymbol name="exclamationmark.circle.fill" size={16} color={Colors.semantic.error} />
            <AppText variant="bodySm" style={styles.errorText}>
              {error}
            </AppText>
          </View>
        ) : null}

        {/* App Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <UiIconSymbol name="info.circle.fill" size={18} color={Colors.primary.default} />
            <AppText variant="label">How it works</AppText>
          </View>
          <AppText variant="bodySm" color="secondary" style={styles.infoSubtext}>
            Daily Check-in helps you build consistency. Your habits are stored on-chain, creating permanent proof of your dedication.
          </AppText>
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} disabled={isLoading} activeOpacity={0.85} style={styles.submitWrapper}>
          <LinearGradient
            colors={Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          >
            {isLoading ? (
              <AppText variant="buttonLg" style={styles.submitText}>
                Creating...
              </AppText>
            ) : (
              <>
                <UiIconSymbol name="play.fill" size={18} color={Colors.text.inverse} />
                <AppText variant="buttonLg" style={styles.submitText}>
                  Start Today
                </AppText>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glowPrimary,
  },
  title: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  form: {
    gap: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    width: '31%',
    borderWidth: 2,
    borderColor: Colors.border.subtle,
  },
  categorySelected: {
    borderColor: Colors.primary.default,
    backgroundColor: Colors.primary.muted,
  },
  categoryLabel: {
    color: Colors.text.tertiary,
  },
  categoryLabelSelected: {
    color: Colors.primary.default,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.semantic.errorMuted,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  errorText: {
    color: Colors.semantic.error,
  },
  infoBox: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  infoSubtext: {
    textAlign: 'center',
  },
  submitWrapper: {
    marginTop: Spacing.sm,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.glowPrimary,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: Colors.text.inverse,
  },
})
