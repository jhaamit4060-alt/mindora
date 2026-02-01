export interface User {
  _id: string
  email: string
  password: string
  name: string
  createdAt: Date
  onboardingComplete: boolean
  profileCompleted?: boolean // Track if mandatory profile fields are filled
  isSuperAdmin?: boolean
  isAdmin?: boolean
  isDisabled?: boolean // Add flag for disabling user
  profile?: {
    phone: string // Now required for profile completion
    dateOfBirth: string // Now required for profile completion
    gender: string // Now required for profile completion
    address?: string
    emergencyContact?: {
      name: string
      relation: string
      phone: string
    }
    medicalHistory: string // Now required for profile completion
    therapistName?: string
    therapistContact?: string
  }
  preferences?: {
    notifications?: boolean
    theme?: "light" | "dark"
  }
}

export interface MoodEntry {
  _id: string
  userId: string
  date: Date
  mood: 1 | 2 | 3 | 4 | 5
  note?: string
  triggers?: string[]
  createdAt: Date
}

export interface JournalEntry {
  _id: string
  userId: string
  date: Date
  content: string
  mood?: 1 | 2 | 3 | 4 | 5
  createdAt: Date
  updatedAt: Date
}

export interface Exercise {
  id: string
  title: string
  description: string
  duration: number // in seconds
  type: "breathing" | "mindfulness" | "grounding"
  instructions: string[]
}

export interface ExerciseSession {
  _id: string
  userId: string
  exerciseId: string
  completedAt: Date
  duration: number
}

export interface LearningArticle {
  id: string
  title: string
  description: string
  content: string
  category: "stress" | "anxiety" | "sleep" | "mindfulness" | "productivity"
  readTime: number // in minutes
  tags: string[]
}

export interface AuditLog {
  _id: string
  performedBy: string // User ID who performed the action
  performedByName: string // Name of user who performed action
  action: "role_change" | "password_change" | "user_disable" | "user_enable" | "admin_create"
  targetUserId: string
  targetUserEmail: string
  reason: string
  details?: Record<string, any>
  timestamp: Date
}

export interface PasswordResetToken {
  _id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  used: boolean
}
