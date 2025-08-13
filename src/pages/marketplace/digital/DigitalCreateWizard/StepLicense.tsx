import { FC } from 'react'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface StepLicenseProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepLicense: FC<StepLicenseProps> = ({ data, onUpdate }) => {
  const licenses = [
    {
      id: 'lifetime',
      name: 'Acesso Vitalício',
      description: 'O comprador terá acesso permanente',
      icon: Icons.Infinity,
      recommended: true
    },
    {
      id: 'days90',
      name: '90 Dias',
      description: 'Acesso por 90 dias após a compra',
      icon: Icons.Calendar
    },
    {
      id: 'days30',
      name: '30 Dias',
      description: 'Acesso por 30 dias após a compra',
      icon: Icons.Clock
    }
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Tipo de licença para seu produto
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {licenses.map((license) => (
          <Card
            key={license.id}
            className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg relative ${
              data.license === license.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUpdate({ license: license.id })}
          >
            {license.recommended && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
            )}
            <div className="text-center">
              <license.icon className={`w-12 h-12 mx-auto mb-4 ${
                data.license === license.id ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {license.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {license.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}