import { FC } from 'react'
import { useProfile } from '../hooks/useProfile'
import { ReputationDisplay } from './ReputationDisplay'
import { ProfileStats } from './ProfileStats'
import { TokenizationPanel } from './TokenizationPanel'
import { useProfileTranslation } from '@app/i18n/useTranslation'

interface ProfileViewerProps {
  userId?: string
  showActions?: boolean
  compact?: boolean
}

export const ProfileViewer: FC<ProfileViewerProps> = ({
  userId,
  showActions = true,
  compact = false
}) => {
  const { t } = useProfileTranslation()
  const { profile, isLoading, isOwner } = useProfile(userId)

  if (isLoading) {
    return <ProfileViewerSkeleton compact={compact} />
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('profileNotFound')}</h3>
        <p className="text-gray-600">{t('profileNotFoundDescription')}</p>
      </div>
    )
  }

  if (compact) {
    return <CompactProfileView profile={profile} showActions={showActions && isOwner} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg mx-auto">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                <span className="text-3xl font-bold text-primary-600">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Verification Badge */}
          {profile.isVerified && (
            <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {/* Tokenized Badge */}
          {profile.isTokenized && (
            <div className="absolute bottom-2 left-2 bg-secondary-500 rounded-full p-1">
              <svg className="w-4 h-4 text-primary-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          {profile.name}
        </h1>

        {profile.bio && (
          <p className="text-gray-600 max-w-2xl mx-auto">
            {profile.bio}
          </p>
        )}

        <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
          {profile.location && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{profile.location}</span>
            </div>
          )}

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>{t('website')}</span>
            </a>
          )}

          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{t('memberSince', { date: profile.createdAt.toLocaleDateString() })}</span>
          </div>
        </div>
      </div>

      {/* Social Stats */}
      <div className="flex justify-center space-x-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{profile.followersCount}</div>
          <div className="text-sm text-gray-500">{t('followers')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{profile.followingCount}</div>
          <div className="text-sm text-gray-500">{t('following')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{profile.postsCount}</div>
          <div className="text-sm text-gray-500">{t('posts')}</div>
        </div>
      </div>

      {/* Reputation */}
      <ReputationDisplay reputation={profile.reputation} />

      {/* Tokenization Panel */}
      {(profile.isTokenized || isOwner) && (
        <TokenizationPanel 
          profile={profile} 
          canEdit={isOwner}
        />
      )}

      {/* Stats */}
      <ProfileStats stats={profile.stats} />

      {/* Badges */}
      {profile.badges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('badges')}</h3>
          <div className="flex flex-wrap gap-3">
            {profile.badges.filter(badge => badge.isVisible).map(badge => (
              <div
                key={badge.id}
                className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: badge.color + '20', color: badge.color }}
              >
                <span className="mr-2">{badge.icon}</span>
                {badge.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && !isOwner && (
        <div className="flex space-x-4 pt-4">
          <button className="flex-1 btn-primary">
            {t('follow')}
          </button>
          <button className="flex-1 btn-secondary">
            {t('message')}
          </button>
        </div>
      )}
    </div>
  )
}

// Compact version for cards/lists
const CompactProfileView: FC<{ profile: User; showActions: boolean }> = ({ profile, showActions }) => {
  const { t } = useProfileTranslation()

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              <span className="text-lg font-bold text-primary-600">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {profile.isTokenized && (
          <div className="absolute -bottom-1 -right-1 bg-secondary-500 rounded-full p-1">
            <svg className="w-3 h-3 text-primary-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{profile.name}</h3>
          {profile.isVerified && (
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        {profile.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{profile.bio}</p>
        )}
        
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <span>{profile.reputation.overall} {t('reputation')}</span>
          <span>{profile.followersCount} {t('followers')}</span>
          {profile.location && <span>{profile.location}</span>}
        </div>
      </div>

      {showActions && (
        <div className="flex flex-col space-y-2">
          <button className="btn-primary text-sm px-4 py-2">
            {t('follow')}
          </button>
        </div>
      )}
    </div>
  )
}

// Loading skeleton
const ProfileViewerSkeleton: FC<{ compact: boolean }> = ({ compact }) => {
  if (compact) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto"></div>
      </div>
      <div className="flex justify-center space-x-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="text-center">
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
