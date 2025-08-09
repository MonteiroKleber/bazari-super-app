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
