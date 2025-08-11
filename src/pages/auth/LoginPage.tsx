
// BEGIN ETAPA3-AUTH
import { FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginForm } from '@features/auth/components/LoginForm'
import { AuthLayout } from '@features/auth/components/AuthLayout'
// import { useAuthTranslation } from '@shared/hooks/useTranslation'
const T = (k:string)=>k

export const LoginPage: FC = () => {
  // const { t } = useAuthTranslation()
  const t = T
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location as any).state?.from?.pathname || '/dashboard'

  return (
    <AuthLayout title={t('signIn')} subtitle={t('signInToYourAccount')}>
      <LoginForm
        onSuccess={() => navigate(from, { replace: true })}
        onSwitchToRegister={() => navigate('/auth/register')}
        onSwitchToImport={() => navigate('/auth/import')}
      />
    </AuthLayout>
  )
}
// END ETAPA3-AUTH

