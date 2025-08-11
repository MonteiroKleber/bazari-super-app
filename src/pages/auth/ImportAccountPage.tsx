
// BEGIN ETAPA3-AUTH
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImportAccountForm } from '@features/auth/components/ImportAccountForm'
import { AuthLayout } from '@features/auth/components/AuthLayout'

export const ImportAccountPage: FC = () => {
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Importar Conta"
      subtitle="Importe sua carteira existente"
      showBackButton
      onBack={() => navigate('/auth/login')}
    >
      <ImportAccountForm
        onSuccess={() => navigate('/dashboard')}
        onCancel={() => navigate('/auth/login')}
      />
    </AuthLayout>
  )
}
// END ETAPA3-AUTH

