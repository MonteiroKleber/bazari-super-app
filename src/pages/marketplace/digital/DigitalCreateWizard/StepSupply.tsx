import { FC } from 'react'
import { Input } from '@shared/ui/Input'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface StepSupplyProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepSupply: FC<StepSupplyProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Quantidade disponível
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unlimited */}
        <Card
          className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
            data.isUnlimited
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onUpdate({ isUnlimited: true, supply: 0 })}
        >
          <div className="text-center">
            <Icons.Infinity className={`w-12 h-12 mx-auto mb-4 ${
              data.isUnlimited ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ilimitado
            </h3>
            <p className="text-gray-600 text-sm">
              Pode ser vendido quantas vezes quiser
            </p>
          </div>
        </Card>

        {/* Limited */}
        <Card
          className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
            !data.isUnlimited
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onUpdate({ isUnlimited: false })}
        >
          <div className="text-center">
            <Icons.Hash className={`w-12 h-12 mx-auto mb-4 ${
              !data.isUnlimited ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Limitado
            </h3>
            <p className="text-gray-600 text-sm">
              Edição limitada com escassez
            </p>
          </div>
        </Card>
      </div>

      {!data.isUnlimited && (
        <div className="max-w-md mx-auto">
          <Input
            type="number"
            label="Quantidade Disponível"
            value={data.supply}
            onChange={(e) => onUpdate({ supply: parseInt(e.target.value) || 1 })}
            placeholder="Ex: 100"
            min="1"
          />
          <p className="text-sm text-gray-600 mt-2">
            Cada unidade será um token único (NFT)
          </p>
        </div>
      )}
    </div>
  )
}