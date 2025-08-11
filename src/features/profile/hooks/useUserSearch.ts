import { useState, useCallback, useEffect } from 'react'
import { profileService } from '../services/profileService'
import type { User } from '@entities/user'

interface SearchFilters {
  location?: string
  isTokenized?: boolean
  minReputation?: number
  hasAvatar?: boolean
  isVerified?: boolean
}

export function useUserSearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const search = useCallback(async (searchQuery?: string, searchFilters?: SearchFilters) => {
    const finalQuery = searchQuery !== undefined ? searchQuery : query
    const finalFilters = searchFilters !== undefined ? searchFilters : filters

    if (!finalQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const searchResults = await profileService.searchUsers(finalQuery, finalFilters)
      setResults(searchResults)
      setHasSearched(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro na busca')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [query, filters])

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    setHasSearched(false)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  // Auto-search com debounce
  useEffect(() => {
    if (!query.trim()) return

    const debounceTimer = setTimeout(() => {
      search()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [query, search])

  return {
    // Estado
    query,
    filters,
    results,
    isSearching,
    error,
    hasSearched,
    hasResults: results.length > 0,
    isEmpty: hasSearched && results.length === 0,

    // Ações
    search,
    updateQuery,
    updateFilters,
    clearSearch,
    clearFilters,

    // Utilitários
    resultCount: results.length
  }
}
