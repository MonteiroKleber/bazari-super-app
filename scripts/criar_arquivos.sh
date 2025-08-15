#!/bin/bash

# Criar as pastas necessárias
mkdir -p src/pages/marketplace/digital/DigitalCreateWizard
mkdir -p src/features/marketplace/components/digital

# Criar arquivos em src/pages/marketplace/digital/
touch src/pages/marketplace/digital/DigitalHome.tsx
touch src/pages/marketplace/digital/DigitalList.tsx
touch src/pages/marketplace/digital/DigitalPDP.tsx
touch src/pages/marketplace/digital/DigitalMine.tsx

# Criar arquivos em src/pages/marketplace/digital/DigitalCreateWizard/
touch src/pages/marketplace/digital/DigitalCreateWizard/index.tsx
touch src/pages/marketplace/digital/DigitalCreateWizard/StepType.tsx
touch src/pages/marketplace/digital/DigitalCreateWizard/StepUploads.tsx
touch src/pages/marketplace/digital/DigitalCreateWizard/StepLicense.tsx
touch src/pages/marketplace/digital/DigitalCreateWizard/StepSupply.tsx
touch src/pages/marketplace/digital/DigitalCreateWizard/StepRoyalties.tsx
touch src/pages/marketplace/digital/DigitalCreateWizard/StepPricing.tsx
touch src/pages/marketplace/digital/DigitalCreateWizard/StepReview.tsx
touch src/pages/marketplace/digital/DigitalCreateWizard/StepPublish.tsx

# Criar arquivos em src/features/marketplace/components/digital/
touch src/features/marketplace/components/digital/DigitalBadge.tsx
touch src/features/marketplace/components/digital/RoyaltyChip.tsx
touch src/features/marketplace/components/digital/LicensePill.tsx
touch src/features/marketplace/components/digital/OnchainProofModal.tsx
touch src/features/marketplace/components/digital/DecryptGate.tsx
touch src/features/marketplace/components/digital/ResaleCta.tsx
touch src/features/marketplace/components/digital/DigitalStats.tsx
touch src/features/marketplace/components/digital/DigitalCategoryCard.tsx
touch src/features/marketplace/components/digital/DigitalProductGrid.tsx
touch src/features/marketplace/components/digital/index.ts

echo "✅ Estrutura e arquivos criados com sucesso."
