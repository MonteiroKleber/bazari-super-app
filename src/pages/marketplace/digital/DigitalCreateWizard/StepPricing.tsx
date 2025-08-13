import { FC } from 'react'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'

interface StepPricingProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepPricing: FC<StepPricingProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Defina o preço do seu produto
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Input
            type="number"
            label="Preço"
            value={data.price}
            onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Select
            label="Moeda"
            value={data.currency}
            onChange={(value) => onUpdate({ currency: value })}
          >
            <option value="BZR">BZR</option>
            <option value="USD">USD</option>
          </Select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Preço de venda:</span>
          <span className="font-medium">{data.price} {data.currency}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxa da plataforma (2.5%):</span>
          <span>-{(data.price * 0.025).toFixed(2)} {data.currency}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxa de gas (estimada):</span>
          <span>-0.01 {data.currency}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Você receberá:</span>
          <span>{(data.price * 0.975 - 0.01).toFixed(2)} {data.currency}</span>
        </div>
      </div>
    </div>
  )
}