// src/features/social/hooks/useSocial.ts

import { useState, useEffect, useCallback } from 'react'
import { Post, Notification, Activity, Comment } from '../types/social.types'

// Mock data para desenvolvimento
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'João Silva',
    avatarUrl: '/icons/avatar-default.svg',
    content: 'Acabei de criar meu primeiro NFT no Bazari! 🎨 Que experiência incrível tokenizar minha arte digital. #BazariNFT #Web3',
    media: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    stats: { likes: 15, comments: 3, shares: 2 },
    isLiked: false
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'Maria Santos',
    avatarUrl: '/icons/avatar-default.svg',
    content: 'Minha loja virtual no marketplace já está gerando ótimas vendas! 🛍️ Quem disse que Web3 é complicado?',
    media: { type: 'image', url: '/icons/placeholder-image.jpg' },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    stats: { likes: 24, comments: 7, shares: 5 },
    isLiked: true
  },
  {
    id: '3',
    authorId: 'user3',
    authorName: 'Carlos Oliveira',
    avatarUrl: '/icons/avatar-default.svg',
    content: 'Participei da minha primeira votação na DAO do Bazari! 🗳️ É incrível como cada voz importa na construção do futuro descentralizado.',
    media: null,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    stats: { likes: 8, comments: 1, shares: 1 },
    isLiked: false
  }
]

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    postId: '1',
    fromUser: { id: 'user2', name: 'Maria Santos', avatarUrl: '/icons/avatar-default.svg' },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    message: 'curtiu sua publicação'
  },
  {
    id: '2',
    type: 'comment',
    postId: '2',
    fromUser: { id: 'user3', name: 'Carlos Oliveira', avatarUrl: '/icons/avatar-default.svg' },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
    message: 'comentou em sua publicação'
  },
  {
    id: '3',
    type: 'follow',
    fromUser: { id: 'user4', name: 'Ana Costa', avatarUrl: '/icons/avatar-default.svg' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    message: 'começou a seguir você'
  }
]

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    kind: 'transfer',
    title: 'Transferência BZR',
    description: 'Enviou 150 BZR para João Silva',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    txHash: '0x1a2b3c4d5e6f...',
    amount: '150',
    token: 'BZR',
    icon: '💸'
  },
  {
    id: '2',
    kind: 'marketplace',
    title: 'Compra no Marketplace',
    description: 'Adquiriu produto "Camiseta Bazari" por 25 BZR',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    amount: '25',
    token: 'BZR',
    icon: '🛒'
  },
  {
    id: '3',
    kind: 'vote',
    title: 'Votação DAO',
    description: 'Votou "SIM" na proposta #15: Expansão para novos mercados',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icon: '🗳️'
  },
  {
    id: '4',
    kind: 'profile',
    title: 'Perfil Tokenizado',
    description: 'Criou NFT do perfil com sucesso',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    icon: '🎨'
  }
]

export const useSocial = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar dados do localStorage ou usar mocks
  useEffect(() => {
    const savedPosts = localStorage.getItem('bazari_social_posts')
    const savedNotifications = localStorage.getItem('bazari_social_notifications')
    const savedActivities = localStorage.getItem('bazari_social_activities')

    setPosts(savedPosts ? JSON.parse(savedPosts) : MOCK_POSTS)
    setNotifications(savedNotifications ? JSON.parse(savedNotifications) : MOCK_NOTIFICATIONS)
    setActivities(savedActivities ? JSON.parse(savedActivities) : MOCK_ACTIVITIES)
  }, [])

  // Salvar posts no localStorage
  const savePosts = useCallback((newPosts: Post[]) => {
    setPosts(newPosts)
    localStorage.setItem('bazari_social_posts', JSON.stringify(newPosts))
  }, [])

  // Salvar notificações no localStorage
  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    setNotifications(newNotifications)
    localStorage.setItem('bazari_social_notifications', JSON.stringify(newNotifications))
  }, [])

  // Criar nova postagem
  const createPost = useCallback((content: string, media?: { type: 'image' | 'video'; url: string }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: 'current_user',
      authorName: 'Você',
      avatarUrl: '/icons/avatar-default.svg',
      content,
      media: media || null,
      createdAt: new Date().toISOString(),
      stats: { likes: 0, comments: 0, shares: 0 },
      isLiked: false
    }

    const updatedPosts = [newPost, ...posts]
    savePosts(updatedPosts)
    return newPost
  }, [posts, savePosts])

  // Curtir/descurtir post
  const toggleLike = useCallback((postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const wasLiked = post.isLiked
        return {
          ...post,
          isLiked: !wasLiked,
          stats: {
            ...post.stats,
            likes: wasLiked ? post.stats.likes - 1 : post.stats.likes + 1
          }
        }
      }
      return post
    })
    savePosts(updatedPosts)
  }, [posts, savePosts])

  // Compartilhar post
  const sharePost = useCallback((postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          stats: {
            ...post.stats,
            shares: post.stats.shares + 1
          }
        }
      }
      return post
    })
    savePosts(updatedPosts)
  }, [posts, savePosts])

  // Comentar post
  const commentPost = useCallback((postId: string, comment: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          stats: {
            ...post.stats,
            comments: post.stats.comments + 1
          }
        }
      }
      return post
    })
    savePosts(updatedPosts)
  }, [posts, savePosts])

  // Marcar notificação como lida
  const markNotificationAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    )
    saveNotifications(updatedNotifications)
  }, [notifications, saveNotifications])

  // Marcar todas notificações como lidas
  const markAllNotificationsAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }))
    saveNotifications(updatedNotifications)
  }, [notifications, saveNotifications])

  // Contar notificações não lidas
  const unreadNotificationsCount = notifications.filter(n => !n.read).length

  return {
    // Data
    posts,
    notifications,
    activities,
    loading,
    unreadNotificationsCount,
    
    // Actions
    createPost,
    toggleLike,
    sharePost,
    commentPost,
    markNotificationAsRead,
    markAllNotificationsAsRead
  }
}