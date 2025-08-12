import { FC, startTransition } from 'react' // ✅ ADICIONAR startTransition
import { useLocation } from 'react-router-dom'
import { useNavigation } from '@shared/hooks/useNavigation'
import { LoginForm } from '@features/auth/components/LoginForm'
import { AuthLayout } from '@features/auth/components/AuthLayout'

export const LoginPage: FC = () => {
   const { navigate } = useNavigation()
  const location = useLocation()
  const from = (location as any).state?.from?.pathname || '/dashboard'

  return (
    <AuthLayout title="Entrar" subtitle="Entre na sua conta">
      <LoginForm
        onSuccess={() => {
          // ✅ ENVOLVER com startTransition
          startTransition(() => {
            navigate(from, { replace: true })
          })
        }}
        onSwitchToRegister={() => {
          // ✅ ENVOLVER com startTransition - LINHA 21 QUE ESTAVA CAUSANDO ERRO
          startTransition(() => {
            navigate('/auth/register')
          })
        }}
        onSwitchToImport={() => {
          // ✅ ENVOLVER com startTransition
          startTransition(() => {
            navigate('/auth/import')
          })
        }}
      />
    </AuthLayout>
  )
}