import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utilitário principal para classes CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitários de formatação
export const formatters = {
  currency: (value: number, currency = 'BRL') =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(value),
  
  number: (value: number) =>
    new Intl.NumberFormat('pt-BR').format(value),
  
  percentage: (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
    }).format(value / 100),
  
  date: (date: Date | string) =>
    new Intl.DateTimeFormat('pt-BR').format(new Date(date)),
  
  dateTime: (date: Date | string) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date)),
}

// Utilitários de validação
export const validators = {
  email: (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  phone: (phone: string) =>
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone),
  
  cpf: (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '')
    if (numbers.length !== 11) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false
    
    // Calcular dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i)
    }
    let checkDigit = 11 - (sum % 11)
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0
    if (checkDigit !== parseInt(numbers.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i)
    }
    checkDigit = 11 - (sum % 11)
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0
    
    return checkDigit === parseInt(numbers.charAt(10))
  },
  
  password: (password: string) => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }),
  
  url: (url: string) =>
    /^https?:\/\/.+/.test(url),
}

// Utilitários de string
export const stringUtils = {
  capitalize: (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  
  truncate: (str: string, length: number, suffix = '...') =>
    str.length <= length ? str : str.slice(0, length) + suffix,
  
  slug: (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim(),
  
  initials: (name: string) =>
    name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2),
  
  mask: {
    cpf: (value: string) =>
      value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1'),
    
    phone: (value: string) =>
      value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
        .replace(/(-\d{4})\d+?$/, '$1'),
    
    currency: (value: string) =>
      value
        .replace(/\D/g, '')
        .replace(/(\d)(\d{2})$/, '$1,$2')
        .replace(/(?=(\d{3})+(\D))\B/g, '.'),
  },
}

// Utilitários de array
export const arrayUtils = {
  unique: <T>(array: T[]) => [...new Set(array)],
  
  groupBy: <T>(array: T[], key: keyof T) =>
    array.reduce((groups, item) => {
      const group = item[key] as unknown as string
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>),
  
  sortBy: <T>(array: T[], key: keyof T) =>
    [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
      return 0
    }),
  
  chunk: <T>(array: T[], size: number) => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },
}

// Utilitários de performance
export const performanceUtils = {
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), wait)
    }
  },
  
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },
  
  memoize: <T extends (...args: any[]) => any>(func: T) => {
    const cache = new Map()
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = JSON.stringify(args)
      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = func.apply(null, args)
      cache.set(key, result)
      return result
    }) as T
  },
}

// Utilitários de localStorage
export const storageUtils = {
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },
  
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return defaultValue
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  },
}
