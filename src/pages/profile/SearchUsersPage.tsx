import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserSearch } from '@features/search/components/UserSearch'
import { SearchResults } from '@features/search/components/SearchResults'
import { useUserSearch } from '@features/profile/hooks/useUserSearch'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

export const SearchUsersPage: FC = () => {
  const { t } = useProfileTranslation()
  const navigate = useNavigate()
  const {
    query,
    filters,
    results,
    isSearching,
    hasSearched,
    hasResults,
    isEmpty,
    updateQuery,
    updateFilters,
    clearSearch,
    search
  } = useUserSearch()

  const handleUserSelect = (userId: string) => {
    navigate(`/profile/${userId}`)
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('searchUsers')}</h1>
        <p className="text-gray-600">{t('searchUsersDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Search Panel */}
        <div className="lg:col-span-1">
          <UserSearch
            query={query}
            filters={filters}
            onQueryChange={updateQuery}
            onFiltersChange={updateFilters}
            onSearch={search}
            onClear={clearSearch}
            isSearching={isSearching}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <SearchResults
            results={results}
            isLoading={isSearching}
            hasSearched={hasSearched}
            hasResults={hasResults}
            isEmpty={isEmpty}
            onUserSelect={handleUserSelect}
            query={query}
          />
        </div>
      </div>
    </div>
  )
}
