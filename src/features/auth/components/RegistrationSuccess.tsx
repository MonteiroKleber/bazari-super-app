import { FC, useEffect, useState, startTransition } from 'react'
import { useNavigate } from 'react-router-dom'

export const RegistrationSuccess: FC = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { 
          clearInterval(timer)
          // ✅ NAVEGAÇÃO PARA PERFIL COM startTransition
          startTransition(() => {
            navigate('/profile')
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-success-100 p-6">
          <svg className="h-12 w-12 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Parabéns!</h3>
        <p className="text-gray-600">Sua conta foi criada com sucesso!</p>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-primary-700">
          Redirecionando para seu perfil em {countdown} segundos...
        </p>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>✅ Conta criada com segurança</p>
        <p>✅ Frase de recuperação salva</p>
        <p>✅ Pronto para usar o Bazari</p>
      </div>

      <button
        onClick={() => startTransition(() => navigate('/profile'))}
        className="btn-primary"
      >
        Ir para Meu Perfil
      </button>
    </div>
  )
}