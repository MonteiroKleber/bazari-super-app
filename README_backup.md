# 🌟 Bazari - Super App Web3

> Marketplace descentralizado com rede social integrada, onde sua identidade é um ativo, seus negócios são tokens e sua comunidade governa o ecossistema.

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

### Paleta de Cores Oficial ✅
```css
--primary-900: #8B0000   /* Resistência e povo */
--primary-700: #A52A2A   /* Variação principal */
--secondary-400: #FFB300 /* Riqueza e esperança */
--dark-900: #1C1C1C      /* Descentralização */
--light-100: #F5F1E0     /* Simplicidade */
```

### Sistema Tipográfico ✅
- **Fontes**: Poppins (títulos) + Inter (texto)
- **Pesos**: 300, 400, 500, 600, 700
- **Tamanhos**: xs (12px) até 6xl (60px)
- **Loading**: Carregamento otimizado via Google Fonts

### Componentes Implementados ✅
**11 componentes principais completos**:
- ✅ `Button` - 5 variants, 5 tamanhos, estados de loading, ícones
- ✅ `Input` - Validação, ícones, password toggle, 3 variants
- ✅ `Select` - Dropdown customizado com animações e busca
- ✅ `Textarea` - Campo multilinhas redimensionável
- ✅ `Card` - 4 variants com Header, Body, Footer
- ✅ `Badge` - 7 variants semânticos, 2 formas, 3 tamanhos
- ✅ `Loading` - 4 tipos (spinner, dots, pulse, skeleton)
- ✅ `Modal` - Portal, acessibilidade, ESC key, backdrop
- ✅ `Tooltip` - 4 posições, 2 variants, delay configurável
- ✅ `Progress` - Linear e circular, animações, variants
- ✅ `Icon System` - 100+ ícones Lucide React centralizados

### Sistema de Ícones ✅
```typescript
import { Search, User, Settings, Heart, Wallet } from '@shared/icons'

// Uso direto
<Search className="w-5 h-5 text-primary-600" />

// Com utilitários
const iconClasses = cn(
  getIconSizeClasses('md'),
  getIconVariantClasses('primary')
)
```

### Responsividade ✅
- **Mobile First** - Design otimizado para dispositivos móveis
- **Breakpoints**: `xs` (475px), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- **Touch Friendly** - Elementos com tamanho adequado para toque
- **Safe Areas** - Suporte a dispositivos com notch

### Acessibilidade ✅
- **ARIA** - Atributos completos em todos os componentes
- **Navegação por teclado** - Tab, Enter, ESC, setas
- **Contraste WCAG 2.1 AA** - Conformidade rigorosa
- **Screen readers** - Labels e descrições apropriadas
- **Focus management** - Indicadores visuais claros

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

### Configuração de Testes ✅
- **Vitest** - Runner de testes rápido
- **@testing-library/react** - Testes centrados no usuário
- **jsdom** - Ambiente DOM simulado
- **Coverage >70%** - Meta de cobertura atingida

## 🔒 Segurança Web3

### Autenticação (ETAPA 3 - PRÓXIMA)
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

### ✅ **ETAPA 2** - Design System e Componentes Base (COMPLETA)
**Duração:** 1 chat | **Status:** 🟢 **100% COMPLETA**

**Deliverables concluídos:**
- [x] ✅ **Paleta de cores oficial** implementada no Tailwind
- [x] ✅ **Sistema tipográfico** (Poppins/Inter) configurado e carregado
- [x] ✅ **11 componentes React completos** em `src/shared/ui/`:
  - Button (5 variants, 5 sizes, loading, icons, acessibilidade)
  - Input (validação, ícones, password toggle, 3 variants)
  - Select (dropdown customizado com animações)
  - Textarea (redimensionável, validação)
  - Card (4 variants, Header/Body/Footer)
  - Badge (7 variants, formas, tamanhos)
  - Loading (4 tipos, skeleton, full-screen)
  - Modal (portal, ESC key, backdrop, acessibilidade)
  - Tooltip (4 posições, 2 variants, delay)
  - Progress (linear e circular, animações)
- [x] ✅ **Sistema de ícones** centralizado (Lucide React, 100+ ícones)
- [x] ✅ **Configuração Framer Motion** para animações fluidas
- [x] ✅ **Responsividade mobile-first** testada e funcional
- [x] ✅ **Acessibilidade ARIA completa** - navegação por teclado, screen readers
- [x] ✅ **Testes unitários** para todos os componentes (coverage >70%)
- [x] ✅ **Hooks utilitários** (useDesignSystem, useResponsive, useA11y)
- [x] ✅ **Documentação completa** de componentes (COMPONENTS.md)

### 🟡 **ETAPA 3** - Autenticação e Gestão de Conta
**Duração:** 1 chat | **Status:** ⏸️ **Próxima - Aguardando**

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
- [ ] Tela de perfil completa e editável
- [ ] Tokenização de identidade (Identity NFT)
- [ ] Páginas públicas de perfil com QR code
- [ ] Sistema de busca de usuários com filtros
- [ ] Upload de avatar otimizado (IPFS)

### 🟡 **ETAPA 5** - Marketplace Base
**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 4**

**Deliverables planejados:**
- [ ] Sistema de categorias hierárquico (4 níveis)
- [ ] Entidades Business, Product, Service completas
- [ ] Cadastro de estabelecimento com tokenização
- [ ] Carrinho multi-loja com cálculo de frete
- [ ] Sistema de favoritos e reviews

### 🟡 **ETAPA 6** - Wallet e Integração Substrate
**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 5**

**Deliverables planejados:**
- [ ] Configuração Polkadot.js API completa
- [ ] Conectividade com BazariChain (Substrate testnet)
- [ ] Wallet nativa com dashboard
- [ ] Staking e delegação BZR
- [ ] Histórico de transações paginado

### 🟡 **ETAPA 7** - Rede Social Integrada
**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 6**

**Deliverables planejados:**
- [ ] Sistema de postagens descentralizado
- [ ] Feed público cronológico
- [ ] Interações sociais Web3
- [ ] Centro de notificações
- [ ] Timeline de atividades blockchain

### 🟡 **ETAPA 8** - DAO Governança e DEX
**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 7**

**Deliverables planejados:**
- [ ] DAO Governança completa
- [ ] DEX (Exchange Descentralizado)
- [ ] AMM (Automated Market Maker) básico
- [ ] Sistema de votação ponderada
- [ ] Liquidity pools com rewards

### 🟡 **ETAPA 9** - Protocolo de Trabalho e Finalização
**Duração:** 1 chat | **Status:** ⏸️ **Aguardando ETAPA 8**

**Deliverables planejados:**
- [ ] Protocolo de Trabalho Descentralizado
- [ ] Marketplace de projetos freelance
- [ ] Escrow automático com smart contracts
- [ ] Otimizações finais de performance
- [ ] Suíte completa de testes (coverage >80%)

## 📊 Status de Progressão

| Etapa | Foco Principal | Dependências | Progresso | Status |
|-------|---------------|--------------|-----------|---------|
| **1** | 🏗️ Infraestrutura base | - | 100% | ✅ **COMPLETA** |
| **2** | 🎨 Design System | Etapa 1 | 100% | ✅ **COMPLETA** |
| **3** | 🔐 Autenticação | Etapas 1-2 | 0% | 🎯 **PRÓXIMA** |
| **4** | 👤 Perfil básico | Etapas 1-3 | 0% | ⏸️ **Aguardando** |
| **5** | 🛒 Marketplace | Etapas 1-4 | 0% | ⏸️ **Aguardando** |
| **6** | 💰 Wallet Web3 | Etapas 1-5 | 0% | ⏸️ **Aguardando** |
| **7** | 📱 Social features | Etapas 1-6 | 0% | ⏸️ **Aguardando** |
| **8** | 🏛️ DAO & DEX | Etapas 1-7 | 0% | ⏸️ **Aguardando** |
| **9** | 🔧 Trabalho & Final | Todas anteriores | 0% | ⏸️ **Aguardando** |

**Progresso Total: 22.2% (2/9 etapas)**

## 🎯 **Próximo Passo: ETAPA 3 - Autenticação**

Com o Design System 100% completo, agora vamos implementar o sistema de autenticação Web3:

### 🔥 **OBJETIVOS ETAPA 3**
```bash
# 1. Sistema de autenticação completo
- Login com senha segura
- Criação de nova conta
- Importação via seed phrase
- Recuperação de conta

# 2. Criptografia e segurança
- Chaves privadas criptografadas
- Persistência segura
- Guards de rota

# 3. Interface de usuário
- Telas de auth usando Design System
- Fluxos intuitivos e seguros
- Validações robustas
```

### 📋 **CHECKLIST PARA ETAPA 3**
- [ ] 🔐 **Sistema de criptografia** (AES-256)
- [ ] 🎯 **Fluxo de seed phrase** (geração + confirmação)
- [ ] 🛡️ **Guards de rota** protegidas
- [ ] 💾 **Persistência segura** com TTL
- [ ] 🎨 **Interfaces usando Design System**
- [ ] 🧪 **Testes de segurança**

## 🎨 Demonstração do Design System

Para ver todos os componentes em ação:

```bash
npm run dev
# Acesse: http://localhost:3000/components-demo
```

**Página de demonstração inclui:**
- ✨ Todos os 11 componentes implementados
- 🎯 Exemplos práticos de uso
- 📱 Responsividade testada
- ♿ Acessibilidade demonstrada
- 🌙 Dark mode funcional
- 🎭 Animações fluidas

## 🤝 Contribuição

### Fluxo de Contribuição
1. **Fork** o projeto
2. Crie uma **branch**: `git checkout -b feature/nova-funcionalidade`
3. **Commit** suas mudanças: `git commit -m 'feat: adicionar nova funcionalidade'`
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
- 🐛 **Issues:** [GitHub Issues](https://github.com/seu-usuario/bazari-super-app/issues)

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**🎯 Próximo Passo: ETAPA 3 - Autenticação e Gestão de Conta**

*"Com o Design System completo, agora vamos implementar autenticação Web3 segura com criptografia local e guards de rota."*

---

**Feito com ❤️ pela comunidade Bazari**

**ETAPA 1: ✅ COMPLETA | ETAPA 2: ✅ COMPLETA | ETAPA 3: 🎯 PRÓXIMA**

![Bazari Progress](https://img.shields.io/badge/Progresso-22.2%25-green?style=for-the-badge)

</div>