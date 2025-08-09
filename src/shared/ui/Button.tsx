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
