import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export interface TooltipProps {
  content: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  variant?: 'dark' | 'light'
  delay?: number
  children: React.ReactElement
  disabled?: boolean
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  variant = 'dark',
  delay = 200,
  children,
  disabled = false,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

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

  const placementClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-0',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-0',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-0',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-0',
  }

  const variantClasses = {
    dark: {
      tooltip: 'bg-gray-900 text-white border-gray-900',
      arrow: 'border-gray-900',
    },
    light: {
      tooltip: 'bg-white text-gray-900 border-gray-200 shadow-lg',
      arrow: 'border-white',
    },
  }

  return (
    <div className="relative inline-block">
      {React.cloneElement(children, {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      })}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              'absolute z-50 px-3 py-2 text-sm font-medium rounded-lg border whitespace-nowrap pointer-events-none',
              placementClasses[placement],
              variantClasses[variant].tooltip,
              className
            )}
            role="tooltip"
          >
            {content}
            
            {/* Arrow */}
            <div
              className={clsx(
                'absolute w-0 h-0 border-4',
                arrowClasses[placement],
                variantClasses[variant].arrow
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
