// src/features/work/services/escrowService.ts
import type { Escrow, EscrowState, EscrowEvent, EscrowEventType } from '../entities/workTypes';

const STORAGE_PREFIX = 'bazari_work_v1';
const ESCROWS_KEY = `${STORAGE_PREFIX}:escrows`;

class EscrowService {
  // ========================================
  // ESTADO E TRANSIÇÕES VÁLIDAS
  // ========================================
  
  private readonly validTransitions: Record<EscrowState, EscrowState[]> = {
    CREATED: ['FUNDED'],
    FUNDED: ['IN_PROGRESS', 'REFUNDED'],
    IN_PROGRESS: ['SUBMITTED', 'DISPUTED'],
    SUBMITTED: ['RELEASED', 'DISPUTED'],
    DISPUTED: ['RELEASED', 'REFUNDED'],
    RELEASED: [], // Estado final
    REFUNDED: []  // Estado final
  };

  // ========================================
  // CRIAÇÃO E CONSULTA
  // ========================================

  async createEscrow(
    projectId: string,
    clientAddress: string,
    freelancerAddress: string,
    amountTotalBZR: number
  ): Promise<Escrow> {
    const escrows = this.getAllEscrows();
    
    const escrow: Escrow = {
      id: this.generateId(),
      projectId,
      clientAddress,
      freelancerAddress,
      amountTotalBZR,
      amountFundedBZR: 0,
      amountReleasedBZR: 0,
      state: 'CREATED',
      events: [{
        ts: Date.now(),
        type: 'CREATE',
        meta: { amountTotalBZR }
      }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    escrows.push(escrow);
    this.saveEscrows(escrows);

    return escrow;
  }

  async getById(id: string): Promise<Escrow | null> {
    const escrows = this.getAllEscrows();
    return escrows.find(e => e.id === id) || null;
  }

  async getByProjectId(projectId: string): Promise<Escrow | null> {
    const escrows = this.getAllEscrows();
    return escrows.find(e => e.projectId === projectId) || null;
  }

  async listByAddress(address: string): Promise<Escrow[]> {
    const escrows = this.getAllEscrows();
    return escrows
      .filter(e => e.clientAddress === address || e.freelancerAddress === address)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async listByClient(clientAddress: string): Promise<Escrow[]> {
    const escrows = this.getAllEscrows();
    return escrows
      .filter(e => e.clientAddress === clientAddress)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async listByFreelancer(freelancerAddress: string): Promise<Escrow[]> {
    const escrows = this.getAllEscrows();
    return escrows
      .filter(e => e.freelancerAddress === freelancerAddress)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // ========================================
  // TRANSIÇÕES DE ESTADO
  // ========================================

  async fund(escrowId: string, amountBZR: number): Promise<Escrow | null> {
    return this.transitionState(escrowId, 'FUNDED', 'FUND', {
      amountBZR,
      update: (escrow) => ({
        ...escrow,
        amountFundedBZR: escrow.amountFundedBZR + amountBZR
      })
    });
  }

  async markInProgress(escrowId: string): Promise<Escrow | null> {
    return this.transitionState(escrowId, 'IN_PROGRESS', 'SUBMIT', {
      update: (escrow) => escrow
    });
  }

  async submitWork(escrowId: string, submissionData?: any): Promise<Escrow | null> {
    return this.transitionState(escrowId, 'SUBMITTED', 'SUBMIT', {
      submissionData,
      update: (escrow) => escrow
    });
  }

  async dispute(escrowId: string, reason: string): Promise<Escrow | null> {
    return this.transitionState(escrowId, 'DISPUTED', 'DISPUTE', {
      reason,
      update: (escrow) => escrow
    });
  }

  async release(escrowId: string, options: { milestoneId?: string } = {}): Promise<Escrow | null> {
    const escrow = await this.getById(escrowId);
    if (!escrow) return null;

    const amountToRelease = escrow.amountFundedBZR - escrow.amountReleasedBZR;

    return this.transitionState(escrowId, 'RELEASED', 'RELEASE', {
      milestoneId: options.milestoneId,
      amountReleased: amountToRelease,
      update: (escrow) => ({
        ...escrow,
        amountReleasedBZR: escrow.amountFundedBZR
      })
    });
  }

  async releaseMilestone(escrowId: string, milestoneId: string, amountBZR: number): Promise<Escrow | null> {
    const escrow = await this.getById(escrowId);
    if (!escrow) return null;

    // Não muda o estado principal, apenas registra o evento
    return this.addEvent(escrowId, 'MILESTONE_RELEASE', {
      milestoneId,
      amountBZR,
      update: (escrow) => ({
        ...escrow,
        amountReleasedBZR: escrow.amountReleasedBZR + amountBZR
      })
    });
  }

  async refund(escrowId: string): Promise<Escrow | null> {
    return this.transitionState(escrowId, 'REFUNDED', 'REFUND', {
      update: (escrow) => escrow
    });
  }

  // ========================================
  // HELPERS INTERNOS
  // ========================================

  private async transitionState(
    escrowId: string,
    newState: EscrowState,
    eventType: EscrowEventType,
    options: {
      update: (escrow: Escrow) => Escrow;
      [key: string]: any;
    }
  ): Promise<Escrow | null> {
    const escrows = this.getAllEscrows();
    const escrowIndex = escrows.findIndex(e => e.id === escrowId);
    
    if (escrowIndex === -1) return null;

    const currentEscrow = escrows[escrowIndex];
    
    // Verificar se a transição é válida
    if (!this.validTransitions[currentEscrow.state].includes(newState)) {
      throw new Error(
        `Transição inválida: ${currentEscrow.state} -> ${newState}`
      );
    }

    // Aplicar atualização customizada
    const updatedEscrow = options.update(currentEscrow);

    // Criar novo evento
    const event: EscrowEvent = {
      ts: Date.now(),
      type: eventType,
      meta: { ...options, update: undefined } // Remove a função update do meta
    };

    // Atualizar escrow
    escrows[escrowIndex] = {
      ...updatedEscrow,
      state: newState,
      events: [...currentEscrow.events, event],
      updatedAt: Date.now()
    };

    this.saveEscrows(escrows);
    return escrows[escrowIndex];
  }

  private async addEvent(
    escrowId: string,
    eventType: EscrowEventType,
    options: {
      update: (escrow: Escrow) => Escrow;
      [key: string]: any;
    }
  ): Promise<Escrow | null> {
    const escrows = this.getAllEscrows();
    const escrowIndex = escrows.findIndex(e => e.id === escrowId);
    
    if (escrowIndex === -1) return null;

    const currentEscrow = escrows[escrowIndex];
    
    // Aplicar atualização customizada
    const updatedEscrow = options.update(currentEscrow);

    // Criar novo evento
    const event: EscrowEvent = {
      ts: Date.now(),
      type: eventType,
      meta: { ...options, update: undefined }
    };

    // Atualizar escrow (sem mudar estado)
    escrows[escrowIndex] = {
      ...updatedEscrow,
      events: [...currentEscrow.events, event],
      updatedAt: Date.now()
    };

    this.saveEscrows(escrows);
    return escrows[escrowIndex];
  }

  // ========================================
  // VALIDAÇÕES E UTILITÁRIOS
  // ========================================

  canTransitionTo(currentState: EscrowState, targetState: EscrowState): boolean {
    return this.validTransitions[currentState].includes(targetState);
  }

  getAvailableActions(state: EscrowState): string[] {
    const actions: string[] = [];
    
    switch (state) {
      case 'CREATED':
        actions.push('fund');
        break;
      case 'FUNDED':
        actions.push('markInProgress', 'refund');
        break;
      case 'IN_PROGRESS':
        actions.push('submitWork', 'dispute');
        break;
      case 'SUBMITTED':
        actions.push('release', 'dispute');
        break;
      case 'DISPUTED':
        actions.push('release', 'refund');
        break;
    }
    
    return actions;
  }

  calculateProgress(escrow: Escrow): {
    fundedPercent: number;
    releasedPercent: number;
    remainingBZR: number;
  } {
    const fundedPercent = escrow.amountTotalBZR > 0 
      ? (escrow.amountFundedBZR / escrow.amountTotalBZR) * 100 
      : 0;
    
    const releasedPercent = escrow.amountFundedBZR > 0 
      ? (escrow.amountReleasedBZR / escrow.amountFundedBZR) * 100 
      : 0;

    const remainingBZR = escrow.amountFundedBZR - escrow.amountReleasedBZR;

    return {
      fundedPercent: Math.round(fundedPercent),
      releasedPercent: Math.round(releasedPercent),
      remainingBZR
    };
  }

  // ========================================
  // STORAGE
  // ========================================

  private getAllEscrows(): Escrow[] {
    try {
      const data = localStorage.getItem(ESCROWS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveEscrows(escrows: Escrow[]): void {
    localStorage.setItem(ESCROWS_KEY, JSON.stringify(escrows));
  }

  private generateId(): string {
    return `escrow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================================
  // SEED DATA
  // ========================================

  seedIfEmpty(): void {
    const escrows = this.getAllEscrows();
    
    if (escrows.length === 0) {
      // Criar alguns escrows de exemplo
      const mockEscrows: Escrow[] = [
        {
          id: 'escrow-1',
          projectId: 'proj-3', // Projeto em negociação
          clientAddress: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
          freelancerAddress: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
          amountTotalBZR: 3000,
          amountFundedBZR: 3000,
          amountReleasedBZR: 1000,
          state: 'IN_PROGRESS',
          events: [
            {
              ts: Date.now() - 259200000, // 3 dias atrás
              type: 'CREATE',
              meta: { amountTotalBZR: 3000 }
            },
            {
              ts: Date.now() - 172800000, // 2 dias atrás
              type: 'FUND',
              meta: { amountBZR: 3000 }
            },
            {
              ts: Date.now() - 86400000, // 1 dia atrás
              type: 'MILESTONE_RELEASE',
              meta: { milestoneId: 'm1', amountBZR: 1000 }
            }
          ],
          createdAt: Date.now() - 259200000,
          updatedAt: Date.now() - 86400000
        }
      ];

      this.saveEscrows(mockEscrows);
    }
  }
}

// Singleton instance
export const escrowService = new EscrowService();

// TODO: Integração futura com Substrate/ink!
// export async function createEscrowOnChain(escrow: Escrow): Promise<string> {
//   // return substrateClient.tx.escrow.create(
//   //   escrow.projectId,
//   //   escrow.freelancerAddress,
//   //   escrow.amountTotalBZR
//   // );
// }

// TODO: Integração futura com IPFS para submissões
// export async function uploadWorkSubmission(files: File[]): Promise<string[]> {
//   // return Promise.all(files.map(file => ipfsClient.add(file)));
// }