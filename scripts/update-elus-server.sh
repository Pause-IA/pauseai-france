#!/usr/bin/env bash
#
# Met à jour les données des élus (elus.json + code-postal-circo.json) et ouvre
# une PULL REQUEST de mise à jour. Rien n'est poussé directement sur main : un
# humain relit puis merge la PR, ce qui déclenche le redéploiement Netlify.
#
# Conçu pour tourner périodiquement via un timer systemd (voir scripts/systemd/).
# Ne dépend que de Node 18+, git et curl (aucune dépendance npm).
#
# Variables d'environnement :
#   GITHUB_TOKEN   (requis) PAT fine-grained avec, sur ce repo :
#                  Contents: Read and write + Pull requests: Read and write
#   REPO_DIR       chemin du clone du repo       (défaut : dossier du script)
#   REPO_SLUG      owner/repo                     (défaut : Pause-IA/pauseai-france)
#   BASE_BRANCH    branche cible de la PR         (défaut : main)
#   PR_BRANCH      branche de travail             (défaut : chore/maj-elus)
#   GIT_NAME / GIT_EMAIL   auteur des commits
#   ALERT_WEBHOOK  URL d'un webhook Discord/Slack pour les alertes d'échec
#                  (recommandé : pas de dépendance SMTP).
#   ALERT_EMAIL    adresse prévenue en cas d'échec (défaut romain@pauseia.fr ;
#                  vide = pas d'alerte). Utilise la commande `mail` du serveur.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="${REPO_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
REPO_SLUG="${REPO_SLUG:-Pause-IA/pauseai-france}"
BASE_BRANCH="${BASE_BRANCH:-main}"
PR_BRANCH="${PR_BRANCH:-chore/maj-elus}"
GIT_NAME="${GIT_NAME:-Pause IA Bot}"
GIT_EMAIL="${GIT_EMAIL:-bot@pauseia.fr}"
# Canaux d'alerte en cas d'échec (laisser vide pour désactiver) :
#   ALERT_WEBHOOK : URL d'un webhook entrant Discord/Slack (prioritaire, le plus
#                   robuste : pas de dépendance SMTP).
#   ALERT_EMAIL   : adresse mail (utilise la commande `mail` si un MTA marche).
ALERT_WEBHOOK="${ALERT_WEBHOOK:-}"
ALERT_EMAIL="${ALERT_EMAIL:-romain@pauseia.fr}"

# Alerte si une étape échoue : on est ainsi prévenu d'une source cassée, d'un
# garde-fou déclenché ou d'un token expiré (fini la staleness silencieuse). Les
# données en ligne, elles, restent intactes.
notify_failure() {
	local line=$1
	local msg="Échec de la mise à jour des élus (pauseia.fr), ligne $line : ${BASH_COMMAND}"
	echo "✗ $msg" >&2
	if [[ -n "$ALERT_WEBHOOK" ]]; then
		# Format compatible Discord ({"content":...}) et Slack ({"text":...}).
		curl -s -m 15 -H 'Content-Type: application/json' \
			-d "$(printf '{"content":%s,"text":%s}' "$(json_str "$msg")" "$(json_str "$msg")")" \
			"$ALERT_WEBHOOK" >/dev/null || true
	fi
	if [[ -n "$ALERT_EMAIL" ]] && command -v mail >/dev/null 2>&1; then
		printf '%s\n\nDétails : journalctl -u update-elus -n 100\n' "$msg" |
			mail -s "[Pause IA] Échec mise à jour des élus" "$ALERT_EMAIL" 2>/dev/null || true
	fi
}

# Échappe une chaîne pour l'inclure dans du JSON (guillemets, antislashs, sauts de ligne).
json_str() {
	printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g' |
		awk 'BEGIN{printf "\""} {printf "%s%s", sep, $0; sep="\\n"} END{printf "\""}'
}

trap 'notify_failure "$LINENO"' ERR

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
	echo "✗ GITHUB_TOKEN manquant (PAT avec Contents + Pull requests en write)." >&2
	exit 1
fi

cd "$REPO_DIR"

echo "→ Mise à jour du dépôt ($BASE_BRANCH)…"
git fetch --quiet origin "$BASE_BRANCH"
git checkout --quiet "$BASE_BRANCH"
git reset --hard --quiet "origin/$BASE_BRANCH"

echo "→ Génération des données des élus…"
node scripts/generate-elus.js --report

DATA_FILES=(src/lib/data/elus.json src/lib/data/code-postal-circo.json)
if git diff --quiet -- "${DATA_FILES[@]}"; then
	echo "✓ Aucun changement, pas de PR à ouvrir."
	exit 0
fi

echo "→ Changements détectés, préparation de la branche $PR_BRANCH…"
git checkout -B "$PR_BRANCH"
git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" add "${DATA_FILES[@]}"
git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" \
	commit -m "chore: mise a jour automatique des elus ($(date +%F))"

REMOTE="https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO_SLUG}.git"
git push --force "$REMOTE" "HEAD:refs/heads/${PR_BRANCH}"

echo "→ Ouverture de la pull request…"
API="https://api.github.com/repos/${REPO_SLUG}/pulls"
PAYLOAD=$(printf '{"title":"Mise à jour automatique des élus","head":"%s","base":"%s","body":"Mise à jour des données des élus depuis les sources ouvertes. Relire le diff (notamment les emails à confiance faible) puis merger pour déployer."}' "$PR_BRANCH" "$BASE_BRANCH")
RESP=$(curl -s -o /tmp/elus_pr_resp.json -w "%{http_code}" -X POST \
	-H "Authorization: Bearer ${GITHUB_TOKEN}" \
	-H "Accept: application/vnd.github+json" \
	"$API" -d "$PAYLOAD")

if [[ "$RESP" == "201" ]]; then
	echo "✓ PR ouverte : $(grep -o '"html_url": *"[^"]*' /tmp/elus_pr_resp.json | head -1 | cut -d'"' -f4)"
elif grep -q "A pull request already exists" /tmp/elus_pr_resp.json; then
	echo "✓ Une PR est déjà ouverte pour $PR_BRANCH (mise à jour avec les nouveaux commits)."
else
	echo "⚠️  Réponse inattendue de l'API GitHub (HTTP $RESP) :" >&2
	cat /tmp/elus_pr_resp.json >&2
	exit 1
fi
