#!/usr/bin/env bash
set -euo pipefail

TRUNCATE="${TRUNCATE:-0}"

files=(
  "src/features/social/types/social.types.ts"
  "src/features/social/hooks/useSocial.ts"
  "src/features/social/services/socialService.ts"
  "src/features/social/components/PostCard.tsx"
  "src/features/social/components/NotificationItem.tsx"
  "src/features/social/components/index.ts"
  "src/pages/social/SocialFeed.tsx"
  "src/pages/social/SocialPostCreate.tsx"
  "src/pages/social/SocialNotifications.tsx"
  "src/pages/social/SocialTimeline.tsx"
  "src/pages/social/index.ts"
  "src/app/routes/socialRoutes.tsx"
  "src/features/social/index.ts"
)

echo "Criando arquivos vazios da ETAPA 7…"
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
