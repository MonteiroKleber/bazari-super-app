import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Páginas carregadas de forma lazy para otimização
const HomePage = lazy(() => import('@pages/Home'))
const NotFoundPage = lazy(() => import('@pages/NotFound'))

const LoginPage = lazy(() =>
  import('@pages/auth/LoginPage').then(m => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('@pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage }))
)
const ImportAccountPage = lazy(() =>
  import('@pages/auth/ImportAccountPage').then(m => ({ default: m.ImportAccountPage }))
)
const RecoveryPage = lazy(() =>
  import('@pages/auth/RecoveryPage').then(m => ({ default: m.RecoveryPage }))
)

const DashboardPage = lazy(() => import('@pages/DashboardPage').then(m => ({ default: m.DashboardPage })))

// ✅ PROFILE PAGES - ADICIONADO
const MyProfilePage = lazy(() => import('@pages/profile/MyProfilePage').then(m => ({ default: m.MyProfilePage })))
const EditProfilePage = lazy(() => import('@pages/profile/EditProfilePage').then(m => ({ default: m.EditProfilePage })))
const PublicProfilePage = lazy(() => import('@pages/profile/PublicProfilePage').then(m => ({ default: m.PublicProfilePage })))
const SearchUsersPage = lazy(() => import('@pages/profile/SearchUsersPage').then(m => ({ default: m.SearchUsersPage })))

import { marketplaceRoutes } from './routes/marketplaceRoutes'

/**
 * Componente de Loading para Suspense
 */
const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
    <div className='text-center'>
      <div className='w-12 h-12 mx-auto mb-4 border-4 border-primary-900 border-t-transparent rounded-full animate-spin' />
      <p className='text-gray-600 dark:text-gray-400'>Carregando...</p>
    </div>
  </div>
)

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

        {/* ✅ DASHBOARD ADICIONADO */}
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Rotas de autenticação */}
        <Route path='/auth/*' element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path='login' element={<LoginPage />} />
                <Route path='register' element={<RegisterPage />} />
                <Route path='import' element={<ImportAccountPage />} />
                <Route path='recovery' element={<RecoveryPage />} />
                <Route path='*' element={<Navigate to='/auth/login' replace />} />
              </Routes>
            </Suspense>
          </PublicRoute>
        } />

        {/* ✅ ROTAS DO PERFIL - ATIVADAS */}
        <Route path='/profile/*' element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route index element={<MyProfilePage />} />
                <Route path='edit' element={<EditProfilePage />} />
                <Route path=':userId' element={<PublicProfilePage />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />

        {/* ✅ ROTA DE BUSCA - ATIVADA */}
        <Route path='/search/*' element={
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path='users' element={<SearchUsersPage />} />
            </Routes>
          </Suspense>
        } />

        {/* Rotas do marketplace - serão implementadas na ETAPA 5 */}
        {/* 
        <Route path='/marketplace/*' element={
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route index element={<MarketplacePage />} />
              <Route path='category/:category' element={<CategoryPage />} />
              <Route path='product/:productId' element={<ProductPage />} />
              <Route path='business/:businessId' element={<BusinessPage />} />
              <Route path='cart' element={<CartPage />} />
              <Route path='checkout' element={<CheckoutPage />} />
            </Routes>
          </Suspense>
        } />
        */}

        {/* Rotas do negócio - serão implementadas na ETAPA 5 */}
        {/* 
        <Route path='/business/*' element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route index element={<MyBusinessPage />} />
                <Route path='register' element={<RegisterBusinessPage />} />
                <Route path='edit/:businessId' element={<EditBusinessPage />} />
                <Route path='products' element={<ManageProductsPage />} />
                <Route path='analytics' element={<BusinessAnalyticsPage />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
        */}

        {/* Rotas da carteira - serão implementadas na ETAPA 6 */}
        {/* 
        <Route path='/wallet/*' element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route index element={<WalletPage />} />
                <Route path='send' element={<SendPage />} />
                <Route path='receive' element={<ReceivePage />} />
                <Route path='transactions' element={<TransactionsPage />} />
                <Route path='tokens' element={<TokensPage />} />
                <Route path='nfts' element={<NFTsPage />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
        */}

        {/* Rotas sociais - serão implementadas na ETAPA 7 */}
        {/* 
        <Route path='/social/*' element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path='feed' element={<FeedPage />} />
                <Route path='post/:postId' element={<PostPage />} />
                <Route path='followers' element={<FollowersPage />} />
                <Route path='following' element={<FollowingPage />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
        */}

        {/* Rotas da DAO - serão implementadas na ETAPA 8 */}
        {/* 
        <Route path='/dao/*' element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route index element={<DAOPage />} />
                <Route path='proposals' element={<ProposalsPage />} />
                <Route path='proposal/:proposalId' element={<ProposalPage />} />
                <Route path='create-proposal' element={<CreateProposalPage />} />
                <Route path='governance' element={<GovernancePage />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
        */}

        {/* Rotas do DEX - serão implementadas na ETAPA 8 */}
        {/* 
        <Route path='/dex/*' element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route index element={<DEXPage />} />
                <Route path='swap' element={<SwapPage />} />
                <Route path='liquidity' element={<LiquidityPage />} />
                <Route path='ranking' element={<TokenRankingPage />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
        */}

        {/* Rotas de trabalho - serão implementadas na ETAPA 9 */}
        {/* 
        <Route path='/work/*' element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route index element={<WorkPage />} />
                <Route path='projects' element={<ProjectsPage />} />
                <Route path='project/:projectId' element={<ProjectPage />} />
                <Route path='create-project' element={<CreateProjectPage />} />
                <Route path='freelancers' element={<FreelancersPage />} />
                <Route path='my-projects' element={<MyProjectsPage />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
        */}

        {/* Rotas de configurações */}
        {/* 
        <Route path='/settings/*' element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route index element={<SettingsPage />} />
                <Route path='language' element={<LanguageSettingsPage />} />
                <Route path='theme' element={<ThemeSettingsPage />} />
                <Route path='notifications' element={<NotificationSettingsPage />} />
                <Route path='privacy' element={<PrivacySettingsPage />} />
                <Route path='security' element={<SecuritySettingsPage />} />
              </Routes>
            </Suspense>
          </ProtectedRoute>
        } />
        */}

        {/* Página 404 - deve ficar por último */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}