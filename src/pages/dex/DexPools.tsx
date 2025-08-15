// src/pages/dex/DexPools.tsx

import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDEX } from '@features/dex/hooks/useDEX'
import { PoolCard } from '@features/dex/components'

export const DexPools: FC = () => {
  const { pools, positions, loading, error } = useDEX()
  const [filter, setFilter] = useState<'all' | 'my_positions'>('all')
  const [sortBy, setSortBy] = useState<'tvl' | 'apr' | 'volume'>('tvl')

  const getFilteredPools = () => {
    let filtered = pools

    if (filter === 'my_positions') {
      const userPoolIds = positions.map(p => p.poolId)
      filtered = pools.filter(p => userPoolIds.includes(p.id))
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'tvl':
        filtered.sort((a, b) => b.tvl - a.tvl)
        break
      case 'apr':
        filtered.sort((a, b) => b.apr - a.apr)
        break
      case 'volume':
        filtered.sort((a, b) => b.volume24h - a.volume24h)
        break
    }

    return filtered
  }

  const filteredPools = getFilteredPools()

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K`
    }
    return amount.toFixed(2)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
            Pools de Liquidez
          </h1>
          <p className="text-gray-600">
            Explore pools ou adicione liquidez para ganhar recompensas
          </p>
        </div>
        <Link
          to="/dex/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Criar Pool
        </Link>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'Todos os Pools' },
              { key: 'my_positions', label: 'Minhas Posições' }
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
                {label} ({key === 'all' ? pools.length : 
                         positions.filter(p => p.lpBalance > 0).map(p => p.poolId).filter((id, idx, arr) => arr.indexOf(id) === idx).length})
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
              <option value="tvl">TVL</option>
              <option value="apr">APR</option>
              <option value="volume">Volume 24h</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total de Pools</div>
          <div className="text-2xl font-bold text-gray-900">{pools.length}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">TVL Total</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(pools.reduce((sum, p) => sum + p.tvl, 0))} BZR
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Volume 24h</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(pools.reduce((sum, p) => sum + p.volume24h, 0))} BZR
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">APR Médio</div>
          <div className="text-2xl font-bold text-gray-900">
            {pools.length > 0 ? (pools.reduce((sum, p) => sum + p.apr, 0) / pools.length).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-600">❌ {error}</div>
        </div>
      )}

      {/* Pools Grid */}
      {filteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map((pool) => (
            <PoolCard
              key={pool.id}
              pool={pool}
              onClick={() => window.location.href = `/dex/pools/${pool.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Nenhum pool encontrado' : 'Você não tem posições ativas'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'Seja o primeiro a criar um pool!'
              : 'Adicione liquidez a um pool para começar a ganhar recompensas.'
            }
          </p>
          <Link
            to={filter === 'all' ? '/dex/create' : '/dex'}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {filter === 'all' ? 'Criar Pool' : 'Explorar Pools'}
          </Link>
        </div>
      )}
    </div>
  )
}