// src/pages/dex/DexPoolDetail.tsx

import { FC, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { usePool } from '@features/dex/hooks/useDEX'
import { AddLiquidityForm, RemoveLiquidityForm } from '@features/dex/components'

export const DexPoolDetail: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { pool, positions, stats, addLiquidity, removeLiquidity, claimRewards, calculateAddLiquidity, calculateRemoveLiquidity, loading, error } = usePool(id!)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'remove'>('overview')

  if (!id) {
    return <Navigate to="/dex/pools" replace />
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error || !pool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">❌ Pool não encontrado</div>
          <Link
            to="/dex/pools"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Voltar para pools
          </Link>
        </div>
      </div>
    )
  }

  const userPosition = positions.length > 0 ? positions[0] : null

  const formatCurrency = (amount: number, symbol?: string): string => {
    const formatted = amount >= 1000000 ? `${(amount / 1000000).toFixed(2)}M` :
                     amount >= 1000 ? `${(amount / 1000).toFixed(2)}K` :
                     amount.toFixed(6)
    return symbol ? `${formatted} ${symbol}` : formatted
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/dex" className="hover:text-gray-700">DEX</Link>
        <span>→</span>
        <Link to="/dex/pools" className="hover:text-gray-700">Pools</Link>
        <span>→</span>
        <span className="text-gray-900">{pool.tokenA.symbol}-{pool.tokenB.symbol}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {pool.tokenA.symbol.charAt(0)}
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold -ml-3">
                {pool.tokenB.symbol.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {pool.tokenA.symbol}-{pool.tokenB.symbol}
              </h1>
              <p className="text-gray-600">
                Taxa: {(pool.swapFee * 100).toFixed(2)}% • Criado em {formatDate(pool.createdAt)}
              </p>
            </div>
          </div>
          
          {userPosition && userPosition.pendingRewards > 0 && (
            <button
              onClick={() => claimRewards()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Claim {userPosition.pendingRewards.toFixed(2)} ZARI
            </button>
          )}
        </div>

        {/* Pool Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">TVL</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(pool.tvl)} BZR
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">APR</div>
            <div className="text-xl font-bold text-green-600">
              {pool.apr.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Volume 24h</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(pool.volume24h)} BZR
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">LP Supply</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(pool.totalLpSupply)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Visão Geral' },
              { key: 'add', label: 'Adicionar Liquidez' },
              { key: 'remove', label: 'Remover Liquidez' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pool Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações do Pool
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reserva {pool.tokenA.symbol}</span>
                      <span className="font-medium">{formatCurrency(pool.reserveA, pool.tokenA.symbol)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reserva {pool.tokenB.symbol}</span>
                      <span className="font-medium">{formatCurrency(pool.reserveB, pool.tokenB.symbol)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Preço {pool.tokenA.symbol}/{pool.tokenB.symbol}</span>
                        <span className="font-medium">{(pool.reserveB / pool.reserveA).toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Preço {pool.tokenB.symbol}/{pool.tokenA.symbol}</span>
                        <span className="font-medium">{(pool.reserveA / pool.reserveB).toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {stats && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Estatísticas
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume 7d</span>
                        <span className="font-medium">{formatCurrency(stats.volume7d)} BZR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume 30d</span>
                        <span className="font-medium">{formatCurrency(stats.volume30d)} BZR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxas 24h</span>
                        <span className="font-medium">{formatCurrency(stats.fees24h)} BZR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mudança de preço 24h</span>
                        <span className={`font-medium ${
                          stats.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stats.priceChange24h >= 0 ? '+' : ''}{stats.priceChange24h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provedores de liquidez</span>
                        <span className="font-medium">{stats.liquidityProviders}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Position */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sua Posição
                </h3>
                
                {userPosition ? (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">LP Tokens</div>
                        <div className="font-semibold">{userPosition.lpBalance.toFixed(6)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Share do Pool</div>
                        <div className="font-semibold">{userPosition.sharePercentage.toFixed(4)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">{pool.tokenA.symbol}</div>
                        <div className="font-semibold">{userPosition.tokenAAmount.toFixed(6)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">{pool.tokenB.symbol}</div>
                        <div className="font-semibold">{userPosition.tokenBAmount.toFixed(6)}</div>
                      </div>
                    </div>

                    {userPosition.pendingRewards > 0 && (
                      <div className="border-t border-blue-200 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-600">Recompensas Pendentes</div>
                            <div className="font-semibold text-purple-600">
                              {userPosition.pendingRewards.toFixed(4)} ZARI
                            </div>
                          </div>
                          <button
                            onClick={() => claimRewards()}
                            className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            Claim
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-600">
                      Posição criada em {formatDate(userPosition.addedAt)}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-gray-400 mb-2">💧</div>
                    <div className="text-gray-600 mb-3">Você não tem posição neste pool</div>
                    <button
                      onClick={() => setActiveTab('add')}
                      className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                    >
                      Adicionar Liquidez
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add Liquidity Tab */}
          {activeTab === 'add' && (
            <AddLiquidityForm
              pool={pool}
              onAddLiquidity={addLiquidity}
              calculateAddLiquidity={calculateAddLiquidity}
              loading={loading}
            />
          )}

          {/* Remove Liquidity Tab */}
          {activeTab === 'remove' && (
            <>
              {userPosition ? (
                <RemoveLiquidityForm
                  pool={pool}
                  position={userPosition}
                  onRemoveLiquidity={removeLiquidity}
                  calculateRemoveLiquidity={calculateRemoveLiquidity}
                  loading={loading}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">💧</div>
                  <div className="text-gray-600 mb-3">
                    Você não tem posição neste pool para remover
                  </div>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                  >
                    Adicionar Liquidez Primeiro
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}