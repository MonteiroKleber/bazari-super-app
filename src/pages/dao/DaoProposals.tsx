// src/pages/dao/DaoProposals.tsx

import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDAO } from '@features/dao/hooks/useDAO'
import { ProposalCard } from '@features/dao/components'
import { ProposalState } from '@features/dao/types/dao.types'

export const DaoProposals: FC = () => {
  const { proposals, castVote, loading, error } = useDAO()
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'votes'>('newest')

  const getFilteredProposals = () => {
    let filtered = proposals

    // Aplicar filtros
    switch (filter) {
      case 'active':
        filtered = proposals.filter(p => p.state === ProposalState.ACTIVE)
        break
      case 'pending':
        filtered = proposals.filter(p => 
          p.state === ProposalState.DRAFT || 
          p.state === ProposalState.QUEUED
        )
        break
      case 'completed':
        filtered = proposals.filter(p => 
          p.state === ProposalState.SUCCEEDED || 
          p.state === ProposalState.DEFEATED ||
          p.state === ProposalState.EXECUTED
        )
        break
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt)
        break
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt)
        break
      case 'votes':
        filtered.sort((a, b) => b.totalVotes - a.totalVotes)
        break
    }

    return filtered
  }

  const filteredProposals = getFilteredProposals()

  const getFilterCount = (filterType: typeof filter): number => {
    switch (filterType) {
      case 'all':
        return proposals.length
      case 'active':
        return proposals.filter(p => p.state === ProposalState.ACTIVE).length
      case 'pending':
        return proposals.filter(p => 
          p.state === ProposalState.DRAFT || 
          p.state === ProposalState.QUEUED
        ).length
      case 'completed':
        return proposals.filter(p => 
          p.state === ProposalState.SUCCEEDED || 
          p.state === ProposalState.DEFEATED ||
          p.state === ProposalState.EXECUTED
        ).length
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Propostas da DAO
          </h1>
          <p className="text-gray-600">
            Explore e vote nas propostas da comunidade
          </p>
        </div>
        <Link
          to="/dao/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Nova Proposta
        </Link>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'active', label: 'Ativas' },
              { key: 'pending', label: 'Pendentes' },
              { key: 'completed', label: 'Finalizadas' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label} ({getFilterCount(key as typeof filter)})
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
              <option value="votes">Mais votadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-600">❌ {error}</div>
        </div>
      )}

      {/* Proposals List */}
      {filteredProposals.length > 0 ? (
        <div className="space-y-6">
          {filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onVote={castVote}
              canVote={proposal.state === ProposalState.ACTIVE}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma proposta encontrada
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'Não há propostas criadas ainda.'
              : `Não há propostas na categoria "${filter}".`
            }
          </p>
          <Link
            to="/dao/create"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Criar primeira proposta
          </Link>
        </div>
      )}
    </div>
  )
}