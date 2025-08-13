import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { AuthGuard } from '@shared/guards/AuthGuard'

// ✅ LAZY IMPORTS SIMPLES (sem .then syntax complexa)
const MyProfilePage = lazy(() =>
   import('@pages/profile/MyProfilePage').then(m => ({ default: m.MyProfilePage }))
)
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
