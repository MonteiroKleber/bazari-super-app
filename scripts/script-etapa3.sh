#!/bin/bash

# Lista de arquivos conforme estrutura fornecida
ESTRUTURA=(
    "src/features/auth/components/LoginForm.tsx"
    "src/features/auth/components/RegisterForm.tsx"
    "src/features/auth/components/ImportAccountForm.tsx"
    "src/features/auth/components/RecoveryForm.tsx"
    "src/features/auth/components/SeedPhraseConfirmation.tsx"
    "src/features/auth/components/AuthLayout.tsx"

    "src/features/auth/hooks/useAuth.ts"
    "src/features/auth/hooks/useAuthForm.ts"
    "src/features/auth/hooks/useWalletGeneration.ts"

    "src/features/auth/store/authStore.ts"

    "src/features/auth/services/authService.ts"
    "src/features/auth/services/cryptoService.ts"
    "src/features/auth/services/walletService.ts"

    "src/features/auth/types/auth.types.ts"

    "src/shared/guards/AuthGuard.tsx"
    "src/shared/guards/RouteGuard.tsx"

    "src/entities/account.ts"

    "src/pages/auth/LoginPage.tsx"
    "src/pages/auth/RegisterPage.tsx"
    "src/pages/auth/ImportAccountPage.tsx"
    "src/pages/auth/RecoveryPage.tsx"
)

# Loop para criar estrutura
for ITEM in "${ESTRUTURA[@]}"; do
    DIR=$(dirname "$ITEM")
    FILE=$(basename "$ITEM")

    # Criar diretório se não existir
    if [ ! -d "$DIR" ]; then
        echo "Criando pasta: $DIR"
        mkdir -p "$DIR"
    fi

    # Criar arquivo se não existir
    if [ ! -f "$ITEM" ]; then
        echo "Criando arquivo: $ITEM"
        touch "$ITEM"
    fi
done

echo "Verificação e criação da estrutura concluída."
