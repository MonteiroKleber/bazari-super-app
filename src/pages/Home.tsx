const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700'>
      <header className='relative z-10 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center'>
              <span className='text-xl font-bold text-primary-900'>B</span>
            </div>
            <h1 className='text-2xl font-bold text-white'>Bazari</h1>
          </div>
          
          <nav className='hidden md:flex space-x-8'>
            <a href='#features' className='text-white hover:text-secondary-300 transition-colors'>
              Recursos
            </a>
            <a href='#about' className='text-white hover:text-secondary-300 transition-colors'>
              Sobre
            </a>
            <a href='#roadmap' className='text-white hover:text-secondary-300 transition-colors'>
              Roadmap
            </a>
          </nav>

          <div className='flex space-x-4'>
            <button className='px-6 py-2 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-primary-900 transition-all duration-200'>
              Entrar
            </button>
            <button className='px-6 py-2 bg-secondary-500 text-primary-900 rounded-lg hover:bg-secondary-400 transition-colors duration-200 font-medium'>
              Começar
            </button>
          </div>
        </div>
      </header>

      <main className='relative z-10 px-4 py-20 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <h2 className='text-5xl md:text-7xl font-bold text-white mb-6'>
            O Futuro do
            <span className='block text-secondary-400'>Comércio Social</span>
          </h2>
          
          <p className='text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto'>
            Marketplace descentralizado onde sua identidade é um ativo, 
            seus negócios são tokens e sua comunidade governa o ecossistema.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
            <button className='w-full sm:w-auto px-8 py-4 bg-secondary-500 text-primary-900 rounded-xl hover:bg-secondary-400 transition-colors duration-200 font-semibold text-lg'>
              Criar Conta Gratuita
            </button>
            <button className='w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-primary-900 transition-all duration-200 font-semibold text-lg'>
              Explorar Demo
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>100%</div>
              <div className='text-white'>Descentralizado</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>0%</div>
              <div className='text-white'>Taxas de Plataforma</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-secondary-400 mb-2'>∞</div>
              <div className='text-white'>Possibilidades</div>
            </div>
          </div>
        </div>
      </main>

      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl' />
      </div>
    </div>
  )
}

export default Home
