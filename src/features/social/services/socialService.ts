// src/features/social/services/socialService.ts

import { Post, Notification, Activity, Comment, UserProfile } from '../types/social.types'

class SocialService {
  private readonly STORAGE_KEYS = {
    POSTS: 'bazari_social_posts',
    NOTIFICATIONS: 'bazari_social_notifications', 
    ACTIVITIES: 'bazari_social_activities',
    COMMENTS: 'bazari_social_comments',
    PROFILES: 'bazari_social_profiles'
  }

  // Posts management
  async getPosts(): Promise<Post[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.POSTS)
    return stored ? JSON.parse(stored) : []
  }

  async savePosts(posts: Post[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEYS.POSTS, JSON.stringify(posts))
  }

  async createPost(content: string, authorId: string, authorName: string, media?: { type: 'image' | 'video'; url: string }): Promise<Post> {
    const newPost: Post = {
      id: Date.now().toString(),
      authorId,
      authorName,
      avatarUrl: '/icons/avatar-default.svg',
      content,
      media: media || null,
      createdAt: new Date().toISOString(),
      stats: { likes: 0, comments: 0, shares: 0 },
      isLiked: false
    }

    const posts = await this.getPosts()
    const updatedPosts = [newPost, ...posts]
    await this.savePosts(updatedPosts)
    
    return newPost
  }

  async deletePost(postId: string): Promise<void> {
    const posts = await this.getPosts()
    const updatedPosts = posts.filter(p => p.id !== postId)
    await this.savePosts(updatedPosts)
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const posts = await this.getPosts()
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
    await this.savePosts(updatedPosts)

    // Criar notificação se curtiu (não se descurtiu)
    const post = posts.find(p => p.id === postId)
    if (post && !post.isLiked && post.authorId !== userId) {
      await this.createNotification({
        type: 'like',
        postId,
        fromUserId: userId,
        toUserId: post.authorId
      })
    }
  }

  async sharePost(postId: string, userId: string): Promise<void> {
    const posts = await this.getPosts()
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
    await this.savePosts(updatedPosts)

    // Criar notificação de compartilhamento
    const post = posts.find(p => p.id === postId)
    if (post && post.authorId !== userId) {
      await this.createNotification({
        type: 'share',
        postId,
        fromUserId: userId,
        toUserId: post.authorId
      })
    }
  }

  // Comments management
  async getComments(postId: string): Promise<Comment[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.COMMENTS)
    const allComments: Comment[] = stored ? JSON.parse(stored) : []
    return allComments.filter(c => c.postId === postId)
  }

  async addComment(postId: string, content: string, authorId: string, authorName: string): Promise<Comment> {
    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      authorId,
      authorName,
      avatarUrl: '/icons/avatar-default.svg',
      content,
      createdAt: new Date().toISOString()
    }

    const stored = localStorage.getItem(this.STORAGE_KEYS.COMMENTS)
    const comments: Comment[] = stored ? JSON.parse(stored) : []
    const updatedComments = [...comments, comment]
    localStorage.setItem(this.STORAGE_KEYS.COMMENTS, JSON.stringify(updatedComments))

    // Atualizar contador de comentários no post
    const posts = await this.getPosts()
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, stats: { ...post.stats, comments: post.stats.comments + 1 }}
        : post
    )
    await this.savePosts(updatedPosts)

    // Criar notificação
    const post = posts.find(p => p.id === postId)
    if (post && post.authorId !== authorId) {
      await this.createNotification({
        type: 'comment',
        postId,
        fromUserId: authorId,
        toUserId: post.authorId
      })
    }

    return comment
  }

  // Notifications management
  async getNotifications(userId: string): Promise<Notification[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS)
    const allNotifications: Notification[] = stored ? JSON.parse(stored) : []
    // Em uma implementação real, filtraria por userId
    return allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async createNotification({ type, postId, fromUserId, toUserId }: {
    type: 'like' | 'comment' | 'follow' | 'share'
    postId?: string
    fromUserId: string
    toUserId: string
  }): Promise<Notification> {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      postId,
      fromUser: {
        id: fromUserId,
        name: 'Usuário', // Em implementação real, buscar nome real
        avatarUrl: '/icons/avatar-default.svg'
      },
      createdAt: new Date().toISOString(),
      read: false,
      message: this.getNotificationMessage(type)
    }

    const stored = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS)
    const notifications: Notification[] = stored ? JSON.parse(stored) : []
    const updatedNotifications = [notification, ...notifications]
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications))

    return notification
  }

  private getNotificationMessage(type: string): string {
    const messages = {
      like: 'curtiu sua publicação',
      comment: 'comentou em sua publicação',
      follow: 'começou a seguir você',
      share: 'compartilhou sua publicação'
    }
    return messages[type as keyof typeof messages] || 'interagiu com você'
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS)
    const notifications: Notification[] = stored ? JSON.parse(stored) : []
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications))
  }

  async markAllNotificationsAsRead(): Promise<void> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS)
    const notifications: Notification[] = stored ? JSON.parse(stored) : []
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications))
  }

  // Activities management
  async getActivities(userId?: string): Promise<Activity[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.ACTIVITIES)
    const activities: Activity[] = stored ? JSON.parse(stored) : []
    return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async addActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    const stored = localStorage.getItem(this.STORAGE_KEYS.ACTIVITIES)
    const activities: Activity[] = stored ? JSON.parse(stored) : []
    const updatedActivities = [newActivity, ...activities]
    localStorage.setItem(this.STORAGE_KEYS.ACTIVITIES, JSON.stringify(updatedActivities))

    return newActivity
  }

  // User profiles management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.PROFILES)
    const profiles: UserProfile[] = stored ? JSON.parse(stored) : []
    return profiles.find(p => p.id === userId) || null
  }

  async updateUserProfile(profile: UserProfile): Promise<void> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.PROFILES)
    const profiles: UserProfile[] = stored ? JSON.parse(stored) : []
    const updatedProfiles = profiles.map(p => 
      p.id === profile.id ? profile : p
    )
    if (!profiles.find(p => p.id === profile.id)) {
      updatedProfiles.push(profile)
    }
    localStorage.setItem(this.STORAGE_KEYS.PROFILES, JSON.stringify(updatedProfiles))
  }

  // Utility methods
  formatTimeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'agora mesmo'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `há ${minutes} min`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `há ${hours}h`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `há ${days}d`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }
}

export const socialService = new SocialService()