import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  animated?: boolean
  striped?: boolean
  showValue?: boolean
  label?: string
  className?: string
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  animated = false,
  striped = false,
  showValue = false,
  label,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const containerClasses = clsx(
    'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
    {
      'h-1': size === 'sm',
      'h-2': size === 'md',
      'h-3': size === 'lg',
    },
    className
  )

  const barClasses = clsx(
    'h-full transition-all duration-300 ease-out',
    {
      'bg-primary-600': variant === 'primary',
      'bg-secondary-500': variant === 'secondary',
      'bg-green-600': variant === 'success',
      'bg-yellow-500': variant === 'warning',
      'bg-red-600': variant === 'error',
    },
    {
      'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-size-200 animate-shimmer': 
        striped && animated,
      'bg-stripes': striped && !animated,
    }
  )

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={containerClasses} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
        <motion.div
          className={barClasses}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Circular Progress variant
export const CircularProgress: React.FC<{
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  className?: string
}> = ({
  value,
  max = 100,
  size = 64,
  strokeWidth = 4,
  variant = 'primary',
  showValue = false,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-500',
    success: 'text-green-600',
    warning: 'text-yellow-500',
    error: 'text-red-600',
  }

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={colorClasses[variant]}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}
