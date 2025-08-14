#!/usr/bin/env bash
set -euo pipefail

# Uso:
#   ./create_wallet_scaffold.sh [RAIZ_DO_PROJETO]
# Se não passar argumento, usa o diretório atual (.)
ROOT_DIR="${1:-.}"

FILES=(
  "src/features/wallet/substrate/config.ts"
  "src/features/wallet/substrate/substrateClient.ts"
  "src/features/wallet/services/walletService.ts"
  "src/features/wallet/hooks/useWallet.ts"
  "src/features/wallet/components/WalletHeader.tsx"
  "src/features/wallet/components/AccountSwitcher.tsx"
  "src/features/wallet/components/AccountManager.tsx"
  "src/features/wallet/components/BalanceCard.tsx"
  "src/features/wallet/components/AssetTabs.tsx"
  "src/features/wallet/components/TokenList.tsx"
  "src/features/wallet/components/NftGrid.tsx"
  "src/pages/wallet/WalletHome.tsx"
  "src/pages/wallet/WalletStaking.tsx"
  "src/pages/wallet/WalletHistory.tsx"
  "src/pages/wallet/WalletAccounts.tsx"
  "src/app/routes/walletRoutes.tsx"
)

created=0
skipped=0

echo "📁 Criando estrutura de wallet em: $ROOT_DIR"
echo

for rel in "${FILES[@]}"; do
  abs="$ROOT_DIR/$rel"
  dir="$(dirname "$abs")"
  mkdir -p "$dir"
  if [[ -e "$abs" ]]; then
    echo "SKIP  - $rel (já existe)"
    ((skipped++)) || true
  else
    : > "$abs"   # cria arquivo vazio
    echo "CREATE- $rel"
    ((created++)) || true
  fi
done

echo
echo "✅ Concluído. Criados: $created | Ignorados: $skipped"
