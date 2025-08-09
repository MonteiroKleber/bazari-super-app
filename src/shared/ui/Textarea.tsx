import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { AlertCircle } from '@shared/icons'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'flushed'
  textareaSize?: 'sm' | 'md' | 'lg'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      textareaSize = 'md',
      resize = 'vertical',
      className,
      ...props
    },
    ref
  ) => {
    const containerClasses = clsx('relative', className)

    const textareaClasses = clsx(
      'block w-full transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-500 dark:placeholder:text-gray-400',
      
      // Size variants
      {
        'px-3 py-2 text-sm': textareaSize === 'sm',
        'px-4 py-3 text-base': textareaSize === 'md',
        'px-5 py-4 text-lg': textareaSize === 'lg',
      },
      
      // Resize variants
      {
        'resize-none': resize === 'none',
        'resize-y': resize === 'vertical',
        'resize-x': resize === 'horizontal',
        'resize': resize === 'both',
      },
      
      // Variant styles
      {
        'border rounded-lg bg-white dark:bg-dark-800': variant === 'default',
        'border-gray-300 dark:border-gray-600': variant === 'default' && !error,
        'border-red-500 dark:border-red-400': variant === 'default' && error,
        'text-gray-900 dark:text-gray-100': variant === 'default',
        
        'border-0 rounded-lg bg-gray-100 dark:bg-dark-700': variant === 'filled',
        'text-gray-900 dark:text-gray-100': variant === 'filled',
        
        'border-0 border-b-2 rounded-none bg-transparent': variant === 'flushed',
        'border-gray-300 dark:border-gray-600': variant === 'flushed' && !error,
        'border-red-500 dark:border-red-400': variant === 'flushed' && error,
        'text-gray-900 dark:text-gray-100': variant === 'flushed',
      }
    )

    return (
      <div className={containerClasses}>
        {label && (
          <label
            className={clsx(
              'block text-sm font-medium mb-2',
              error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={textareaClasses}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        />
        
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id={`${props.id}-error`}
            className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
        
        {/* Helper text */}
        {helperText && !error && (
          <div
            id={`${props.id}-helper`}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
