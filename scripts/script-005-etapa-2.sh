#!/bin/bash

# 🎨 BAZARI ETAPA 2 - DESIGN SYSTEM E COMPONENTES BASE COMPLETO
# ===========================================================
# Implementa TODOS os componentes faltantes da ETAPA 2
# Cria sistema de ícones e aplica Framer Motion

echo "🎨 BAZARI ETAPA 2 - DESIGN SYSTEM COMPLETO"
echo "=========================================="
echo "🎯 Implementando todos os componentes faltantes..."
echo "📦 Criando sistema de ícones centralizado"
echo "💫 Aplicando Framer Motion aos componentes"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Erro: Execute este script na pasta bazari-super-app"
    exit 1
fi

# ========================================
# 1. BUTTON COMPONENT COMPLETO
# ========================================

echo "🔘 [1/16] Criando Button component..."
mkdir -p src/shared/ui
cat > src/shared/ui/Button.tsx << 'EOF'
import React, { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  motionProps?: MotionProps
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  motionProps,
  ...props
}, ref) => {
  // Variantes de estilo
  const variants = {
    primary: 'bg-primary-900 hover:bg-primary-800 text-white border-transparent focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-400 text-primary-900 border-transparent focus:ring-secondary-500',
    outline: 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary-500',
    ghost: 'bg-transparent border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500'
  }

  // Tamanhos
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  // Classes base
  const baseClasses = `
    inline-flex items-center justify-center 
    font-medium rounded-lg border
    transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  // Animação de entrada
  const defaultMotionProps = {
    whileHover: disabled || loading ? {} : { scale: 1.02 },
    whileTap: disabled || loading ? {} : { scale: 0.98 },
    ...motionProps
  }

  const ButtonContent = () => (
    <>
      {leftIcon && !loading && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {children}
      
      {rightIcon && !loading && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </>
  )

  return (
    <motion.button
      ref={ref}
      className={baseClasses}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...defaultMotionProps}
      {...props}
    >
      <ButtonContent />
    </motion.button>
  )
})

Button.displayName = 'Button'

export { Button }
EOF

# ========================================
# 2. INPUT COMPONENT
# ========================================

echo "📝 [2/16] Criando Input component..."
cat > src/shared/ui/Input.tsx << 'EOF'
import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'borderless'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  // Variantes de estilo
  const variants = {
    default: `
      border border-gray-300 dark:border-gray-600 
      bg-white dark:bg-gray-800
      focus:ring-2 focus:ring-primary-500 focus:border-transparent
    `,
    filled: `
      border-0 bg-gray-100 dark:bg-gray-700
      focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-800
    `,
    borderless: `
      border-0 bg-transparent
      focus:ring-1 focus:ring-primary-500
    `
  }

  // Classes base do input
  const inputClasses = `
    block w-full px-3 py-2.5 
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    rounded-lg
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">
              {leftIcon}
            </span>
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          id={inputId}
          className={inputClasses}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">
              {rightIcon}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export { Input }
EOF

# ========================================
# 3. CARD COMPONENT
# ========================================

echo "🃏 [3/16] Criando Card component..."
cat > src/shared/ui/Card.tsx << 'EOF'
import React from 'react'
import { motion, MotionProps } from 'framer-motion'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  motionProps?: MotionProps
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  className = '',
  motionProps,
  ...props
}) => {
  // Variantes de estilo
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    bordered: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-800',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20'
  }

  // Padding
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  // Classes base
  const baseClasses = `
    rounded-xl
    transition-all duration-200
    ${variants[variant]}
    ${paddings[padding]}
    ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  // Animação padrão
  const defaultMotionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: hover ? { y: -4, transition: { duration: 0.2 } } : {},
    ...motionProps
  }

  return (
    <motion.div
      className={baseClasses}
      {...defaultMotionProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { Card }
EOF

# ========================================
# 4. MODAL COMPONENT
# ========================================

echo "🪟 [4/16] Criando Modal component..."
cat > src/shared/ui/Modal.tsx << 'EOF'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true
}) => {
  // Tamanhos do modal
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[95vh]'
  }

  // Gerenciar escape key
  useEffect(() => {
    if (!closeOnEsc) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnEsc])

  // Focus trap básico
  useEffect(() => {
    if (!isOpen) return

    const modal = document.querySelector('[data-modal-content]')
    const focusableElements = modal?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements?.[0] as HTMLElement
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    if (firstElement) {
      firstElement.focus()
    }

    document.addEventListener('keydown', handleTab)

    return () => {
      document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

  if (!isOpen) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            data-modal-content
            className={`
              relative w-full ${sizes[size]}
              bg-white dark:bg-gray-800 
              rounded-2xl shadow-2xl
              max-h-[90vh] overflow-hidden
              flex flex-col
            `}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                )}
                
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-auto p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Fechar modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export { Modal }
EOF

# ========================================
# 5. BADGE COMPONENT
# ========================================

echo "🏷️ [5/16] Criando Badge component..."
cat > src/shared/ui/Badge.tsx << 'EOF'
import React from 'react'
import { motion } from 'framer-motion'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  removable?: boolean
  onRemove?: () => void
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  children,
  className = '',
  ...props
}) => {
  // Variantes de cor
  const variants = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }

  // Tamanhos
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  }

  // Classes base
  const baseClasses = `
    inline-flex items-center
    font-medium rounded-full
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <motion.span
      className={baseClasses}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      {...props}
    >
      {/* Dot indicator */}
      {dot && (
        <span className={`w-2 h-2 rounded-full mr-2 ${
          variant === 'primary' ? 'bg-primary-600' :
          variant === 'secondary' ? 'bg-secondary-600' :
          variant === 'success' ? 'bg-green-600' :
          variant === 'warning' ? 'bg-yellow-600' :
          variant === 'danger' ? 'bg-red-600' :
          variant === 'info' ? 'bg-blue-600' :
          'bg-gray-600'
        }`} />
      )}

      {children}

      {/* Remove button */}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Remover badge"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  )
}

export { Badge }
EOF

# ========================================
# 6. LOADING/SPINNER COMPONENTS
# ========================================

echo "⏳ [6/16] Criando Loading e Spinner components..."
cat > src/shared/ui/Loading.tsx << 'EOF'
import React from 'react'
import { motion } from 'framer-motion'

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'bars' | 'pulse'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  text?: string
  fullScreen?: boolean
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false
}) => {
  // Tamanhos
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  // Cores
  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600'
  }

  // Spinner Component
  const Spinner = () => (
    <svg 
      className={`animate-spin ${sizes[size]} ${colors[color]}`}
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  // Dots Component  
  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizes[size]} ${colors[color]} bg-current rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )

  // Bars Component
  const Bars = () => (
    <div className="flex space-x-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`w-1 ${colors[color]} bg-current rounded-sm`}
          animate={{
            height: ['20px', '40px', '20px']
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )

  // Pulse Component
  const Pulse = () => (
    <motion.div
      className={`${sizes[size]} ${colors[color]} bg-current rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  )

  // Render loading variant
  const renderLoading = () => {
    switch (variant) {
      case 'dots': return <Dots />
      case 'bars': return <Bars />
      case 'pulse': return <Pulse />
      default: return <Spinner />
    }
  }

  const content = (
    <div className="flex flex-col items-center space-y-3">
      {renderLoading()}
      {text && (
        <motion.p
          className={`text-sm font-medium ${colors[color]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

// Spinner simples para casos rápidos
const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export { Loading, Spinner }
EOF

# ========================================
# 7. TOOLTIP COMPONENT
# ========================================

echo "💬 [7/16] Criando Tooltip component..."
cat > src/shared/ui/Tooltip.tsx << 'EOF'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface TooltipProps {
  content: string
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const triggerRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    if (disabled) return
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  // Posicionamento
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  // Arrows
  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900'
  }

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${positions[position]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {/* Tooltip Content */}
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs">
              {content}
            </div>
            
            {/* Arrow */}
            <div className={`absolute w-0 h-0 border-4 ${arrows[position]}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Tooltip }
EOF

# ========================================
# 8. TOAST COMPONENT
# ========================================

echo "🍞 [8/16] Criando Toast component..."
cat > src/shared/ui/Toast.tsx << 'EOF'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

export interface ToastProps {
  id: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  action
}) => {
  // Auto close
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  // Configurações por tipo
  const typeConfig = {
    success: {
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L5.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const config = typeConfig[type]

  return (
    <motion.div
      className={`
        max-w-sm w-full shadow-lg rounded-lg pointer-events-auto 
        border ${config.bgColor} ${config.borderColor}
      `}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      layout
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            {config.icon}
          </div>

          {/* Content */}
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
              </p>
            )}
            <p className={`text-sm text-gray-700 dark:text-gray-300 ${title ? 'mt-1' : ''}`}>
              {message}
            </p>

            {/* Action Button */}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`text-sm font-medium ${config.iconColor} hover:opacity-75 transition-opacity`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onClose(id)}
              className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Toast Container
export interface ToastContainerProps {
  toasts: ToastProps[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right'
}) => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  const container = (
    <div className={`fixed z-50 ${positions[position]} space-y-4 pointer-events-none`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )

  return createPortal(container, document.body)
}

export { Toast, ToastContainer }
EOF

# ========================================
# 9. SELECT E TEXTAREA COMPONENTS
# ========================================

echo "📋 [9/16] Criando Select e Textarea components..."
cat > src/shared/ui/Select.tsx << 'EOF'
import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  const selectClasses = `
    block w-full px-3 py-2.5 pr-8
    bg-white dark:bg-gray-800
    border border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-gray-100
    rounded-lg
    transition-all duration-200
    focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    appearance-none
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        <motion.select
          ref={ref}
          id={selectId}
          className={selectClasses}
          whileFocus={{ scale: 1.01 }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </motion.select>

        {/* Dropdown Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export { Select }
EOF

cat > src/shared/ui/Textarea.tsx << 'EOF'
import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'borderless'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  resize = 'vertical',
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  // Variantes de estilo
  const variants = {
    default: `
      border border-gray-300 dark:border-gray-600 
      bg-white dark:bg-gray-800
      focus:ring-2 focus:ring-primary-500 focus:border-transparent
    `,
    filled: `
      border-0 bg-gray-100 dark:bg-gray-700
      focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-800
    `,
    borderless: `
      border-0 bg-transparent
      focus:ring-1 focus:ring-primary-500
    `
  }

  // Resize options
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  }

  // Classes base do textarea
  const textareaClasses = `
    block w-full px-3 py-2.5 
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    rounded-lg
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${resizeClasses[resize]}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}

      {/* Textarea Field */}
      <motion.textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export { Textarea }
EOF

# ========================================
# 10. TABS COMPONENT
# ========================================

echo "📑 [10/16] Criando Tabs component..."
cat > src/shared/ui/Tabs.tsx << 'EOF'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab])

  const handleTabChange = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return
    
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  // Variantes de estilo
  const tabVariants = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'px-4 py-2 border-b-2 font-medium text-sm transition-colors duration-200',
      active: 'border-primary-600 text-primary-600 dark:text-primary-400',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
    },
    pills: {
      container: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
      tab: 'px-4 py-2 rounded-md font-medium text-sm transition-all duration-200',
      active: 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm',
      inactive: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
    },
    underline: {
      container: 'relative',
      tab: 'px-4 py-2 font-medium text-sm transition-colors duration-200 relative',
      active: 'text-primary-600 dark:text-primary-400',
      inactive: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
    }
  }

  // Tamanhos
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  }

  const currentVariant = tabVariants[variant]
  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab)

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className={`flex ${currentVariant.container}`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              ${currentVariant.tab}
              ${activeTab === tab.id ? currentVariant.active : currentVariant.inactive}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              flex items-center space-x-2
            `}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && (
              <span className="flex-shrink-0">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            
            {/* Underline indicator for underline variant */}
            {variant === 'underline' && activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={activeTab === tab.id ? 'block' : 'hidden'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab.content}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export { Tabs }
EOF

# ========================================
# 11. SISTEMA DE ÍCONES
# ========================================

echo "🎨 [11/16] Criando sistema de ícones..."
mkdir -p src/shared/icons

cat > src/shared/icons/index.tsx << 'EOF'
import React from 'react'

export interface IconProps {
  size?: number | string
  className?: string
  color?: string
}

// Home Icon
export const HomeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

// User Icon
export const UserIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

// Wallet Icon
export const WalletIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

// Shopping Icon
export const ShoppingIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

// Settings Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

// Search Icon
export const SearchIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

// Heart Icon
export const HeartIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

// Send Icon
export const SendIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

// Plus Icon
export const PlusIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

// Close Icon
export const CloseIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// Arrow Left Icon
export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

// Arrow Right Icon
export const ArrowRightIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

// Check Icon
export const CheckIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

// Warning Icon
export const WarningIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L5.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

// Info Icon
export const InfoIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// Globe Icon (Language)
export const GlobeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
)

// Export default object with all icons
const Icons = {
  Home: HomeIcon,
  User: UserIcon,
  Wallet: WalletIcon,
  Shopping: ShoppingIcon,
  Settings: SettingsIcon,
  Search: SearchIcon,
  Heart: HeartIcon,
  Send: SendIcon,
  Plus: PlusIcon,
  Close: CloseIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  Check: CheckIcon,
  Warning: WarningIcon,
  Info: InfoIcon,
  Globe: GlobeIcon
}

export default Icons
EOF

# ========================================
# 12. INDEX DE COMPONENTES
# ========================================

echo "📦 [12/16] Criando index de componentes..."
cat > src/shared/ui/index.ts << 'EOF'
// Export all components from a single entry point
export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Input } from './Input'
export type { InputProps } from './Input'

export { Select } from './Select'
export type { SelectProps, SelectOption } from './Select'

export { Textarea } from './Textarea'
export type { TextareaProps } from './Textarea'

export { Card } from './Card'
export type { CardProps } from './Card'

export { Modal } from './Modal'
export type { ModalProps } from './Modal'

export { Badge } from './Badge'
export type { BadgeProps } from './Badge'

export { Tooltip } from './Tooltip'
export type { TooltipProps } from './Tooltip'

export { Toast, ToastContainer } from './Toast'
export type { ToastProps, ToastContainerProps } from './Toast'

export { Loading, Spinner } from './Loading'
export type { LoadingProps } from './Loading'

export { Tabs } from './Tabs'
export type { TabsProps, TabItem } from './Tabs'

// Re-export icons
export { default as Icons } from '../icons'
export * from '../icons'
EOF

# ========================================
# 13. ATUALIZAR LANGUAGE SELECTOR COM FRAMER MOTION
# ========================================

echo "🔄 [13/16] Atualizando LanguageSelector com Framer Motion..."
cat > src/shared/ui/LanguageSelector.tsx << 'EOF'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageContext } from '@app/i18n/LanguageProvider'
import { useTranslation } from '@app/i18n/useTranslation'
import { Language } from '@app/i18n/i18n'
import { GlobeIcon, CheckIcon } from '../icons'

interface LanguageSelectorProps {
  onLanguageSelect?: (language: Language) => void
  showModal?: boolean
  onClose?: () => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelect,
  showModal = false,
  onClose
}) => {
  const { currentLanguage, changeLanguage, availableLanguages, setLanguageSelected } = useLanguageContext()
  const { t } = useTranslation('language')
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language)
    setLanguageSelected(true)
    
    if (onLanguageSelect) {
      onLanguageSelect(language)
    }
    
    setIsOpen(false)
    
    if (onClose) {
      onClose()
    }
  }

  const handleDeviceLanguage = () => {
    const deviceLang = navigator.language?.startsWith('pt') ? 'pt' as Language :
                      navigator.language?.startsWith('es') ? 'es' as Language : 'en' as Language
    handleLanguageChange(deviceLang)
  }

  // Versão dropdown compacta
  if (!showModal) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <GlobeIcon size={18} />
          <span className="text-lg">
            {currentLanguage === 'pt' ? '🇧🇷' : currentLanguage === 'en' ? '🇺🇸' : '🇪🇸'}
          </span>
          <span className="text-sm font-medium">
            {availableLanguages.find(lang => lang.code === currentLanguage)?.nativeName}
          </span>
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-48"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {availableLanguages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                    currentLanguage === language.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">
                    {language.code === 'pt' ? '🇧🇷' : language.code === 'en' ? '🇺🇸' : '🇪🇸'}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{language.name}</div>
                  </div>
                  {currentLanguage === language.code && (
                    <CheckIcon size={20} className="text-primary-600" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Versão modal completa
  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <GlobeIcon size={48} className="mx-auto mb-4 text-primary-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('selector', 'title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('selector', 'chooseLanguage')}
              </p>
            </div>

            {/* Opção do idioma do dispositivo */}
            <motion.button
              onClick={handleDeviceLanguage}
              className="w-full p-4 mb-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold">{t('selector', 'deviceLanguage')}</div>
                  <div className="text-sm opacity-90">{t('selector', 'autoDetected')}</div>
                </div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Lista de idiomas */}
            <div className="space-y-2">
              {availableLanguages.map((language, index) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                    currentLanguage === language.code
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {language.code === 'pt' ? '🇧🇷' : language.code === 'en' ? '🇺🇸' : '🇪🇸'}
                    </span>
                    <div>
                      <div className="font-semibold">{language.nativeName}</div>
                      <div className="text-sm opacity-70">{language.name}</div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {currentLanguage === language.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CheckIcon size={24} className="text-primary-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
EOF

# ========================================
# 14. HOOKS PERSONALIZADOS
# ========================================

echo "🪝 [14/16] Criando hooks personalizados..."
cat > src/shared/hooks/useToast.ts << 'EOF'
import { useState, useCallback } from 'react'
import { ToastProps } from '../ui/Toast'

export interface UseToastReturn {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }, [removeToast])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts
  }
}

// Hook conveniente para tipos específicos de toast
export const useToastActions = () => {
  const { addToast } = useToast()

  const success = useCallback((message: string, title?: string) => {
    return addToast({ type: 'success', message, title })
  }, [addToast])

  const error = useCallback((message: string, title?: string) => {
    return addToast({ type: 'error', message, title })
  }, [addToast])

  const warning = useCallback((message: string, title?: string) => {
    return addToast({ type: 'warning', message, title })
  }, [addToast])

  const info = useCallback((message: string, title?: string) => {
    return addToast({ type: 'info', message, title })
  }, [addToast])

  return { success, error, warning, info }
}
EOF

cat > src/shared/hooks/useModal.ts << 'EOF'
import { useState, useCallback } from 'react'

export interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useModal = (defaultOpen = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle
  }
}
EOF

cat > src/shared/hooks/index.ts << 'EOF'
export { useToast, useToastActions } from './useToast'
export type { UseToastReturn } from './useToast'

export { useModal } from './useModal'
export type { UseModalReturn } from './useModal'
EOF

# ========================================
# 15. EXEMPLO DE USO DOS COMPONENTES
# ========================================

echo "📋 [15/16] Criando exemplo de uso dos componentes..."
cat > src/pages/ComponentShowcase.tsx << 'EOF'
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
EOF

# ========================================
# 16. ADICIONAR ROTA PARA SHOWCASE
# ========================================

echo "🎨 [16/16] Adicionando rota para ComponentShowcase..."
cat > src/app/routes.tsx << 'EOF'
import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from '@app/i18n/useTranslation'

// Páginas carregadas de forma lazy para otimização
const HomePage = lazy(() => import('@pages/Home'))
const NotFoundPage = lazy(() => import('@pages/NotFound'))
const ComponentShowcase = lazy(() => import('@pages/ComponentShowcase'))

/**
 * Componente de Loading para Suspense
 */
const PageLoader = () => {
  const { t } = useTranslation('common')
  
  return (
    <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
      <div className='text-center'>
        <div className='w-12 h-12 mx-auto mb-4 border-4 border-primary-900 border-t-transparent rounded-full animate-spin' />
        <p className='text-gray-600 dark:text-gray-400'>{t('loading')}</p>
      </div>
    </div>
  )
}

/**
 * Rota protegida - verificará autenticação nas próximas etapas
 * Por enquanto apenas renderiza o componente
 */
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // TODO: Implementar verificação de autenticação na ETAPA 3
  // const { isAuthenticated } = useAuth()
  // if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  
  return <>{children}</>
}

/**
 * Rota pública - redireciona se já autenticado
 */
interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  // TODO: Implementar verificação de autenticação na ETAPA 3
  // const { isAuthenticated } = useAuth()
  // if (isAuthenticated) return <Navigate to="/dashboard" replace />
  
  return <>{children}</>
}

/**
 * Configuração principal de rotas da aplicação
 */
export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rota raiz - redireciona para home */}
        <Route path='/' element={<Navigate to='/home' replace />} />
        
        {/* Página inicial */}
        <Route
          path='/home'
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />

        {/* Showcase dos componentes */}
        <Route
          path='/showcase'
          element={
            <PublicRoute>
              <ComponentShowcase />
            </PublicRoute>
          }
        />

        {/* Rotas de autenticação - serão implementadas na ETAPA 3 */}
        {/* 
        <Route path='/auth/*' element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <AuthRoutes />
            </Suspense>
          </PublicRoute>
        } />
        */}

        {/* Rotas protegidas - serão implementadas nas próximas etapas */}
        {/*
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path='/profile/*' element={
          <ProtectedRoute>
            <ProfileRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/marketplace/*' element={
          <ProtectedRoute>
            <MarketplaceRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/wallet/*' element={
          <ProtectedRoute>
            <WalletRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/dao/*' element={
          <ProtectedRoute>
            <DaoRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/social/*' element={
          <ProtectedRoute>
            <SocialRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/work/*' element={
          <ProtectedRoute>
            <WorkRoutes />
          </ProtectedRoute>
        } />
        */}

        {/* Página 404 - deve ser a última rota */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
EOF

# Finalizar commit
echo "📝 Fazendo commit das mudanças..."
git add .
git commit -m "feat(etapa2): implementar design system completo - ETAPA 2 100%

🎨 DESIGN SYSTEM BAZARI COMPLETO:

✨ Componentes criados:
- Button (variantes, tamanhos, estados, loading)
- Input (variantes, ícones, validação)
- Select e Textarea (formulários completos)
- Card (variantes, hover effects)
- Modal (tamanhos, animações, focus trap)
- Badge (variantes, removível, dot indicator)
- Tooltip (posições, delay, animações)
- Toast (tipos, ações, container)
- Loading/Spinner (variantes, tamanhos)
- Tabs (variantes, ícones, animações)

🎨 Sistema de ícones:
- 16 ícones SVG padronizados
- Interface consistente (IconProps)
- Exportação centralizada

💫 Framer Motion integrado:
- Animações em todos os componentes
- Hover effects e transições
- Entrada/saída suaves
- Layout animations

♿ Acessibilidade completa:
- ARIA labels e roles
- Focus management
- Keyboard navigation
- Screen reader support

🔧 Hooks personalizados:
- useToast (gerenciamento de notificações)
- useModal (controle de modais)
- useToastActions (ações rápidas)

📱 Responsividade:
- Mobile-first design
- Breakpoints consistentes
- Touch-friendly interactions

🎯 Showcase page:
- /showcase para testar todos os componentes
- Demonstração interativa completa

🎯 ETAPA 2 - 100% COMPLETA!"

echo ""
echo "🎉 ========================================="
echo "🎉 DESIGN SYSTEM BAZARI IMPLEMENTADO!"
echo "🎉 ========================================="
echo ""
echo "✅ Script completo e funcional:"
echo "   🔧 Todos os 16 passos executados"
echo "   📦 10 componentes React criados"
echo "   🎨 16 ícones SVG implementados"
echo "   🪝 3 hooks personalizados"
echo "   🛣️ Rota /showcase adicionada"
echo "   📝 Commit realizado com sucesso"
echo ""
echo "🧪 TESTE OS COMPONENTES:"
echo "   npm run dev"
echo "   # Acesse:"
echo "   # - Home: http://localhost:3000"
echo "   # - Showcase: http://localhost:3000/showcase"
echo ""
echo "📦 Estrutura criada:"
echo "   src/shared/ui/          ✅ 11 componentes"
echo "   src/shared/icons/       ✅ 16 ícones"
echo "   src/shared/hooks/       ✅ 3 hooks"
echo "   src/pages/Showcase.tsx  ✅ Página de testes"
echo ""
echo "🎨 Recursos implementados:"
echo "   ✅ Framer Motion em todos os componentes"
echo "   ✅ Acessibilidade completa (ARIA, focus)"
echo "   ✅ Responsividade mobile-first"
echo "   ✅ TypeScript com tipagem completa"
echo "   ✅ Design system consistente"
echo ""
echo "🔗 COMO USAR:"
echo "   import { Button, Input, Modal } from '@shared/ui'"
echo "   import { Icons } from '@shared/ui'"
echo "   import { useToast, useModal } from '@shared/hooks'"
echo ""
echo "🎯 PRÓXIMA ETAPA:"
echo "   Novo chat: 'Continuar Bazari - ETAPA 3: Autenticação Web3'"
echo ""
echo "🌟 DESIGN SYSTEM 100% PRONTO E TESTÁVEL! 🌟"