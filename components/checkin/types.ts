export interface CheckInDay {
  dayNumber: number
  date: string
  completed: boolean
  transactionSignature?: string
  feePaid?: number
  mintAddress?: string // NFT mint address
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

/**
 * Badge/NFT information for a specific day
 */
export interface DailyBadge {
  name: string
  description: string
  image: string
}

/**
 * Minted NFT badge record
 */
export interface MintedBadge {
  day: number
  mintAddress: string
  transactionSignature: string
  mintedAt: string
  metadata: BadgeMetadata
}

/**
 * NFT badge metadata (Metaplex standard)
 */
export interface BadgeMetadata {
  name: string
  symbol: string
  description: string
  image: string
  external_url?: string
  attributes: BadgeAttribute[]
  properties: {
    files: { uri: string; type: string }[]
    category: string
    creators: { address: string; share: number }[]
  }
  seller_fee_basis_points?: number
}

/**
 * Badge attribute for NFT metadata
 */
export interface BadgeAttribute {
  trait_type: string
  value: string | number
}

/**
 * Get badge info for a specific day
 */
export function getDayBadge(dayNumber: number, habitName: string): DailyBadge {
  return {
    name: `Day ${dayNumber}: ${habitName}`,
    description: `Completed day ${dayNumber} of the 12-day ${habitName} challenge`,
    image: `badge_day${dayNumber}`,
  }
}

