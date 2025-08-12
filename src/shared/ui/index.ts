// 🎨 Design System Bazari - Componentes UI
// ========================================
// Exportação centralizada de todos os componentes do Design System

// Componentes de Entrada

export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Input } from './Input'
export type { InputProps } from './Input'

export { Select } from './Select'
export type { SelectProps, SelectOption } from './Select'

export { Textarea } from './Textarea'
export type { TextareaProps } from './Textarea'

// Componentes de Layout
export { Card, CardHeader, CardBody, CardFooter } from './Card'
export type { CardProps } from './Card'

export { Modal, ModalBody, ModalFooter } from './Modal'
export type { ModalProps } from './Modal'

// Componentes de Feedback
export { Badge } from './Badge'
export type { BadgeProps } from './Badge'

export { Loading, SkeletonText, SkeletonCard } from './Loading'
export type { LoadingProps } from './Loading'

export { Tooltip } from './Tooltip'
export type { TooltipProps } from './Tooltip'

export { Progress, CircularProgress } from './Progress'
export type { ProgressProps } from './Progress'

// Tipos globais para o Design System
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading'

// Constantes do Design System
export const DESIGN_TOKENS = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
} as const

// Utilitários do Design System
export const createComponentClasses = (
  base: string,
  variants: Record<string, string>,
  sizes?: Record<string, string>
) => ({
  base,
  variants,
  sizes: sizes || {},
})

// Hook para acessibilidade
export const useA11y = () => ({
  // Funções utilitárias para acessibilidade
  generateId: (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Atributos ARIA comuns
  ariaProps: {
    button: {
      role: 'button',
      tabIndex: 0,
    },
    link: {
      role: 'link',
      tabIndex: 0,
    },
    dialog: {
      role: 'dialog',
      'aria-modal': true,
    },
  },
})
