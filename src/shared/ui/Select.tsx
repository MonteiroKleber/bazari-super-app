// 🔧 CORREÇÃO CRÍTICA: src/shared/ui/Select.tsx
// Problema: value={selectedItem} quando selectedItem é objeto
// console.log("[DEBUG] selectedItem:", selectedItem, "typeof:", typeof selectedItem)

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icons } from './Icons'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

export interface SelectProps {
  options: SelectOption[]
  value?: string | number | SelectOption // 🔧 ACEITA tanto string quanto objeto
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: string | number | string[] | number[]) => void
  onSearch?: (query: string) => void
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  options = [],
  value,
  placeholder = 'Selecione...',
  label,
  error,
  disabled = false,
  multiple = false,
  searchable = false,
  clearable = false,
  size = 'md',
  onChange,
  onSearch,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([])
  const selectRef = useRef<HTMLDivElement>(null)

  // 🔧 CORREÇÃO: Extrair valor seguro do prop value
  const getSafeValue = (val: unknown): string | number | null => {
    if (val === null || val === undefined) return null
    
    // Se é string ou number, retorna direto
    if (typeof val === 'string' || typeof val === 'number') return val
    
    // Se é objeto com propriedade value, extrai o value
    if (typeof val === 'object' && val !== null && 'value' in val) {
      const objVal = (val as SelectOption).value
      if (typeof objVal === 'string' || typeof objVal === 'number') return objVal
    }
    
    // Se é objeto com propriedade id, usa como fallback
    if (typeof val === 'object' && val !== null && 'id' in val) {
      const objId = (val as any).id
      if (typeof objId === 'string' || typeof objId === 'number') return objId
    }
    
    // Fallback: converte para string se possível
    return String(val)
  }

  // 🔧 INICIALIZAÇÃO: Configurar valores selecionados com segurança
  useEffect(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        const safeValues = value.map(getSafeValue).filter(v => v !== null) as (string | number)[]
        setSelectedValues(safeValues)
      } else {
        const safeValue = getSafeValue(value)
        setSelectedValues(safeValue !== null ? [safeValue] : [])
      }
    } else {
      const safeValue = getSafeValue(value)
      setSelectedValues(safeValue !== null ? [safeValue] : [])
    }
  }, [value, multiple])

  // 🔧 HELPER: Encontrar opção por valor seguro
  const findOptionByValue = (val: string | number): SelectOption | undefined => {
    return options.find(opt => opt.value === val)
  }

  // 🔧 HELPER: Obter rótulo para exibição
  const getDisplayLabel = (): string => {
    if (selectedValues.length === 0) return placeholder
    
    if (multiple) {
      if (selectedValues.length === 1) {
        const option = findOptionByValue(selectedValues[0])
        return option?.label || String(selectedValues[0])
      }
      return `${selectedValues.length} selecionados`
    } else {
      const option = findOptionByValue(selectedValues[0])
      return option?.label || String(selectedValues[0])
    }
  }

  // Classes de tamanho
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  // Filtrar opções baseado na busca
  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  // 🔧 HANDLE SELECTION: Garantir que onChange recebe valores corretos
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return

    const safeValue = getSafeValue(option.value)
    if (safeValue === null) return

    let newValues: (string | number)[]

    if (multiple) {
      if (selectedValues.includes(safeValue)) {
        newValues = selectedValues.filter(v => v !== safeValue)
      } else {
        newValues = [...selectedValues, safeValue]
      }
    } else {
      newValues = [safeValue]
      setIsOpen(false)
    }

    setSelectedValues(newValues)
    
    // 🔧 SEGURANÇA: Chamar onChange com valores corretos
    if (onChange) {
      if (multiple) {
        onChange(newValues)
      } else {
        onChange(newValues[0] || '')
      }
    }
  }

  // 🔧 CLEAR: Limpar seleção com segurança
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedValues([])
    if (onChange) {
      onChange(multiple ? [] : '')
    }
  }

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Select Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative w-full border border-gray-300 rounded-lg bg-white cursor-pointer
          focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${error ? 'border-red-500' : ''}
          ${sizeClasses[size]}
        `}
      >
        {/* Display Value */}
        <span className={`block truncate ${selectedValues.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
          {getDisplayLabel()}
        </span>

        {/* Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {/* Clear Button */}
          {clearable && selectedValues.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Icons.X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          {/* Dropdown Arrow */}
          <Icons.ArrowRight 
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-90' : ''
            }`} 
          />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    onSearch?.(e.target.value)
                  }}
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}

            {/* Options */}
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nenhuma opção encontrada
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const safeValue = getSafeValue(option.value)
                  const isSelected = safeValue !== null && selectedValues.includes(safeValue)
                  
                  return (
                    <div
                      key={`option-${option.value}`} // 🔧 KEY SEGURA
                      onClick={() => handleSelect(option)}
                      className={`
                        px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                        ${option.disabled 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'hover:bg-gray-100'
                        }
                        ${isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        {option.icon && (
                          <span className="flex-shrink-0">{option.icon}</span>
                        )}
                        <span>{option.label}</span>
                      </div>
                      
                      {isSelected && (
                        <Icons.Check className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}