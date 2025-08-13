import { FC } from 'react'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

interface StepReviewProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepReview: FC<StepReviewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Revise as informações do seu produto
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Preview do Produto</h3>
          
          <div className="space-y-4">
            {data.coverImage && (
              <img 
                src={URL.createObjectURL(data.coverImage)}
                alt="Cover"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {data.title}
              </h4>
              <p className="text-gray-600 mt-2 line-clamp-3">
                {data.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>Tokenizado</Badge>
              {data.royaltiesPct > 0 && <Badge>Royalties {data.royaltiesPct}%</Badge>}
              <Badge>{data.license === 'lifetime' ? 'Vitalícia' : `${data.license.replace('days', '')} dias`}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {data.price} {data.currency}
              </span>
              <span className="text-sm text-gray-600">
                {data.isUnlimited ? 'Ilimitado' : `${data.supply} unidades`}
              </span>
            </div>
          </div>
        </Card>

        {/* Details */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Detalhes Técnicos</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">{data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium">{data.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arquivos:</span>
                <span className="font-medium">{data.files.length} arquivo(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Licença:</span>
                <span className="font-medium">
                  {data.license === 'lifetime' ? 'Vitalícia' : `${data.license.replace('days', '')} dias`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supply:</span>
                <span className="font-medium">
                  {data.isUnlimited ? 'Ilimitado' : `${data.supply} unidades`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Royalties:</span>
                <span className="font-medium">{data.royaltiesPct}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Resumo Financeiro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Preço de venda:</span>
                <span>{data.price} {data.currency}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa da plataforma:</span>
                <span>-{(data.price * 0.025).toFixed(2)} {data.currency}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de gas:</span>
                <span>~0.01 {data.currency}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Você receberá:</span>
                <span>{(data.price * 0.975 - 0.01).toFixed(2)} {data.currency}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}