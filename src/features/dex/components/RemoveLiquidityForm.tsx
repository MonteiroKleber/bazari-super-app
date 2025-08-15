// src/features/dex/components/RemoveLiquidityForm.tsx

import { FC, useState, useEffect } from 'react'
import { Pool, Position, RemoveLiquidityCalculation } from '../types/dex.types'

interface RemoveLiquidityFormProps {
  pool: Pool
  position: Position
  onRemoveLiquidity: (lpAmount: number) => Promise<void>
  calculateRemoveLiquidity: (lpAmount: number) => RemoveLiquidityCalculation | null
  loading?: boolean
}

export const RemoveLiquidityForm: FC<RemoveLiquidityFormProps> = ({
  pool,
  position,
  onRemoveLiquidity,
  calculateRemoveLiquidity,
  loading = false
}) => {
  const [lpAmount, setLpAmount] = useState<string>('')
  const [percentage, setPercentage] = useState<number>(0)
  const [calculation, setCalculation] = useState<RemoveLiquidityCalculation | null>(null)

  // Recalcular quando lpAmount muda
  useEffect(() => {
    if (lpAmount && parseFloat(lpAmount) > 0) {
      const calc = calculateRemoveLiquidity(parseFloat(lpAmount))
      setCalculation(calc)
      setPercentage((parseFloat(lpAmount) / position.lpBalance) * 100)
    } else {
      setCalculation(null)
      setPercentage(0)
    }
  }, [lpAmount, calculateRemoveLiquidity, position.lpBalance])

  const handlePercentageClick = (percent: number) => {
    const amount = (position.lpBalance * percent) / 100
    setLpAmount(amount.toString())
  }

  const handleRemoveLiquidity = async () => {
    if (!calculation || !lpAmount) return

    try {
      await onRemoveLiquidity(parseFloat(lpAmount))
      setLpAmount('')
      setCalculation(null)
      setPercentage(0)
    } catch (error) {
      console.error('Remove liquidity failed:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Remover Liquidez do Pool {pool.tokenA.symbol}-{pool.tokenB.symbol}
      </h3>

      {/* Position Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Sua Posição</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">LP Tokens</div>
            <div className="font-medium">{position.lpBalance.toFixed(6)}</div>
          </div>
          <div>
            <div className="text-gray-500">Share do Pool</div>
            <div className="font-medium">{position.sharePercentage.toFixed(4)}%</div>
          </div>
          <div>
            <div className="text-gray-500">{pool.tokenA.symbol}</div>
            <div className="font-medium">{position.tokenAAmount.toFixed(6)}</div>
          </div>
          <div>
            <div className="text-gray-500">{pool.tokenB.symbol}</div>
            <div className="font-medium">{position.tokenBAmount.toFixed(6)}</div>
          </div>
        </div>
      </div>

      {/* Amount to Remove */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantidade de LP Tokens para remover
        </label>
        <div className="relative">
          <input
            type="number"
            value={lpAmount}
            onChange={(e) => setLpAmount(e.target.value)}
            placeholder="0.0"
            max={position.lpBalance}
            className="w-full p-4 pr-20 text-right text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-2">
            <button
              onClick={() => setLpAmount(position.lpBalance.toString())}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              MAX
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Disponível: {position.lpBalance.toFixed(6)} LP
        </div>
      </div>

      {/* Percentage Buttons */}
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          {[25, 50, 75, 100].map(percent => (
            <button
              key={percent}
              onClick={() => handlePercentageClick(percent)}
              className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                Math.abs(percentage - percent) < 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {percent}%
            </button>
          ))}
        </div>
        {percentage > 0 && (
          <div className="text-sm text-gray-600">
            Removendo {percentage.toFixed(1)}% da sua posição
          </div>
        )}
      </div>

      {/* Calculation Details */}
      {calculation && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <h4 className="font-medium text-gray-900 mb-2">Você receberá:</h4>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{pool.tokenA.symbol}</span>
            <span className="font-medium">{calculation.tokenAAmount.toFixed(6)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{pool.tokenB.symbol}</span>
            <span className="font-medium">{calculation.tokenBAmount.toFixed(6)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Share removida</span>
              <span className="font-medium">{(calculation.shareRemoved * 100).toFixed(4)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Remove Liquidity Button */}
      <button
        onClick={handleRemoveLiquidity}
        disabled={loading || !calculation || !lpAmount || parseFloat(lpAmount) > position.lpBalance}
        className="w-full py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processando...' : 
         !lpAmount ? 'Digite a quantidade' :
         parseFloat(lpAmount) > position.lpBalance ? 'Quantidade insuficiente' :
         'Remover Liquidez'}
      </button>

      {/* Warning */}
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          ⚠️ Ao remover liquidez, você deixará de receber as taxas de swap e recompensas 
          proporcionalmente à quantidade removida.
        </p>
      </div>
    </div>
  )
}
