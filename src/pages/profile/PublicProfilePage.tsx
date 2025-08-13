import { FC } from 'react'
import { useParams } from 'react-router-dom'

export const PublicProfilePage: FC = () => {
  const { userId } = useParams<{ userId: string }>()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Perfil Público</h1>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-t-lg"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3 mt-12">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Seguir
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Mensagem
                </button>
              </div>
            </div>
            
            {/* User Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Usuário #{userId}</h2>
                <p className="text-gray-600">@usuario{userId}</p>
              </div>
              
              <p className="text-gray-700">
                Este é o perfil público do usuário #{userId}. 
                Aqui você pode ver as informações públicas e interagir com o usuário.
              </p>
              
              {/* Stats */}
              <div className="flex space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">134</div>
                  <div className="text-sm text-gray-500">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">89</div>
                  <div className="text-sm text-gray-500">Seguindo</div>
                </div>
              </div>
              
              {/* Tokenization Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <h3 className="font-medium text-green-900">Perfil Tokenizado</h3>
                    <p className="text-sm text-green-700">
                      Este usuário tokenizou seu perfil como NFT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage
