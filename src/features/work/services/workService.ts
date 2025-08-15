// src/features/work/services/workService.ts
import type { Project, Proposal, WorkFilters, WorkListResponse, WorkCategory } from '../entities/workTypes';

const STORAGE_PREFIX = 'bazari_work_v1';
const PROJECTS_KEY = `${STORAGE_PREFIX}:projects`;
const PROPOSALS_KEY = `${STORAGE_PREFIX}:proposals`;

class WorkService {
  // ========================================
  // PROJECTS
  // ========================================

  async listProjects(filters: WorkFilters = {}): Promise<WorkListResponse> {
    const projects = this.getAllProjects();
    let filtered = [...projects];

    // Aplicar filtros
    if (filters.q) {
      const query = filters.q.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p => 
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Aplicar ordenação
    const sort = filters.sort || 'newest';
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'budget_asc':
        filtered.sort((a, b) => a.budgetMinBZR - b.budgetMinBZR);
        break;
      case 'budget_desc':
        filtered.sort((a, b) => b.budgetMaxBZR - a.budgetMaxBZR);
        break;
    }

    // Aplicar paginação
    const limit = filters.limit || 12;
    const offset = filters.offset || 0;
    const paginatedProjects = filtered.slice(offset, offset + limit);

    return {
      projects: paginatedProjects,
      total: filtered.length,
      hasMore: offset + limit < filtered.length
    };
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = this.getAllProjects();
    return projects.find(p => p.slug === slug) || null;
  }

  async getProjectById(id: string): Promise<Project | null> {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const projects = this.getAllProjects();
    
    const project: Project = {
      ...projectData,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    projects.push(project);
    this.saveProjects(projects);

    return project;
  }

  async updateProjectStatus(id: string, status: Project['status']): Promise<Project | null> {
    const projects = this.getAllProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) return null;

    projects[projectIndex] = {
      ...projects[projectIndex],
      status,
      updatedAt: Date.now()
    };

    this.saveProjects(projects);
    return projects[projectIndex];
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const projects = this.getAllProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) return null;

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      updatedAt: Date.now()
    };

    this.saveProjects(projects);
    return projects[projectIndex];
  }

  // ========================================
  // PROPOSALS
  // ========================================

  async listProposalsByProject(projectId: string): Promise<Proposal[]> {
    const proposals = this.getAllProposals();
    return proposals
      .filter(p => p.projectId === projectId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async listProposalsByFreelancer(freelancerAddress: string): Promise<Proposal[]> {
    const proposals = this.getAllProposals();
    return proposals
      .filter(p => p.freelancerAddress === freelancerAddress)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getProposalById(id: string): Promise<Proposal | null> {
    const proposals = this.getAllProposals();
    return proposals.find(p => p.id === id) || null;
  }

  async createProposal(proposalData: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Proposal> {
    const proposals = this.getAllProposals();
    
    const proposal: Proposal = {
      ...proposalData,
      id: this.generateId(),
      status: 'PENDING',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    proposals.push(proposal);
    this.saveProposals(proposals);

    return proposal;
  }

  async updateProposalStatus(id: string, status: Proposal['status']): Promise<Proposal | null> {
    const proposals = this.getAllProposals();
    const proposalIndex = proposals.findIndex(p => p.id === id);
    
    if (proposalIndex === -1) return null;

    proposals[proposalIndex] = {
      ...proposals[proposalIndex],
      status,
      updatedAt: Date.now()
    };

    this.saveProposals(proposals);
    return proposals[proposalIndex];
  }

  // ========================================
  // STORAGE HELPERS
  // ========================================

  private getAllProjects(): Project[] {
    try {
      const data = localStorage.getItem(PROJECTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }

  private getAllProposals(): Proposal[] {
    try {
      const data = localStorage.getItem(PROPOSALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveProposals(proposals: Proposal[]): void {
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================================
  // SEED DATA
  // ========================================

  seedIfEmpty(): void {
    const projects = this.getAllProjects();
    
    if (projects.length === 0) {
      const mockProjects: Project[] = [
        {
          id: 'proj-1',
          slug: 'desenvolvimento-loja-virtual',
          title: 'Desenvolvimento de Loja Virtual',
          description: 'Preciso de um e-commerce completo em React/Node.js com integração de pagamento PIX e sistema de estoque.',
          budgetMinBZR: 5000,
          budgetMaxBZR: 8000,
          currency: 'BZR',
          category: 'desenvolvimento',
          tags: ['react', 'nodejs', 'ecommerce', 'pix'],
          ownerAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          status: 'OPEN',
          createdAt: Date.now() - 86400000, // 1 dia atrás
          updatedAt: Date.now() - 86400000
        },
        {
          id: 'proj-2',
          slug: 'design-identidade-visual',
          title: 'Design de Identidade Visual Completa',
          description: 'Criação de logo, cartão de visita, material gráfico e manual de marca para startup de tecnologia.',
          budgetMinBZR: 1500,
          budgetMaxBZR: 3000,
          currency: 'BZR',
          category: 'design',
          tags: ['logo', 'branding', 'identidade', 'startup'],
          ownerAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
          status: 'OPEN',
          createdAt: Date.now() - 172800000, // 2 dias atrás
          updatedAt: Date.now() - 172800000
        },
        {
          id: 'proj-3',
          slug: 'campanha-marketing-digital',
          title: 'Campanha de Marketing Digital para Produto',
          description: 'Estratégia completa de marketing digital incluindo anúncios no Google Ads, Facebook Ads e criação de conteúdo.',
          budgetMinBZR: 2000,
          budgetMaxBZR: 4000,
          currency: 'BZR',
          category: 'marketing',
          tags: ['google-ads', 'facebook-ads', 'conteudo', 'estrategia'],
          ownerAddress: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
          status: 'IN_NEGOTIATION',
          createdAt: Date.now() - 259200000, // 3 dias atrás
          updatedAt: Date.now() - 86400000
        },
        {
          id: 'proj-4',
          slug: 'traducao-documentos-tecnicos',
          title: 'Tradução de Documentos Técnicos',
          description: 'Tradução de documentação técnica de software de inglês para português brasileiro, mantendo precisão técnica.',
          budgetMinBZR: 800,
          budgetMaxBZR: 1200,
          currency: 'BZR',
          category: 'traducao',
          tags: ['traducao', 'tecnico', 'portugues', 'documentacao'],
          ownerAddress: '5GBNeWRhZc2jXu7D6HjepWxPloE7FEH4C25aJobQDiUoqz1X',
          status: 'OPEN',
          createdAt: Date.now() - 345600000, // 4 dias atrás
          updatedAt: Date.now() - 345600000
        },
        {
          id: 'proj-5',
          slug: 'consultoria-blockchain-web3',
          title: 'Consultoria em Blockchain e Web3',
          description: 'Consultoria técnica para implementação de soluções blockchain em empresa tradicional. Expertise em Substrate necessária.',
          budgetMinBZR: 10000,
          budgetMaxBZR: 15000,
          currency: 'BZR',
          category: 'consultoria',
          tags: ['blockchain', 'web3', 'substrate', 'consultoria'],
          ownerAddress: '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL',
          status: 'OPEN',
          createdAt: Date.now() - 432000000, // 5 dias atrás
          updatedAt: Date.now() - 432000000
        },
        {
          id: 'proj-6',
          slug: 'analise-dados-vendas',
          title: 'Análise de Dados de Vendas',
          description: 'Análise estatística de dados de vendas dos últimos 2 anos com insights e dashboard interativo em Python.',
          budgetMinBZR: 3000,
          budgetMaxBZR: 5000,
          currency: 'BZR',
          category: 'dados',
          tags: ['python', 'analise', 'dashboard', 'vendas'],
          ownerAddress: '5Ck5SLSHYac6WFt5UPU2WuWJqVy5n7V8Jp2CgN4jyHb8hBvR',
          status: 'OPEN',
          createdAt: Date.now() - 518400000, // 6 dias atrás
          updatedAt: Date.now() - 518400000
        }
      ];

      this.saveProjects(mockProjects);

      // Adicionar algumas propostas de exemplo
      const mockProposals: Proposal[] = [
        {
          id: 'prop-1',
          projectId: 'proj-1',
          freelancerAddress: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
          coverLetter: 'Sou desenvolvedor full-stack com 5 anos de experiência em React e Node.js. Já desenvolvi mais de 10 e-commerces similares.',
          bidBZR: 6500,
          milestones: [
            { id: 'm1', title: 'Setup inicial e arquitetura', amountBZR: 1500, done: false },
            { id: 'm2', title: 'Frontend da loja', amountBZR: 2500, done: false },
            { id: 'm3', title: 'Backend e API', amountBZR: 2000, done: false },
            { id: 'm4', title: 'Integração PIX e testes', amountBZR: 500, done: false }
          ],
          status: 'PENDING',
          createdAt: Date.now() - 43200000, // 12 horas atrás
          updatedAt: Date.now() - 43200000
        },
        {
          id: 'prop-2',
          projectId: 'proj-2',
          freelancerAddress: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
          coverLetter: 'Designer especializado em identidade visual para startups. Portfolio com mais de 50 marcas criadas.',
          bidBZR: 2200,
          milestones: [
            { id: 'm1', title: 'Pesquisa e conceito', amountBZR: 500, done: false },
            { id: 'm2', title: 'Criação do logo', amountBZR: 800, done: false },
            { id: 'm3', title: 'Material gráfico completo', amountBZR: 600, done: false },
            { id: 'm4', title: 'Manual de marca', amountBZR: 300, done: false }
          ],
          status: 'PENDING',
          createdAt: Date.now() - 21600000, // 6 horas atrás
          updatedAt: Date.now() - 21600000
        }
      ];

      this.saveProposals(mockProposals);
    }
  }
}

// Singleton instance
export const workService = new WorkService();

// TODO: Integração futura com Substrate
// export async function createProjectOnChain(project: Project): Promise<string> {
//   // return substrateClient.tx.workProtocol.createProject(project);
// }

// TODO: Integração futura com IPFS para anexos
// export async function uploadProjectAttachment(file: File): Promise<string> {
//   // return ipfsClient.add(file);
// }