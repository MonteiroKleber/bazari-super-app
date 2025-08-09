# 🌟 Bazari - Super App Web3

> Marketplace descentralizado com rede social integrada, onde sua identidade é um ativo, seus negócios são tokens e sua comunidade governa o ecossistema.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📋 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run test` - Executar testes
- `npm run test:coverage` - Relatório de coverage
- `npm run lint` - Verificar código
- `npm run lint:fix` - Corrigir problemas automaticamente
- `npm run format` - Formatar código

## 🛠 Tecnologias

### Frontend
- **React 18** + **TypeScript** - Interface moderna e type-safe
- **Vite** - Build tool rápido e otimizado
- **TailwindCSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas
- **React Router** - Roteamento SPA

### Web3 & Blockchain
- **Polkadot.js** - Interação com Substrate
- **IPFS** - Armazenamento descentralizado
- **BazariChain** - Blockchain customizada

### Desenvolvimento
- **Vitest** - Testes rápidos
- **ESLint + Prettier** - Qualidade de código
- **Husky** - Git hooks automatizados

## 📐 Arquitetura

Seguimos o padrão **Feature-Sliced Design**:

```
src/
├── app/        # Configuração da aplicação
├── pages/      # Páginas e rotas
├── features/   # Funcionalidades de negócio
├── shared/     # Código compartilhado
├── entities/   # Modelos de dados
└── services/   # APIs e integrações
```

## 🌍 Internacionalização

Sistema multi-idioma com detecção automática:
- 🇧🇷 Português (Brasil)
- 🇺🇸 English (US)  
- 🇪🇸 Español

```typescript
// Uso básico
const { t } = useTranslation()
const text = t('common', 'loading')

// Hook especializado
const { t } = useCommonTranslation()
const text = t('loading')
```

## 🎨 Design System

### Paleta de Cores Oficial
- **Primária**: `#8B0000` (Resistência e povo)
- **Secundária**: `#FFB300` (Riqueza e esperança)
- **Fundo Escuro**: `#1C1C1C` (Descentralização)
- **Fundo Claro**: `#F5F1E0` (Simplicidade)

### Componentes Base
- `.btn-primary`, `.btn-secondary` - Botões estilizados
- `.card-bazari` - Cards reutilizáveis
- `.input-bazari` - Inputs padronizados
- `.badge-*` - Badges semânticos

## 📱 PWA Features

- **Instalação nativa** em dispositivos móveis
- **Funcionamento offline** para funcionalidades básicas
- **Cache inteligente** de recursos
- **Service Worker** configurado

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Coverage report
npm run test:coverage

# Testes em modo watch
npm run test -- --watch
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adicionar nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrão de Commits

Usamos [Conventional Commits](https://conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação de código
refactor: refatoração
test: adição de testes
chore: tarefas de manutenção
```

## 🗺 Roadmap

- [x] **ETAPA 1**: Configuração base e infraestrutura ✅
- [ ] **ETAPA 2**: Design system e componentes
- [ ] **ETAPA 3**: Autenticação Web3
- [ ] **ETAPA 4**: Perfil tokenizado
- [ ] **ETAPA 5**: Marketplace descentralizado
- [ ] **ETAPA 6**: Carteira Web3 nativa
- [ ] **ETAPA 7**: Rede social integrada
- [ ] **ETAPA 8**: Governança DAO
- [ ] **ETAPA 9**: Protocolo de trabalho

## 📄 Licença

Este projeto está licenciado sob a MIT License.

---

<div align="center">

**Feito com ❤️ pela comunidade Bazari**

**ETAPA 1 - Configuração Base: 100% COMPLETA** ✅

</div>
