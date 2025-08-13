// 🔧 CORREÇÃO: src/shared/utils/renderSafety.ts
// Utils para renderização segura - evitar "can't convert item to string"

// 🔧 SAFE STRING: Garantir que valor é string
export const safeString = (value: unknown, fallback = ''): string => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value.toString()
  
  // Se é objeto, tentar extrair propriedades comuns
  if (typeof value === 'object') {
    const obj = value as any
    if ('label' in obj && typeof obj.label === 'string') return obj.label
    if ('name' in obj && typeof obj.name === 'string') return obj.name
    if ('title' in obj && typeof obj.title === 'string') return obj.title
    if ('id' in obj) return String(obj.id)
  }
  
  // Fallback final
  return String(value)
}

// 🔧 SAFE NUMBER: Garantir que valor é número válido
export const safeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

// 🔧 SAFE CURRENCY: Formatar moeda com segurança
export const safeCurrency = (value: unknown, currency = 'BRL'): string => {
  const numValue = safeNumber(value, 0)
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD'
    }).format(numValue)
  } catch {
    return `R$ ${numValue.toFixed(2)}`
  }
}

// 🔧 SAFE FORMAT NUMBER: Formatar números grandes (1K, 1M)
export const safeFormatNumber = (value: unknown): string => {
  const num = safeNumber(value, 0)
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// 🔧 SAFE DATE: Formatar data com segurança
export const safeDate = (value: unknown, format = 'pt-BR'): string => {
  if (!value) return ''
  
  try {
    const date = value instanceof Date ? value : new Date(String(value))
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString(format)
  } catch {
    return ''
  }
}

// 🔧 SAFE CLASS NAME: Construir className sem template literals
export const safeClassName = (...classes: unknown[]): string => {
  return classes
    .filter(Boolean)
    .map(cls => safeString(cls))
    .filter(cls => cls.trim().length > 0)
    .join(' ')
}

// 🔧 SAFE KEY: Gerar key única para listas
export const safeKey = (prefix: string, value: unknown, index?: number): string => {
  const baseKey = safeString(prefix, 'item')
  const valueStr = safeString(value, '')
  const indexStr = typeof index === 'number' ? index.toString() : ''
  
  return `${baseKey}-${valueStr || indexStr || Math.random().toString(36).substr(2, 9)}`
}

// 🔧 SAFE RATING STARS: Renderizar estrelas com segurança
export const safeRatingStars = (
  rating: unknown, 
  iconComponent: React.ComponentType<{ className?: string }>,
  size = 'w-5 h-5'
): React.ReactElement[] => {
  const safeRating = safeNumber(rating, 0)
  const filledStars = Math.floor(Math.min(Math.max(safeRating, 0), 5))
  
  return Array.from({ length: 5 }, (_, index) => 
    React.createElement(iconComponent, {
      key: safeKey('star', index),
      className: safeClassName(
        size,
        index < filledStars ? 'text-yellow-500 fill-current' : 'text-gray-300'
      )
    })
  )
}

// 🔧 SAFE OBJECT VALUE: Extrair valor de objeto com fallback
export const safeObjectValue = (
  obj: unknown, 
  path: string | string[], 
  fallback: unknown = ''
): unknown => {
  if (!obj || typeof obj !== 'object') return fallback
  
  const keys = Array.isArray(path) ? path : path.split('.')
  let current = obj as any
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return fallback
    }
    current = current[key]
  }
  
  return current
}

// 🔧 SAFE PROPS: Filtrar props inválidas para DOM
export const safeProps = (props: Record<string, unknown>): Record<string, any> => {
  const filtered: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(props)) {
    // Pular propriedades que não são válidas para DOM
    if (key.startsWith('data-') || key.startsWith('aria-') || 
        ['id', 'className', 'style', 'onClick', 'onMouseOver', 'onFocus'].includes(key)) {
      
      // Garantir que valores são apropriados
      if (key === 'className') {
        filtered[key] = safeString(value)
      } else if (key === 'id') {
        filtered[key] = safeString(value)
      } else if (typeof value === 'function' || typeof value === 'string' || 
                 typeof value === 'number' || typeof value === 'boolean') {
        filtered[key] = value
      }
    }
  }
  
  return filtered
}