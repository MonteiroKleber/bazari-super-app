// src/pages/wallet/WalletStaking.tsx

import { FC, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Input, Select, Tooltip, Badge } from '@shared/ui'
import { Icons } from '@shared/ui'
import { WalletHeader } from '@features/wallet/components/WalletHeader'
import { useWallet } from '@features/wallet/hooks/useWallet'

// Mock validators data
const MOCK_VALIDATORS = [
  {
    address: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    name: 'Validator Alice',
    commission: '5.00',
    totalStaked: '1,250,000',
    isActive: true,
    apy: '12.5'
  },
  {
    address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    name: 'Validator Bob',
    commission: '3.50',
    totalStaked: '890,000',
    isActive: true,
    apy: '14.2'
  },
  {
    address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
    name: 'Validator Charlie',
    commission: '7.00',
    totalStaked: '750,000',
    isActive: true,
    apy: '11.8'
  },
  {
    address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
    name: 'Validator Dave',
    commission: '4.25',
    totalStaked: '680,000',
    isActive: false,
    apy: '0'
  }
]

interface StakingInfoCardProps {
  bzrBalance: string
  stakingInfo: any
}

const StakingInfoCard: FC<StakingInfoCardProps> = ({ bzrBalance, stakingInfo }) => {
  const formatBalance = (amount: string): string => {
    const num = parseFloat(amount)
    if (isNaN(num)) return '0.0000'
    
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icons.TrendingUp className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-primary-900">
            Informações de Staking
          </h3>
        </div>
        <Tooltip content="Atualizar informações">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-200"
          >
            <Icons.RefreshCw className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 rounded-lg p-4">
          <p className="text-sm text-primary-600 mb-1">Saldo Disponível</p>
          <p className="text-xl font-bold text-primary-900">
            {formatBalance(bzrBalance)} BZR
          </p>
          <p className="text-xs text-primary-600">
            Disponível para staking
          </p>
        </div>

        <div className="bg-white/70 rounded-lg p-4">
          <p className="text-sm text-primary-600 mb-1">Total em Staking</p>
          <p className="text-xl font-bold text-primary-900">
            {formatBalance(stakingInfo?.stakedAmount || '0')} BZR
          </p>
          <p className="text-xs text-primary-600">
            Quantidade delegada
          </p>
        </div>

        <div className="bg-white/70 rounded-lg p-4">
          <p className="text-sm text-primary-600 mb-1">Recompensas Acumuladas</p>
          <p className="text-xl font-bold text-green-700">
            {formatBalance(stakingInfo?.rewardsEarned || '0')} BZR
          </p>
          <p className="text-xs text-primary-600">
            Pronto para claim
          </p>
        </div>

        <div className="bg-white/70 rounded-lg p-4">
          <p className="text-sm text-primary-600 mb-1">APY Estimado</p>
          <p className="text-xl font-bold text-primary-900">
            ~12.5%
          </p>
          <p className="text-xs text-primary-600">
            Retorno anual estimado
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3">
        <Tooltip content="Em breve">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-primary-300 text-primary-700 hover:bg-primary-200"
            disabled
          >
            <Icons.Plus className="h-4 w-4 mr-1" />
            Claim
          </Button>
        </Tooltip>

        <Tooltip content="Em breve">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-primary-300 text-primary-700 hover:bg-primary-200"
            disabled
          >
            <Icons.Minus className="h-4 w-4 mr-1" />
            Unstake
          </Button>
        </Tooltip>
      </div>
    </Card>
  )
}

interface StakingFormProps {
  bzrBalance: string
  onStake: (amount: string, validatorAddress: string) => void
}

const StakingForm: FC<StakingFormProps> = ({ bzrBalance, onStake }) => {
  const [amount, setAmount] = useState('')
  const [selectedValidator, setSelectedValidator] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validatorOptions = MOCK_VALIDATORS
    .filter(v => v.isActive)
    .map(v => ({
      value: v.address,
      label: `${v.name} (${v.commission}% comissão)`
    }))

  const maxAmount = parseFloat(bzrBalance) || 0
  const stakeAmount = parseFloat(amount) || 0
  const isValidAmount = stakeAmount > 0 && stakeAmount <= maxAmount && stakeAmount >= 10

  const handleMaxClick = () => {
    const max = Math.max(0, maxAmount - 0.1) // Reserve some for fees
    setAmount(max.toFixed(4))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidAmount || !selectedValidator) return

    setIsSubmitting(true)
    
    try {
      await onStake(amount, selectedValidator)
      setAmount('')
      setSelectedValidator('')
      console.log('✅ Staking simulado com sucesso!')
    } catch (error) {
      console.error('❌ Erro no staking:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icons.Plus className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Delegar BZR
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Quantidade
            </label>
            <button
              type="button"
              onClick={handleMaxClick}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Usar máximo
            </button>
          </div>
          <Input
            type="number"
            placeholder="0.0000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="10"
            max={maxAmount}
            rightElement={
              <span className="text-sm text-gray-500 pr-3">BZR</span>
            }
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mínimo: 10 BZR</span>
            <span>Disponível: {parseFloat(bzrBalance).toFixed(4)} BZR</span>
          </div>
        </div>

        {/* Validator Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecionar Validador
          </label>
          <Select
            options={validatorOptions}
            value={selectedValidator}
            onChange={setSelectedValidator}
            placeholder="Escolha um validador..."
          />
        </div>

        {/* Selected Validator Info */}
        {selectedValidator && (
          <div className="bg-gray-50 rounded-lg p-4">
            {(() => {
              const validator = MOCK_VALIDATORS.find(v => v.address === selectedValidator)
              if (!validator) return null
              
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {validator.name}
                    </span>
                    <Badge variant={validator.isActive ? 'success' : 'error'}>
                      {validator.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Comissão:</span>
                      <span className="block font-medium">{validator.commission}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Staked:</span>
                      <span className="block font-medium">{validator.totalStaked} BZR</span>
                    </div>
                    <div>
                      <span className="text-gray-500">APY:</span>
                      <span className="block font-medium">{validator.apy}%</span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Estimated Returns */}
        {isValidAmount && selectedValidator && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-2">
              Retornos Estimados
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700">Recompensa diária:</span>
                <span className="block font-medium text-green-900">
                  ~{(stakeAmount * 0.125 / 365).toFixed(4)} BZR
                </span>
              </div>
              <div>
                <span className="text-green-700">Recompensa anual:</span>
                <span className="block font-medium text-green-900">
                  ~{(stakeAmount * 0.125).toFixed(4)} BZR
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icons.AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Período de desbloqueio</p>
              <p>Tokens delegados ficam bloqueados por 28 dias após solicitar unstake.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Tooltip content="Função mockada - Em breve integração real">
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={!isValidAmount || !selectedValidator || isSubmitting}
          >
            {isSubmitting ? 'Processando...' : 'Delegar BZR'}
          </Button>
        </Tooltip>
      </form>
    </Card>
  )
}

const ValidatorList: FC = () => {
  const [sortBy, setSortBy] = useState('apy')

  const sortedValidators = useMemo(() => {
    return [...MOCK_VALIDATORS].sort((a, b) => {
      switch (sortBy) {
        case 'commission':
          return parseFloat(a.commission) - parseFloat(b.commission)
        case 'totalStaked':
          return parseFloat(b.totalStaked.replace(/,/g, '')) - parseFloat(a.totalStaked.replace(/,/g, ''))
        case 'apy':
        default:
          return parseFloat(b.apy) - parseFloat(a.apy)
      }
    })
  }, [sortBy])

  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Validadores Disponíveis
          </h3>
          <Select
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'apy', label: 'APY' },
              { value: 'commission', label: 'Comissão' },
              { value: 'totalStaked', label: 'Total Staked' }
            ]}
            className="w-40"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedValidators.map((validator) => (
          <div key={validator.address} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  validator.isActive ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {validator.name}
                    </h4>
                    <Badge variant={validator.isActive ? 'success' : 'error'}>
                      {validator.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {validator.address.slice(0, 8)}...{validator.address.slice(-8)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-right">
                  <p className="text-gray-500">APY</p>
                  <p className="font-medium text-green-600">{validator.apy}%</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Comissão</p>
                  <p className="font-medium">{validator.commission}%</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Total Staked</p>
                  <p className="font-medium">{validator.totalStaked} BZR</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export const WalletStaking: FC = () => {
  const { tokens, activeAccount } = useWallet()

  // Get BZR balance
  const bzrToken = tokens.find(token => token.isNative || token.symbol === 'BZR')
  const bzrBalance = bzrToken?.amount || '0'

  // Mock staking info
  const stakingInfo = {
    stakedAmount: '100.0000',
    rewardsEarned: '5.2341',
    unbondingAmount: '0.0000',
  }

  const handleStake = async (amount: string, validatorAddress: string) => {
    // Mock function - would integrate with substrate client
    console.log('🥩 Mock staking:', { amount, validatorAddress })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Would call: walletService.stake(amount, validatorAddress)
    /*
    // IMPLEMENTAÇÃO REAL COMENTADA:
    // const txHash = await walletService.stake(amount, validatorAddress)
    // console.log('✅ Staking transaction:', txHash)
    */
  }

  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WalletHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-8 text-center">
            <Icons.TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione uma conta
            </h3>
            <p className="text-gray-600 mb-4">
              Para começar a fazer staking, você precisa selecionar uma conta ativa.
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
      <WalletHeader title="Staking & Delegação" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Staking Form */}
          <div className="lg:col-span-1 space-y-6">
            <StakingForm 
              bzrBalance={bzrBalance}
              onStake={handleStake}
            />
          </div>

          {/* Right Column - Info & Validators */}
          <div className="lg:col-span-2 space-y-6">
            {/* Staking Info */}
            <StakingInfoCard 
              bzrBalance={bzrBalance}
              stakingInfo={stakingInfo}
            />

            {/* Validator List */}
            <ValidatorList />
          </div>
        </div>
      </div>
    </div>
  )
}