// src/pages/dex/DexSwap.tsx

import { FC } from 'react'
import { useDEX, useSwap } from '@features/dex/hooks/useDEX'
import { SwapForm } from '@features/dex/components'

export const DexSwap: FC = () => {
  const { pools, swap, calculateSwap, loading } = useDEX()
  const swapHook = useSwap()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Swap de Tokens
        </h1>
        <p className="text-gray-600">
          Troque tokens da BazariChain com liquidez descentralizada
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Swap Interface */}
        <div className="lg:col-span-2">
          <SwapForm
            pools={pools}
            onSwap={swap}
            calculateSwap={calculateSwap}
            loading={loading}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pool Info */}
          {swapHook.selectedPool && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pool Selecionado</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Par</span>
                  <span className="font-medium">
                    {swapHook.pools.find(p => p.id === swapHook.selectedPool)?.tokenA.symbol}-
                    {swapHook.pools.find(p => p.id === swapHook.selectedPool)?.tokenB.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de swap</span>
                  <span className="font-medium">
                    {((swapHook.pools.find(p => p.id === swapHook.selectedPool)?.swapFee || 0) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TVL</span>
                  <span className="font-medium">
                    {(swapHook.pools.find(p => p.id === swapHook.selectedPool)?.tvl || 0).toLocaleString()} BZR
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Price Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Informações de Preço</h3>
            {swapHook.calculation ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de câmbio</span>
                  <span className="font-medium">
                    1 {swapHook.tokenIn} = {swapHook.calculation.rate.toFixed(6)} {swapHook.tokenOut}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impacto no preço</span>
                  <span className={`font-medium ${
                    swapHook.calculation.priceImpact < 0.01 ? 'text-green-600' :
                    swapHook.calculation.priceImpact < 0.03 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {(swapHook.calculation.priceImpact * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de swap</span>
                  <span className="font-medium">
                    {swapHook.calculation.fee.toFixed(6)} {swapHook.tokenIn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mínimo recebido</span>
                  <span className="font-medium">
                    {swapHook.minAmountOut.toFixed(6)} {swapHook.tokenOut}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Digite uma quantidade para ver os detalhes do preço
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">💡 Dicas de Swap</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Verifique o impacto no preço antes de fazer grandes swaps</li>
              <li>• Ajuste a tolerância ao slippage conforme necessário</li>
              <li>• Pools com mais liquidez têm menores impactos no preço</li>
              <li>• As taxas de swap são distribuídas aos provedores de liquidez</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}