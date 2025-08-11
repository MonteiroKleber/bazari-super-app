import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileEditor } from '@features/profile/components/ProfileEditor'
import { useAuth } from '@features/auth/hooks/useAuth'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

export const EditProfilePage: FC = () => {
  const { t } = useProfileTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
    }
  }, [isAuthenticated, navigate])

  const handleSave = () => {
    navigate('/profile')
  }

  const handleCancel = () => {
    navigate('/profile')
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToProfile')}
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{t('editProfile')}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <ProfileEditor onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  )
}
