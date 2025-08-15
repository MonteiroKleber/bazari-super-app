import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

const RouteLoader = () => <div className="p-6">Carregando…</div>

// Use caminho relativo a partir de src/app/routes/
const WorkHome = lazy(() =>
  import('../../features/work/pages/work/WorkHome').then(m => ({ default: m.default || m.WorkHome }))
)
const WorkProjectDetail = lazy(() =>
  import('../../features/work/pages/work/WorkProjectDetail').then(m => ({ default: m.default || m.WorkProjectDetail }))
)
const WorkCreateProject = lazy(() =>
  import('../../features/work/pages/work/WorkCreateProject').then(m => ({ default: m.default || m.WorkCreateProject }))
)
const WorkProposals = lazy(() =>
  import('../../features/work/pages/work/WorkProposals').then(m => ({ default: m.default || m.WorkProposals }))
)
const WorkDashboardClient = lazy(() =>
  import('../../features/work/pages/work/WorkDashboardClient').then(m => ({ default: m.default || m.WorkDashboardClient }))
)
const WorkDashboardFreelancer = lazy(() =>
  import('../../features/work/pages/work/WorkDashboardFreelancer').then(m => ({ default: m.default || m.WorkDashboardFreelancer }))
)

export const workRoutes: RouteObject[] = [
  {
    path: '/work',
    element: (
      <Suspense fallback={<RouteLoader />}>
        <WorkHome />
      </Suspense>
    )
  },
  {
    path: '/work/new',
    element: (
      <Suspense fallback={<RouteLoader />}>
        <WorkCreateProject />
      </Suspense>
    )
  },
  {
    path: '/work/p/:slug',
    element: (
      <Suspense fallback={<RouteLoader />}>
        <WorkProjectDetail />
      </Suspense>
    )
  },
  {
    path: '/work/me/proposals',
    element: (
      <Suspense fallback={<RouteLoader />}>
        <WorkProposals />
      </Suspense>
    )
  },
  {
    path: '/work/me/client',
    element: (
      <Suspense fallback={<RouteLoader />}>
        <WorkDashboardClient />
      </Suspense>
    )
  },
  {
    path: '/work/me/freelancer',
    element: (
      <Suspense fallback={<RouteLoader />}>
        <WorkDashboardFreelancer />
      </Suspense>
    )
  }
]
