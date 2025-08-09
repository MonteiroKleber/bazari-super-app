import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@app/i18n/useTranslation'

const NotFound = () => {
  const { t: tErrors } = useTranslation('errors')
  const { t: tNavigation } = useTranslation('navigation')

  return (
    <div className='min-h-screen flex items-center justify-center bg-light-100 dark:bg-dark-900 px-4'>
      <div className='text-center max-w-md w-full'>
        {/* Ilustração 404 */}
        <div className='mb-8'>
          <div className='text-9xl font-bold text-primary-900 dark:text-primary-400 mb-4'>
            404
          </div>
          <div className='w-24 h-1 bg-secondary-500 mx-auto mb-6' />
        </div>

        {/* Conteúdo */}
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          {tErrors('pageNotFound')}
        </h1>
        
        <p className='text-gray-600 dark:text-gray-400 mb-8'>
          {tErrors('pageNotFoundDescription')}
        </p>

        {/* Ações */}
        <div className='space-y-4'>
          <Link
            to='/home'
            className='block w-full bg-primary-900 hover:bg-primary-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200'
          >
            {tErrors('goHome')}
          </Link>
          
          <button
            type='button'
            onClick={() => window.history.back()}
            className='block w-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200'
          >
            {tErrors('previousPage')}
          </button>
        </div>

        {/* Links úteis */}
        <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            {tErrors('usefulLinks')}
          </p>
          <div className='flex flex-wrap gap-4 justify-center text-sm'>
            <Link 
              to='/marketplace' 
              className='text-primary-700 dark:text-primary-400 hover:underline'
            >
              {tNavigation('marketplace')}
            </Link>
            <Link 
              to='/profile' 
              className='text-primary-700 dark:text-primary-400 hover:underline'
            >
              {tNavigation('profile')}
            </Link>
            <Link 
              to='/wallet' 
              className='text-primary-700 dark:text-primary-400 hover:underline'
            >
              {tNavigation('wallet')}
            </Link>
            <Link 
              to='/dao' 
              className='text-primary-700 dark:text-primary-400 hover:underline'
            >
              {tNavigation('dao')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
