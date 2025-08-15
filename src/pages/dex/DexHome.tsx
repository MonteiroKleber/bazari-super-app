// src/pages/dex/DexHome.tsx

import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useDEX } from '@features/dex/hooks/useDEX'
import { PoolCard } from '@features/dex/components'

export const DexHome: FC = () => {
  const { pools, positions, stats, loading, error } = useDEX()

  const topPools = pools
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, 4)

  const userPositions = positions.filter(p => p.lpBalance > 0)
  const totalUserRewards = positions.reduce((sum, p) => sum + p.pendingRewards, 0)

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
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">❌ Erro ao carregar dados do DEX</div>
          <div className="text-sm text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bazari DEX
        </h1>
        <p className="text-gray-600">
          Exchange descentralizado para tokens nativos da BazariChain
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">TVL Total</div>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalTVL)} BZR</div>
          <div className="text-xs opacity-75 mt-1">
            Valor total bloqueado
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Volume 24h</div>
          <div className="text-2xl font-bold">{formatCurrency(stats.volume24h)} BZR</div>
          <div className="text-xs opacity-75 mt-1">
            {stats.totalSwaps} swaps realizados
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Pools Ativos</div>
          <div className="text-2xl font-bold">{stats.totalPools}</div>
          <div className="text-xs opacity-75 mt-1">
            {stats.totalUsers} usuários únicos
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Taxas Coletadas</div>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalFees)} BZR</div>
          <div className="text-xs opacity-75 mt-1">
            Distribuídas aos LPs
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/dex/swap"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-2xl">🔄</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Fazer Swap</h3>
              <p className="text-sm text-gray-600">Troque tokens instantaneamente</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dex/pools"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <span className="text-2xl">💧</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Adicionar Liquidez</h3>
              <p className="text-sm text-gray-600">Ganhe taxas fornecendo liquidez</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dex/rewards"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <span className="text-2xl">🎁</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Claim Recompensas</h3>
              <p className="text-sm text-gray-600">
                {totalUserRewards > 0 
                  ? `${totalUserRewards.toFixed(2)} ZARI disponíveis`
                  : 'Ver suas recompensas'
                }
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Pools */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Top Pools por TVL
              </h2>
              <Link
                to="/dex/pools"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Ver todos →
              </Link>
            </div>
            
            {topPools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topPools.map((pool) => (
                  <PoolCard
                    key={pool.id}
                    pool={pool}
                    onClick={() => window.location.href = `/dex/pools/${pool.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">💧</div>
                <div className="text-gray-600">Nenhum pool disponível</div>
              </div>
            )}
          </div>

          {/* User Positions */}
          {userPositions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Suas Posições ({userPositions.length})
                </h2>
                <Link
                  to="/dex/rewards"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Ver detalhes →
                </Link>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="divide-y divide-gray-200">
                  {userPositions.slice(0, 3).map((position) => {
                    const pool = pools.find(p => p.id === position.poolId)
                    if (!pool) return null

                    return (
                      <div key={position.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {pool.tokenA.symbol.charAt(0)}
                              </div>
                              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold -ml-2">
                                {pool.tokenB.symbol.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {pool.tokenA.symbol}-{pool.tokenB.symbol}
                              </div>
                              <div className="text-sm text-gray-500">
                                Share: {position.sharePercentage.toFixed(3)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {position.lpBalance.toFixed(4)} LP
                            </div>
                            {position.pendingRewards > 0 && (
                              <div className="text-sm text-purple-600">
                                +{position.pendingRewards.toFixed(2)} ZARI
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Mercado</h3>
            <div className="space-y-3">
              {pools.slice(0, 3).map((pool) => (
                <div key={pool.id} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">
                    {pool.tokenA.symbol}/{pool.tokenB.symbol}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {(pool.reserveB / pool.reserveA).toFixed(4)}
                    </div>
                    <div className="text-xs text-green-600">
                      {pool.apr.toFixed(1)}% APR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Atividade Recente</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Swap BZR → ZARI</span>
                </div>
                <span className="font-medium">1000 BZR</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Liquidez adicionada</span>
                </div>
                <span className="font-medium">BZR-ZARI</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Recompensa claimed</span>
                </div>
                <span className="font-medium">50 ZARI</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Links Rápidos</h3>
            <div className="space-y-2">
              <Link
                to="/dex/create"
                className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Criar Pool
              </Link>
              <Link
                to="/dex/pools"
                className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg text-center text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Explorar Pools
              </Link>
              <Link
                to="/wallet"
                className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg text-center text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Ver Carteira
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}







// src/pages/dex/index.ts

