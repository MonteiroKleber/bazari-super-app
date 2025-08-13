import { FC } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export const Layout: FC = () => {
  const location = useLocation()
  
  // ✅ CORRIGIDO: Páginas que não precisam do layout completo (Header/Footer)
  const noLayoutPages = [
    '/',                    // ✅ Home (página landing independente)
    '/auth/login',          // ✅ Páginas de autenticação
    '/auth/register', 
    '/auth/import', 
    '/auth/recovery'
  ]
  
  // 🔧 CORREÇÃO PRINCIPAL: Verificação mais robusta da rota
  const isHomePage = location.pathname === '/' || location.pathname === ''
  const isAuthPage = location.pathname.startsWith('/auth')
  const shouldShowLayout = !isHomePage && !isAuthPage
  
  // ✅ Páginas independentes (Home + Auth) - SEM Header/Footer do marketplace
  if (!shouldShowLayout) {
    return (
      <div className="min-h-screen">
        <Outlet />
      </div>
    )
  }

  // ✅ Páginas do app (Dashboard, Perfil, Marketplace) - COM Header/Footer
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}