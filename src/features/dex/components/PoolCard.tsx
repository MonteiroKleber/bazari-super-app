// src/features/dex/components/PoolCard.tsx

import { FC } from 'react'
import { Pool } from '../types/dex.types'

interface PoolCardProps {
  pool: Pool
  onClick?: () => void
  showActions?: boolean
}

export const PoolCard: FC<PoolCardProps> = ({
  pool,
  onClick,
  showActions = true
}) => {
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K`
    }
    return amount.toFixed(2)
  }

  const getAPRColor = (apr: number): string => {
    if (apr >= 50) return 'text-green-600'
    if (apr >= 20) return 'text-blue-600'
    return 'text-gray-600'
  }

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
            <h3 className="font-semibold text-gray-900">
              {pool.tokenA.symbol}-{pool.tokenB.symbol}
            </h3>
            <p className="text-sm text-gray-500">
              Taxa: {(pool.swapFee * 100).toFixed(2)}%
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-bold ${getAPRColor(pool.apr)}`}>
            {pool.apr.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">APR</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">TVL</div>
          <div className="font-semibold text-gray-900">
            {formatCurrency(pool.tvl)} BZR
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Volume 24h</div>
          <div className="font-semibold text-gray-900">
            {formatCurrency(pool.volume24h)} BZR
          </div>
        </div>
      </div>

      {/* Reserves */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="text-xs text-gray-500 mb-2">Reserves</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">{formatCurrency(pool.reserveA)}</span>
            <span className="text-gray-500 ml-1">{pool.tokenA.symbol}</span>
          </div>
          <div>
            <span className="font-medium">{formatCurrency(pool.reserveB)}</span>
            <span className="text-gray-500 ml-1">{pool.tokenB.symbol}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <button className="flex-1 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
            Adicionar Liquidez
          </button>
          <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
            Fazer Swap
          </button>
        </div>
      )}
    </div>
  )
}
