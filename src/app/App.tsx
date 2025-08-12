import { BrowserRouter } from 'react-router-dom'

import { AppProviders } from './providers'
import { AppRoutes } from './routes'

/**
 * Componente principal da aplicação Bazari
 * Configura providers e roteamento
 */
const App = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className='min-h-screen bg-light-100 dark:bg-dark-900 text-gray-900 dark:text-gray-100'>
          <AppRoutes />
        </div>
      </AppProviders>
    </BrowserRouter>
  )
}

export default App