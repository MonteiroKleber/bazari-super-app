# 🌟 Bazari - Super App Web3

> Marketplace descentralizado com rede social integrada, onde sua identidade é
> um ativo, seus negócios são tokens e sua comunidade governa o ecossistema.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web3](https://img.shields.io/badge/Web3-FF6B6B?style=for-the-badge&logo=web3dotjs&logoColor=white)](https://web3js.org/)

## 🚀 Quick Start

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/bazari-super-app.git
cd bazari-super-app

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📋 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento (http://localhost:3000)
- `npm run build` - Build de produção otimizado
- `npm run test` - Executar testes com Vitest
- `npm run test:coverage` - Relatório de coverage detalhado
- `npm run lint` - Verificar código com ESLint
- `npm run lint:fix` - Corrigir problemas automaticamente
- `npm run format` - Formatar código com Prettier
- `npm run prepare` - Configurar hooks Git com Husky

## 🛠 Stack Tecnológica

### Frontend Core

- **React 18** + **TypeScript** - Interface moderna e type-safe
- **Vite** - Build tool ultra-rápido com HMR
- **TailwindCSS** - Framework CSS utilitário responsivo
- **Framer Motion** - Animações fluidas e interativas
- **React Router v6** - Roteamento SPA otimizado

### Web3 & Blockchain

- **Polkadot.js API** - Conectividade com Substrate
- **IPFS** - Armazenamento descentralizado de conteúdo
- **BazariChain** - Blockchain customizada (Substrate)
- **Zustand** - Gerenciamento de estado Web3

### Desenvolvimento & Qualidade

- **Vitest** - Testes unitários rápidos
- **ESLint + Prettier** - Qualidade e formatação de código
- **Husky + lint-staged** - Git hooks automatizados
- **TypeScript Strict** - Tipagem rigorosa

### PWA & Performance

- **Service Worker** - Cache inteligente offline
- **Web App Manifest** - Instalação nativa
- **Lazy Loading** - Carregamento otimizado de componentes

## 📐 Arquitetura

Seguimos o padrão **Feature-Sliced Design** para escalabilidade:

```
src/
├── app/           # 🏗️ Configuração da aplicação
│   ├── providers/ # Provedores globais (theme, i18n, auth)
│   ├── router/    # Configuração de rotas
│   └── i18n/      # Sistema de internacionalização
├── pages/         # 📄 Páginas e rotas principais
├── features/      # 🎯 Funcionalidades de negócio
│   ├── auth/      # Autenticação Web3
│   ├── marketplace/ # Marketplace descentralizado
│   ├── wallet/    # Carteira nativa
│   ├── social/    # Rede social
│   ├── dao/       # Governança descentralizada
│   └── trabalho/  # Protocolo de trabalho
├── shared/        # 🔧 Código compartilhado
│   ├── ui/        # Componentes de interface
│   ├── lib/       # Utilitários e helpers
│   ├── hooks/     # React hooks customizados
│   └── types/     # Tipos TypeScript globais
├── entities/      # 📊 Modelos de dados de negócio
└── services/      # 🌐 APIs e integrações externas
```

## 🌍 Sistema de Internacionalização

Sistema multi-idioma completo com detecção automática:

- 🇧🇷 **Português (Brasil)** - Idioma padrão
- 🇺🇸 **English (US)** - Mercado internacional
- 🇪🇸 **Español** - Expansão América Latina

```typescript
// Uso básico
const { t, changeLanguage } = useTranslation()
const text = t('common', 'loading') // "Carregando..."

// Hook especializado por módulo
const { t } = useAuthTranslation()
const loginText = t('login') // Tradução do módulo auth

// Mudança de idioma
changeLanguage('en') // Muda para inglês
```

## 🎨 Design System Bazari

### Paleta de Cores Oficial

```css
--primary-900: #8b0000 /* Resistência e povo */ --primary-700: #a52a2a
  /* Variação principal */ --secondary-400: #ffb300 /* Riqueza e esperança */
  --dark-900: #1c1c1c /* Descentralização */ --light-100: #f5f1e0
  /* Simplicidade */;
```

### Componentes Base (ETAPA 2)

- 🔲 **Buttons** - `.btn-primary`, `.btn-secondary`, `.btn-outline`
- 📝 **Forms** - `.input-bazari`, `.select-bazari`, `.textarea-bazari`
- 🎴 **Cards** - `.card-bazari` com shadows e borders
- 🏷️ **Badges** - `.badge-success`, `.badge-warning`, `.badge-error`
- 💬 **Modals** - Sistema de overlay acessível

### Responsividade

- **Mobile First** - Design otimizado para dispositivos móveis
- **Breakpoints Tailwind** - `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Touch Friendly** - Elementos com tamanho adequado para toque

## 📱 Progressive Web App (PWA)

Funcionalidades nativas implementadas:

- ✅ **Instalação nativa** em dispositivos iOS/Android
- ✅ **Funcionamento offline** para funcionalidades básicas
- ✅ **Cache inteligente** de recursos estáticos
- ✅ **Service Worker** configurado com Workbox
- ✅ **Manifest** com ícones e metadados
- ✅ **Push notifications** (preparado para implementação)

## 🧪 Testes e Qualidade

```bash
# Executar todos os testes
npm run test

# Coverage detalhado (meta: >70%)
npm run test:coverage

# Testes em modo watch para desenvolvimento
npm run test -- --watch

# Verificar qualidade do código
npm run lint

# Corrigir problemas automaticamente
npm run lint:fix
```

### Configuração de Testes

- **Vitest** - Runner de testes rápido
- **@testing-library/react** - Testes centrados no usuário
- **jsdom** - Ambiente DOM simulado
- **Mock Service Worker** - Mocking de APIs

## 🔒 Segurança Web3

### Autenticação (ETAPA 3)

- 🔐 **Chaves privadas** criptografadas localmente
- 🎯 **Seed phrase** com confirmação obrigatória
- 🛡️ **Guards de rota** para áreas protegidas
- 💾 **Persistência segura** no localStorage

### Carteira (ETAPA 6)

- 🔗 **Conectividade Substrate** via Polkadot.js
- 💰 **Gestão de saldos** BZR e tokens
- 📄 **Assinatura de transações** segura
- 📊 **Histórico completo** de atividades

## 🗺️ Cronograma de Desenvolvimento

Desenvolvimento **incremental** em 9 etapas otimizadas:

### ✅ **ETAPA 1** - Configuração Base e Infraestrutura (COMPLETA)

**Duração:** 1 chat | **Status:** 🟢 **100% COMPLETA**

**Deliverables concluídos:**

- [x] Estrutura de pastas completa (monorepo Feature-Sliced)
- [x] Configuração Vite + React 18 + TypeScript strict
- [x] Setup TailwindCSS + PostCSS + design tokens
- [x] Configuração ESLint + Prettier + Husky completa
- [x] Aliases de importação (`@app`, `@shared`, `@features`, etc.)
- [x] Sistema i18n completo com detecção automática (PT/EN/ES)
- [x] Arquivo de tradução estruturado e tipado
- [x] Configuração PWA com service worker e manifest
- [x] Documentação README detalhada
- [x] Configuração de testes com Vitest
- [x] Landing page moderna e responsiva
- [x] Entidades base tipadas (User, Business, Product, etc.)

### 🟡 **ETAPA 2** - Design System e Componentes Base

**Duração:** 1 chat | **Status:** ⏳ **PRÓXIMA**

**Deliverables planejados:**

- [ ] Paleta de cores oficial implementada no Tailwind
- [ ] Sistema tipográfico (Poppins/Inter) configurado
- [ ] Componentes `shared/ui` completos:
  - Button (variants, sizes, states, loading)
  - Input, Select, Textarea com validação
  - Card, Modal, Badge com animações
  - Tooltip, Tabs, Toast, Skeleton
  - Loading, Spinner, Progress bar
- [ ] Sistema de ícones (Lucide React)
- [ ] Configuração Framer Motion para animações
- [ ] Responsividade mobile-first testada
- [ ] Acessibilidade (ARIA, focus management, contrast)
- [ ] Storybook para documentação de componentes

### 🟡 **ETAPA 3** - Autenticação e Gestão de Conta

**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 2**

**Deliverables planejados:**

- [ ] Configuração Zustand stores com persist
- [ ] Entidades User e Account expandidas
- [ ] Telas de autenticação completas:
  - Login com senha criptografada
  - Criar nova conta com validações
  - Importar conta (seed phrase de 12/24 palavras)
  - Recuperação de conta com perguntas de segurança
- [ ] Fluxo de confirmação seed phrase obrigatório
- [ ] Criptografia local de chaves privadas (AES-256)
- [ ] Persistência segura com TTL no localStorage
- [ ] Guards de rota para áreas autenticadas
- [ ] Sistema de sessão com renovação automática

### 🟡 **ETAPA 4** - Perfil Tokenizado Básico

**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 3**

**Deliverables planejados:**

- [ ] Configuração IPFS client (Pinata/Infura)
- [ ] Tela de perfil completa e editável:
  - Edição de dados pessoais com validação
  - Upload de avatar otimizado (IPFS)
  - Visualização de valor de mercado tokenizado
  - Sistema de reputação baseado em interações
- [ ] Tokenização de identidade (Identity NFT)
- [ ] Páginas públicas de perfil com QR code
- [ ] Sistema de busca de usuários com filtros
- [ ] Configuração de rotas protegidas expandida

### 🟡 **ETAPA 5** - Marketplace Base

**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 4**

**Deliverables planejados:**

- [ ] Sistema de categorias hierárquico (4 níveis)
- [ ] Entidades Business, Product, Service completas
- [ ] Cadastro de estabelecimento:
  - Informações básicas com geolocalização
  - Upload múltiplo de imagens (IPFS)
  - Seleção de categorias intuitiva
  - Opção de tokenização como Business NFT
- [ ] Cadastro de produtos/serviços com variações
- [ ] Listagem e busca no marketplace com filtros
- [ ] Páginas de detalhe com galeria e reviews
- [ ] Carrinho multi-loja com cálculo de frete
- [ ] Sistema de favoritos e wishlist

### 🟡 **ETAPA 6** - Wallet e Integração Substrate

**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 5**

**Deliverables planejados:**

- [ ] Configuração Polkadot.js API completa
- [ ] Conectividade com BazariChain (Substrate testnet)
- [ ] Wallet nativa completa:
  - Dashboard com saldo BZR e tokens
  - Listagem de NFTs com metadados
  - Envio/recebimento com QR code
  - Histórico de transações paginado
  - Conversão de valores em tempo real
- [ ] Assinatura segura de transações
- [ ] Integração com estabelecimentos tokenizados
- [ ] Gestão avançada de chaves e backup
- [ ] Staking e delegação BZR

### 🟡 **ETAPA 7** - Rede Social Integrada

**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 6**

**Deliverables planejados:**

- [ ] Sistema de postagens descentralizado:
  - Editor rico de conteúdo (texto, imagem, vídeo)
  - Upload otimizado para IPFS
  - Sistema de hashtags e menções
- [ ] Feed público descentralizado e cronológico
- [ ] Interações sociais Web3:
  - Curtir, comentar, compartilhar
  - Sistema de seguidores com NFT proof
  - Reações customizadas com tokens
- [ ] Recomendações de perfis por algoritmo
- [ ] Centro de notificações em tempo real
- [ ] Integração de negócios no perfil social
- [ ] Timeline de atividades blockchain

### 🟡 **ETAPA 8** - DAO Governança e DEX

**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 7**

**Deliverables planejados:**

- [ ] **DAO Governança completa:**
  - Criação de propostas com template
  - Sistema de votação ponderada por stake
  - Execução automática de propostas aprovadas
  - Dashboard de governança com métricas
  - Histórico completo de decisões
- [ ] **DEX (Exchange Descentralizado):**
  - Interface de troca BZR ↔ tokens
  - AMM (Automated Market Maker) básico
  - Liquidity pools com rewards
  - Ranking por valor de mercado em tempo real
  - Histórico de negociações e gráficos
  - Cálculo automático de slippage e fees
- [ ] Integração profunda com carteira nativa
- [ ] Sistema de notificações de governança

### 🟡 **ETAPA 9** - Protocolo de Trabalho e Finalização

**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 8**

**Deliverables planejados:**

- [ ] **Protocolo de Trabalho Descentralizado:**
  - Marketplace de projetos freelance
  - Sistema de candidaturas com stake
  - Gestão de entregas via IPFS
  - Escrow automático com smart contracts
  - Sistema de avaliações bilateral
  - Resolução de disputas via DAO
- [ ] **Otimizações finais:**
  - Busca inteligente global (fuzzy search)
  - Performance optimization (code splitting)
  - Lazy loading inteligente
  - Bundle analysis e otimização
- [ ] **Qualidade e Deploy:**
  - Suíte completa de testes (coverage >80%)
  - Build de produção ultra-otimizado
  - CI/CD pipeline configurado
  - Documentação técnica completa
  - Deploy em ambiente descentralizado

## 📊 Status de Progressão

| Etapa | Foco Principal         | Dependências     | Progresso | Status            |
| ----- | ---------------------- | ---------------- | --------- | ----------------- |
| **1** | 🏗️ Infraestrutura base | -                | 100%      | ✅ **COMPLETA**   |
| **2** | 🎨 Design System       | Etapa 1          | 0%        | ⏳ **PRÓXIMA**    |
| **3** | 🔐 Autenticação        | Etapas 1-2       | 0%        | ⏸️ **Aguardando** |
| **4** | 👤 Perfil básico       | Etapas 1-3       | 0%        | ⏸️ **Aguardando** |
| **5** | 🛒 Marketplace         | Etapas 1-4       | 0%        | ⏸️ **Aguardando** |
| **6** | 💰 Wallet Web3         | Etapas 1-5       | 0%        | ⏸️ **Aguardando** |
| **7** | 📱 Social features     | Etapas 1-6       | 0%        | ⏸️ **Aguardando** |
| **8** | 🏛️ DAO & DEX           | Etapas 1-7       | 0%        | ⏸️ **Aguardando** |
| **9** | 🔧 Trabalho & Final    | Todas anteriores | 0%        | ⏸️ **Aguardando** |

## 🤝 Contribuição

### Fluxo de Contribuição

1. **Fork** o projeto
2. Crie uma **branch**: `git checkout -b feature/nova-funcionalidade`
3. **Commit** suas mudanças:
   `git commit -m 'feat: adicionar nova funcionalidade'`
4. **Push** para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um **Pull Request**

### Padrão de Commits

Seguimos [Conventional Commits](https://conventionalcommits.org/):

```bash
feat: nova funcionalidade          # Nova feature
fix: correção de bug              # Correção de bug
docs: atualização de documentação # Documentação
style: formatação de código       # Formatação (sem mudança de lógica)
refactor: refatoração             # Refatoração de código
test: adição de testes           # Testes
chore: tarefas de manutenção     # Manutenção/build/CI
perf: melhorias de performance   # Otimizações
```

### Guidelines de Código

- **TypeScript strict** - Tipagem rigorosa obrigatória
- **ESLint** - Sem warnings permitidos em produção
- **Prettier** - Formatação automática configurada
- **Testes** - Coverage mínimo de 70% para novas features
- **Documentação** - JSDoc para funções públicas

## 🔮 Visão de Futuro

### Funcionalidades Avançadas (Pós v1.0)

- 🤖 **IA integrada** para recomendações personalizadas
- 🌐 **Multi-chain** - Suporte a Ethereum, Polygon, BSC
- 📊 **Analytics avançadas** para estabelecimentos
- 💎 **Programa de fidelidade** tokenizado
- 🎮 **Gamificação** com conquistas NFT
- 🔊 **Notificações push** descentralizadas
- 📱 **App móvel nativo** React Native

### Integrações Planejadas

- 💳 **Pagamentos fiat** via PIX/cartão
- 📍 **Mapas integrados** para delivery
- 💬 **Chat descentralizado** Matrix protocol
- 🎥 **Streaming ao vivo** para estabelecimentos
- 📈 **DeFi farming** com LP tokens
- 🏪 **ERP básico** para pequenos negócios

## 📞 Suporte e Comunidade

- 📧 **Email:** contato@bazari.com.br
- 💬 **Discord:** [Comunidade Bazari](https://discord.gg/bazari)
- 🐦 **Twitter:** [@BazariApp](https://twitter.com/BazariApp)
- 📖 **Documentação:** [docs.bazari.com.br](https://docs.bazari.com.br)
- 🐛 **Issues:**
  [GitHub Issues](https://github.com/seu-usuario/bazari-super-app/issues)

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo
[LICENSE](LICENSE) para detalhes.

---

<div align="center">

**🚀 Próximo Passo: Executar ETAPA 2 - Design System**

_"Criar um novo chat com: 'Continuar desenvolvimento Bazari - ETAPA 2'"_

---

**Feito com ❤️ pela comunidade Bazari**

**ETAPA 1/9 - Configuração Base: 100% COMPLETA** ✅

![Bazari Progress](https://img.shields.io/badge/Progresso-11.1%25-brightgreen?style=for-the-badge)

</div>
