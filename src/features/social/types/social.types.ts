// src/features/social/types/social.types.ts

export interface Post {
  id: string
  authorId: string
  authorName: string
  avatarUrl?: string
  content: string
  media?: { type: 'image' | 'video'; url: string } | null
  createdAt: string // ISO
  stats: { likes: number; comments: number; shares: number }
  isLiked?: boolean
  isShared?: boolean
}

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'share'
  postId?: string
  fromUser: { id: string; name: string; avatarUrl?: string }
  createdAt: string
  read: boolean
  message: string
}

export interface Activity {
  id: string
  kind: 'transfer' | 'purchase' | 'sale' | 'vote' | 'marketplace' | 'profile' | 'other'
  title: string
  description?: string
  createdAt: string
  txHash?: string
  amount?: string
  token?: string
  icon?: string
}

export interface SocialStats {
  posts: number
  followers: number
  following: number
  likes: number
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  avatarUrl?: string
  content: string
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  username?: string
  avatarUrl?: string
  bio?: string
  isFollowing?: boolean
  isFollowed?: boolean
  stats: SocialStats
}