import { useState, useEffect } from 'react'
import { DESIGN_TOKENS } from '@shared/ui'

export interface UseDesignSystemOptions {
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  darkMode?: boolean
}

export const useDesignSystem = (options: UseDesignSystemOptions = {}) => {
  const { breakpoint: targetBreakpoint, darkMode: initialDarkMode } = options
  
  // Estado do tema
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode ?? false)
  
  // Estado do breakpoint atual
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('md')
  
  // Detectar breakpoint atual
  useEffect(() => {
    const breakpoints = {
      xs: 475,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    }
    
    const updateBreakpoint = () => {
      const width = window.innerWidth
      let current = 'xs'
      
      Object.entries(breakpoints).forEach(([key, value]) => {
        if (width >= value) {
          current = key
        }
      })
      
      setCurrentBreakpoint(current)
    }
    
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  // Detectar preferência de tema
  useEffect(() => {
    if (initialDarkMode === undefined) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    }
  }, [initialDarkMode])
  
  // Aplicar tema ao document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  
  // Funções utilitárias
  const toggleTheme = () => setIsDarkMode(!isDarkMode)
  
  const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm'
  const isTablet = currentBreakpoint === 'md'
  const isDesktop = ['lg', 'xl', '2xl'].includes(currentBreakpoint)
  
  const getSpacing = (size: keyof typeof DESIGN_TOKENS.spacing) => 
    DESIGN_TOKENS.spacing[size]
  
  const getFontSize = (size: keyof typeof DESIGN_TOKENS.fontSize) => 
    DESIGN_TOKENS.fontSize[size]
  
  const getBorderRadius = (size: keyof typeof DESIGN_TOKENS.borderRadius) => 
    DESIGN_TOKENS.borderRadius[size]
  
  return {
    // Estado
    isDarkMode,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    
    // Ações
    toggleTheme,
    setDarkMode: setIsDarkMode,
    
    // Utilitários
    getSpacing,
    getFontSize,
    getBorderRadius,
    
    // Tokens
    tokens: DESIGN_TOKENS,
    
    // Verificações
    isBreakpoint: (bp: string) => currentBreakpoint === bp,
    isBreakpointUp: (bp: string) => {
      const order = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
      const currentIndex = order.indexOf(currentBreakpoint)
      const targetIndex = order.indexOf(bp)
      return currentIndex >= targetIndex
    },
  }
}

// Hook para componentes responsivos
export const useResponsive = () => {
  const { isMobile, isTablet, isDesktop, currentBreakpoint } = useDesignSystem()
  
  const getValue = <T>(values: {
    mobile?: T
    tablet?: T
    desktop?: T
    xs?: T
    sm?: T
    md?: T
    lg?: T
    xl?: T
    '2xl'?: T
  }): T | undefined => {
    // Primeira tentativa: usar breakpoint específico
    if (values[currentBreakpoint as keyof typeof values]) {
      return values[currentBreakpoint as keyof typeof values]
    }
    
    // Segunda tentativa: usar categorias gerais
    if (isMobile && values.mobile) return values.mobile
    if (isTablet && values.tablet) return values.tablet
    if (isDesktop && values.desktop) return values.desktop
    
    // Fallback: primeiro valor disponível
    return Object.values(values).find(v => v !== undefined)
  }
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    getValue,
  }
}

// Hook para acessibilidade
export const useA11y = () => {
  const [announcements, setAnnouncements] = useState<string[]>([])
  
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, `${priority}:${message}`])
    
    // Limpar após 5 segundos
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1))
    }, 5000)
  }
  
  const generateId = (prefix: string = 'bazari') => 
    `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  
  const getAriaProps = (type: 'button' | 'link' | 'dialog' | 'input') => {
    const baseProps = {
      button: { role: 'button', tabIndex: 0 },
      link: { role: 'link', tabIndex: 0 },
      dialog: { role: 'dialog', 'aria-modal': true },
      input: { role: 'textbox' },
    }
    
    return baseProps[type] || {}
  }
  
  return {
    announce,
    generateId,
    getAriaProps,
    announcements,
  }
}
