import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { Habit, CheckInDay, HabitCategory, TOTAL_DAYS } from './types'

const HABIT_STORAGE_KEY = 'daily-checkin-habit'

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0]
}

const initializeCheckIns = (startDate: string): CheckInDay[] => {
  const checkIns: CheckInDay[] = []
  const start = new Date(startDate)

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    checkIns.push({
      dayNumber: i + 1,
      date: getDateString(date),
      completed: false,
    })
  }

  return checkIns
}

export function useHabitStorage() {
  const [habit, setHabit] = useState<Habit | null>(null)
  const [loading, setLoading] = useState(true)

  const loadHabit = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(HABIT_STORAGE_KEY)
      if (stored) {
        setHabit(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load habit:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHabit()
  }, [loadHabit])

  const saveHabit = useCallback(async (habitData: Habit) => {
    try {
      await AsyncStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(habitData))
      setHabit(habitData)
    } catch (error) {
      console.error('Failed to save habit:', error)
      throw error
    }
  }, [])

  const createHabit = useCallback(
    async (name: string, category: HabitCategory) => {
      const startDate = getDateString()
      const newHabit: Habit = {
        id: generateId(),
        name,
        category,
        startDate,
        checkIns: initializeCheckIns(startDate),
        createdAt: new Date().toISOString(),
      }
      await saveHabit(newHabit)
      return newHabit
    },
    [saveHabit]
  )

  const recordCheckIn = useCallback(
    async (dayNumber: number, transactionSignature: string, feePaid: number) => {
      if (!habit) throw new Error('No active habit')

      const updatedCheckIns = habit.checkIns.map((checkIn) =>
        checkIn.dayNumber === dayNumber
          ? { ...checkIn, completed: true, transactionSignature, feePaid }
          : checkIn
      )

      const updatedHabit = { ...habit, checkIns: updatedCheckIns }
      await saveHabit(updatedHabit)
      return updatedHabit
    },
    [habit, saveHabit]
  )

  const deleteHabit = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HABIT_STORAGE_KEY)
      setHabit(null)
    } catch (error) {
      console.error('Failed to delete habit:', error)
      throw error
    }
  }, [])

  const getTodayCheckIn = useCallback((): CheckInDay | null => {
    if (!habit) return null
    const today = getDateString()
    return habit.checkIns.find((checkIn) => checkIn.date === today) || null
  }, [habit])

  const getCurrentDayNumber = useCallback((): number => {
    if (!habit) return 0
    const today = getDateString()
    const checkIn = habit.checkIns.find((c) => c.date === today)
    return checkIn?.dayNumber || 0
  }, [habit])

  const getProgress = useCallback(() => {
    if (!habit) return { completed: 0, total: TOTAL_DAYS, percentage: 0 }
    const completed = habit.checkIns.filter((c) => c.completed).length
    return {
      completed,
      total: TOTAL_DAYS,
      percentage: Math.round((completed / TOTAL_DAYS) * 100),
    }
  }, [habit])

  const isJourneyComplete = useCallback(() => {
    if (!habit) return false
    const lastDay = habit.checkIns[TOTAL_DAYS - 1]
    const today = getDateString()
    return lastDay.date <= today
  }, [habit])

  return {
    habit,
    loading,
    createHabit,
    recordCheckIn,
    deleteHabit,
    getTodayCheckIn,
    getCurrentDayNumber,
    getProgress,
    isJourneyComplete,
    refresh: loadHabit,
  }
}
