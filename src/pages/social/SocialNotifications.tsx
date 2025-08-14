// src/pages/social/SocialNotifications.tsx

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { Tabs } from '@shared/ui/Tabs'
import { NotificationItem } from '@features/social/components/NotificationItem'
import { useSocial } from '@features/social/hooks/useSocial'
import { useTranslation } from '@app/i18n/useTranslation'
import { Notification } from '@features/social/types/social.types'

type NotificationFilter = 'all' | 'likes' | 'comments' | 'follows' | 'shares'

export const SocialNotifications: React.FC = () => {
  const { t } = useTranslation()
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useSocial()
  
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)

  // Filtrar notificações
  useEffect(() => {
    let filtered = notifications

    // Filtro por tipo
    if (filter !== 'all') {
      const typeMap = {
        likes: 'like',
        comments: 'comment', 
        follows: 'follow',
        shares: 'share'
      }
      filtered = filtered.filter(n => n.type === typeMap[filter])
    }

    // Filtro por não lidas
    if (showOnlyUnread) {
      filtered = filtered.filter(n => !n.read)
    }

    setFilteredNotifications(filtered)
  }, [notifications, filter, showOnlyUnread])

  const handleViewPost = (postId: string) => {
    // Em implementação real, navegaria para o post específico
    console.log('Ver post:', postId)
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
  }

  const notificationCounts = {
    all: notifications.length,
    likes: notifications.filter(n => n.type === 'like').length,
    comments: notifications.filter(n => n.type === 'comment').length,
    follows: notifications.filter(n => n.type === 'follow').length,
    shares: notifications.filter(n => n.type === 'share').length
  }

  const tabs = [
    { 
      id: 'all', 
      label: `Todas (${notificationCounts.all})`,
      count: notificationCounts.all
    },
    { 
      id: 'likes', 
      label: `❤️ Curtidas (${notificationCounts.likes})`,
      count: notificationCounts.likes
    },
    { 
      id: 'comments', 
      label: `💬 Comentários (${notificationCounts.comments})`,
      count: notificationCounts.comments
    },
    { 
      id: 'follows', 
      label: `👤 Seguidores (${notificationCounts.follows})`,
      count: notificationCounts.follows
    },
    { 
      id: 'shares', 
      label: `🔄 Compartilhamentos (${notificationCounts.shares})`,
      count: notificationCounts.shares
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 flex items-center space-x-3">
                <span>{t('social.notifications', 'Notificações')}</span>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="primary" className="animate-pulse">
                    {unreadNotificationsCount} nova{unreadNotificationsCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </h1>
              <p className="text-dark-600 mt-2">
                Acompanhe todas as interações com seus posts
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {unreadNotificationsCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2"
                >
                  <span>✓</span>
                  <span>Marcar todas como lidas</span>
                </Button>
              )}
              
              <Link to="/social">
                <Button variant="ghost" size="sm">
                  ← Voltar ao feed
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Rápidas */}
          <Card className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="text-primary-700">
                  <span className="font-semibold">{notifications.length}</span> total
                </div>
                <div className="text-primary-700">
                  <span className="font-semibold">{unreadNotificationsCount}</span> não lidas
                </div>
                <div className="text-primary-700">
                  <span className="font-semibold">
                    {notifications.filter(n => n.read).length}
                  </span> lidas
                </div>
              </div>
              <div className="text-primary-600">
                🔔 Centro de notificações
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Tabs
              tabs={tabs}
              activeTab={filter}
              onTabChange={(tabId) => setFilter(tabId as NotificationFilter)}
              className="flex-1"
            />
            
            <div className="flex items-center space-x-3 ml-6">
              <label className="flex items-center space-x-2 text-sm text-dark-700">
                <input
                  type="checkbox"
                  checked={showOnlyUnread}
                  onChange={(e) => setShowOnlyUnread(e.target.checked)}
                  className="rounded border-sand-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Apenas não lidas</span>
              </label>
            </div>
          </div>
        </div>

        {/* Lista de Notificações */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markNotificationAsRead}
                onViewPost={handleViewPost}
              />
            ))}
          </div>
        ) : (
          /* Estado Vazio */
          <Card className="p-12 text-center">
            {showOnlyUnread ? (
              // Sem notificações não lidas
              <div>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2">
                  Tudo em dia!
                </h2>
                <p className="text-dark-600 mb-6">
                  Você não tem notificações não lidas no momento.
                </p>
                <Button
                  onClick={() => setShowOnlyUnread(false)}
                  variant="outline"
                >
                  Ver todas as notificações
                </Button>
              </div>
            ) : filter !== 'all' ? (
              // Filtro específico sem resultados
              <div>
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2">
                  Nenhuma notificação deste tipo
                </h2>
                <p className="text-dark-600 mb-6">
                  Não há notificações de {filter} no momento.
                </p>
                <Button
                  onClick={() => setFilter('all')}
                  variant="outline"
                >
                  Ver todas as notificações
                </Button>
              </div>
            ) : (
              // Sem notificações em geral
              <div>
                <div className="text-6xl mb-4">🔔</div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2">
                  Nenhuma notificação
                </h2>
                <p className="text-dark-600 mb-6">
                  Quando outros usuários interagirem com seus posts, as notificações aparecerão aqui.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/social/post">
                    <Button className="w-full sm:w-auto">
                      ✍️ Criar primeiro post
                    </Button>
                  </Link>
                  <Link to="/social">
                    <Button variant="outline" className="w-full sm:w-auto">
                      📱 Ver feed
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Rodapé com dicas */}
        {filteredNotifications.length > 0 && (
          <Card className="p-4 mt-8 bg-sand-50">
            <div className="flex items-center space-x-3 text-sm text-dark-600">
              <span>💡</span>
              <p>
                <strong>Dica:</strong> Clique em uma notificação para marcá-la como lida automaticamente.
                Use os filtros acima para organizar melhor suas notificações.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}