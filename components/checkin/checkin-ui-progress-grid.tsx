import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors, Spacing, BorderRadius, Shadows, Components } from '@/constants/theme'
import { CheckInDay } from './types'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

interface ProgressGridProps {
  checkIns: CheckInDay[]
  currentDayNumber: number
}

export function CheckInProgressGrid({ checkIns, currentDayNumber }: ProgressGridProps) {
  const getDateString = (): string => {
    return new Date().toISOString().split('T')[0]
  }

  const today = getDateString()

  const getDayStatus = (checkIn: CheckInDay) => {
    if (checkIn.completed) return 'completed'
    if (checkIn.date === today) return 'today'
    if (checkIn.date < today) return 'missed'
    return 'pending'
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          backgroundColor: Colors.checkIn.completed,
          shadow: Shadows.glowSuccess,
        }
      case 'missed':
        return {
          backgroundColor: Colors.checkIn.missed,
          shadow: {},
        }
      case 'today':
        return {
          backgroundColor: Colors.checkIn.today,
          shadow: Shadows.glowPrimary,
        }
      default:
        return {
          backgroundColor: Colors.checkIn.pending,
          shadow: {},
        }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h4">Your Journey</AppText>
        <AppText variant="caption" color="secondary">
          12 Days
        </AppText>
      </View>

      <View style={styles.grid}>
        {checkIns.map((checkIn) => {
          const status = getDayStatus(checkIn)
          const isToday = status === 'today'
          const statusStyles = getStatusStyles(status)

          return (
            <View
              key={checkIn.dayNumber}
              style={[
                styles.dayCircle,
                { backgroundColor: statusStyles.backgroundColor },
                isToday && styles.todayCircle,
                status === 'completed' && styles.completedCircle,
              ]}
            >
              {checkIn.completed ? (
                <UiIconSymbol name="checkmark" size={18} color={Colors.text.inverse} />
              ) : (
                <AppText variant="labelSm" style={[styles.dayNumber, status === 'pending' && styles.pendingDayNumber]}>
                  {checkIn.dayNumber}
                </AppText>
              )}
              {isToday && <View style={styles.todayIndicator} />}
            </View>
          )
        })}
      </View>

      <View style={styles.legend}>
        <LegendItem color={Colors.checkIn.completed} label="Completed" />
        <LegendItem color={Colors.checkIn.today} label="Today" />
        <LegendItem color={Colors.checkIn.missed} label="Missed" />
        <LegendItem color={Colors.checkIn.pending} label="Upcoming" />
      </View>
    </View>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>
    </View>
  )
}

const CIRCLE_SIZE = Components.progressCircle.size

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  dayCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  todayCircle: {
    shadowColor: Colors.primary.default,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  completedCircle: {
    shadowColor: Colors.checkIn.completed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  dayNumber: {
    color: Colors.text.primary,
  },
  pendingDayNumber: {
    color: Colors.text.tertiary,
  },
  todayIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.text.primary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})
