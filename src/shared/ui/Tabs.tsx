import React, { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'

// ✅ CONTEXT PARA TABS
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// ✅ TABS ROOT COMPONENT
interface TabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue,
  onValueChange,
  className = '',
  children
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// ✅ TABS LIST COMPONENT
interface TabsListProps {
  className?: string
  children: React.ReactNode
}

export const TabsList: React.FC<TabsListProps> = ({ className = '', children }) => {
  return (
    <div className={`flex border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  )
}

// ✅ TABS TRIGGER COMPONENT
interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className = '',
  children,
  disabled = false
}) => {
  const { value: currentValue, onValueChange } = useTabsContext()
  const isActive = currentValue === value

  return (
    <button
      onClick={() => !disabled && onValueChange(value)}
      disabled={disabled}
      className={`
        relative px-4 py-2 font-medium text-sm transition-all duration-200
        border-b-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${isActive 
          ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
      
      {/* Animação de indicador ativo */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
          layoutId="activeTabIndicator"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  )
}

// ✅ TABS CONTENT COMPONENT
interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className = '',
  children
}) => {
  const { value: currentValue } = useTabsContext()
  
  if (currentValue !== value) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`mt-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ✅ EXPORT DEFAULT (compatibilidade com imports antigos)
export default Tabs
