#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPENROUTER_ENV_FILE="${OPENROUTER_ENV_FILE:-$HOME/.config/claude-openrouter/env.sh}"
TRACKED_OUTPUTS=(
  "src/data/activity-feed.generated.json"
  "src/generated/content-index.ts"
  "src/generated/search-documents.json"
)

if [[ -z "${OPENROUTER_API_KEY:-}" && -f "$OPENROUTER_ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$OPENROUTER_ENV_FILE"
fi

cd "$ROOT_DIR"

pnpm content:source
pnpm activity:generate
node --import tsx scripts/build-content-indices.mts
node --import tsx scripts/build-search.mts

changed_outputs=()
for output in "${TRACKED_OUTPUTS[@]}"; do
  if ! git diff --quiet -- "$output"; then
    changed_outputs+=("$output")
  fi
done

if [[ ${#changed_outputs[@]} -gt 0 ]]; then
  printf 'Publishable tracked outputs changed:\n'
  printf ' - %s\n' "${changed_outputs[@]}"
else
  printf 'No publishable tracked outputs changed.\n'
fi
