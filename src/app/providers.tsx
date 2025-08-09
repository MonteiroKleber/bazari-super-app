import React, { ReactNode, useEffect, useState } from 'react'
import { LanguageProvider } from './i18n/LanguageProvider'
import { useTranslation } from './i18n/useTranslation'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Provider de tema - gerencia tema claro/escuro
 */
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Detecta preferência do sistema
    const savedTheme = localStorage.getItem('bazari_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)

    // Função para alternar tema (disponível globalmente para testes)
    const toggleTheme = () => {
      const newTheme = isDark ? 'light' : 'dark'
      setIsDark(!isDark)
      localStorage.setItem('bazari_theme', newTheme)
      document.documentElement.classList.toggle('dark', !isDark)
    }

    // Expõe função de toggle via window para facilitar testes
    ;(window as any).toggleTheme = toggleTheme
  }, [isDark])

  return <>{children}</>
}

/**
 * Error Boundary - captura erros React
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

/**
 * Componente de fallback para erro
 */
const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  // Hook aqui é seguro pois está dentro do provider
  const { t } = useTranslation('errors')

  return (
    <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
      <div className='max-w-md w-full mx-4 p-8 bg-white dark:bg-dark-800 rounded-xl shadow-lg text-center'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
          {t('unexpectedError')}
        </h2>
        
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          {t('unexpectedErrorDescription')}
        </p>
        
        <button
          type='button'
          onClick={() => window.location.reload()}
          className='w-full bg-primary-900 hover:bg-primary-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200'
        >
          {t('reloadPage')}
        </button>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className='mt-4 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
              {t('errorDetails')}
            </summary>
            <pre className='mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto'>
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

/**
 * Provider principal que combina todos os outros providers
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
