// src/pages/dao/DaoTreasury.tsx

import { FC, useState } from 'react'
import { useTreasury } from '@features/dao/hooks/useDAO'
import { TreasuryWidget } from '@features/dao/components'

export const DaoTreasury: FC = () => {
  const { balance, history, loading } = useTreasury()
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [typeFilter, setTypeFilter] = useState<'all' | 'inflow' | 'outflow'>('all')

  const getFilteredHistory = () => {
    let filtered = history

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(entry => entry.type === typeFilter)
    }

    // Filtro por tempo
    if (timeFilter !== 'all') {
      const days = parseInt(timeFilter.replace('d', ''))
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(entry => entry.timestamp >= cutoffTime)
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp)
  }

  const filteredHistory = getFilteredHistory()

  const getTotalsByPeriod = () => {
    const inflows = filteredHistory.filter(e => e.type === 'inflow')
    const outflows = filteredHistory.filter(e => e.type === 'outflow')

    return {
      totalInflow: inflows.reduce((sum, e) => sum + e.amount, 0),
      totalOutflow: outflows.reduce((sum, e) => sum + e.amount, 0),
      netFlow: inflows.reduce((sum, e) => sum + e.amount, 0) - outflows.reduce((sum, e) => sum + e.amount, 0)
    }
  }

  const periodStats = getTotalsByPeriod()

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number, token: string): string => {
    return `${amount.toLocaleString()} ${token}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tesouro da DAO
        </h1>
        <p className="text-gray-600">
          Gestão transparente dos recursos da comunidade Bazari
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Period Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Entradas</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(periodStats.totalInflow, 'BZR')}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {timeFilter === 'all' ? 'Total histórico' : `Últimos ${timeFilter}`}
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Saídas</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(periodStats.totalOutflow, 'BZR')}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {timeFilter === 'all' ? 'Total histórico' : `Últimos ${timeFilter}`}
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Fluxo Líquido</div>
              <div className={`text-2xl font-bold ${
                periodStats.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {periodStats.netFlow >= 0 ? '+' : ''}{formatCurrency(periodStats.netFlow, 'BZR')}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {timeFilter === 'all' ? 'Total histórico' : `Últimos ${timeFilter}`}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Time Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Período:</span>
                <div className="flex space-x-1">
                  {[
                    { key: '7d', label: '7 dias' },
                    { key: '30d', label: '30 dias' },
                    { key: '90d', label: '90 dias' },
                    { key: 'all', label: 'Todos' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTimeFilter(key as typeof timeFilter)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        timeFilter === key
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tipo:</span>
                <div className="flex space-x-1">
                  {[
                    { key: 'all', label: 'Todos' },
                    { key: 'inflow', label: 'Entradas' },
                    { key: 'outflow', label: 'Saídas' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTypeFilter(key as typeof typeFilter)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        typeFilter === key
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Histórico de Transações ({filteredHistory.length})
              </h2>
            </div>
            
            {filteredHistory.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredHistory.map((entry) => (
                  <div key={entry.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          entry.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900">
                            {entry.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(entry.timestamp)}
                          </div>
                          {entry.proposalId && (
                            <div className="text-xs text-blue-600 mt-1">
                              Proposta #{entry.proposalId.split('-')[1]}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${
                          entry.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {entry.type === 'inflow' ? '+' : '-'}{formatCurrency(entry.amount, entry.token)}
                        </div>
                        {entry.txHash && (
                          <div className="text-xs text-gray-500 mt-1 font-mono">
                            {entry.txHash.slice(0, 10)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-2">📊</div>
                <div className="text-gray-600">Nenhuma transação encontrada</div>
                <div className="text-sm text-gray-500 mt-1">
                  Tente ajustar os filtros de período e tipo
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Balance */}
          <TreasuryWidget balance={balance} compact />

          {/* Treasury Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sobre o Tesouro</h3>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                O tesouro da DAO é gerenciado pela comunidade através de propostas 
                de governança. Todos os gastos devem ser aprovados por votação.
              </p>
              <p>
                As principais fontes de receita incluem taxas de protocolo, 
                penalidades de slashing e doações da comunidade.
              </p>
              <div className="bg-blue-50 rounded-lg p-3 mt-4">
                <div className="text-sm font-medium text-blue-900 mb-1">
                  💡 Propor Uso
                </div>
                <div className="text-xs text-blue-700">
                  Você pode criar uma proposta para usar recursos do tesouro 
                  em benefício da comunidade.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de transações</span>
                <span className="font-medium">{history.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Propostas executadas</span>
                <span className="font-medium">
                  {history.filter(e => e.proposalId).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última atualização</span>
                <span className="font-medium">
                  {formatDate(balance.lastUpdated)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

