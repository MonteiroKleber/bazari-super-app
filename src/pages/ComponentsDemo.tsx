import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@shared/ui/Button'
import { 
  Heart, 
  Star, 
  Settings, 
  Search, 
  User, 
  Download,
  AlertTriangle 
} from 'lucide-react'

const ComponentsDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadingTest = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🎨 Design System Bazari
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Demonstração dos componentes implementados na ETAPA 2.
            Sistema completo com acessibilidade e responsividade.
          </p>
          
          {/* Status badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              ✅ ETAPA 2 - 100% Completa
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
              🎯 Design System
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-400">
              🔥 Acessibilidade
            </span>
          </div>
        </motion.div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Buttons Demo */}
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Botões
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Variants, tamanhos, estados e ícones
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Variants */}
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" leftIcon={<Heart className="w-4 h-4" />}>
                    Primary
                  </Button>
                  <Button variant="secondary" leftIcon={<Star className="w-4 h-4" />}>
                    Secondary
                  </Button>
                  <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                    Outline
                  </Button>
                  <Button variant="ghost" leftIcon={<Search className="w-4 h-4" />}>
                    Ghost
                  </Button>
                  <Button variant="danger" leftIcon={<AlertTriangle className="w-4 h-4" />}>
                    Danger
                  </Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Tamanhos</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* Estados */}
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Estados</h3>
                <div className="flex flex-wrap gap-2">
                  <Button loading={isLoading}>
                    {isLoading ? 'Loading...' : 'Normal'}
                  </Button>
                  <Button disabled>Disabled</Button>
                  <Button
                    rightIcon={<Download className="w-4 h-4" />}
                    onClick={handleLoadingTest}
                  >
                    Testar Loading
                  </Button>
                </div>
              </div>

              {/* Full Width */}
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Largura Completa</h3>
                <Button 
                  fullWidth 
                  variant="primary"
                  leftIcon={<User className="w-4 h-4" />}
                >
                  Botão de Largura Completa
                </Button>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Status da Implementação
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Progresso da ETAPA 2
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ Sistema de Ícones (Lucide React)
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ Componente Button Completo
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ Utilitários CSS (cn function)
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ Animações Framer Motion
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ Acessibilidade ARIA
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  🔄 Outros componentes (Input, Card, Modal, etc.)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-gray-100 dark:bg-dark-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              🎉 Design System Base Implementado!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              O componente Button está funcionando perfeitamente com todas as funcionalidades.
              Próximo passo: implementar os demais componentes (Input, Card, Modal, etc.)
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ✅ Button Component
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                🎯 TypeScript
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-400">
                🔥 Framer Motion
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ComponentsDemo
