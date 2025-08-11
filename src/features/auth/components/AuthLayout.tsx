
// BEGIN ETAPA3-AUTH
import { FC, ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
}

export const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-secondary-500 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-900">B</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Bazari</h1>
          <p className="text-secondary-300">Super App Web3</p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="mb-6">
            {showBackButton && (
              <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          </div>

          {children}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-secondary-300">© 2025 Bazari - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  )
}
// END ETAPA3-AUTH

