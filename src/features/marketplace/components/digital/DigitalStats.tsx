import { FC } from 'react'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface DigitalStatsProps {
  stats: {
    totalDigitals: number
    totalCreators: number
    totalTransactions: number
    totalVolume: number
  }
}

export const DigitalStats: FC<DigitalStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      <Card className="p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icons.Zap className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {stats.totalDigitals.toLocaleString()}
        </h3>
        <p className="text-gray-600 text-sm">Produtos Digitais</p>
      </Card>

      <Card className="p-6 text-center">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icons.Users className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {stats.totalCreators.toLocaleString()}
        </h3>
        <p className="text-gray-600 text-sm">Criadores Ativos</p>
      </Card>

      <Card className="p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icons.Activity className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {stats.totalTransactions.toLocaleString()}
        </h3>
        <p className="text-gray-600 text-sm">Transações</p>
      </Card>

      <Card className="p-6 text-center">
        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icons.TrendingUp className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {stats.totalVolume.toFixed(1)}k
        </h3>
        <p className="text-gray-600 text-sm">Volume BZR</p>
      </Card>

    </div>
  )
}