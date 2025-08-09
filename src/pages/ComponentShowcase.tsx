import React, { useState } from 'react'
import { 
  Button, 
  Input, 
  Card, 
  Modal, 
  Badge, 
  Tooltip, 
  Loading, 
  Tabs,
  Select,
  Textarea,
  Icons
} from '@shared/ui'
import { useModal, useToast, useToastActions } from '@shared/hooks'
import { ToastContainer } from '@shared/ui/Toast'

const ComponentShowcase: React.FC = () => {
  const modal = useModal()
  const { toasts } = useToast()
  const toast = useToastActions()
  const [activeTab, setActiveTab] = useState('buttons')

  const tabs = [
    {
      id: 'buttons',
      label: 'Buttons',
      icon: <Icons.Plus size={16} />,
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" onClick={() => toast.success('Botão primário clicado!')}>
              Primary
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button loading>Loading</Button>
            <Button leftIcon={<Icons.Heart size={16} />}>With Icon</Button>
            <Button rightIcon={<Icons.ArrowRight size={16} />}>Next</Button>
          </div>
        </div>
      )
    },
    {
      id: 'inputs',
      label: 'Inputs',
      icon: <Icons.Settings size={16} />,
      content: (
        <div className="space-y-6 max-w-md">
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            leftIcon={<Icons.User size={16} />}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error="Email é obrigatório"
          />
          
          <Select
            label="País"
            placeholder="Selecione um país"
            options={[
              { value: 'br', label: 'Brasil' },
              { value: 'us', label: 'Estados Unidos' },
              { value: 'es', label: 'Espanha' }
            ]}
          />
          
          <Textarea
            label="Mensagem"
            placeholder="Digite sua mensagem..."
            rows={4}
          />
        </div>
      )
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: <Icons.Info size={16} />,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success" dot>Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger" removable onRemove={() => console.log('Removed')}>
                Removable
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Toast Messages</h3>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => toast.success('Operação realizada com sucesso!')}>
                Success Toast
              </Button>
              <Button size="sm" onClick={() => toast.error('Erro ao processar!')}>
                Error Toast
              </Button>
              <Button size="sm" onClick={() => toast.warning('Atenção: verifique os dados!')}>
                Warning Toast
              </Button>
              <Button size="sm" onClick={() => toast.info('Nova atualização disponível!')}>
                Info Toast
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Loading States</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Loading variant="spinner" />
              <Loading variant="dots" />
              <Loading variant="bars" />
              <Loading variant="pulse" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'overlays',
      label: 'Overlays',
      icon: <Icons.Settings size={16} />,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Modal</h3>
            <Button onClick={modal.open}>Abrir Modal</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Tooltips</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="Este é um tooltip informativo">
                <Button variant="outline">Hover me</Button>
              </Tooltip>
              
              <Tooltip content="Tooltip à esquerda" position="left">
                <Button variant="outline">Left tooltip</Button>
              </Tooltip>
              
              <Tooltip content="Tooltip embaixo" position="bottom">
                <Button variant="outline">Bottom tooltip</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bazari Design System
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Showcase de todos os componentes disponíveis
            </p>
          </div>
        </Card>

        {/* Component Tabs */}
        <Card>
          <Tabs
            tabs={tabs}
            defaultTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
          />
        </Card>

        {/* Modal Example */}
        <Modal
          isOpen={modal.isOpen}
          onClose={modal.close}
          title="Modal de Exemplo"
        >
          <div className="space-y-4">
            <p>Este é um modal de exemplo usando o componente Modal do design system.</p>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={modal.close}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast.success('Modal confirmado!')
                modal.close()
              }}>
                Confirmar
              </Button>
            </div>
          </div>
        </Modal>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} position="top-right" />
      </div>
    </div>
  )
}

export default ComponentShowcase
