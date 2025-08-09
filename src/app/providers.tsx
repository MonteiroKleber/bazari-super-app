import React, { ReactNode, useEffect, useState } from 'react'

import { useLanguageDetector } from './i18n/useTranslation'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Theme Provider - Gerencia tema claro/escuro
 */
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Verifica preferência salva ou do sistema
    const savedTheme = localStorage.getItem('bazari_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldUseDark)

    // Aplica classe no documento
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('bazari_theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newTheme)
  }

  // Expõe função de toggle via window para facilitar testes
  useEffect(() => {
    ;(window as any).toggleTheme = toggleTheme
  }, [])

  return <>{children}</>
}

/**
 * Language Provider - Monitora mudanças de idioma
 */
const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const currentLanguage = useLanguageDetector()

  useEffect(() => {
    // Atualiza atributo lang do documento
    document.documentElement.lang = currentLanguage
  }, [currentLanguage])

  return <>{children}</>
}

/**
 * Error Boundary - Captura erros não tratados
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo)
    
    // Aqui poderia integrar com serviço de monitoramento como Sentry
    // Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
          <div className='max-w-md w-full mx-4 p-8 bg-white dark:bg-dark-800 rounded-xl shadow-lg text-center'>
            <div className='w-16 h-16 mx-auto mb-4 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center'>
              <svg 
                className='w-8 h-8 text-error-600' 
                fill='none' 
                stroke='currentColor' 
                viewBox='0 0 24 24'
              >
                <path 
                  strokeLinecap='round' 
                  strokeLinejoin='round' 
                  strokeWidth={2} 
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' 
                />
              </svg>
            </div>
            
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              Oops! Algo deu errado
            </h2>
            
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            
            <button
              type='button'
              onClick={() => window.location.reload()}
              className='w-full bg-primary-900 hover:bg-primary-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200'
            >
              Recarregar Página
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className='mt-4 text-left'>
                <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className='mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto'>
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Provider principal que combina todos os outros providers
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}