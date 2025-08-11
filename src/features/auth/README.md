# 🔐 Sistema de Autenticação Web3 Bazari

Sistema completo de autenticação Web3 com suporte a múltiplas contas, criptografia local e gerenciamento seguro de chaves.

## Hooks
- `useAuth()` — estado e ações de autenticação
- `useAuthForm()` — validação de formulários
- `useWalletGeneration()` — geração/confirm. da seed phrase

## Componentes
- `LoginForm`, `RegisterForm`, `ImportAccountForm`
- `SeedPhraseDisplay`, `SeedPhraseConfirmation`
- `AuthLayout`, `RegistrationSuccess`

## Páginas
- `LoginPage`, `RegisterPage`, `ImportAccountPage`, `RecoveryPage`

## Segurança
- AES-GCM + PBKDF2 (100k iterações), salt aleatório
- Chaves privadas sempre criptografadas
- Persistência somente de dados não sensíveis

## Fluxos
- Registro → Gera e confirma seed phrase → cria conta → login
- Importação → Valida seed → define senha → login
- Recuperação → Mostra endereço/chave pública → seguir para Importar
