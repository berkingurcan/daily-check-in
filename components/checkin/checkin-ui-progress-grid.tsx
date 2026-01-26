import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import { Colors } from '@/constants/colors'
import { CheckInDay, TOTAL_DAYS } from './types'

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.checkIn.completed
      case 'missed':
        return Colors.checkIn.missed
      case 'today':
        return Colors.checkIn.today
      default:
        return Colors.checkIn.pending
    }
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Your 12-Day Journey</AppText>
      <View style={styles.grid}>
        {checkIns.map((checkIn) => {
          const status = getDayStatus(checkIn)
          const isToday = status === 'today'

          return (
            <View
              key={checkIn.dayNumber}
              style={[
                styles.dayCircle,
                { backgroundColor: getStatusColor(status) },
                isToday && styles.todayGlow,
              ]}
            >
              <AppText style={styles.dayNumber}>{checkIn.dayNumber}</AppText>
              {checkIn.completed && <AppText style={styles.checkmark}>✓</AppText>}
            </View>
          )
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.checkIn.completed }]} />
          <AppText style={styles.legendText}>Completed</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.checkIn.today }]} />
          <AppText style={styles.legendText}>Today</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.checkIn.missed }]} />
          <AppText style={styles.legendText}>Missed</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.checkIn.pending }]} />
          <AppText style={styles.legendText}>Upcoming</AppText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 16,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  dayCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayGlow: {
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  checkmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 12,
    color: Colors.dark.text,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
})
