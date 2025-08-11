import { FC } from 'react'
import { Link } from 'react-router-dom'

export const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-secondary-500 rounded flex items-center justify-center">
              <span className="text-primary-900 font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-bold">Bazari</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Bazari - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}