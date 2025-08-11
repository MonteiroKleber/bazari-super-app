
// BEGIN ETAPA3-AUTH
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecoveryForm } from '@features/auth/components/RecoveryForm'
import { AuthLayout } from '@features/auth/components/AuthLayout'

export const RecoveryPage: FC = () => {
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Recuperar Conta"
      subtitle="Encontre o endereço gerado pela sua seed phrase"
      showBackButton
      onBack={() => navigate('/auth/login')}
    >
      <RecoveryForm
        onSuccess={() => navigate('/auth/login')}
        onCancel={() => navigate('/auth/login')}
      />
    </AuthLayout>
  )
}
// END ETAPA3-AUTH

