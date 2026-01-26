import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export function AppDropdown({
  items,
  selectedItem,
  selectItem,
}: {
  items: readonly string[]
  selectedItem: string
  selectItem: (item: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trigger} onPress={() => setIsOpen(!isOpen)} activeOpacity={0.7}>
        <AppText variant="label">{selectedItem}</AppText>
        <UiIconSymbol name={isOpen ? 'chevron.up' : 'chevron.down'} size={14} color={Colors.text.secondary} />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {items.map((option, index) => {
            const isSelected = option === selectedItem
            const isLast = index === items.length - 1

            return (
              <TouchableOpacity
                key={index}
                style={[styles.option, isSelected && styles.optionSelected, !isLast && styles.optionBorder]}
                onPress={() => {
                  selectItem(option)
                  setIsOpen(false)
                }}
                activeOpacity={0.7}
              >
                <AppText variant="body" style={isSelected ? styles.optionTextSelected : undefined}>
                  {option}
                </AppText>
                {isSelected && <UiIconSymbol name="checkmark" size={16} color={Colors.primary.default} />}
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 100,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: Spacing.xs,
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    minWidth: 150,
    ...Shadows.lg,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  optionSelected: {
    backgroundColor: Colors.primary.muted,
  },
  optionTextSelected: {
    color: Colors.primary.default,
  },
})
