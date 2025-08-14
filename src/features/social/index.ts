// src/features/social/index.ts

// Componentes
export { PostCard, NotificationItem } from './components'

// Hooks
export { useSocial } from './hooks/useSocial'

// Serviços
export { socialService } from './services/socialService'

// Tipos
export type {
  Post,
  Notification,
  Activity,
  SocialStats,
  Comment,
  UserProfile
} from './types/social.types'