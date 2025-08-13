import { FC } from 'react'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface StepTypeProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepType: FC<StepTypeProps> = ({ data, onUpdate }) => {
  const productTypes = [
    {
      id: 'curso',
      name: 'Curso Online',
      description: 'Curso em vídeo com certificado NFT',
      icon: Icons.GraduationCap,
      category: 'cursos-tokenizados'
    },
    {
      id: 'ebook',
      name: 'E-book',
      description: 'Livro digital tokenizado',
      icon: Icons.Book,
      category: 'ebooks-digitais'
    },
    {
      id: 'software',
      name: 'Software',
      description: 'Aplicativo ou ferramenta digital',
      icon: Icons.Code,
      category: 'software'
    },
    {
      id: 'nft',
      name: 'NFT / Arte',
      description: 'Arte digital ou colecionável',
      icon: Icons.Image,
      category: 'colecionaveis-digitais'
    }
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Que tipo de produto digital você quer criar?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productTypes.map((type) => (
          <Card
            key={type.id}
            className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
              data.type === type.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUpdate({ 
              type: type.id,
              category: type.category 
            })}
          >
            <div className="text-center">
              <type.icon className={`w-12 h-12 mx-auto mb-4 ${
                data.type === type.id ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {type.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {type.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}