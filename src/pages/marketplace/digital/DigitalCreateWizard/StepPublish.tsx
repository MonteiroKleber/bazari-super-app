import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface StepPublishProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepPublish: FC<StepPublishProps> = ({ data }) => {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [txHash, setTxHash] = useState('')

  const handlePublish = async () => {
    setIsPublishing(true)
    
    // Simular processo de publicação
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock transaction hash
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
    setTxHash(mockTxHash)
    setIsPublished(true)
    setIsPublishing(false)
  }

  const handleViewProduct = () => {
    // Mock product ID
    const productId = 'digital_' + Date.now()
    navigate(`/marketplace/digitais/produto/${productId}`)
  }

  if (isPublished) {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Icons.Check className="w-12 h-12 text-green-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Produto Publicado com Sucesso! 🎉
          </h2>
          <p className="text-gray-600">
            Seu produto digital foi tokenizado e está disponível no marketplace
          </p>
        </div>

        <Card className="p-6 bg-gray-50">
          <h3 className="font-semibold mb-4">Detalhes da Transação</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Token ID:</span>
              <span className="font-mono">digital_{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction Hash:</span>
              <span className="font-mono text-xs">{txHash}</span>
            </div>
            <div className="flex justify-between">
              <span>Blockchain:</span>
              <span>BazariChain</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleViewProduct}>
            <Icons.Eye className="w-4 h-4 mr-2" />
            Ver Produto
          </Button>
          <Button variant="outline" onClick={() => navigate('/marketplace/digitais')}>
            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Marketplace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Tudo pronto para publicar!
        </h2>
        <p className="text-gray-600 mb-8">
          Clique em "Publicar e Assinar" para tokenizar seu produto e disponibilizá-lo no marketplace
        </p>
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          ⚡ O que acontecerá agora:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Seus arquivos serão enviados para o IPFS</li>
          <li>• Um token será criado na BazariChain</li>
          <li>• Seu produto ficará disponível no marketplace</li>
          <li>• Você poderá acompanhar as vendas e royalties</li>
        </ul>
      </Card>

      <Button
        onClick={handlePublish}
        loading={isPublishing}
        size="lg"
        className="bg-green-600 hover:bg-green-700"
        disabled={isPublishing}
      >
        {isPublishing ? (
          <>
            <Icons.Loader className="w-5 h-5 mr-2 animate-spin" />
            Publicando...
          </>
        ) : (
          <>
            <Icons.Upload className="w-5 h-5 mr-2" />
            Publicar e Assinar (mock)
          </>
        )}
      </Button>

      {isPublishing && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Publicando seu produto digital...
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '66%' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}