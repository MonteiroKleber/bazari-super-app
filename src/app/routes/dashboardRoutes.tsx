import { Suspense, lazy } from 'react'
import { AuthGuard } from '@shared/guards/AuthGuard'
const DashboardHome = lazy(() => import("../../pages/DashboardHome"));


// Loader component para DAO
const DashboardLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Carregando DAO...</p>
    </div>
  </div>
)


const routes = [
  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <Suspense fallback={<DashboardLoader />}>
          <DashboardHome />
        </Suspense>
      </AuthGuard>
    )
  },
];

export default routes;
