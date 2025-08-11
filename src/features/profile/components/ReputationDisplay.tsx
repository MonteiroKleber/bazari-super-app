import { FC } from 'react'
import type { ReputationScore } from '@entities/user'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

interface ReputationDisplayProps {
  reputation: ReputationScore
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ReputationDisplay: FC<ReputationDisplayProps> = ({
  reputation,
  showDetails = true,
  size = 'md'
}) => {
  const { t } = useProfileTranslation()

  const getReputationColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-blue-600 bg-blue-100'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getReputationLabel = (score: number): string => {
    if (score >= 90) return t('excellent')
    if (score >= 70) return t('good')
    if (score >= 50) return t('fair')
    return t('poor')
  }

  const reputationCategories = [
    { key: 'trading', label: t('trading'), score: reputation.trading },
    { key: 'social', label: t('social'), score: reputation.social },
    { key: 'community', label: t('community'), score: reputation.community }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('reputation')}</h3>
        
        <div className="relative inline-block">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={reputation.overall >= 70 ? '#10b981' : reputation.overall >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - reputation.overall / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{reputation.overall}</div>
              <div className="text-xs text-gray-500">{t('score')}</div>
            </div>
          </div>
        </div>

        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getReputationColor(reputation.overall)}`}>
          {getReputationLabel(reputation.overall)}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        {reputationCategories.map(category => (
          <div key={category.key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{category.label}</span>
              <span className="text-sm text-gray-600">{category.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  category.score >= 70 ? 'bg-green-500' : 
                  category.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${category.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{reputation.details.totalTransactions}</div>
              <div className="text-gray-500">{t('transactions')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{reputation.details.successfulDeals}</div>
              <div className="text-gray-500">{t('successfulDeals')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{reputation.details.averageRating.toFixed(1)}⭐</div>
              <div className="text-gray-500">{t('averageRating')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{reputation.details.endorsements}</div>
              <div className="text-gray-500">{t('endorsements')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
