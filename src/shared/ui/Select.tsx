import React, { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { ChevronDown, Check, AlertCircle } from '@shared/icons'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  selectSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'flushed'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Selecione uma opção',
      selectSize = 'md',
      variant = 'default',
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState(value || '')

    const containerClasses = clsx('relative', className)

    const triggerClasses = clsx(
      'flex items-center justify-between w-full cursor-pointer transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // Size variants
      {
        'px-3 py-2 text-sm': selectSize === 'sm',
        'px-4 py-3 text-base': selectSize === 'md',
        'px-5 py-4 text-lg': selectSize === 'lg',
      },
      
      // Variant styles
      {
        'border rounded-lg bg-white dark:bg-dark-800': variant === 'default',
        'border-gray-300 dark:border-gray-600': variant === 'default' && !error,
        'border-red-500 dark:border-red-400': variant === 'default' && error,
        
        'border-0 rounded-lg bg-gray-100 dark:bg-dark-700': variant === 'filled',
        
        'border-0 border-b-2 rounded-none bg-transparent': variant === 'flushed',
        'border-gray-300 dark:border-gray-600': variant === 'flushed' && !error,
        'border-red-500 dark:border-red-400': variant === 'flushed' && error,
      }
    )

    const selectedOption = options.find(option => option.value === selectedValue)

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return
      
      setSelectedValue(option.value)
      setIsOpen(false)
      
      // Trigger onChange event
      if (onChange) {
        const syntheticEvent = {
          target: { value: option.value },
        } as React.ChangeEvent<HTMLSelectElement>
        onChange(syntheticEvent)
      }
    }

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
        
        {/* Hidden native select for form compatibility */}
        <select
          ref={ref}
          value={selectedValue}
          onChange={() => {}} // Controlled by custom logic
          className="sr-only"
          tabIndex={-1}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom select trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={triggerClasses}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={clsx(
              selectedValue ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
            )}>
              {selectedOption?.label || placeholder}
            </span>
            
            <ChevronDown 
              className={clsx(
                'w-5 h-5 text-gray-400 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </button>
          
          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
              >
                {options.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    className={clsx(
                      'flex items-center justify-between w-full px-4 py-2 text-left transition-colors duration-150',
                      'hover:bg-gray-50 dark:hover:bg-dark-700',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      selectedValue === option.value && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    )}
                  >
                    <span>{option.label}</span>
                    {selectedValue === option.value && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
        
        {/* Helper text */}
        {helperText && !error && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
