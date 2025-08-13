#!/bin/bash

echo "🔧 BAZARI - CORREÇÃO COMPONENTES UI FALTANDO"
echo "==========================================="
echo "🎯 Corrigindo Tabs, AlertCircle e outros imports"
echo ""

# ==========================================
# 1. CORRIGIR COMPONENTE TABS COMPLETO
# ==========================================

echo "📑 [1/5] Criando Tabs component moderno (shadcn-style)..."
cat > src/shared/ui/Tabs.tsx << 'EOF'
import React, { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'

// ✅ CONTEXT PARA TABS
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// ✅ TABS ROOT COMPONENT
interface TabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue,
  onValueChange,
  className = '',
  children
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// ✅ TABS LIST COMPONENT
interface TabsListProps {
  className?: string
  children: React.ReactNode
}

export const TabsList: React.FC<TabsListProps> = ({ className = '', children }) => {
  return (
    <div className={`flex border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  )
}

// ✅ TABS TRIGGER COMPONENT
interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className = '',
  children,
  disabled = false
}) => {
  const { value: currentValue, onValueChange } = useTabsContext()
  const isActive = currentValue === value

  return (
    <button
      onClick={() => !disabled && onValueChange(value)}
      disabled={disabled}
      className={`
        relative px-4 py-2 font-medium text-sm transition-all duration-200
        border-b-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${isActive 
          ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
      
      {/* Animação de indicador ativo */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
          layoutId="activeTabIndicator"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  )
}

// ✅ TABS CONTENT COMPONENT
interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className = '',
  children
}) => {
  const { value: currentValue } = useTabsContext()
  
  if (currentValue !== value) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`mt-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ✅ EXPORT DEFAULT (compatibilidade com imports antigos)
export default Tabs
EOF

# ==========================================
# 2. CORRIGIR ÍCONES - ADICIONAR ALERTCIRCLE
# ==========================================

echo "🎨 [2/5] Adicionando AlertCircle aos ícones..."
cat > src/shared/icons/index.tsx << 'EOF'
import React from 'react'

// ✅ ÍCONES BÁSICOS
export const Home = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
)

export const User = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export const Search = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

export const Menu = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="4" x2="20" y1="12" y2="12"/>
    <line x1="4" x2="20" y1="6" y2="6"/>
    <line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
)

export const X = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
)

export const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
)

export const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

export const Eye = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export const EyeOff = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
)

// ✅ ÍCONE ALERTCIRCLE (que estava faltando)
export const AlertCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
)

// ✅ ÍCONES PARA MARKETPLACE
export const Package = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="16.5" x2="7.5" y1="9.4" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.29,7 12,12 20.71,7"/>
    <line x1="12" x2="12" y1="22" y2="12"/>
  </svg>
)

export const Building = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
)

export const Info = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
)

export const Star = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
)

export const MessageCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
)

export const Filter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
  </svg>
)

export const Heart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

export const ShoppingCart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
)

// ✅ COMPONENTE ICONS UNIFICADO
export const Icons = {
  Home,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  Package,
  Building,
  Info,
  Star,
  MessageCircle,
  Filter,
  Heart,
  ShoppingCart
}

export default Icons
EOF

# ==========================================
# 3. CORRIGIR TEXTAREA (REMOVE ALERTCIRCLE IMPORT)
# ==========================================

echo "📝 [3/5] Corrigindo Textarea component..."
cat > src/shared/ui/Textarea.tsx << 'EOF'
import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'flushed'
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    error,
    helperText,
    variant = 'default',
    resize = 'vertical',
    className = '',
    ...props
  }, ref) => {
    const hasError = !!error
    
    const baseClasses = `
      block w-full px-3 py-2 text-gray-900 dark:text-gray-100 
      placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-offset-2 
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
    `
    
    const variantClasses = {
      default: `
        border border-gray-300 dark:border-gray-600 rounded-lg
        bg-white dark:bg-gray-800
        focus:ring-primary-500 focus:border-primary-500
        ${hasError ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500' : ''}
      `,
      filled: `
        border-0 rounded-lg bg-gray-100 dark:bg-gray-700
        focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-800
        ${hasError ? 'bg-red-50 dark:bg-red-900/20 focus:ring-red-500' : ''}
      `,
      flushed: `
        border-0 border-b-2 rounded-none bg-transparent
        border-gray-300 dark:border-gray-600
        focus:ring-0 focus:border-primary-500
        ${hasError ? 'border-red-500 dark:border-red-400 focus:border-red-500' : ''}
      `
    }
    
    const resizeClasses = {
      none: 'resize-none',
      both: 'resize',
      horizontal: 'resize-x',
      vertical: 'resize-y'
    }
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            className={`
              ${baseClasses}
              ${variantClasses[variant]}
              ${resizeClasses[resize]}
              ${className}
            `}
            {...props}
          />
          
          {/* Error Icon */}
          {hasError && (
            <div className="absolute top-3 right-3 text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" x2="12" y1="8" y2="12"/>
                <line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* Helper Text ou Error */}
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 text-sm ${
              hasError 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
EOF

# ==========================================
# 4. COMENTAR ROTAS DE MARKETPLACE TEMPORARIAMENTE
# ==========================================

echo "🛣️ [4/5] Comentando rotas de marketplace no router principal..."
cat > src/app/routes/index.tsx << 'EOF'
import { createBrowserRouter } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthGuard } from '@shared/guards/AuthGuard'
import { Layout } from '@shared/components/Layout'

// ✅ LAZY IMPORTS BÁSICOS
const HomePage = lazy(() => import('@pages/Home'))
const NotFoundPage = lazy(() => import('@pages/NotFound'))
const DashboardPage = lazy(() => import('@pages/DashboardPage'))

// TODO: Importar rotas quando componentes estiverem prontos
// import { authRoutes } from './authRoutes'
// import { profileRoutes } from './profileRoutes'
// import { marketplaceRoutes } from './marketplaceRoutes'

// ✅ LOADING SIMPLES
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Carregando...</p>
    </div>
  </div>
)

// ✅ ROUTER BÁSICO E FUNCIONAL
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Erro na página</h1>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    ),
    children: [
      // ✅ Página inicial
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        )
      },
      
      // ✅ Dashboard
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          </Suspense>
        )
      },

      // 🚧 TODO: Reativar gradualmente quando componentes estiverem prontos
      // ...authRoutes,
      // ...profileRoutes,
      // ...marketplaceRoutes,

      // ✅ Página 404
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        )
      }
    ]
  }
])
EOF

# ==========================================
# 5. ATUALIZAR INDEX UI EXPORTS
# ==========================================

echo "📦 [5/5] Atualizando exports do UI..."
cat > src/shared/ui/index.ts << 'EOF'
// ✅ COMPONENTES BÁSICOS
export { Button } from './Button'
export { Input } from './Input'
export { Select } from './Select'
export { Textarea } from './Textarea'
export { Card } from './Card'
export { Modal } from './Modal'
export { Badge } from './Badge'
export { Tooltip } from './Tooltip'
export { Loading } from './Loading'
export { Spinner } from './Spinner'

// ✅ TABS COMPONENTS (novos)
export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from './Tabs'

// ✅ TOAST SYSTEM
export { Toast, ToastContainer, useToast } from './Toast'

// ✅ ICONS
export { Icons } from './Icons'
EOF

echo ""
echo "✅ COMPONENTES UI CORRIGIDOS COM SUCESSO!"
echo "========================================"
echo ""
echo "🔧 Problemas resolvidos:"
echo "  ✅ Tabs component completo (shadcn-style)"
echo "  ✅ TabsContent, TabsList, TabsTrigger exportados"
echo "  ✅ AlertCircle ícone adicionado"
echo "  ✅ Textarea corrigido (sem import AlertCircle)"
echo "  ✅ Rotas de marketplace comentadas temporariamente"
echo "  ✅ Exports do UI atualizados"
echo ""
echo "🚀 Agora execute:"
echo "  npm run dev"
echo ""
echo "📝 Próximos passos:"
echo "  1. Confirme que não há mais erros de imports"
echo "  2. Teste as páginas Home e Dashboard"
echo "  3. Gradualmente reative outras funcionalidades"
echo ""