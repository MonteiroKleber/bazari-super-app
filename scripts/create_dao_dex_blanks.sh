#!/usr/bin/env bash
set -euo pipefail

TRUNCATE="${TRUNCATE:-0}"

files=(
  # ---------------- DAO ----------------
  "src/features/dao/types/dao.types.ts"
  "src/features/dao/services/daoService.ts"
  "src/features/dao/hooks/useDAO.ts"
  "src/features/dao/components/ProposalCard.tsx"
  "src/features/dao/components/VoteBreakdown.tsx"
  "src/features/dao/components/TreasuryWidget.tsx"
  "src/features/dao/components/index.ts"
  "src/features/dao/index.ts"

  "src/pages/dao/DaoHome.tsx"
  "src/pages/dao/DaoProposals.tsx"
  "src/pages/dao/DaoProposalDetail.tsx"
  "src/pages/dao/DaoCreateProposal.tsx"
  "src/pages/dao/DaoVotes.tsx"
  "src/pages/dao/DaoTreasury.tsx"
  "src/pages/dao/index.ts"

  "src/app/routes/daoRoutes.tsx"

  # ---------------- DEX ----------------
  "src/features/dex/engine/amm.ts"
  "src/features/dex/types/dex.types.ts"
  "src/features/dex/services/dexService.ts"
  "src/features/dex/hooks/useDEX.ts"
  "src/features/dex/components/SwapForm.tsx"
  "src/features/dex/components/PoolCard.tsx"
  "src/features/dex/components/AddLiquidityForm.tsx"
  "src/features/dex/components/RemoveLiquidityForm.tsx"
  "src/features/dex/components/RewardsDashboard.tsx"
  "src/features/dex/components/index.ts"
  "src/features/dex/index.ts"

  "src/pages/dex/DexHome.tsx"
  "src/pages/dex/DexSwap.tsx"
  "src/pages/dex/DexPools.tsx"
  "src/pages/dex/DexPoolDetail.tsx"
  "src/pages/dex/DexCreatePool.tsx"
  "src/pages/dex/DexRewards.tsx"
  "src/pages/dex/index.ts"

  "src/app/routes/dexRoutes.tsx"
)

echo "Criando arquivos vazios da ETAPA 8 (DAO + DEX)…"
for f in "${files[@]}"; do
  dir="$(dirname "$f")"
  mkdir -p "$dir"

  if [[ -f "$f" ]]; then
    if [[ "$TRUNCATE" == "1" ]]; then
      : > "$f"
      echo "TRUNC  $f"
    else
      echo "SKIP   $f (já existe; use TRUNCATE=1 para esvaziar)"
    fi
  else
    : > "$f"
    echo "CREATE $f"
  fi
done
echo "Pronto."
