import { useNavigation } from '@shared/hooks/useNavigation'
import { FC, startTransition } from 'react'
import { Link} from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'
import { useProfile } from '@features/profile/hooks/useProfile'

export const Header: FC = () => {
  const { isAuthenticated, currentAccount, logout } = useAuth()
  const { profile } = useProfile(currentAccount?.id)
  const { navigate } = useNavigation() 

  const handleLogout = () => {
    logout()
    startTransition(() => {
      navigate('/')
    })
  }

  const handleProfileClick = () => {
    // ✅ NAVEGAÇÃO PARA PERFIL COM startTransition
    startTransition(() => {
      navigate('/profile')
    })
  }

  const handleEditProfileClick = () => {
    // ✅ NAVEGAÇÃO PARA EDITAR PERFIL COM startTransition
    startTransition(() => {
      navigate('/profile/edit')
    })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Bazari</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/marketplace" className="text-gray-700 hover:text-primary-600 transition-colors">
              Marketplace
            </Link>
            <Link to="/search/users" className="text-gray-700 hover:text-primary-600 transition-colors">
              Usuários
            </Link>
            <Link to="/dao" className="text-gray-700 hover:text-primary-600 transition-colors">
              DAO
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Balance */}
                <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-gray-700">0.00 BZR</span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      {profile?.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100">
                          <span className="text-primary-600 font-medium text-sm">
                            {profile?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button 
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Meu Perfil
                      </button>
                      <button 
                        onClick={handleEditProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Editar Perfil
                      </button>
                      <Link to="/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        Carteira
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Entrar
                </Link>
                <Link to="/auth/register" className="btn-primary">
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}