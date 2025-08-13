import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { AppProviders } from './providers'
import { router } from './routes'

// ✅ ERROR FALLBACK MELHORADO
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h1 className="text-xl font-semibold text-gray-900 mb-4">
        Ops! Algo deu errado
      </h1>
      <p className="text-gray-600 mb-6">
        Ocorreu um erro inesperado. Tente recarregar a página.
      </p>
      
      <div className="space-y-3">
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Recarregar Página
        </button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Detalhes do erro (dev)
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto text-red-600">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
)

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // ✅ LOG DO ERRO PARA DEBUG
        console.error('🚨 Erro capturado pelo ErrorBoundary:', error)
        console.error('📍 Informações adicionais:', errorInfo)
      }}
      onReset={() => {
        // ✅ RESET DE ESTADO SE NECESSÁRIO
        window.location.href = '/'
      }}
    >
      <AppProviders>
        <div className='min-h-screen bg-light-100 dark:bg-dark-900 text-gray-900 dark:text-gray-100'>
          <RouterProvider 
            router={router}
            fallbackElement={<div>Carregando aplicação...</div>}
          />
        </div>
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App