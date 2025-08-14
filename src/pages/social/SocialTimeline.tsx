// src/pages/social/SocialTimeline.tsx

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { Tabs } from '@shared/ui/Tabs'
import { useSocial } from '@features/social/hooks/useSocial'
import { useTranslation } from '@app/i18n/useTranslation'
import { Activity } from '@features/social/types/social.types'
import { socialService } from '@features/social/services/socialService'

type ActivityFilter = 'all' | 'transfer' | 'marketplace' | 'vote' | 'profile'

export const SocialTimeline: React.FC = () => {
  const { t } = useTranslation()
  const { activities } = useSocial()
  const [filter, setFilter] = useState<ActivityFilter>('all')
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d')

  // Filtrar atividades
  useEffect(() => {
    let filtered = activities

    // Filtro por tipo
    if (filter !== 'all') {
      filtered = filtered.filter(a => a.kind === filter)
    }

    // Filtro por período
    if (timeRange !== 'all') {
      const now = Date.now()
      const ranges = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }
      const cutoff = now - ranges[timeRange]
      filtered = filtered.filter(a => new Date(a.createdAt).getTime() > cutoff)
    }

    setFilteredActivities(filtered)
  }, [activities, filter, timeRange])

  const getActivityIcon = (kind: string) => {
    const icons = {
      transfer: '💸',
      purchase: '🛒',
      sale: '💰',
      vote: '🗳️',
      marketplace: '🏪',
      profile: '🎨',
      other: '⚡'
    }
    return icons[kind as keyof typeof icons] || '⚡'
  }

  const getActivityColor = (kind: string) => {
    const colors = {
      transfer: 'text-blue-600 bg-blue-50',
      purchase: 'text-green-600 bg-green-50',
      sale: 'text-yellow-600 bg-yellow-50',
      vote: 'text-purple-600 bg-purple-50',
      marketplace: 'text-orange-600 bg-orange-50',
      profile: 'text-pink-600 bg-pink-50',
      other: 'text-gray-600 bg-gray-50'
    }
    return colors[kind as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  const activityCounts = {
    all: activities.length,
    transfer: activities.filter(a => a.kind === 'transfer').length,
    marketplace: activities.filter(a => ['purchase', 'sale', 'marketplace'].includes(a.kind)).length,
    vote: activities.filter(a => a.kind === 'vote').length,
    profile: activities.filter(a => a.kind === 'profile').length
  }

  const tabs = [
    { id: 'all', label: `Todas (${activityCounts.all})` },
    { id: 'transfer', label: `💸 Transferências (${activityCounts.transfer})` },
    { id: 'marketplace', label: `🛒 Marketplace (${activityCounts.marketplace})` },
    { id: 'vote', label: `🗳️ Votações (${activityCounts.vote})` },
    { id: 'profile', label: `🎨 Perfil (${activityCounts.profile})` }
  ]

  const timeRanges = [
    { id: '24h', label: 'Últimas 24h' },
    { id: '7d', label: 'Últimos 7 dias' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: 'all', label: 'Todas' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 flex items-center space-x-3">
                <span>{t('social.timeline', 'Timeline')}</span>
                <Badge variant="primary">Blockchain</Badge>
              </h1>
              <p className="text-dark-600 mt-2">
                Histórico de todas suas atividades na plataforma
              </p>
            </div>
            
            <Link to="/social">
              <Button variant="ghost" size="sm">
                ← Voltar ao feed
              </Button>
            </Link>
          </div>

          {/* Stats Rápidas */}
          <Card className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="text-primary-700">
                  <span className="font-semibold">{activities.length}</span> atividades
                </div>
                <div className="text-primary-700">
                  <span className="font-semibold">
                    {activities.filter(a => a.kind === 'transfer').length}
                  </span> transferências
                </div>
                <div className="text-primary-700">
                  <span className="font-semibold">
                    {activities.filter(a => ['purchase', 'sale'].includes(a.kind)).length}
                  </span> transações
                </div>
              </div>
              <div className="text-primary-600">
                ⛓️ Timeline Blockchain
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Tipo de atividade
            </label>
            <Tabs
              tabs={tabs}
              activeTab={filter}
              onTabChange={(tabId) => setFilter(tabId as ActivityFilter)}
            />
          </div>

          {/* Filtro por período */}
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Período
            </label>
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <Button
                  key={range.id}
                  variant={timeRange === range.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range.id as typeof timeRange)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline de Atividades */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Ícone da atividade */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.kind)}`}>
                    {activity.icon || getActivityIcon(activity.kind)}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-dark-900 mb-1">
                          {activity.title}
                        </h3>
                        {activity.description && (
                          <p className="text-dark-700 text-sm mb-2">
                            {activity.description}
                          </p>
                        )}
                        
                        {/* Metadados */}
                        <div className="flex items-center space-x-4 text-xs text-dark-600">
                          <span>
                            {socialService.formatTimeAgo(activity.createdAt)}
                          </span>
                          
                          {activity.amount && activity.token && (
                            <Badge variant="secondary" size="sm">
                              {activity.amount} {activity.token}
                            </Badge>
                          )}
                          
                          {activity.txHash && (
                            <Badge variant="outline" size="sm" className="font-mono">
                              TX: {activity.txHash.slice(0, 8)}...
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status/Tipo */}
                      <Badge 
                        variant="secondary"
                        className={`text-xs ${getActivityColor(activity.kind).split(' ')[0]}`}
                      >
                        {activity.kind.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Linha conectora (não no último item) */}
                {index < filteredActivities.length - 1 && (
                  <div className="ml-5 mt-4 h-4 border-l-2 border-sand-200"></div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          /* Estado Vazio */
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-xl font-semibold text-dark-900 mb-2">
              Nenhuma atividade encontrada
            </h2>
            <p className="text-dark-600 mb-6 max-w-md mx-auto">
              {filter !== 'all' || timeRange !== 'all' 
                ? 'Tente ajustar os filtros para ver mais atividades.'
                : 'Suas atividades na blockchain aparecerão aqui conforme você usar a plataforma.'
              }
            </p>
            
            {filter !== 'all' || timeRange !== 'all' ? (
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => setFilter('all')}
                  variant="outline"
                >
                  Ver todas as atividades
                </Button>
                <Button
                  onClick={() => setTimeRange('all')}
                  variant="outline"
                >
                  Ver todos os períodos
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/wallet">
                  <Button className="w-full sm:w-auto">
                    💰 Ir para carteira
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" className="w-full sm:w-auto">
                    🛒 Ver marketplace
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        )}

        {/* Informações da Timeline */}
        {filteredActivities.length > 0 && (
          <Card className="p-4 mt-8 bg-sand-50">
            <div className="flex items-center space-x-3 text-sm text-dark-600">
              <span>ℹ️</span>
              <div>
                <p className="mb-1">
                  <strong>Sobre a Timeline:</strong> Todas as atividades são registradas de forma transparente na blockchain.
                </p>
                <p>
                  Você pode verificar qualquer transação usando o hash (TX) nos exploradores de blockchain.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}