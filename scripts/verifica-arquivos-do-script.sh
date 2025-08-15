#!/bin/bash

# Arquivo que será analisado (mude o caminho se necessário)
SCRIPT_FILE="script-marketplace-01.sh"

# Diretório base do projeto (raiz do seu código)
BASE_PATH="$(pwd)"

# Extrair todos os caminhos de arquivos que serão criados
# Padrão: algo/qualquercoisa/arquivo.ext (ajustado para ts, js, html, css, etc)
FILES_TO_CHECK=$(grep -Eo '([a-zA-Z0-9_\-\/]+)\.(ts|js|html|css|json|md)' "$SCRIPT_FILE" | sort -u)

FOUND=false

echo "🔍 Verificando arquivos listados no script..."

while IFS= read -r file; do
    FILE_PATH="$BASE_PATH/$file"
    if [ -f "$FILE_PATH" ]; then
        echo "✅ Existe: $file"
        FOUND=true
    else
        echo "❌ Não existe: $file"
    fi
done <<< "$FILES_TO_CHECK"

if [ "$FOUND" = false ]; then
    echo "🚫 Nenhum dos arquivos listados no script existe no projeto."
fi
