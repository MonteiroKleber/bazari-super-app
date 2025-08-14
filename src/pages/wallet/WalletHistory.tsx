// src/pages/wallet/WalletHistory.tsx

import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Input, Select, Badge, Tooltip } from '@shared/ui'
import { Icons } from '@shared/ui'
import { WalletHeader } from '@features/wallet/components/WalletHeader'
import { useWallet } from '@features/wallet/hooks/useWallet'
import type { Transaction } from '@features/wallet/hooks/useWallet'

interface TransactionFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  tokenFilter: string
  onTokenFilterChange: (token: string) => void
  onClearFilters: () => void
}

const TransactionFilters: FC<TransactionFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  tokenFilter,
  onTokenFilterChange,
  onClearFilters
}) => {
  const hasFilters = searchQuery || statusFilter || tokenFilter

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Buscar por hash, endereço..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Icons.Search className="h-4 w-4 text-gray-400" />}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'success', label: 'Sucesso' },
            { value: 'failed', label: 'Falhou' },
            { value: 'pending', label: 'Pendente' }
          ]}
          className="w-full sm:w-40"
        />

        {/* Token Filter */}
        <Select
          value={tokenFilter}
          onChange={onTokenFilterChange}
          options={[
            { value: '', label: 'Todos os tokens' },
            { value: 'BZR', label: 'BZR' },
            { value: 'USDT', label: 'USDT' },
            { value: 'GAME', label: 'GAME' }
          ]}
          className="w-full sm:w-40"
        />

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="whitespace-nowrap"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    </Card>
  )
}

interface TransactionItemProps {
  transaction: Transaction
  activeAccountAddress: string
  onViewDetails: (tx: Transaction) => void
  formatAddress: (address: string) => string
  copyToClipboard: (text: string) => Promise<boolean>
}

const TransactionItem: FC<TransactionItemProps> = ({
  transaction,
  activeAccountAddress,
  onViewDetails,
  formatAddress,
  copyToClipboard
}) => {
  const [copied, setCopied] = useState<string | null>(null)

  const isOutgoing = transaction.from === activeAccountAddress
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'success': return 'Sucesso'
      case 'failed': return 'Falhou'
      case 'pending': return 'Pendente'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <Icons.Check className="h-4 w-4" />
      case 'failed': return <Icons.X className="h-4 w-4" />
      case 'pending': return <Icons.Clock className="h-4 w-4" />
      default: return <Icons.Circle className="h-4 w-4" />
    }
  }

  const formatAmount = (amount: string, token: string): string => {
    const num = parseFloat(amount)
    if (isNaN(num)) return '0.0000'
    
    return `${num.toLocaleString('pt-BR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })} ${token}`
  }

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Transaction Icon */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            transaction.status === 'success' ? 'bg-green-100' :
            transaction.status === 'failed' ? 'bg-red-100' :
            'bg-yellow-100'
          }`}>
            {isOutgoing ? (
              <Icons.ArrowUpRight className={`h-5 w-5 ${
                transaction.status === 'success' ? 'text-green-600' :
                transaction.status === 'failed' ? 'text-red-600' :
                'text-yellow-600'
              }`} />
            ) : (
              <Icons.ArrowDownLeft className={`h-5 w-5 ${
                transaction.status === 'success' ? 'text-green-600' :
                transaction.status === 'failed' ? 'text-red-600' :
                'text-yellow-600'
              }`} />
            )}
          </div>

          {/* Transaction Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">
                {isOutgoing ? 'Envio' : 'Recebimento'}
              </h4>
              <Badge 
                variant={transaction.status === 'success' ? 'success' : 
                        transaction.status === 'failed' ? 'error' : 'warning'}
                className="flex items-center space-x-1"
              >
                {getStatusIcon(transaction.status)}
                <span>{getStatusText(transaction.status)}</span>
              </Badge>
            </div>

            {/* Addresses */}
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">De:</span>
                <span className="font-mono">{formatAddress(transaction.from)}</span>
                <Tooltip content={copied === 'from' ? "Copiado!" : "Copiar endereço"}>
                  <button
                    onClick={() => handleCopy(transaction.from, 'from')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copied === 'from' ? (
                      <Icons.Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Icons.Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </Tooltip>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Para:</span>
                <span className="font-mono">{formatAddress(transaction.to)}</span>
                <Tooltip content={copied === 'to' ? "Copiado!" : "Copiar endereço"}>
                  <button
                    onClick={() => handleCopy(transaction.to, 'to')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copied === 'to' ? (
                      <Icons.Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Icons.Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Hash */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500">Hash:</span>
              <span className="text-xs font-mono text-gray-700 truncate">
                {transaction.hash}
              </span>
              <Tooltip content={copied === 'hash' ? "Copiado!" : "Copiar hash"}>
                <button
                  onClick={() => handleCopy(transaction.hash, 'hash')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {copied === 'hash' ? (
                    <Icons.Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Icons.Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </Tooltip>
            </div>

            {/* Timestamp & Block */}
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>
                {new Date(transaction.timestamp).toLocaleString('pt-BR')}
              </span>
              {transaction.blockNumber && (
                <span>Block #{transaction.blockNumber.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Amount & Actions */}
        <div className="text-right">
          <div className="mb-2">
            <p className={`font-semibold ${
              isOutgoing ? 'text-red-600' : 'text-green-600'
            }`}>
              {isOutgoing ? '-' : '+'}
              {formatAmount(transaction.amount, transaction.token)}
            </p>
            {transaction.fee && (
              <p className="text-xs text-gray-500">
                Taxa: {transaction.fee} BZR
              </p>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(transaction)}
          >
            Detalhes
          </Button>
        </div>
      </div>
    </Card>
  )
}

const TransactionStats: FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const stats = {
    total: transactions.length,
    successful: transactions.filter(tx => tx.status === 'success').length,
    failed: transactions.filter(tx => tx.status === 'failed').length,
    pending: transactions.filter(tx => tx.status === 'pending').length,
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Estatísticas</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
          <p className="text-xs text-gray-500">Sucesso</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          <p className="text-xs text-gray-500">Falhou</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pendente</p>
        </div>
      </div>
    </Card>
  )
}

export const WalletHistory: FC = () => {
  const { 
    transactions, 
    isLoadingTxs, 
    hasMoreTxs, 
    loadMoreTransactions,
    searchTransactions,
    activeAccount,
    formatAddress,
    copyToClipboard
  } = useWallet()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tokenFilter, setTokenFilter] = useState('')

  // Apply local filters to transactions
  const filteredTransactions = transactions.filter(tx => {
    if (statusFilter && tx.status !== statusFilter) return false
    if (tokenFilter && tx.token !== tokenFilter) return false
    return true
  })

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    searchTransactions(query)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setTokenFilter('')
    searchTransactions('')
  }

  const handleViewDetails = (transaction: Transaction) => {
    console.log('🔮 Transaction detail modal em breve:', transaction.id)
    // Future: Open transaction detail modal or navigate to detail page
  }

  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WalletHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-8 text-center">
            <Icons.Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione uma conta
            </h3>
            <p className="text-gray-600 mb-4">
              Para ver o histórico de transações, você precisa selecionar uma conta ativa.
            </p>
            <Link to="/wallet">
              <Button>Voltar à Wallet</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <WalletHeader title="Histórico de Transações" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Stats */}
          <TransactionStats transactions={transactions} />

          {/* Filters */}
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            tokenFilter={tokenFilter}
            onTokenFilterChange={setTokenFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Transaction List */}
          <div className="space-y-4">
            {isLoadingTxs && filteredTransactions.length === 0 ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                    </div>
                  </div>
                </Card>
              ))
            ) : filteredTransactions.length === 0 ? (
              <Card className="p-8 text-center">
                <Icons.Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || statusFilter || tokenFilter 
                    ? 'Nenhuma transação encontrada' 
                    : 'Nenhuma transação'
                  }
                </h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter || tokenFilter
                    ? 'Tente ajustar os filtros de busca'
                    : 'As transações aparecerão aqui quando disponíveis'
                  }
                </p>
              </Card>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  activeAccountAddress={activeAccount.address}
                  onViewDetails={handleViewDetails}
                  formatAddress={formatAddress}
                  copyToClipboard={copyToClipboard}
                />
              ))
            )}
          </div>

          {/* Load More Button */}
          {hasMoreTxs && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 hover:border-yellow-500 px-8"
                onClick={loadMoreTransactions}
                disabled={isLoadingTxs}
              >
                {isLoadingTxs ? (
                  <>
                    <Icons.Loader className="h-4 w-4 mr-2 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Carregar mais'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}