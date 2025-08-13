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
