// src/features/dao/components/TreasuryWidget.tsx

import { FC } from 'react'
import { TreasuryBalance, TreasuryEntry } from '../types/dao.types'

interface TreasuryWidgetProps {
  balance: TreasuryBalance
  recentEntries?: TreasuryEntry[]
  compact?: boolean
}

export const TreasuryWidget: FC<TreasuryWidgetProps> = ({
  balance,
  recentEntries = [],
  compact = false
}) => {
  const formatCurrency = (amount: number, token: string): string => {
    return `${amount.toLocaleString()} ${token}`
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
        <h3 className="font-medium mb-3">Tesouro da DAO</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm opacity-90">BZR</div>
            <div className="text-xl font-bold">{balance.BZR.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm opacity-90">ZARI</div>
            <div className="text-xl font-bold">{balance.ZARI.toLocaleString()}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-lg">
        <h3 className="font-semibold text-lg mb-4">Tesouro da DAO</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm opacity-90 mb-1">Saldo do Tesouro</div>
            <div className="text-2xl font-bold">{formatCurrency(balance.BZR, 'BZR')}</div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">BZR em stake (governança)</div>
            <div className="text-2xl font-bold">{formatCurrency(balance.ZARI, 'BZR')}</div>
          </div>
        </div>
        <div className="text-xs opacity-75 mt-4">
          Última atualização: {formatDate(balance.lastUpdated)}
        </div>
      </div>

      {/* Atividades Recentes */}
      {recentEntries.length > 0 && (
        <div className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Atividades Recentes</h4>
          <div className="space-y-3">
            {recentEntries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    entry.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {entry.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  entry.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {entry.type === 'inflow' ? '+' : '-'}{formatCurrency(entry.amount, entry.token)}
                </div>
              </div>
            ))}
          </div>
          
          {recentEntries.length > 5 && (
            <button className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 transition-colors">
              Ver todas as atividades
            </button>
          )}
        </div>
      )}

      {recentEntries.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <div className="text-sm">Nenhuma atividade recente</div>
        </div>
      )}
    </div>
  )
}
