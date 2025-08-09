import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const HomePage = lazy(() => import('@pages/Home'))
const NotFoundPage = lazy(() => import('@pages/NotFound'))

const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900'>
    <div className='text-center'>
      <div className='w-12 h-12 mx-auto mb-4 border-4 border-primary-900 border-t-transparent rounded-full animate-spin' />
      <p className='text-gray-600 dark:text-gray-400'>Carregando...</p>
    </div>
  </div>
)

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path='/' element={<Navigate to='/home' replace />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
