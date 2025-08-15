#!/bin/bash

echo "🔧 BAZARI - CORREÇÃO ROTAS DE PERFIL"
echo "===================================="
echo "🎯 Corrigindo componentes de perfil que causam erro"
echo ""

# ==========================================
# 1. CRIAR PÁGINAS DE PERFIL FUNCIONAIS
# ==========================================

echo "👤 [1/5] Criando páginas de perfil básicas..."

mkdir -p src/pages/profile

# MyProfilePage.tsx
cat > src/pages/profile/MyProfilePage.tsx << 'EOF'
import { FC } from 'react'

export const MyProfilePage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <a
              href="/profile/edit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar Perfil
            </a>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-lg"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end -mt-12 mb-4">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>
            
            {/* User Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">João Silva</h2>
                <p className="text-gray-600">@joaosilva</p>
              </div>
              
              <p className="text-gray-700">
                Desenvolvedor apaixonado por Web3 e tecnologias descentralizadas. 
                Criando o futuro da internet, um smart contract por vez.
              </p>
              
              {/* Stats */}
              <div className="flex space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">Seguindo</div>
                </div>
              </div>
              
              {/* Tokenization Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">Tokenização de Perfil</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Transforme seu perfil em um NFT e monetize sua reputação
                    </p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Tokenizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfilePage
EOF

# EditProfilePage.tsx
cat > src/pages/profile/EditProfilePage.tsx << 'EOF'
import { FC, useState } from 'react'

export const EditProfilePage: FC = () => {
  const [formData, setFormData] = useState({
    name: 'João Silva',
    bio: 'Desenvolvedor apaixonado por Web3 e tecnologias descentralizadas.',
    location: 'São Paulo, Brasil',
    website: 'https://joaosilva.dev'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Salvando perfil:', formData)
    // TODO: Implementar salvamento
    window.location.href = '/profile'
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/profile"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Perfil
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Perfil
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Alterar Foto
                </button>
              </div>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografia
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cidade, País"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://seusite.com"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar Alterações
              </button>
              <a
                href="/profile"
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center"
              >
                Cancelar
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage
EOF

# PublicProfilePage.tsx
cat > src/pages/profile/PublicProfilePage.tsx << 'EOF'
import { FC } from 'react'
import { useParams } from 'react-router-dom'

export const PublicProfilePage: FC = () => {
  const { userId } = useParams<{ userId: string }>()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Perfil Público</h1>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-t-lg"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3 mt-12">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Seguir
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Mensagem
                </button>
              </div>
            </div>
            
            {/* User Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Usuário #{userId}</h2>
                <p className="text-gray-600">@usuario{userId}</p>
              </div>
              
              <p className="text-gray-700">
                Este é o perfil público do usuário #{userId}. 
                Aqui você pode ver as informações públicas e interagir com o usuário.
              </p>
              
              {/* Stats */}
              <div className="flex space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">134</div>
                  <div className="text-sm text-gray-500">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">89</div>
                  <div className="text-sm text-gray-500">Seguindo</div>
                </div>
              </div>
              
              {/* Tokenization Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <h3 className="font-medium text-green-900">Perfil Tokenizado</h3>
                    <p className="text-sm text-green-700">
                      Este usuário tokenizou seu perfil como NFT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage
EOF

# ==========================================
# 2. CORRIGIR PROFILEROUTES COM IMPORTS SIMPLES
# ==========================================

echo "🛣️ [2/5] Criando profileRoutes.tsx corrigido..."
cat > src/app/routes/profileRoutes.tsx << 'EOF'
import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { AuthGuard } from '@shared/guards/AuthGuard'

// ✅ LAZY IMPORTS SIMPLES (sem .then syntax complexa)
const MyProfilePage = lazy(() => import('@pages/profile/MyProfilePage'))
const EditProfilePage = lazy(() => import('@pages/profile/EditProfilePage'))
const PublicProfilePage = lazy(() => import('@pages/profile/PublicProfilePage'))

// ✅ LOADING SIMPLES PARA PERFIL
const ProfileLoader = () => (
  <div className="flex items-center justify-center min-h-96 bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
      <p className="text-gray-500 text-sm">Carregando perfil...</p>
    </div>
  </div>
)

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    children: [
      // Meu perfil (protegido)
      {
        index: true,
        element: (
          <AuthGuard>
            <Suspense fallback={<ProfileLoader />}>
              <MyProfilePage />
            </Suspense>
          </AuthGuard>
        )
      },
      
      // Editar perfil (protegido)
      {
        path: 'edit',
        element: (
          <AuthGuard>
            <Suspense fallback={<ProfileLoader />}>
              <EditProfilePage />
            </Suspense>
          </AuthGuard>
        )
      },
      
      // Perfil público (usuário específico)
      {
        path: ':userId',
        element: (
          <Suspense fallback={<ProfileLoader />}>
            <PublicProfilePage />
          </Suspense>
        )
      }
    ]
  }
]
EOF

# ==========================================
# 3. VERIFICAR SE AUTHGUARD EXISTE
# ==========================================

echo "🛡️ [3/5] Verificando AuthGuard..."
if [ ! -f "src/shared/guards/AuthGuard.tsx" ]; then
  echo "   ↳ Criando AuthGuard básico..."
  mkdir -p src/shared/guards
  
  cat > src/shared/guards/AuthGuard.tsx << 'EOF'
import { FC, ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  // TODO: Implementar verificação de autenticação real na ETAPA 3
  // Por enquanto, apenas renderiza o children
  
  const isAuthenticated = true // Simulado para desenvolvimento
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar esta página.
          </p>
          <a
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard
EOF
fi

# ==========================================
# 4. ATUALIZAR ROUTER PRINCIPAL
# ==========================================

echo "🔗 [4/5] Integrando rotas de perfil no router principal..."
cat > src/app/routes/index.tsx << 'EOF'
import { createBrowserRouter } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from '@shared/components/Layout'
import { profileRoutes } from './profileRoutes'

// ✅ LAZY IMPORTS BÁSICOS
const HomePage = lazy(() => import('@pages/Home'))
const NotFoundPage = lazy(() => import('@pages/NotFound'))
const DashboardPage = lazy(() => import('@pages/DashboardPage'))

// ✅ LOADING SIMPLES
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Carregando...</p>
    </div>
  </div>
)

// ✅ ROUTER COM ROTAS DE PERFIL FUNCIONAIS
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Erro na página</h1>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    ),
    children: [
      // ✅ Página inicial
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        )
      },
      
      // ✅ Dashboard
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        )
      },

      // ✅ ROTAS DE PERFIL ATIVAS
      ...profileRoutes,

      // 🚧 TODO: Outras rotas (quando necessário)
      // ...authRoutes,
      // ...marketplaceRoutes,

      // ✅ Página 404
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        )
      }
    ]
  }
])
EOF

# ==========================================
# 5. ATUALIZAR LAYOUT COM LINKS DE PERFIL
# ==========================================

echo "📱 [5/5] Atualizando Layout com navegação de perfil..."
cat > src/shared/components/Layout.tsx << 'EOF'
import { FC } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export const Layout: FC = () => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🔥 Bazari
              </h1>
            </div>
            
            <nav className="flex space-x-4">
              <a 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Home
              </a>
              <a 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </a>
              <a 
                href="/profile" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/profile') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Perfil
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 Bazari Super App - Marketplace Web3
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
EOF

echo ""
echo "✅ ROTAS DE PERFIL CORRIGIDAS!"
echo "=============================="
echo ""
echo "🔧 Problemas resolvidos:"
echo "  ✅ Páginas de perfil criadas (funcionais)"
echo "  ✅ Lazy imports simplificados"
echo "  ✅ AuthGuard básico criado"
echo "  ✅ profileRoutes.tsx corrigido"
echo "  ✅ Integração no router principal"
echo "  ✅ Navegação atualizada"
echo ""
echo "🚀 Execute: npm run dev"
echo ""
echo "🧪 URLs para testar:"
echo "  http://localhost:3000/profile      → Meu Perfil ✅"
echo "  http://localhost:3000/profile/edit → Editar ✅"
echo "  http://localhost:3000/profile/123  → Perfil Público ✅"
echo ""
echo "📝 Agora descomente as rotas de perfil no router e teste!"
echo ""