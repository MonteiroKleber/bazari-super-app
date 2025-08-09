import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@shared/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // Size variants
      {
        'px-2.5 py-1.5 text-xs gap-1': size === 'xs',
        'px-3 py-2 text-sm gap-1.5': size === 'sm',
        'px-4 py-2.5 text-sm gap-2': size === 'md',
        'px-6 py-3 text-base gap-2': size === 'lg',
        'px-8 py-4 text-lg gap-3': size === 'xl',
      },
      
      // Width
      {
        'w-full': fullWidth,
      },
      
      // Variants
      {
        // Primary
        'bg-primary-900 hover:bg-primary-800 text-white shadow-sm': 
          variant === 'primary' && !disabled && !loading,
        'focus:ring-primary-500': variant === 'primary',
        
        // Secondary
        'bg-secondary-500 hover:bg-secondary-400 text-primary-900 shadow-sm': 
          variant === 'secondary' && !disabled && !loading,
        'focus:ring-secondary-500': variant === 'secondary',
        
        // Outline
        'border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800': 
          variant === 'outline',
        'hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300': 
          variant === 'outline' && !disabled && !loading,
        'focus:ring-gray-500': variant === 'outline',
        
        // Ghost
        'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300': 
          variant === 'ghost' && !disabled && !loading,
        'focus:ring-gray-500': variant === 'ghost',
        
        // Danger
        'bg-red-600 hover:bg-red-700 text-white shadow-sm': 
          variant === 'danger' && !disabled && !loading,
        'focus:ring-red-500': variant === 'danger',
      },
      className
    )

    const LoadingSpinner = () => (
      <svg
        className="animate-spin w-4 h-4"
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
    )

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
        
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
