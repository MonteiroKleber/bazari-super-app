import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'
import { CartButton } from '@features/marketplace/components/CartButton'
import { Button } from '@shared/ui/Button'
import { Icons } from '@shared/ui/Icons'

export const Header: FC = () => {
  const { isAuthenticated, currentAccount, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Bazari</span>
          </Link>

          {/* Navegação Central */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/marketplace" 
              className={`font-medium transition-colors ${
                isActive('/marketplace') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              🛒 Marketplace
            </Link>
            
            <Link 
              to="/search/users" 
              className={`font-medium transition-colors ${
                isActive('/search') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              👥 Usuários
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/marketplace/create-business" 
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                💼 Criar Negócio
              </Link>
            )}
          </nav>

          {/* Ações do Usuário */}
          <div className="flex items-center space-x-4">
            {/* Carrinho */}
            <CartButton />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Menu do Usuário */}
                <div className="relative group">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Icons.User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {currentAccount?.address?.slice(0, 6)}...{currentAccount?.address?.slice(-4)}
                    </span>
                    <Icons.ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Icons.User className="w-4 h-4 mr-3" />
                        Meu Perfil
                      </Link>
                      
                      <Link
                        to="/profile/edit"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Icons.Settings className="w-4 h-4 mr-3" />
                        Configurações
                      </Link>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Icons.LogOut className="w-4 h-4 mr-3" />
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button variant="secondary" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white">
        <div className="flex justify-around py-2">
          <Link
            to="/"
            className={`flex flex-col items-center px-3 py-2 text-xs ${
              location.pathname === '/' ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <Icons.Home className="w-5 h-5 mb-1" />
            Home
          </Link>
          
          <Link
            to="/marketplace"
            className={`flex flex-col items-center px-3 py-2 text-xs ${
              isActive('/marketplace') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <Icons.ShoppingBag className="w-5 h-5 mb-1" />
            Marketplace
          </Link>
          
          <Link
            to="/search/users"
            className={`flex flex-col items-center px-3 py-2 text-xs ${
              isActive('/search') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <Icons.Users className="w-5 h-5 mb-1" />
            Usuários
          </Link>
          
          {isAuthenticated && (
            <Link
              to="/profile"
              className={`flex flex-col items-center px-3 py-2 text-xs ${
                isActive('/profile') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <Icons.User className="w-5 h-5 mb-1" />
              Perfil
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
