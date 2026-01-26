import React, { useState } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'
import { HabitCategory, HABIT_CATEGORIES, TOTAL_DAYS } from './types'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

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
      <View style={styles.header}>
        <LinearGradient
          colors={[Colors.brand.gradientStart, Colors.brand.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <AppText style={styles.icon}>🎯</AppText>
        </LinearGradient>
        <AppText style={styles.title}>Start Your Journey</AppText>
        <AppText style={styles.subtitle}>
          Commit to a habit for {TOTAL_DAYS} days. Each check-in is recorded on-chain as proof of
          your dedication.
        </AppText>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <AppText style={styles.label}>What habit will you build?</AppText>
          <TextInput
            style={styles.input}
            placeholder="e.g., Morning workout, Read 30 min..."
            placeholderTextColor={Colors.dark.textSecondary}
            value={habitName}
            onChangeText={setHabitName}
            maxLength={50}
          />
        </View>

        <View style={styles.inputGroup}>
          <AppText style={styles.label}>Category</AppText>
          <View style={styles.categoryGrid}>
            {HABIT_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.value && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory(category.value)}
              >
                <UiIconSymbol
                  name={category.icon as any}
                  size={24}
                  color={
                    selectedCategory === category.value
                      ? Colors.dark.text
                      : Colors.dark.textSecondary
                  }
                />
                <AppText
                  style={[
                    styles.categoryLabel,
                    selectedCategory === category.value && styles.categoryLabelSelected,
                  ]}
                >
                  {category.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? <AppText style={styles.error}>{error}</AppText> : null}

        <View style={styles.infoBox}>
          <AppText style={styles.infoTitle}>Fee Structure</AppText>
          <AppText style={styles.infoText}>Day 1: 0.01 SOL → Day 12: 0.12 SOL</AppText>
          <AppText style={styles.infoSubtext}>
            Increasing commitment helps you stay accountable
          </AppText>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
          style={styles.submitWrapper}
        >
          <LinearGradient
            colors={[Colors.brand.gradientStart, Colors.brand.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <AppText style={styles.submitText}>
              {isLoading ? 'Creating...' : 'Start Today'}
            </AppText>
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
    padding: 16,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  input: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    width: '30%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categorySelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  categoryLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  categoryLabelSelected: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  error: {
    color: Colors.brand.error,
    fontSize: 14,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  infoText: {
    fontSize: 16,
    color: Colors.brand.primary,
    fontWeight: '600',
  },
  infoSubtext: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  submitWrapper: {
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
  },
})
