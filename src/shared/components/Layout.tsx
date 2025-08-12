import { FC } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export const Layout: FC = () => {
  const location = useLocation()
  
  // ✅ CORRIGIDO: Páginas que não precisam do layout completo
  const noLayoutPages = [
    '/',                    // ✅ ADICIONAR: Home é landing independente  
    '/auth/login', 
    '/auth/register', 
    '/auth/import', 
    '/auth/recovery'
  ]
  
  const shouldShowLayout = !noLayoutPages.includes(location.pathname)
  
  // ✅ Páginas independentes (sem header do marketplace)
  if (!shouldShowLayout) {
    return <Outlet />
  }

  // ✅ Páginas do app (com header do marketplace)
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