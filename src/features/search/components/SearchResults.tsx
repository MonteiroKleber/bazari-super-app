import { FC } from 'react'
import { ProfileViewer } from '@features/profile/components/ProfileViewer'
import type { User } from '@entities/user'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

interface SearchResultsProps {
  results: User[]
  isLoading: boolean
  hasSearched: boolean
  hasResults: boolean
  isEmpty: boolean
  onUserSelect: (userId: string) => void
  query: string
}

export const SearchResults: FC<SearchResultsProps> = ({
  results,
  isLoading,
  hasSearched,
  hasResults,
  isEmpty,
  onUserSelect,
  query
}) => {
  const { t } = useProfileTranslation()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('searchUsers')}</h3>
        <p className="text-gray-600">{t('enterSearchTerm')}</p>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noUsersFound')}</h3>
        <p className="text-gray-600">
          {t('noUsersFoundFor')} <strong>"{query}"</strong>
        </p>
        <p className="text-gray-500 text-sm mt-2">{t('tryDifferentSearch')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('searchResults')} ({results.length})
        </h2>
        <div className="text-sm text-gray-600">
          {t('resultsFor')} <strong>"{query}"</strong>
        </div>
      </div>

      <div className="space-y-4">
        {results.map(user => (
          <div
            key={user.id}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => onUserSelect(user.id)}
          >
            <ProfileViewer userId={user.id} showActions={false} compact={true} />
          </div>
        ))}
      </div>

      {results.length >= 20 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">{t('showingFirst20Results')}</p>
          <button className="text-primary-600 hover:text-primary-500 text-sm font-medium mt-2">
            {t('loadMoreResults')}
          </button>
        </div>
      )}
    </div>
  )
}
