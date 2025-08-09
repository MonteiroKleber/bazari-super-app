import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from '@app/i18n/useTranslation'

// Páginas carregadas de forma lazy para otimização
const HomePage = lazy(() => import('@pages/Home'))
const NotFoundPage = lazy(() => import('@pages/NotFound'))

/**
 * Componente de Loading para Suspense
 */
const PageLoader = () => {
  const { t } = useTranslation('common')
  
  return (
    <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
      <div className='text-center'>
        <div className='w-12 h-12 mx-auto mb-4 border-4 border-primary-900 border-t-transparent rounded-full animate-spin' />
        <p className='text-gray-600 dark:text-gray-400'>{t('loading')}</p>
      </div>
    </div>
  )
}

/**
 * Rota protegida - verificará autenticação nas próximas etapas
 * Por enquanto apenas renderiza o componente
 */
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // TODO: Implementar verificação de autenticação na ETAPA 3
  // const { isAuthenticated } = useAuth()
  // if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  
  return <>{children}</>
}

/**
 * Rota pública - redireciona se já autenticado
 */
interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  // TODO: Implementar verificação de autenticação na ETAPA 3
  // const { isAuthenticated } = useAuth()
  // if (isAuthenticated) return <Navigate to="/dashboard" replace />
  
  return <>{children}</>
}

/**
 * Configuração principal de rotas da aplicação
 */
export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rota raiz - redireciona para home */}
        <Route path='/' element={<Navigate to='/home' replace />} />
        
        {/* Página inicial */}
        <Route
          path='/home'
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />

        {/* Rotas de autenticação - serão implementadas na ETAPA 3 */}
        {/* 
        <Route path='/auth/*' element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <AuthRoutes />
            </Suspense>
          </PublicRoute>
        } />
        */}

        {/* Rotas protegidas - serão implementadas nas próximas etapas */}
        {/*
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path='/profile/*' element={
          <ProtectedRoute>
            <ProfileRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/marketplace/*' element={
          <ProtectedRoute>
            <MarketplaceRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/wallet/*' element={
          <ProtectedRoute>
            <WalletRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/dao/*' element={
          <ProtectedRoute>
            <DaoRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/social/*' element={
          <ProtectedRoute>
            <SocialRoutes />
          </ProtectedRoute>
        } />
        
        <Route path='/work/*' element={
          <ProtectedRoute>
            <WorkRoutes />
          </ProtectedRoute>
        } />
        */}

        {/* Página 404 - deve ser a última rota */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
