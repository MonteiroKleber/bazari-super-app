// src/pages/dex/DexRewards.tsx

import { FC } from 'react'
import { useDEX } from '@features/dex/hooks/useDEX'
import { RewardsDashboard } from '@features/dex/components'

export const DexRewards: FC = () => {
  const { pools, positions, claimRewards, claimAllRewards, loading, error } = useDEX()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Recompensas de Liquidez
        </h1>
        <p className="text-gray-600">
          Gerencie e colete suas recompensas em ZARI dos pools de liquidez
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-600">❌ {error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Rewards Dashboard */
        <RewardsDashboard
          positions={positions}
          pools={pools}
          onClaimRewards={claimRewards}
          onClaimAllRewards={claimAllRewards}
          loading={loading}
        />
      )}
    </div>
  )
}