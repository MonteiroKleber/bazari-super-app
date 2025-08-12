import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './providers'
import { router } from './routes'

const App = () => {
  return (
    <AppProviders>
      <div className='min-h-screen bg-light-100 dark:bg-dark-900 text-gray-900 dark:text-gray-100'>
        <RouterProvider router={router} />
      </div>
    </AppProviders>
  )
}

export default App