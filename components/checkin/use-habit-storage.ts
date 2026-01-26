import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { CheckInDay, Habit, HabitCategory, TOTAL_DAYS } from './types'

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
    [saveHabit],
  )

  const recordCheckIn = useCallback(
    async (dayNumber: number, transactionSignature: string, feePaid: number, mintAddress?: string) => {
      if (!habit) throw new Error('No active habit')

      const updatedCheckIns = habit.checkIns.map((checkIn) =>
        checkIn.dayNumber === dayNumber
          ? { ...checkIn, completed: true, transactionSignature, feePaid, mintAddress }
          : checkIn,
      )

      const updatedHabit = { ...habit, checkIns: updatedCheckIns }
      await saveHabit(updatedHabit)
      return updatedHabit
    },
    [habit, saveHabit],
  )

  const advanceToNextDay = useCallback(async () => {
    if (!habit) return

    // Find the last completed day
    const lastCompletedIdx = habit.checkIns.reduce((maxIdx, checkIn, idx) => {
      return checkIn.completed ? idx : maxIdx
    }, -1)

    // If no days completed or all days completed, nothing to advance
    if (lastCompletedIdx === -1 || lastCompletedIdx >= TOTAL_DAYS - 1) return

    // Shift all remaining day dates so the next day becomes "today"
    const today = getDateString()
    const updatedCheckIns = habit.checkIns.map((checkIn, idx) => {
      if (idx <= lastCompletedIdx) {
        // Keep completed days as-is
        return checkIn
      }
      // Shift future days: next uncompleted day becomes today, rest follow
      const daysFromNextDay = idx - (lastCompletedIdx + 1)
      const newDate = new Date()
      newDate.setDate(newDate.getDate() + daysFromNextDay)
      return { ...checkIn, date: getDateString(newDate) }
    })

    const updatedHabit = { ...habit, checkIns: updatedCheckIns }
    await saveHabit(updatedHabit)
    return updatedHabit
  }, [habit, saveHabit])

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
    // Prioritize uncompleted days for today (the active day to check-in)
    const uncompleted = habit.checkIns.find(
      (checkIn) => checkIn.date === today && !checkIn.completed
    )
    if (uncompleted) return uncompleted
    // If all today's days are complete, return the last completed one for today
    const todayCompletedDays = habit.checkIns.filter(
      (checkIn) => checkIn.date === today && checkIn.completed
    )
    return todayCompletedDays.length > 0
      ? todayCompletedDays[todayCompletedDays.length - 1]
      : null
  }, [habit])

  const getCurrentDayNumber = useCallback((): number => {
    if (!habit) return 0
    const today = getDateString()
    // Prioritize uncompleted days for today (the active day to check-in)
    const uncompleted = habit.checkIns.find(
      (c) => c.date === today && !c.completed
    )
    if (uncompleted) return uncompleted.dayNumber
    // If all today's days are complete, return the last completed one's day number
    const todayDays = habit.checkIns.filter((c) => c.date === today)
    return todayDays.length > 0 ? todayDays[todayDays.length - 1].dayNumber : 0
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
    advanceToNextDay,
    deleteHabit,
    getTodayCheckIn,
    getCurrentDayNumber,
    getProgress,
    isJourneyComplete,
    refresh: loadHabit,
  }
}
