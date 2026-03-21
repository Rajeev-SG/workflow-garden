#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPENROUTER_ENV_FILE="${OPENROUTER_ENV_FILE:-$HOME/.config/claude-openrouter/env.sh}"

if [[ -z "${OPENROUTER_API_KEY:-}" && -f "$OPENROUTER_ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$OPENROUTER_ENV_FILE"
fi

cd "$ROOT_DIR"

pnpm content:source
pnpm activity:generate
pnpm exec tsx scripts/build-content-indices.mts
pnpm exec tsx scripts/build-search.mts
