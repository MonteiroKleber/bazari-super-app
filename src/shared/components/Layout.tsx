import { FC } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export const Layout: FC = () => {
  const location = useLocation()
  
  // Páginas que não precisam do layout completo
  const noLayoutPages = ['/auth/login', '/auth/register', '/auth/import', '/auth/recovery']
  const shouldShowLayout = !noLayoutPages.includes(location.pathname)
  
  if (!shouldShowLayout) {
    return <Outlet />
  }

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