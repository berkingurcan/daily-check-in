export interface CheckInDay {
  dayNumber: number
  date: string
  completed: boolean
  transactionSignature?: string
  feePaid?: number
}

export interface Habit {
  id: string
  name: string
  category: HabitCategory
  startDate: string
  checkIns: CheckInDay[]
  createdAt: string
}

export type HabitCategory = 'study' | 'workout' | 'running' | 'social' | 'health' | 'creative' | 'other'

export const HABIT_CATEGORIES: { value: HabitCategory; label: string; icon: string }[] = [
  { value: 'study', label: 'Study', icon: 'book.fill' },
  { value: 'workout', label: 'Workout', icon: 'dumbbell.fill' },
  { value: 'running', label: 'Running', icon: 'figure.run' },
  { value: 'social', label: 'Social', icon: 'person.2.fill' },
  { value: 'health', label: 'Health', icon: 'heart.fill' },
  { value: 'creative', label: 'Creative', icon: 'paintbrush.fill' },
  { value: 'other', label: 'Other', icon: 'star.fill' },
]

export const TOTAL_DAYS = 12
