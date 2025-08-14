// src/features/social/components/NotificationItem.tsx

import React from 'react'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Notification } from '../types/social.types'
import { socialService } from '../services/socialService'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (notificationId: string) => void
  onViewPost?: (postId: string) => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onViewPost
}) => {
  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id)
    }
  }

  const handleViewPost = () => {
    if (notification.postId) {
      onViewPost?.(notification.postId)
      handleMarkAsRead()
    }
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      like: '❤️',
      comment: '💬',
      follow: '👤',
      share: '🔄'
    }
    return icons[type as keyof typeof icons] || '🔔'
  }

  const getNotificationColor = (type: string) => {
    const colors = {
      like: 'text-red-600',
      comment: 'text-blue-600',
      follow: 'text-green-600',
      share: 'text-purple-600'
    }
    return colors[type as keyof typeof colors] || 'text-dark-600'
  }

  const timeAgo = socialService.formatTimeAgo(notification.createdAt)

  return (
    <Card 
      className={`p-4 mb-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
        !notification.read 
          ? 'bg-primary-50 border-l-4 border-l-primary-500' 
          : 'bg-white hover:bg-sand-50'
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar do usuário que gerou a notificação */}
        <div className="flex-shrink-0 relative">
          <img
            src={notification.fromUser.avatarUrl || '/icons/avatar-default.svg'}
            alt={`Avatar de ${notification.fromUser.name}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          {/* Ícone da ação sobreposto */}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs ${getNotificationColor(notification.type)}`}>
            {getNotificationIcon(notification.type)}
          </div>
        </div>

        {/* Conteúdo da notificação */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-dark-900">
                <span className="font-semibold">{notification.fromUser.name}</span>
                {' '}
                <span className="text-dark-700">{notification.message}</span>
              </p>
              <p className="text-xs text-dark-600 mt-1">{timeAgo}</p>
            </div>

            {/* Indicadores de status */}
            <div className="flex items-center space-x-2 ml-2">
              {!notification.read && (
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              )}
              {notification.postId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewPost}
                  className="text-xs px-2 py-1"
                >
                  Ver post
                </Button>
              )}
            </div>
          </div>

          {/* Tipo específico de notificação */}
          <div className="mt-2">
            {notification.type === 'like' && (
              <div className="text-xs text-red-600 bg-red-50 rounded-full px-2 py-1 inline-flex items-center">
                <span className="mr-1">❤️</span>
                Curtiu sua publicação
              </div>
            )}
            {notification.type === 'comment' && (
              <div className="text-xs text-blue-600 bg-blue-50 rounded-full px-2 py-1 inline-flex items-center">
                <span className="mr-1">💬</span>
                Comentou em sua publicação
              </div>
            )}
            {notification.type === 'follow' && (
              <div className="text-xs text-green-600 bg-green-50 rounded-full px-2 py-1 inline-flex items-center">
                <span className="mr-1">👤</span>
                Começou a seguir você
              </div>
            )}
            {notification.type === 'share' && (
              <div className="text-xs text-purple-600 bg-purple-50 rounded-full px-2 py-1 inline-flex items-center">
                <span className="mr-1">🔄</span>
                Compartilhou sua publicação
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}