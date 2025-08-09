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
