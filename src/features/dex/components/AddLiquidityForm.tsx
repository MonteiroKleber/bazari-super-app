// src/features/dex/components/AddLiquidityForm.tsx

import { FC, useState, useEffect } from 'react'
import { Pool, LiquidityCalculation } from '../types/dex.types'

interface AddLiquidityFormProps {
  pool: Pool
  onAddLiquidity: (amountA: number, amountB: number) => Promise<void>
  calculateAddLiquidity: (amountA: number) => LiquidityCalculation | null
  loading?: boolean
}

export const AddLiquidityForm: FC<AddLiquidityFormProps> = ({
  pool,
  onAddLiquidity,
  calculateAddLiquidity,
  loading = false
}) => {
  const [amountA, setAmountA] = useState<string>('')
  const [amountB, setAmountB] = useState<string>('')
  const [calculation, setCalculation] = useState<LiquidityCalculation | null>(null)

  // Recalcular quando amountA muda
  useEffect(() => {
    if (amountA && parseFloat(amountA) > 0) {
      const calc = calculateAddLiquidity(parseFloat(amountA))
      setCalculation(calc)
      if (calc) {
        setAmountB(calc.tokenBRequired.toFixed(8))
      }
    } else {
      setCalculation(null)
      setAmountB('')
    }
  }, [amountA, calculateAddLiquidity])

  const handleMaxA = () => {
    // TODO: Integrar com saldos reais da wallet
    const mockBalance = pool.tokenA.symbol === 'BZR' ? 50000 : 12500
    setAmountA(mockBalance.toString())
  }

  const handleMaxB = () => {
    // TODO: Integrar com saldos reais da wallet
    const mockBalance = pool.tokenB.symbol === 'BZR' ? 50000 : 12500
    setAmountB(mockBalance.toString())
  }

  const handleAddLiquidity = async () => {
    if (!calculation || !amountA || !amountB) return

    try {
      await onAddLiquidity(parseFloat(amountA), parseFloat(amountB))
      setAmountA('')
      setAmountB('')
      setCalculation(null)
    } catch (error) {
      console.error('Add liquidity failed:', error)
    }
  }

  const getMockBalance = (symbol: string): number => {
    return symbol === 'BZR' ? 50000 : 12500
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Adicionar Liquidez ao Pool {pool.tokenA.symbol}-{pool.tokenB.symbol}
      </h3>

      {/* Token A Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {pool.tokenA.symbol}
        </label>
        <div className="relative">
          <input
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            placeholder="0.0"
            className="w-full p-4 pr-32 text-right text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-2 flex items-center gap-2">
            <button
              onClick={handleMaxA}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              MAX
            </button>
            <span className="px-3 py-2 bg-gray-100 rounded-lg font-medium">
              {pool.tokenA.symbol}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Saldo: {getMockBalance(pool.tokenA.symbol).toLocaleString()} {pool.tokenA.symbol}
        </div>
      </div>

      {/* Plus Icon */}
      <div className="flex justify-center my-4">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          +
        </div>
      </div>

      {/* Token B Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {pool.tokenB.symbol}
        </label>
        <div className="relative">
          <input
            type="number"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}
            placeholder="0.0"
            readOnly={!!calculation}
            className="w-full p-4 pr-32 text-right text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
          <div className="absolute right-2 top-2 flex items-center gap-2">
            <button
              onClick={handleMaxB}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              MAX
            </button>
            <span className="px-3 py-2 bg-gray-100 rounded-lg font-medium">
              {pool.tokenB.symbol}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Saldo: {getMockBalance(pool.tokenB.symbol).toLocaleString()} {pool.tokenB.symbol}
        </div>
      </div>

      {/* Calculation Details */}
      {calculation && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">LP Tokens recebidos</span>
            <span className="font-medium">{calculation.lpTokens.toFixed(6)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Share do pool</span>
            <span className="font-medium">{calculation.sharePercentage.toFixed(4)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Preço {pool.tokenA.symbol}/{pool.tokenB.symbol}</span>
            <span className="font-medium">{calculation.priceA.toFixed(6)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Preço {pool.tokenB.symbol}/{pool.tokenA.symbol}</span>
            <span className="font-medium">{calculation.priceB.toFixed(6)}</span>
          </div>
        </div>
      )}

      {/* Add Liquidity Button */}
      <button
        onClick={handleAddLiquidity}
        disabled={loading || !calculation || !amountA || !amountB}
        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processando...' : 
         !amountA || !amountB ? 'Digite as quantidades' :
         'Adicionar Liquidez'}
      </button>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 Ao adicionar liquidez, você receberá LP tokens que representam sua participação no pool 
          e dão direito a uma parte das taxas de swap e recompensas.
        </p>
      </div>
    </div>
  )
}
