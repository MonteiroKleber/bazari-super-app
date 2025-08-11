import { FC, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProfileViewer } from '@features/profile/components/ProfileViewer'
import { useProfile } from '@features/profile/hooks/useProfile'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

export const PublicProfilePage: FC = () => {
  const { t } = useProfileTranslation()
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { profile, loadProfile, isLoading, error } = useProfile(userId)

  useEffect(() => {
    if (userId) {
      loadProfile()
    }
  }, [userId, loadProfile])

  if (!userId) {
    navigate('/search/users')
    return null
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('profileError')}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/search/users')}
            className="btn-primary"
          >
            {t('searchOtherUsers')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </button>
      </div>

      <ProfileViewer userId={userId} showActions={true} />
    </div>
  )
}
