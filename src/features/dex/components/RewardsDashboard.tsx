// src/features/dex/components/RewardsDashboard.tsx

import { FC } from 'react'
import { Position, Pool } from '../types/dex.types'

interface RewardsDashboardProps {
  positions: Position[]
  pools: Pool[]
  onClaimRewards: (poolId: string) => Promise<void>
  onClaimAllRewards: () => Promise<void>
  loading?: boolean
}

export const RewardsDashboard: FC<RewardsDashboardProps> = ({
  positions,
  pools,
  onClaimRewards,
  onClaimAllRewards,
  loading = false
}) => {
  const positionsWithRewards = positions.filter(p => p.pendingRewards > 0)
  const totalPendingRewards = positions.reduce((sum, p) => sum + p.pendingRewards, 0)
  const totalClaimedRewards = positions.reduce((sum, p) => sum + p.claimedRewards, 0)

  const getPoolName = (poolId: string): string => {
    const pool = pools.find(p => p.id === poolId)
    return pool ? `${pool.tokenA.symbol}-${pool.tokenB.symbol}` : poolId
  }

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d atrás`
    if (hours > 0) return `${hours}h atrás`
    return 'Agora'
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Painel de Recompensas</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm opacity-90 mb-1">Recompensas Pendentes</div>
            <div className="text-2xl font-bold">{totalPendingRewards.toFixed(2)} ZARI</div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">Total Recebido</div>
            <div className="text-2xl font-bold">{totalClaimedRewards.toFixed(2)} ZARI</div>
          </div>
        </div>
        
        {totalPendingRewards > 0 && (
          <button
            onClick={onClaimAllRewards}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Claim Todas as Recompensas'}
          </button>
        )}
      </div>

      {/* Positions with Rewards */}
      {positionsWithRewards.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recompensas por Pool ({positionsWithRewards.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {positionsWithRewards.map((position) => {
              const pool = pools.find(p => p.id === position.poolId)
              return (
                <div key={position.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Pool Icon */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {pool?.tokenA.symbol.charAt(0) || 'A'}
                        </div>
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold -ml-2">
                          {pool?.tokenB.symbol.charAt(0) || 'B'}
                        </div>
                      </div>
                      
                      {/* Pool Info */}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {getPoolName(position.poolId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          LP: {position.lpBalance.toFixed(4)} • 
                          Share: {position.sharePercentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Rewards */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">
                        {position.pendingRewards.toFixed(4)} ZARI
                      </div>
                      <div className="text-sm text-gray-500">
                        Último claim: {formatTimeAgo(position.lastClaimAt)}
                      </div>
                    </div>
                    
                    {/* Claim Button */}
                    <button
                      onClick={() => onClaimRewards(position.poolId)}
                      disabled={loading}
                      className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
                    >
                      Claim
                    </button>
                  </div>
                  
                  {/* APR Info */}
                  {pool && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">APR atual do pool</span>
                        <span className="font-medium text-green-600">{pool.apr.toFixed(1)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* No Rewards */
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma recompensa pendente
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione liquidez aos pools para começar a receber recompensas em ZARI.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Explorar Pools
          </button>
        </div>
      )}

      {/* All Positions Summary */}
      {positions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Todas as Posições ({positions.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {positions.map((position) => (
              <div key={position.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">
                    {getPoolName(position.poolId)}
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-900">
                      Recebido: {position.claimedRewards.toFixed(2)} ZARI
                    </div>
                    <div className="text-gray-500">
                      LP: {position.lpBalance.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
