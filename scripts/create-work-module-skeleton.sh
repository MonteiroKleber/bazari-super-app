#!/usr/bin/env bash
set -euo pipefail

# create-work-module-skeleton.sh
# Cria a estrutura da ETAPA 9 (Work) com arquivos em branco.
# Uso:
#   bash create-work-module-skeleton.sh
#   FORCE=1 bash create-work-module-skeleton.sh   # sobrescreve arquivos existentes

FILES=(
  "src/features/work/entities/workTypes.ts"

  "src/features/work/services/workService.ts"
  "src/features/work/services/escrowService.ts"

  "src/features/work/hooks/useWork.ts"

  "src/features/work/components/ProjectCard.tsx"
  "src/features/work/components/ProjectFilters.tsx"
  "src/features/work/components/ProposalCard.tsx"
  "src/features/work/components/EscrowStatusBadge.tsx"
  "src/features/work/components/MilestoneList.tsx"
  "src/features/work/components/SubmitWorkModal.tsx"
  "src/features/work/components/DisputeDialog.tsx"

  "src/features/work/pages/work/WorkHome.tsx"
  "src/features/work/pages/work/WorkProjectDetail.tsx"
  "src/features/work/pages/work/WorkCreateProject.tsx"
  "src/features/work/pages/work/WorkProposals.tsx"
  "src/features/work/pages/work/WorkDashboardClient.tsx"
  "src/features/work/pages/work/WorkDashboardFreelancer.tsx"

  "src/app/routes/workRoutes.tsx"
)

created=0
skipped=0
overwritten=0

for f in "${FILES[@]}"; do
  dir="$(dirname "$f")"
  mkdir -p "$dir"

  if [[ -e "$f" && "${FORCE:-0}" != "1" ]]; then
    echo "SKIP  $f (já existe)"
    ((skipped++)) || true
    continue
  fi

  # Cria vazio (e sobrescreve se FORCE=1)
  : > "$f"

  if [[ -e "$f" && "${FORCE:-0}" == "1" ]]; then
    echo "OVERW $f"
    ((overwritten++)) || true
  else
    echo "CREATE $f"
    ((created++)) || true
  fi
done

echo
echo "Resumo:"
echo "  Criados:     $created"
echo "  Sobrescritos:$overwritten"
echo "  Ignorados:   $skipped"
