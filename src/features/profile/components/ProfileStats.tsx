import { FC } from 'react'
import type { UserStats } from '@entities/user'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

interface ProfileStatsProps {
  stats: UserStats
  showAll?: boolean
}

export const ProfileStats: FC<ProfileStatsProps> = ({ stats, showAll = true }) => {
  const { t } = useProfileTranslation()

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value)
  }

  const statItems = [
    {
      label: t('totalEarnings'),
      value: formatCurrency(stats.totalEarnings),
      icon: '💰',
      color: 'text-green-600 bg-green-100'
    },
    {
      label: t('totalSpent'),
      value: formatCurrency(stats.totalSpent),
      icon: '💸',
      color: 'text-red-600 bg-red-100'
    },
    {
      label: t('businessesOwned'),
      value: stats.businessesOwned.toString(),
      icon: '🏢',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: t('productsListed'),
      value: stats.productsListed.toString(),
      icon: '📦',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      label: t('servicesOffered'),
      value: stats.servicesOffered.toString(),
      icon: '🛠️',
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      label: t('socialInteractions'),
      value: stats.socialInteractions.toString(),
      icon: '💬',
      color: 'text-pink-600 bg-pink-100'
    },
    {
      label: t('daoParticipation'),
      value: stats.daoParticipation.toString(),
      icon: '🗳️',
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  const displayStats = showAll ? statItems : statItems.slice(0, 4)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('activityStats')}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayStats.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${stat.color}`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {!showAll && statItems.length > 4 && (
        <div className="text-center mt-4">
          <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            {t('viewAllStats')}
          </button>
        </div>
      )}
    </div>
  )
}
