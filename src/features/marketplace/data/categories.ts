export interface Category {
  id: string
  name: string
  slug: string
  level: number
  parent?: string
  children: string[]
  icon?: string
  description?: string
  isActive: boolean
  order: number
}

// Sistema de categorias hierárquico (4 níveis)
export const CATEGORIES: Record<string, Category> = {
  // NÍVEL 1 - Categorias Principais
  'alimentacao': {
    id: 'alimentacao',
    name: 'Alimentação',
    slug: 'alimentacao',
    level: 1,
    children: ['restaurantes', 'delivery', 'produtos-alimenticios'],
    icon: '🍽️',
    description: 'Restaurantes, delivery, produtos alimentícios',
    isActive: true,
    order: 1
  },
  
  'servicos': {
    id: 'servicos',
    name: 'Serviços',
    slug: 'servicos',
    level: 1,
    children: ['tecnologia', 'consultoria', 'manutencao', 'beleza-bem-estar'],
    icon: '🛠️',
    description: 'Serviços profissionais e especializados',
    isActive: true,
    order: 2
  },
  
  'comercio': {
    id: 'comercio',
    name: 'Comércio',
    slug: 'comercio',
    level: 1,
    children: ['roupas-acessorios', 'eletronicos', 'casa-decoracao', 'livros-midia'],
    icon: '🏪',
    description: 'Lojas e produtos físicos',
    isActive: true,
    order: 3
  },
  
  'educacao': {
    id: 'educacao',
    name: 'Educação',
    slug: 'educacao',
    level: 1,
    children: ['cursos-online', 'aulas-particulares', 'workshops', 'certificacoes'],
    icon: '📚',
    description: 'Cursos, aulas e conteúdo educacional',
    isActive: true,
    order: 4
  },
  
  'arte-cultura': {
    id: 'arte-cultura',
    name: 'Arte & Cultura',
    slug: 'arte-cultura',
    level: 1,
    children: ['arte-digital', 'musica', 'design', 'fotografia'],
    icon: '🎨',
    description: 'Arte, design, música e cultura',
    isActive: true,
    order: 5
  },
  
  // NÍVEL 2 - Subcategorias
  'restaurantes': {
    id: 'restaurantes',
    name: 'Restaurantes',
    slug: 'restaurantes',
    level: 2,
    parent: 'alimentacao',
    children: ['comida-brasileira', 'comida-internacional', 'fast-food', 'vegano-vegetariano'],
    icon: '🍴',
    description: 'Restaurantes e casas de alimentação',
    isActive: true,
    order: 1
  },
  
  'delivery': {
    id: 'delivery',
    name: 'Delivery',
    slug: 'delivery',
    level: 2,
    parent: 'alimentacao',
    children: ['pizza', 'hamburguer', 'japonesa', 'sobremesas'],
    icon: '🚚',
    description: 'Entrega de comida em domicílio',
    isActive: true,
    order: 2
  },
  
  'tecnologia': {
    id: 'tecnologia',
    name: 'Tecnologia',
    slug: 'tecnologia',
    level: 2,
    parent: 'servicos',
    children: ['desenvolvimento-web', 'mobile-apps', 'blockchain', 'ia-machine-learning'],
    icon: '💻',
    description: 'Serviços de tecnologia e desenvolvimento',
    isActive: true,
    order: 1
  },
  
  'consultoria': {
    id: 'consultoria',
    name: 'Consultoria',
    slug: 'consultoria',
    level: 2,
    parent: 'servicos',
    children: ['consultoria-empresarial', 'consultoria-financeira', 'consultoria-marketing', 'consultoria-juridica'],
    icon: '📊',
    description: 'Serviços de consultoria especializada',
    isActive: true,
    order: 2
  },
  
  'roupas-acessorios': {
    id: 'roupas-acessorios',
    name: 'Roupas & Acessórios',
    slug: 'roupas-acessorios',
    level: 2,
    parent: 'comercio',
    children: ['roupas-masculinas', 'roupas-femininas', 'acessorios', 'calcados'],
    icon: '👕',
    description: 'Vestuário e acessórios',
    isActive: true,
    order: 1
  },
  
  'arte-digital': {
    id: 'arte-digital',
    name: 'Arte Digital',
    slug: 'arte-digital',
    level: 2,
    parent: 'arte-cultura',
    children: ['nft-art', 'ilustracoes', 'animations', 'concept-art'],
    icon: '🖼️',
    description: 'Arte digital e NFTs',
    isActive: true,
    order: 1
  },
  
  // NÍVEL 3 - Sub-subcategorias
  'desenvolvimento-web': {
    id: 'desenvolvimento-web',
    name: 'Desenvolvimento Web',
    slug: 'desenvolvimento-web',
    level: 3,
    parent: 'tecnologia',
    children: ['frontend', 'backend', 'fullstack', 'ecommerce'],
    icon: '🌐',
    description: 'Desenvolvimento de sites e aplicações web',
    isActive: true,
    order: 1
  },
  
  'blockchain': {
    id: 'blockchain',
    name: 'Blockchain',
    slug: 'blockchain',
    level: 3,
    parent: 'tecnologia',
    children: ['smart-contracts', 'defi', 'nft-development', 'dapp'],
    icon: '⛓️',
    description: 'Desenvolvimento blockchain e Web3',
    isActive: true,
    order: 3
  },
  
  'nft-art': {
    id: 'nft-art',
    name: 'NFT Art',
    slug: 'nft-art',
    level: 3,
    parent: 'arte-digital',
    children: ['pfp-collections', 'generative-art', 'photography-nft', 'utility-nft'],
    icon: '🎭',
    description: 'Arte em formato NFT',
    isActive: true,
    order: 1
  },
  
  // NÍVEL 4 - Especialidades
  'smart-contracts': {
    id: 'smart-contracts',
    name: 'Smart Contracts',
    slug: 'smart-contracts',
    level: 4,
    parent: 'blockchain',
    children: [],
    icon: '📝',
    description: 'Desenvolvimento de contratos inteligentes',
    isActive: true,
    order: 1
  },
  
  'defi': {
    id: 'defi',
    name: 'DeFi',
    slug: 'defi',
    level: 4,
    parent: 'blockchain',
    children: [],
    icon: '🏦',
    description: 'Finanças descentralizadas',
    isActive: true,
    order: 2
  },
  
  'pfp-collections': {
    id: 'pfp-collections',
    name: 'PFP Collections',
    slug: 'pfp-collections',
    level: 4,
    parent: 'nft-art',
    children: [],
    icon: '👤',
    description: 'Coleções de perfil NFT',
    isActive: true,
    order: 1
  }
}

// Funções utilitárias para trabalhar com categorias
export class CategoryService {
  static getCategory(id: string): Category | null {
    return CATEGORIES[id] || null
  }
  
  static getCategoriesByLevel(level: number): Category[] {
    return Object.values(CATEGORIES).filter(cat => cat.level === level)
  }
  
  static getChildCategories(parentId: string): Category[] {
    const parent = CATEGORIES[parentId]
    if (!parent) return []
    
    return parent.children.map(childId => CATEGORIES[childId]).filter(Boolean)
  }
  
  static getParentCategory(categoryId: string): Category | null {
    const category = CATEGORIES[categoryId]
    if (!category?.parent) return null
    
    return CATEGORIES[category.parent]
  }
  
  static getCategoryPath(categoryId: string): Category[] {
    const path: Category[] = []
    let current = CATEGORIES[categoryId]
    
    while (current) {
      path.unshift(current)
      current = current.parent ? CATEGORIES[current.parent] : null
    }
    
    return path
  }
  
  static searchCategories(query: string): Category[] {
    const searchTerm = query.toLowerCase()
    return Object.values(CATEGORIES).filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.description?.toLowerCase().includes(searchTerm)
    )
  }
  
  static getTopLevelCategories(): Category[] {
    return this.getCategoriesByLevel(1).sort((a, b) => a.order - b.order)
  }
  
  static getAllDescendants(categoryId: string): Category[] {
    const descendants: Category[] = []
    const category = CATEGORIES[categoryId]
    
    if (!category) return descendants
    
    for (const childId of category.children) {
      const child = CATEGORIES[childId]
      if (child) {
        descendants.push(child)
        descendants.push(...this.getAllDescendants(childId))
      }
    }
    
    return descendants
  }
}
