export interface User {
  id: string
  address: string
  name: string
  email?: string
  bio?: string
  avatar?: string
  phone?: string
  location?: string
  createdAt: Date
  updatedAt: Date
  
  // Tokenização
  isTokenized: boolean
  tokenId?: string
  marketValue?: number
  
  // Reputação e social
  reputation: number
  followersCount: number
  followingCount: number
  postsCount: number
  
  // Configurações
  settings: UserSettings
}

export interface UserSettings {
  language: 'pt' | 'en' | 'es'
  theme: 'light' | 'dark' | 'auto'
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  social: boolean
  marketplace: boolean
  dao: boolean
  wallet: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private'
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  allowMessages: boolean
}
