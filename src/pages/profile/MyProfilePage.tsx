import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

export const MyProfilePage: FC = () => {
  const navigate = useNavigate()
  const { 
    isAuthenticated, 
    currentAccount, 
    user, 
    isLoading,
    currentSession,
    accounts 
  } = useAuth()

  // 🔧 DEBUG: Log de todos os estados
  useEffect(() => {
    console.log('🔧 DEBUG MyProfilePage - Estados da autenticação:')
    console.log('- isAuthenticated:', isAuthenticated)
    console.log('- isLoading:', isLoading)
    console.log('- currentAccount:', currentAccount)
    console.log('- currentSession:', currentSession)
    console.log('- accounts:', accounts)
    console.log('- user:', user)
  }, [isAuthenticated, isLoading, currentAccount, currentSession, accounts, user])

  useEffect(() => {
    console.log('🔧 DEBUG: useEffect executado')
    console.log('- isAuthenticated:', isAuthenticated)
    console.log('- isLoading:', isLoading)
    
    // ✅ CORREÇÃO: Aguardar carregamento terminar antes de redirecionar
    if (isLoading) {
      console.log('🔧 DEBUG: Ainda carregando, aguardando...')
      return
    }
    
    if (!isAuthenticated) {
      console.log('🔧 DEBUG: Não autenticado, redirecionando para login')
      navigate('/auth/login')
      return
    }
    
    console.log('🔧 DEBUG: Usuário autenticado, permanecendo na página')
  }, [isAuthenticated, isLoading, navigate])

  const handleEditProfile = () => {
    navigate('/profile/edit')
  }

  // ✅ CORREÇÃO: Mostrar loading enquanto carrega
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  // ✅ DEBUG: Mostrar estado de autenticação na tela
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 🔧 DEBUG INFO */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">🔧 Debug Info:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div>✅ isAuthenticated: <strong>{isAuthenticated ? 'true' : 'false'}</strong></div>
            <div>⏳ isLoading: <strong>{isLoading ? 'true' : 'false'}</strong></div>
            <div>👤 currentAccount: <strong>{currentAccount ? currentAccount.name : 'null'}</strong></div>
            <div>🔐 currentSession: <strong>{currentSession ? 'existe' : 'null'}</strong></div>
            <div>📦 accounts: <strong>{accounts.length} contas</strong></div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <button
            onClick={handleEditProfile}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Editar Perfil
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-6 mb-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.name || currentAccount?.name || 'Usuário'}
              </h2>
              <p className="text-gray-600">Membro desde {
                currentAccount?.createdAt ? 
                new Date(currentAccount.createdAt).toLocaleDateString('pt-BR') : 
                'hoje'
              }</p>
              <p className="text-sm text-gray-500 font-mono mt-1">
                {currentAccount?.address ? 
                  `${currentAccount.address.slice(0, 8)}...${currentAccount.address.slice(-8)}` : 
                  'Endereço não disponível'
                }
              </p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-gray-600">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-gray-600">Seguindo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
          </div>

          {/* Account Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Conta</h3>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Ativo
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                🔒 Não Tokenizado
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <div className="text-left">
                <div className="font-medium">Tokenizar Perfil</div>
                <div className="text-sm text-gray-600">Transforme seu perfil em NFT</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/search/users')}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="text-left">
                <div className="font-medium">Buscar Usuários</div>
                <div className="text-sm text-gray-600">Encontre outros membros</div>
              </div>
            </div>
          </button>
        </div>

        {/* 🔧 DEBUG: Estado completo */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">🔧 Estado Completo:</h3>
          <pre className="text-xs text-gray-700 overflow-x-auto">
            {JSON.stringify({ 
              isAuthenticated, 
              isLoading, 
              hasAccount: !!currentAccount,
              hasSession: !!currentSession,
              accountsCount: accounts.length 
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}