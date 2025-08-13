// src/features/marketplace/data/categories.ts
// Sistema completo de categorias do Marketplace Bazari
// Inclui categorias físicas + digitais tokenizadas + CategoryService

export interface Category {
  id: string
  name: string
  slug: string
  level: number
  parent?: string
  children?: string[]
  icon?: string
  description?: string
  isActive: boolean
  order: number
}

export const categories: Category[] = [
  // ============================================
  // CATEGORIAS FÍSICAS EXISTENTES (Níveis 1-4)
  // ============================================
  
  // NÍVEL 1 - Categorias Raiz Físicas
  {
    id: 'alimentacao',
    name: 'Alimentação e Bebidas',
    slug: 'alimentacao',
    level: 1,
    isActive: true,
    order: 1,
    icon: '🍽️',
    description: 'Restaurantes, cafés, delivery e produtos alimentícios',
    children: [
      'restaurantes',
      'cafes-e-lanchonetes', 
      'delivery',
      'produtos-organicos',
      'bebidas',
      'doces-e-sobremesas'
    ]
  },
  {
    id: 'comercio',
    name: 'Comércio e Varejo',
    slug: 'comercio',
    level: 1,
    isActive: true,
    order: 2,
    icon: '🛍️',
    description: 'Lojas físicas e online, produtos diversos',
    children: [
      'moda-e-vestuario',
      'eletronicos',
      'casa-e-decoracao',
      'livros-e-papelaria',
      'esportes-e-lazer',
      'pet-shop'
    ]
  },
  {
    id: 'servicos',
    name: 'Serviços',
    slug: 'servicos',
    level: 1,
    isActive: true,
    order: 3,
    icon: '🔧',
    description: 'Serviços profissionais e especializados',
    children: [
      'beleza-e-estetica',
      'saude-e-bem-estar',
      'educacao',
      'consultoria',
      'manutencao-e-reparos',
      'eventos'
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    slug: 'tecnologia',
    level: 1,
    isActive: true,
    order: 4,
    icon: '💻',
    description: 'Tecnologia, desenvolvimento e inovação',
    children: [
      'desenvolvimento-software',
      'design-grafico',
      'marketing-digital',
      'suporte-tecnico',
      'hardware',
      'telecomunicacoes'
    ]
  },

  // NÍVEL 2 - Subcategorias Alimentação
  {
    id: 'restaurantes',
    name: 'Restaurantes',
    slug: 'restaurantes',
    level: 2,
    parent: 'alimentacao',
    isActive: true,
    order: 1,
    icon: '🍽️',
    children: ['brasileira', 'italiana', 'japonesa', 'mexicana', 'vegetariana']
  },
  {
    id: 'cafes-e-lanchonetes',
    name: 'Cafés e Lanchonetes',
    slug: 'cafes-e-lanchonetes',
    level: 2,
    parent: 'alimentacao',
    isActive: true,
    order: 2,
    icon: '☕',
    children: ['cafe-gourmet', 'lanches-rapidos', 'sucos-naturais']
  },
  {
    id: 'delivery',
    name: 'Delivery',
    slug: 'delivery',
    level: 2,
    parent: 'alimentacao',
    isActive: true,
    order: 3,
    icon: '🚚'
  },
  {
    id: 'produtos-organicos',
    name: 'Produtos Orgânicos',
    slug: 'produtos-organicos',
    level: 2,
    parent: 'alimentacao',
    isActive: true,
    order: 4,
    icon: '🌱'
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    slug: 'bebidas',
    level: 2,
    parent: 'alimentacao',
    isActive: true,
    order: 5,
    icon: '🥤',
    children: ['cervejas-artesanais', 'vinhos', 'destilados', 'nao-alcoolicas']
  },
  {
    id: 'doces-e-sobremesas',
    name: 'Doces e Sobremesas',
    slug: 'doces-e-sobremesas',
    level: 2,
    parent: 'alimentacao',
    isActive: true,
    order: 6,
    icon: '🍰'
  },

  // NÍVEL 2 - Subcategorias Comércio
  {
    id: 'moda-e-vestuario',
    name: 'Moda e Vestuário',
    slug: 'moda-e-vestuario',
    level: 2,
    parent: 'comercio',
    isActive: true,
    order: 1,
    icon: '👕',
    children: ['roupas-masculinas', 'roupas-femininas', 'calcados', 'acessorios']
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos',
    slug: 'eletronicos',
    level: 2,
    parent: 'comercio',
    isActive: true,
    order: 2,
    icon: '📱',
    children: ['smartphones', 'computadores', 'games', 'eletrodomesticos']
  },
  {
    id: 'casa-e-decoracao',
    name: 'Casa e Decoração',
    slug: 'casa-e-decoracao',
    level: 2,
    parent: 'comercio',
    isActive: true,
    order: 3,
    icon: '🏠',
    children: ['moveis', 'decoracao', 'jardim', 'organizacao']
  },
  {
    id: 'livros-e-papelaria',
    name: 'Livros e Papelaria',
    slug: 'livros-e-papelaria',
    level: 2,
    parent: 'comercio',
    isActive: true,
    order: 4,
    icon: '📚'
  },
  {
    id: 'esportes-e-lazer',
    name: 'Esportes e Lazer',
    slug: 'esportes-e-lazer',
    level: 2,
    parent: 'comercio',
    isActive: true,
    order: 5,
    icon: '⚽',
    children: ['futebol', 'fitness', 'natacao', 'ciclismo']
  },
  {
    id: 'pet-shop',
    name: 'Pet Shop',
    slug: 'pet-shop',
    level: 2,
    parent: 'comercio',
    isActive: true,
    order: 6,
    icon: '🐕'
  },

  // NÍVEL 2 - Subcategorias Serviços
  {
    id: 'beleza-e-estetica',
    name: 'Beleza e Estética',
    slug: 'beleza-e-estetica',
    level: 2,
    parent: 'servicos',
    isActive: true,
    order: 1,
    icon: '💄',
    children: ['cabelereiros', 'estetica-facial', 'massagens', 'manicure']
  },
  {
    id: 'saude-e-bem-estar',
    name: 'Saúde e Bem-estar',
    slug: 'saude-e-bem-estar',
    level: 2,
    parent: 'servicos',
    isActive: true,
    order: 2,
    icon: '🏥',
    children: ['fisioterapia', 'psicologia', 'nutricao', 'medicina']
  },
  {
    id: 'educacao',
    name: 'Educação',
    slug: 'educacao',
    level: 2,
    parent: 'servicos',
    isActive: true,
    order: 3,
    icon: '🎓',
    children: ['cursos-presenciais', 'aulas-particulares', 'idiomas', 'reforco-escolar']
  },
  {
    id: 'consultoria',
    name: 'Consultoria',
    slug: 'consultoria',
    level: 2,
    parent: 'servicos',
    isActive: true,
    order: 4,
    icon: '📊',
    children: ['juridica', 'contabil', 'empresarial', 'financeira']
  },
  {
    id: 'manutencao-e-reparos',
    name: 'Manutenção e Reparos',
    slug: 'manutencao-e-reparos',
    level: 2,
    parent: 'servicos',
    isActive: true,
    order: 5,
    icon: '🔨',
    children: ['eletrica', 'hidraulica', 'pintura', 'marcenaria']
  },
  {
    id: 'eventos',
    name: 'Eventos',
    slug: 'eventos',
    level: 2,
    parent: 'servicos',
    isActive: true,
    order: 6,
    icon: '🎉',
    children: ['casamentos', 'festas', 'corporativos', 'formaturas']
  },

  // NÍVEL 2 - Subcategorias Tecnologia
  {
    id: 'desenvolvimento-software',
    name: 'Desenvolvimento de Software',
    slug: 'desenvolvimento-software',
    level: 2,
    parent: 'tecnologia',
    isActive: true,
    order: 1,
    icon: '⚡',
    children: ['web-development', 'mobile-apps', 'sistemas', 'blockchain']
  },
  {
    id: 'design-grafico',
    name: 'Design Gráfico',
    slug: 'design-grafico',
    level: 2,
    parent: 'tecnologia',
    isActive: true,
    order: 2,
    icon: '🎨',
    children: ['logotipos', 'web-design', 'impressos', 'branding']
  },
  {
    id: 'marketing-digital',
    name: 'Marketing Digital',
    slug: 'marketing-digital',
    level: 2,
    parent: 'tecnologia',
    isActive: true,
    order: 3,
    icon: '📈',
    children: ['seo', 'redes-sociais', 'ads', 'email-marketing']
  },
  {
    id: 'suporte-tecnico',
    name: 'Suporte Técnico',
    slug: 'suporte-tecnico',
    level: 2,
    parent: 'tecnologia',
    isActive: true,
    order: 4,
    icon: '🛠️'
  },
  {
    id: 'hardware',
    name: 'Hardware',
    slug: 'hardware',
    level: 2,
    parent: 'tecnologia',
    isActive: true,
    order: 5,
    icon: '💾'
  },
  {
    id: 'telecomunicacoes',
    name: 'Telecomunicações',
    slug: 'telecomunicacoes',
    level: 2,
    parent: 'tecnologia',
    isActive: true,
    order: 6,
    icon: '📡'
  },

  // ============================================
  // 🆕 CATEGORIA DIGITAIS TOKENIZADAS
  // ============================================

  // NÍVEL 1 - Categoria Raiz Digitais
  {
    id: 'digitais',
    name: 'Digitais',
    slug: 'digitais',
    level: 1,
    isActive: true,
    order: 10,
    icon: '⚡',
    description: 'Produtos digitais tokenizados na blockchain',
    children: [
      'cursos-tokenizados',
      'ebooks-digitais', 
      'software',
      'midias-digitais',
      'assinaturas-digitais',
      'colecionaveis-digitais'
    ]
  },

  // NÍVEL 2 - Subcategorias Digitais
  {
    id: 'cursos-tokenizados',
    name: 'Cursos Tokenizados',
    slug: 'cursos-tokenizados',
    level: 2,
    parent: 'digitais',
    isActive: true,
    order: 1,
    icon: '🎓',
    description: 'Cursos online com certificado NFT e acesso tokenizado',
    children: [
      'web3-development',
      'blockchain-basicos',
      'defi-trading',
      'nft-creation',
      'smart-contracts'
    ]
  },
  {
    id: 'ebooks-digitais',
    name: 'E-books Digitais',
    slug: 'ebooks-digitais',
    level: 2,
    parent: 'digitais',
    isActive: true,
    order: 2,
    icon: '📚',
    description: 'Livros digitais tokenizados com propriedade verificável',
    children: [
      'ficcao-cientifica',
      'guias-tecnicos',
      'biografia',
      'negocios',
      'autoajuda'
    ]
  },
  {
    id: 'software',
    name: 'Software',
    slug: 'software',
    level: 2,
    parent: 'digitais',
    isActive: true,
    order: 3,
    icon: '💻',
    description: 'Aplicativos e ferramentas digitais tokenizadas',
    children: [
      'trading-bots',
      'ferramentas-dev',
      'plugins',
      'templates',
      'scripts'
    ]
  },
  {
    id: 'midias-digitais',
    name: 'Mídias Digitais',
    slug: 'midias-digitais',
    level: 2,
    parent: 'digitais',
    isActive: true,
    order: 4,
    icon: '🎵',
    description: 'Conteúdo audiovisual tokenizado',
    children: [
      'musicas',
      'samples-audio',
      'videos',
      'podcasts',
      'soundtracks'
    ]
  },
  {
    id: 'assinaturas-digitais',
    name: 'Assinaturas Digitais',
    slug: 'assinaturas-digitais',
    level: 2,
    parent: 'digitais',
    isActive: true,
    order: 5,
    icon: '📄',
    description: 'Serviços de assinatura tokenizados',
    children: [
      'newsletters-premium',
      'acesso-comunidades',
      'consultoria-recorrente',
      'alertas-exclusivos'
    ]
  },
  {
    id: 'colecionaveis-digitais',
    name: 'Colecionáveis Digitais',
    slug: 'colecionaveis-digitais',
    level: 2,
    parent: 'digitais',
    isActive: true,
    order: 6,
    icon: '🎨',
    description: 'Arte digital e colecionáveis únicos (NFTs)',
    children: [
      'arte-digital',
      'cards-colecionaveis',
      'avatares',
      'memorabilia',
      'arte-generativa'
    ]
  },

  // NÍVEL 3 - Subcategorias Cursos Tokenizados
  {
    id: 'web3-development',
    name: 'Web3 Development',
    slug: 'web3-development',
    level: 3,
    parent: 'cursos-tokenizados',
    isActive: true,
    order: 1,
    icon: '⚡'
  },
  {
    id: 'blockchain-basicos',
    name: 'Blockchain Básicos',
    slug: 'blockchain-basicos',
    level: 3,
    parent: 'cursos-tokenizados',
    isActive: true,
    order: 2,
    icon: '🔗'
  },
  {
    id: 'defi-trading',
    name: 'DeFi Trading',
    slug: 'defi-trading',
    level: 3,
    parent: 'cursos-tokenizados',
    isActive: true,
    order: 3,
    icon: '📈'
  },
  {
    id: 'nft-creation',
    name: 'Criação de NFTs',
    slug: 'nft-creation',
    level: 3,
    parent: 'cursos-tokenizados',
    isActive: true,
    order: 4,
    icon: '🎨'
  },
  {
    id: 'smart-contracts',
    name: 'Smart Contracts',
    slug: 'smart-contracts',
    level: 3,
    parent: 'cursos-tokenizados',
    isActive: true,
    order: 5,
    icon: '📝'
  },

  // NÍVEL 3 - Subcategorias E-books Digitais
  {
    id: 'ficcao-cientifica',
    name: 'Ficção Científica',
    slug: 'ficcao-cientifica',
    level: 3,
    parent: 'ebooks-digitais',
    isActive: true,
    order: 1,
    icon: '🚀'
  },
  {
    id: 'guias-tecnicos',
    name: 'Guias Técnicos',
    slug: 'guias-tecnicos',
    level: 3,
    parent: 'ebooks-digitais',
    isActive: true,
    order: 2,
    icon: '📖'
  },
  {
    id: 'biografia',
    name: 'Biografia',
    slug: 'biografia',
    level: 3,
    parent: 'ebooks-digitais',
    isActive: true,
    order: 3,
    icon: '👤'
  },
  {
    id: 'negocios',
    name: 'Negócios',
    slug: 'negocios',
    level: 3,
    parent: 'ebooks-digitais',
    isActive: true,
    order: 4,
    icon: '💼'
  },
  {
    id: 'autoajuda',
    name: 'Autoajuda',
    slug: 'autoajuda',
    level: 3,
    parent: 'ebooks-digitais',
    isActive: true,
    order: 5,
    icon: '💪'
  },

  // NÍVEL 3 - Subcategorias Software
  {
    id: 'trading-bots',
    name: 'Trading Bots',
    slug: 'trading-bots',
    level: 3,
    parent: 'software',
    isActive: true,
    order: 1,
    icon: '🤖'
  },
  {
    id: 'ferramentas-dev',
    name: 'Ferramentas de Desenvolvimento',
    slug: 'ferramentas-dev',
    level: 3,
    parent: 'software',
    isActive: true,
    order: 2,
    icon: '⚒️'
  },
  {
    id: 'plugins',
    name: 'Plugins',
    slug: 'plugins',
    level: 3,
    parent: 'software',
    isActive: true,
    order: 3,
    icon: '🔌'
  },
  {
    id: 'templates',
    name: 'Templates',
    slug: 'templates',
    level: 3,
    parent: 'software',
    isActive: true,
    order: 4,
    icon: '📄'
  },
  {
    id: 'scripts',
    name: 'Scripts',
    slug: 'scripts',
    level: 3,
    parent: 'software',
    isActive: true,
    order: 5,
    icon: '📜'
  },

  // NÍVEL 3 - Subcategorias Mídias Digitais
  {
    id: 'musicas',
    name: 'Músicas',
    slug: 'musicas',
    level: 3,
    parent: 'midias-digitais',
    isActive: true,
    order: 1,
    icon: '🎵'
  },
  {
    id: 'samples-audio',
    name: 'Samples de Áudio',
    slug: 'samples-audio',
    level: 3,
    parent: 'midias-digitais',
    isActive: true,
    order: 2,
    icon: '🎧'
  },
  {
    id: 'videos',
    name: 'Vídeos',
    slug: 'videos',
    level: 3,
    parent: 'midias-digitais',
    isActive: true,
    order: 3,
    icon: '🎬'
  },
  {
    id: 'podcasts',
    name: 'Podcasts',
    slug: 'podcasts',
    level: 3,
    parent: 'midias-digitais',
    isActive: true,
    order: 4,
    icon: '🎙️'
  },
  {
    id: 'soundtracks',
    name: 'Soundtracks',
    slug: 'soundtracks',
    level: 3,
    parent: 'midias-digitais',
    isActive: true,
    order: 5,
    icon: '🎼'
  },

  // NÍVEL 3 - Subcategorias Assinaturas Digitais
  {
    id: 'newsletters-premium',
    name: 'Newsletters Premium',
    slug: 'newsletters-premium',
    level: 3,
    parent: 'assinaturas-digitais',
    isActive: true,
    order: 1,
    icon: '📧'
  },
  {
    id: 'acesso-comunidades',
    name: 'Acesso a Comunidades',
    slug: 'acesso-comunidades',
    level: 3,
    parent: 'assinaturas-digitais',
    isActive: true,
    order: 2,
    icon: '👥'
  },
  {
    id: 'consultoria-recorrente',
    name: 'Consultoria Recorrente',
    slug: 'consultoria-recorrente',
    level: 3,
    parent: 'assinaturas-digitais',
    isActive: true,
    order: 3,
    icon: '💼'
  },
  {
    id: 'alertas-exclusivos',
    name: 'Alertas Exclusivos',
    slug: 'alertas-exclusivos',
    level: 3,
    parent: 'assinaturas-digitais',
    isActive: true,
    order: 4,
    icon: '🔔'
  },

  // NÍVEL 3 - Subcategorias Colecionáveis Digitais
  {
    id: 'arte-digital',
    name: 'Arte Digital',
    slug: 'arte-digital',
    level: 3,
    parent: 'colecionaveis-digitais',
    isActive: true,
    order: 1,
    icon: '🖼️'
  },
  {
    id: 'cards-colecionaveis',
    name: 'Cards Colecionáveis',
    slug: 'cards-colecionaveis',
    level: 3,
    parent: 'colecionaveis-digitais',
    isActive: true,
    order: 2,
    icon: '🃏'
  },
  {
    id: 'avatares',
    name: 'Avatares',
    slug: 'avatares',
    level: 3,
    parent: 'colecionaveis-digitais',
    isActive: true,
    order: 3,
    icon: '👾'
  },
  {
    id: 'memorabilia',
    name: 'Memorabilia',
    slug: 'memorabilia',
    level: 3,
    parent: 'colecionaveis-digitais',
    isActive: true,
    order: 4,
    icon: '🏆'
  },
  {
    id: 'arte-generativa',
    name: 'Arte Generativa',
    slug: 'arte-generativa',
    level: 3,
    parent: 'colecionaveis-digitais',
    isActive: true,
    order: 5,
    icon: '🌀'
  }
]

// ============================================
// 🔧 CATEGORYSERVICE - NAMED EXPORT
// ============================================

export class CategoryService {
  private categories: Category[] = categories

  /**
   * Lista todas as categorias ativas
   */
  list(): Category[] {
    return this.categories.filter(cat => cat.isActive)
  }

  /**
   * Obtém categoria por ID
   */
  getById(id: string): Category | undefined {
    return this.categories.find(cat => cat.id === id)
  }

  /**
   * Obtém categorias por nível
   */
  getByLevel(level: number): Category[] {
    return this.categories.filter(cat => cat.level === level && cat.isActive)
  }

  /**
   * Obtém categorias filhas de uma categoria pai
   */
  getChildren(parentId: string): Category[] {
    return this.categories.filter(cat => cat.parent === parentId && cat.isActive)
  }

  /**
   * Obtém categorias raiz (nível 1)
   */
  getRootCategories(): Category[] {
    return this.getByLevel(1)
  }

  /**
   * Obtém categorias digitais (filhas de 'digitais')
   */
  getDigitalCategories(): Category[] {
    return this.getChildren('digitais')
  }

  /**
   * Obtém categorias físicas (exclui 'digitais' e suas filhas)
   */
  getPhysicalCategories(): Category[] {
    const digitalIds = ['digitais', ...this.getDigitalCategories().map(c => c.id)]
    return this.categories.filter(cat => 
      cat.isActive && 
      !digitalIds.includes(cat.id) &&
      !digitalIds.includes(cat.parent || '')
    )
  }

  /**
   * Obtém caminho completo da categoria (breadcrumb)
   */
  getCategoryPath(categoryId: string): Category[] {
    const path: Category[] = []
    let currentCategory = this.getById(categoryId)
    
    while (currentCategory) {
      path.unshift(currentCategory)
      currentCategory = currentCategory.parent 
        ? this.getById(currentCategory.parent) 
        : undefined
    }
    
    return path
  }

  /**
   * Verifica se categoria é digital
   */
  isDigitalCategory(categoryId: string): boolean {
    const category = this.getById(categoryId)
    if (!category) return false
    
    const path = this.getCategoryPath(categoryId)
    return path.some(cat => cat.id === 'digitais')
  }

  /**
   * Obtém todas as subcategorias (recursivo)
   */
  getAllSubcategories(parentId: string): Category[] {
    const direct = this.getChildren(parentId)
    const indirect: Category[] = []
    
    direct.forEach(cat => {
      indirect.push(...this.getAllSubcategories(cat.id))
    })
    
    return [...direct, ...indirect]
  }

  /**
   * Busca categorias por nome/slug
   */
  search(query: string): Category[] {
    const normalizedQuery = query.toLowerCase().trim()
    
    return this.categories.filter(cat => 
      cat.isActive && (
        cat.name.toLowerCase().includes(normalizedQuery) ||
        cat.slug.toLowerCase().includes(normalizedQuery) ||
        cat.description?.toLowerCase().includes(normalizedQuery)
      )
    )
  }

  /**
   * Obtém estatísticas das categorias
   */
  getStats() {
    return {
      total: this.categories.length,
      active: this.categories.filter(c => c.isActive).length,
      digital: this.getDigitalCategories().length,
      physical: this.getPhysicalCategories().length,
      levels: {
        1: this.getByLevel(1).length,
        2: this.getByLevel(2).length,
        3: this.getByLevel(3).length,
        4: this.getByLevel(4).length
      }
    }
  }
}

// ============================================
// UTILITÁRIOS PARA TRABALHAR COM CATEGORIAS
// ============================================

/**
 * Obtém categoria por ID
 */
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id)
}

/**
 * Obtém categorias por nível
 */
export const getCategoriesByLevel = (level: number): Category[] => {
  return categories.filter(cat => cat.level === level && cat.isActive)
}

/**
 * Obtém categorias filhas de uma categoria pai
 */
export const getChildCategories = (parentId: string): Category[] => {
  return categories.filter(cat => cat.parent === parentId && cat.isActive)
}

/**
 * Obtém categorias raiz (nível 1)
 */
export const getRootCategories = (): Category[] => {
  return getCategoriesByLevel(1)
}

/**
 * Obtém categorias digitais (filhas de 'digitais')
 */
export const getDigitalCategories = (): Category[] => {
  return getChildCategories('digitais')
}

/**
 * Obtém categorias físicas (exclui 'digitais' e suas filhas)
 */
export const getPhysicalCategories = (): Category[] => {
  const digitalIds = ['digitais', ...getDigitalCategories().map(c => c.id)]
  return categories.filter(cat => 
    cat.isActive && 
    !digitalIds.includes(cat.id) &&
    !digitalIds.includes(cat.parent || '')
  )
}

/**
 * Obtém caminho completo da categoria (breadcrumb)
 */
export const getCategoryPath = (categoryId: string): Category[] => {
  const path: Category[] = []
  let currentCategory = getCategoryById(categoryId)
  
  while (currentCategory) {
    path.unshift(currentCategory)
    currentCategory = currentCategory.parent 
      ? getCategoryById(currentCategory.parent) 
      : undefined
  }
  
  return path
}

/**
 * Verifica se categoria é digital
 */
export const isDigitalCategory = (categoryId: string): boolean => {
  const category = getCategoryById(categoryId)
  if (!category) return false
  
  const path = getCategoryPath(categoryId)
  return path.some(cat => cat.id === 'digitais')
}

/**
 * Obtém todas as subcategorias (recursivo)
 */
export const getAllSubcategories = (parentId: string): Category[] => {
  const direct = getChildCategories(parentId)
  const indirect: Category[] = []
  
  direct.forEach(cat => {
    indirect.push(...getAllSubcategories(cat.id))
  })
  
  return [...direct, ...indirect]
}

// ============================================
// CONSTANTES ÚTEIS
// ============================================

export const CATEGORY_LEVELS = {
  ROOT: 1,
  SUBCATEGORY: 2,
  SUB_SUBCATEGORY: 3,
  SPECIFIC: 4
} as const

export const DIGITAL_CATEGORY_ID = 'digitais'

export const MAIN_DIGITAL_CATEGORIES = [
  'cursos-tokenizados',
  'ebooks-digitais',
  'software',
  'midias-digitais',
  'assinaturas-digitais',
  'colecionaveis-digitais'
] as const

export const PHYSICAL_ROOT_CATEGORIES = [
  'alimentacao',
  'comercio',
  'servicos', 
  'tecnologia'
] as const

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export type CategoryLevel = typeof CATEGORY_LEVELS[keyof typeof CATEGORY_LEVELS]
export type DigitalCategoryId = typeof MAIN_DIGITAL_CATEGORIES[number]
export type PhysicalCategoryId = typeof PHYSICAL_ROOT_CATEGORIES[number]
export type CategoryId = string

// ============================================
// DADOS PARA MOCK/TESTING
// ============================================

export const mockCategoryStats = {
  total: categories.length,
  digital: getDigitalCategories().length,
  physical: getPhysicalCategories().length,
  levels: {
    1: getCategoriesByLevel(1).length,
    2: getCategoriesByLevel(2).length,
    3: getCategoriesByLevel(3).length,
    4: getCategoriesByLevel(4).length
  }
}

// Default export para compatibilidade
export default categories