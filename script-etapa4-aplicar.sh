#!/usr/bin/env bash
# script-etapa4-aplicar.sh
# Aplica os arquivos definidos em conteudo-etapa-4.txt
# Regras:
# - Lê blocos de código (``` ... ```). Dentro do bloco, procura a 1ª linha que contenha um caminho "src/..."
# - O restante do bloco vira o conteúdo do arquivo
# - Cria diretórios necessários
# - Não sobrescreve arquivo que já exista com conteúdo (apenas reporta)
# - Se existir vazio, preenche
# - --dry-run: apenas mostra o que faria

set -uo pipefail

DRY_RUN=0
INPUT_FILE="conteudo-etapa-4.txt"

for arg in "$@"; do
  case "$arg" in
    -n|--dry-run) DRY_RUN=1 ;;
    -i|--input)
      shift
      INPUT_FILE="${1:-conteudo-etapa-4.txt}"
      ;;
    *) ;;
  esac
done

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "ERRO: arquivo '$INPUT_FILE' não encontrado."
  exit 1
fi

# helpers
log() { printf "%s\n" "$*"; }
mkp() { [[ $DRY_RUN -eq 1 ]] && log "MKDIR (dry-run): $1" || { mkdir -p "$1"; log "MKDIR: $1"; }; }
write_file() {
  local target="$1" tmpfile="$2"

  # Se já existe e é diretório, não tentar tratar como arquivo
  if [[ -d "$target" ]]; then
    log "SKIP (é diretório): $target"
    return 0
  fi

  if [[ -f "$target" ]]; then
    # arquivo existe
    if [[ -s "$target" ]]; then
      # já tem conteúdo -> não sobrescrever
      # Checamos igualdade apenas se for arquivo regular
      if cmp -s "$target" "$tmpfile" 2>/dev/null; then
        log "OK (sem mudanças): $target"
      else
        log "SKIP (existe c/ conteúdo): $target"
      fi
      return 0
    else
      # existe mas está vazio -> podemos preencher
      if [[ $DRY_RUN -eq 1 ]]; then
        log "FILL (dry-run, vazio → preenchido): $target"
      else
        cp "$tmpfile" "$target"
        log "FILL (vazio → preenchido): $target"
      fi
      return 0
    fi
  else
    # novo arquivo
    if [[ $DRY_RUN -eq 1 ]]; then
      log "CREATE (dry-run): $target"
    else
      cp "$tmpfile" "$target"
      log "CREATE: $target"
    fi
  fi
}

# parsing do arquivo
in_code=0
current_path=""
buffer_file="$(mktemp)"
cleanup() { rm -f "$buffer_file" 2>/dev/null || true; }
trap cleanup EXIT

# função para “finalizar” um bloco quando temos caminho válido
flush_block() {
  local path="$1"
  if [[ -z "$path" ]]; then
    : > "$buffer_file" # limpa buffer e sai
    return
  fi
  # garante diretório
  local dir
  dir="$(dirname "$path")"
  if [[ ! -d "$dir" ]]; then
    mkp "$dir"
  fi
  write_file "$path" "$buffer_file"
  : > "$buffer_file" # limpa buffer
}

# regex util: extrai primeiro "src/..." da linha
extract_path() {
  local line="$1"
  # pega a primeira ocorrência que comece em src/ e vá até espaço, parêntese ou fim
  if [[ "$line" =~ (src/[^\"\'\)\ ]+) ]]; then
    printf "%s" "${BASH_REMATCH[1]}"
  else
    printf ""
  fi
}

# percorre o arquivo linha a linha
while IFS= read -r line || [[ -n "$line" ]]; do
  # detecta início/fim de bloco ```
  if [[ "$line" =~ ^\`\`\` ]]; then
    if [[ $in_code -eq 0 ]]; then
      in_code=1
      current_path=""
      : > "$buffer_file"
      continue
    else
      # fechando bloco: se temos caminho, grava
      flush_block "$current_path"
      in_code=0
      current_path=""
      continue
    fi
  fi

  if [[ $in_code -eq 1 ]]; then
    # se ainda não temos caminho, tentar extrair a partir da linha
    if [[ -z "$current_path" ]]; then
      guess="$(extract_path "$line")"
      if [[ -n "$guess" ]]; then
        current_path="$guess"
        # não incluir essa linha (é um comentário indicando o caminho)
        continue
      fi
    fi
    # acumula conteúdo do bloco
    printf "%s\n" "$line" >> "$buffer_file"
  fi
done < "$INPUT_FILE"

# caso o arquivo termine dentro de bloco (sem crase final)
if [[ $in_code -eq 1 ]]; then
  flush_block "$current_path"
fi

# criar diretórios “vazios” visíveis no topo (árvore) caso não tenham aparecido em blocos
# — pegamos linhas do 1º bloco de árvore que comecem com 'src/' ou '└──/├──'
# — e geramos as pastas correspondentes
awk '
  BEGIN{inblock=0}
  /^```/ {inblock=!inblock; next}
  inblock==1 {
    # linhas do tipo "src/" ou "├──" "└──" "│"
    if ($0 ~ /^src\//) { print $0 }
    else if ($0 ~ /^[│├└ ]+└── / || $0 ~ /^[│├└ ]+├── /) {
      # extrai caminho após os “├── ”/“└── ”
      sub(/^[│├└ ]+/, "", $0)
      sub(/^├── /, "", $0); sub(/^└── /, "", $0)
      # pega apenas o caminho (1ª coluna)
      print "src/"$0
    }
  }
' "$INPUT_FILE" | sed 's/ (.*//g' | sed 's/[[:space:]]*$//' | while read -r maybe; do
  [[ -z "$maybe" ]] && continue
  # se termina com "/" ou não tem extensão, tratamos como diretório
  case "$maybe" in
    */) dir="$maybe" ;;
    *)
      # se parece diretório (sem ponto e não contém extensão), ainda assim criar pasta base
      if [[ "$maybe" != *.* ]]; then dir="$maybe"; else dir="$(dirname "$maybe")"; fi
      ;;
  esac
  [[ -d "$dir" ]] && continue
  mkp "$dir"
done

if [[ $DRY_RUN -eq 1 ]]; then
  echo "----"
  echo "Dry-run concluído. Nenhuma modificação foi aplicada."
fi
