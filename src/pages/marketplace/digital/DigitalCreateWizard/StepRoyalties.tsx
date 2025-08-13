import { FC } from 'react'
import { Input } from '@shared/ui/Input'
import { Card } from '@shared/ui/Card'

interface StepRoyaltiesProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepRoyalties: FC<StepRoyaltiesProps> = ({ data, onUpdate }) => {
  const presetRoyalties = [0, 2.5, 5, 7.5, 10, 15]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Porcentagem de royalties nas revendas
      </h2>
      
      <p className="text-gray-600">
        Você receberá esta porcentagem cada vez que seu produto for revendido na DEX
      </p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {presetRoyalties.map((percentage) => (
          <Card
            key={percentage}
            className={`p-4 text-center cursor-pointer border-2 transition-all hover:shadow-lg ${
              data.royaltiesPct === percentage
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUpdate({ royaltiesPct: percentage })}
          >
            <p className={`text-2xl font-bold ${
              data.royaltiesPct === percentage ? 'text-primary-600' : 'text-gray-700'
            }`}>
              {percentage}%
            </p>
          </Card>
        ))}
      </div>

      <div className="max-w-md mx-auto">
        <Input
          type="number"
          label="Ou defina uma porcentagem personalizada"
          value={data.royaltiesPct}
          onChange={(e) => onUpdate({ royaltiesPct: parseFloat(e.target.value) || 0 })}
          placeholder="Ex: 8.5"
          min="0"
          max="25"
          step="0.1"
        />
        <p className="text-sm text-gray-600 mt-2">
          Máximo: 25% | Recomendado: 5-10%
        </p>
      </div>
    </div>
  )
}