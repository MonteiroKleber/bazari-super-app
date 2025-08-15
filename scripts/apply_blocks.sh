#!/usr/bin/env bash
# apply_blocks.sh (v1.1)
# Saída humana, cores e resumo. Regex tolerante para blocos ```[lang?]
set -euo pipefail

SOURCE=""
PROJECT=""
MODE="dry-run"
OVERWRITE="false"
COLORS="auto"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source) SOURCE="${2:-}"; shift 2;;
    --project) PROJECT="${2:-}"; shift 2;;
    --mode) MODE="${2:-}"; shift 2;;
    --overwrite) OVERWRITE="true"; shift 1;;
    --colors) COLORS="${2:-auto}"; shift 2;;
    -h|--help) echo "Uso: $0 --source ARQ --project DIR [--mode dry-run|apply] [--overwrite]"; exit 0;;
    *) echo "Arg desconhecido: $1" >&2; exit 2;;
  esac
done

if [[ -z "$SOURCE" || -z "$PROJECT" ]]; then
  echo "Uso: $0 --source ARQ --project DIR [--mode dry-run|apply] [--overwrite]" >&2; exit 2
fi

SOURCE="$(realpath -m "$SOURCE")"
PROJECT="$(realpath -m "$PROJECT")"

[[ -f "$SOURCE" ]] || { echo "[ERRO] Arquivo não encontrado: $SOURCE" >&2; exit 1; }
[[ -d "$PROJECT" ]] || { echo "[ERRO] Diretório não encontrado: $PROJECT" >&2; exit 1; }
[[ "$MODE" == "dry-run" || "$MODE" == "apply" ]] || { echo "[ERRO] --mode deve ser dry-run ou apply" >&2; exit 1; }

supports_color() {
  if [[ "$COLORS" == "always" ]]; then return 0; fi
  if [[ "$COLORS" == "never" ]]; then return 1; fi
  [[ -t 1 ]] && tput colors >/dev/null 2>&1
}
if supports_color; then
  C_RESET="$(printf '\033[0m')"; C_DIM="$(printf '\033[2m')"; C_BOLD="$(printf '\033[1m')"
  C_GREEN="$(printf '\033[32m')"; C_YELLOW="$(printf '\033[33m')"; C_CYAN="$(printf '\033[36m')"; C_RED="$(printf '\033[31m')"
else C_RESET=""; C_DIM=""; C_BOLD=""; C_GREEN=""; C_YELLOW=""; C_CYAN=""; C_RED=""; fi

echo -e "${C_BOLD}apply_blocks.sh — Execução${C_RESET}"
echo -e "Fonte:    ${C_CYAN}${SOURCE}${C_RESET}"
echo -e "Projeto:  ${C_CYAN}${PROJECT}${C_RESET}"
echo -e "Modo:     ${C_YELLOW}${MODE}${C_RESET}   Overwrite: ${C_YELLOW}${OVERWRITE}${C_RESET}"
echo

# Pré-scan: quantos fences existem?
FENCE_COUNT=$(grep -c '```' "$SOURCE" || true)
echo -e "Pré‑scan: linhas com \`\`\` = ${C_BOLD}${FENCE_COUNT}${C_RESET}"
if [[ "$FENCE_COUNT" -eq 0 ]]; then
  echo -e "${C_YELLOW}Aviso:${C_RESET} nenhum fence '```' encontrado no arquivo fonte."
  echo "Verifique se os blocos estão realmente cercados por crases triplas."
  exit 0
fi
echo

PY_OUT="$(python3 - <<'PY' "$SOURCE" "$PROJECT" "$MODE" "$OVERWRITE"
import sys, re
from pathlib import Path

source_path = Path(sys.argv[1])
project_root = Path(sys.argv[2])
mode = sys.argv[3]
overwrite = (sys.argv[4].lower() == 'true')

text = source_path.read_text(encoding='utf-8', errors='ignore')

# Regex mais tolerante:
# - aceita indentação/espacos após ```
# - linguagem opcional; aceita até fim de linha
# - fecha em linha que contenha apenas ``` com possíveis espaços
open_pat = r"^```[ \t]*(?P<lang>[^\r\n]*)\r?\n"
close_pat = r"\n```[ \t]*$"
BLOCK_RE = re.compile(open_pat + r"(?P<code>.*?)(?:" + close_pat + r")", re.DOTALL | re.MULTILINE)

# caminho alvo na primeira linha de comentário do bloco
FILE_HINT_RE = re.compile(r"^\s*(?://|/\*)\s*(?P<path>src/[^\s)*/]+)", re.IGNORECASE)

rows = []
idx = 0
for m in BLOCK_RE.finditer(text):
    idx += 1
    lang = (m.group('lang') or '').strip()
    code = (m.group('code') or '').strip()
    target_path = None
    for line in code.splitlines()[:6]:
        mh = FILE_HINT_RE.search(line)
        if mh:
            target_path = mh.group('path').strip()
            break

    action, exists, bytes_wrote, error = None, None, 0, None
    if not target_path:
        action = 'skip:no_target_hint'
    else:
        dest = project_root / target_path
        exists = dest.exists()
        if exists:
            if mode == 'dry-run':
                action = 'would:list_existing'
            else:
                if overwrite:
                    try:
                        dest.parent.mkdir(parents=True, exist_ok=True)
                        dest.write_text(code, encoding='utf-8')
                        bytes_wrote = len(code.encode('utf-8'))
                        action = 'overwritten'
                    except Exception as e:
                        action = 'error'; error = str(e)
                else:
                    action = 'listed_existing'
        else:
            if mode == 'dry-run':
                action = 'would:create'
            else:
                try:
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    dest.write_text(code, encoding='utf-8')
                    bytes_wrote = len(code.encode('utf-8'))
                    action = 'created'
                except Exception as e:
                    action = 'error'; error = str(e)

    rows.append((idx, lang, target_path or "", "" if exists is None else ("yes" if exists else "no"),
                 action or "", str(bytes_wrote), error or ""))

for r in rows:
    print("\\t".join(map(str, r)))
PY
)"

printf "%b\n" "${C_DIM}────────────────────────────────────────────────────────────────────────────${C_RESET}"
printf "%b\n" " ${C_BOLD}#  ${C_RESET}│ ${C_BOLD}Arquivo alvo${C_RESET}                                  │ ${C_BOLD}Ação${C_RESET}"
printf "%b\n" "${C_DIM}────────────────────────────────────────────────────────────────────────────${C_RESET}"

total=0; created=0; overwritten=0; would_create=0; listed=0; would_list=0; skipped=0; errors=0

while IFS=$'\t' read -r idx lang target exists action wrote error; do
  [[ -z "${idx:-}" ]] && continue
  total=$((total+1))
  case "$action" in
    created)              sym="✅"; color="$C_GREEN";  created=$((created+1));;
    overwritten)          sym="♻️ "; color="$C_GREEN";  overwritten=$((overwritten+1));;
    "would:create")       sym="🟢"; color="$C_CYAN";   would_create=$((would_create+1));;
    listed_existing)      sym="—";  color="$C_DIM";    listed=$((listed+1));;
    "would:list_existing") sym="➜"; color="$C_DIM";    would_list=$((would_list+1));;
    skip:no_target_hint)  sym="⏭️ "; color="$C_YELLOW"; skipped=$((skipped+1));;
    error)                sym="❌"; color="$C_RED";    errors=$((errors+1));;
    *)                    sym="•";  color="$C_DIM";;
  esac
  tgt="${target:-}"
  [[ -z "$tgt" ]] && tgt="(sem hint de caminho)"
  printf " %2s │ %-44s │ %b%s%b\n" "$idx" "$tgt" "$color" "$sym $action" "$C_RESET"
  if [[ -n "${error:-}" ]]; then
    printf "    %b↳ %s%b\n" "$C_RED" "$error" "$C_RESET"
  fi
done <<< "$PY_OUT"

printf "%b\n" "${C_DIM}────────────────────────────────────────────────────────────────────────────${C_RESET}"
echo -e " Total blocos: ${C_BOLD}${total}${C_RESET}   Criados: ${C_GREEN}${created}${C_RESET}   Overwrite: ${C_GREEN}${overwritten}${C_RESET}   Prev. criar: ${C_CYAN}${would_create}${C_RESET}   Existentes: ${C_DIM}${listed}${C_RESET}   Prev. listar: ${C_DIM}${would_list}${C_RESET}   Sem hint: ${C_YELLOW}${skipped}${C_RESET}   Erros: ${C_RED}${errors}${C_RESET}"
printf "%b\n" "${C_DIM}────────────────────────────────────────────────────────────────────────────${C_RESET}"

if [[ "$MODE" == "dry-run" ]]; then
  echo -e "${C_BOLD}Modo dry-run:${C_RESET} nada foi alterado. Use --mode apply para aplicar."
fi
