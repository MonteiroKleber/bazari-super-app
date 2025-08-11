import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileViewer } from '@features/profile/components/ProfileViewer'
import { useProfile } from '@features/profile/hooks/useProfile'
import { useAuth } from '@features/auth/hooks/useAuth'
import { useProfileTranslation } from '@app/i18n/useTranslation'

export const MyProfilePage: FC = () => {
  const { t } = useProfileTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, currentAccount } = useAuth()
  const { loadProfile } = useProfile()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }

    if (currentAccount) {
      loadProfile(currentAccount.id)
    }
  }, [isAuthenticated, currentAccount, navigate, loadProfile])

  const handleEditProfile = () => {
    navigate('/profile/edit')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('myProfile')}</h1>
        <button
          onClick={handleEditProfile}
          className="btn-primary"
        >
          {t('editProfile')}
        </button>
      </div>

      <ProfileViewer userId={currentAccount?.id} showActions={false} />
    </div>
  )
}
