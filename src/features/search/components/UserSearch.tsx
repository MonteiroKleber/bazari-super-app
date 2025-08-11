import { FC } from 'react'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

interface SearchFilters {
  location?: string
  isTokenized?: boolean
  minReputation?: number
  hasAvatar?: boolean
  isVerified?: boolean
}

interface UserSearchProps {
  query: string
  filters: SearchFilters
  onQueryChange: (query: string) => void
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  onSearch: () => void
  onClear: () => void
  isSearching: boolean
}

export const UserSearch: FC<UserSearchProps> = ({
  query,
  filters,
  onQueryChange,
  onFiltersChange,
  onSearch,
  onClear,
  isSearching
}) => {
  const { t } = useProfileTranslation()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('searchFilters')}</h2>

      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('searchQuery')}
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full input-bazari pl-10"
            placeholder={t('searchPlaceholder')}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('location')}
        </label>
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => onFiltersChange({ location: e.target.value || undefined })}
          className="w-full input-bazari"
          placeholder={t('anyLocation')}
        />
      </div>

      {/* Reputation Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('minReputation')}
        </label>
        <select
          value={filters.minReputation || ''}
          onChange={(e) => onFiltersChange({ 
            minReputation: e.target.value ? parseInt(e.target.value) : undefined 
          })}
          className="w-full input-bazari"
        >
          <option value="">{t('anyReputation')}</option>
          <option value="90">{t('excellent')} (90+)</option>
          <option value="70">{t('good')} (70+)</option>
          <option value="50">{t('fair')} (50+)</option>
        </select>
      </div>

      {/* Boolean Filters */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isTokenized || false}
            onChange={(e) => onFiltersChange({ isTokenized: e.target.checked || undefined })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">{t('tokenizedOnly')}</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.hasAvatar || false}
            onChange={(e) => onFiltersChange({ hasAvatar: e.target.checked || undefined })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">{t('withAvatar')}</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isVerified || false}
            onChange={(e) => onFiltersChange({ isVerified: e.target.checked || undefined })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">{t('verifiedOnly')}</span>
        </label>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={onSearch}
          disabled={isSearching || !query.trim()}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isSearching ? t('searching') : t('search')}
        </button>
        
        <button
          onClick={onClear}
          className="w-full btn-secondary"
        >
          {t('clearFilters')}
        </button>
      </div>
    </div>
  )
}
