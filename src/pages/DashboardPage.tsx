import { FC } from 'react'
import { useAuth } from '@features/auth/hooks/useAuth'
import { Link } from 'react-router-dom'

export const DashboardPage: FC = () => {
  const { user, currentAccount } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo ao Bazari, {user?.name || currentAccount?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Seu dashboard Web3 está em construção. Por enquanto, explore as funcionalidades disponíveis.
          </p>
        </div>

        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Meu Perfil */}
          <Link 
            to="/profile" 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                Meu Perfil
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Visualize e edite seu perfil tokenizado, gerencie suas informações e estatísticas.
            </p>
          </Link>

          {/* Buscar Usuários */}
          <Link 
            to="/search/users" 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                Buscar Usuários
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Encontre outros usuários na rede Bazari e conecte-se com a comunidade.
            </p>
          </Link>

          {/* Marketplace (Em breve) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-400">
                Marketplace
              </h3>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Em breve
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Compre e venda produtos e serviços no marketplace descentralizado.
            </p>
          </div>

          {/* Wallet (Em breve) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-400">
                Carteira Web3
              </h3>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Em breve
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Gerencie seus tokens BZR, NFTs e transações blockchain.
            </p>
          </div>

          {/* DAO (Em breve) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-400">
                Governança DAO
              </h3>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Em breve
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Participe das decisões da comunidade e vote em propostas.
            </p>
          </div>

          {/* Social (Em breve) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-400">
                Rede Social
              </h3>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Em breve
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Conecte-se, compartilhe e interaja com a comunidade Bazari.
            </p>
          </div>
        </div>

        {/* Informações da Conta */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Nome:</span>
              <span className="ml-2 text-gray-900">{user?.name || currentAccount?.name || 'Usuário'}</span>
            </div>
            <div>
              <span className="text-gray-500">Endereço:</span>
              <span className="ml-2 text-gray-900 font-mono text-xs">
                {currentAccount?.address ? 
                  `${currentAccount.address.slice(0, 8)}...${currentAccount.address.slice(-8)}` : 
                  'Não disponível'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-500">Conta criada:</span>
              <span className="ml-2 text-gray-900">
                {currentAccount?.createdAt ? 
                  new Date(currentAccount.createdAt).toLocaleDateString('pt-BR') : 
                  'Não disponível'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className="ml-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Ativo
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Próximas Funcionalidades */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🚀 Próximas Funcionalidades</h3>
          <p className="text-blue-700 text-sm mb-4">
            O Bazari está em desenvolvimento ativo. Estas funcionalidades serão implementadas em breve:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-blue-700">
              <span className="mr-2">📊</span>
              <span>Dashboard completo com métricas</span>
            </div>
            <div className="flex items-center text-blue-700">
              <span className="mr-2">🛒</span>
              <span>Marketplace de produtos e serviços</span>
            </div>
            <div className="flex items-center text-blue-700">
              <span className="mr-2">💰</span>
              <span>Carteira Web3 integrada</span>
            </div>
            <div className="flex items-center text-blue-700">
              <span className="mr-2">🏛️</span>
              <span>Sistema de governança DAO</span>
            </div>
            <div className="flex items-center text-blue-700">
              <span className="mr-2">📱</span>
              <span>Rede social descentralizada</span>
            </div>
            <div className="flex items-center text-blue-700">
              <span className="mr-2">💼</span>
              <span>Marketplace de trabalho</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}