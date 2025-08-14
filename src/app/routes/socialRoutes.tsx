// src/app/routes/socialRoutes.tsx

import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { AuthGuard } from '@shared/guards/AuthGuard'

// Lazy loading das páginas
const SocialFeed = lazy(() => 
  import('@pages/social/SocialFeed').then(m => ({ default: m.SocialFeed }))
)

const SocialPostCreate = lazy(() => 
  import('@pages/social/SocialPostCreate').then(m => ({ default: m.SocialPostCreate }))
)

const SocialNotifications = lazy(() => 
  import('@pages/social/SocialNotifications').then(m => ({ default: m.SocialNotifications }))
)

const SocialTimeline = lazy(() => 
  import('@pages/social/SocialTimeline').then(m => ({ default: m.SocialTimeline }))
)

// Loader para páginas sociais
const SocialLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-2xl mx-auto">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-sand-200 rounded w-48"></div>
          <div className="h-10 bg-sand-200 rounded w-32"></div>
        </div>
        
        {/* Card skeletons */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-sand-200 p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-sand-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-sand-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-sand-200 rounded w-20"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-sand-200 rounded"></div>
              <div className="h-4 bg-sand-200 rounded w-3/4"></div>
            </div>
            <div className="flex space-x-4">
              <div className="h-8 bg-sand-200 rounded w-20"></div>
              <div className="h-8 bg-sand-200 rounded w-24"></div>
              <div className="h-8 bg-sand-200 rounded w-28"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const socialRoutes: RouteObject[] = [
  {
    path: '/social',
    element: (
      <AuthGuard>
        <Suspense fallback={<SocialLoader />}>
          <SocialFeed />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/social/post',
    element: (
      <AuthGuard>
        <Suspense fallback={<SocialLoader />}>
          <SocialPostCreate />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/social/notifications', 
    element: (
      <AuthGuard>
        <Suspense fallback={<SocialLoader />}>
          <SocialNotifications />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/social/timeline',
    element: (
      <AuthGuard>
        <Suspense fallback={<SocialLoader />}>
          <SocialTimeline />
        </Suspense>
      </AuthGuard>
    )
  }
]