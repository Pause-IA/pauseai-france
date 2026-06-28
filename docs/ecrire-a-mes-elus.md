# Page « Écrire à mes élus »

Documentation technique et fonctionnelle de l'outil qui permet à un citoyen
d'écrire à ses députés et sénateurs sur les risques de l'IA, avec un minimum de
friction. Inspiré de ControlAI, adapté à la France et au périmètre de Pause IA.

URL : `/[lang]/ecrire-a-mes-elus` (FR et EN).

---

## 1. Parcours utilisateur

1. **Étape 1 : trouver ses élus.**
   L'utilisateur saisit son **code postal**, son **nom** et sa **ville**
   (saisis une seule fois, ils remplissent ensuite chaque mail). Il obtient la
   liste de ses sénateurs (par département) et de son/ses députés (par
   circonscription exacte quand le géocodage le permet), avec photo et fiche
   officielle.
2. **Étape 2 : rédiger le mail.**
   Pour chaque élu, un email est pré-rédigé. L'utilisateur peut choisir un
   **sujet principal** (3 angles), une **longueur** (courte / détaillée) et
   ajouter une **phrase personnelle** (recommandée). Il ouvre ensuite son
   client mail (`mailto:`) ou copie le texte.

La progression (« Écrit ✓ ») et les infos personnelles sont mémorisées
**localement** (voir § 4).

---

## 2. Données des élus

- Générées par `node scripts/generate-elus.js` à partir de sources ouvertes
  (data.gouv « deputes-active.csv », Sénat « ODSEN_GENERAL.csv ») et figées dans
  `src/lib/data/elus.json`. **Aucun appel réseau au runtime** : le site survit
  aux pannes des sources.
- Géocodage code postal → circonscription via `code-postal-circo.json`
  (construit à partir de `commune-circo.json`, lui-même issu de la table
  officielle commune ↔ circonscription, cf. `scripts/build-commune-circo.py`).
- Résolution (`src/lib/data/elus.ts`) :
  - **Sénateurs** : par département (toujours fiable).
  - **Députés** : par circonscription exacte si le code postal est connu,
    sinon repli sur tous les députés du département.
- **Génération idempotente** (`writeStableJson` : clés triées, `generatedAt`
  préservé) → une PR ne s'ouvre que si le contenu change réellement.
- **Garde-fous** : seuils sur le nombre d'élus / d'emails ; en cas d'anomalie,
  le script jette une erreur, n'écrit rien, et sort en code 1 (déclenche une
  alerte).

### Mise à jour automatique

- **Filet principal** : timer systemd sur le serveur
  (`scripts/update-elus-server.sh`, `scripts/systemd/update-elus.{service,timer}`).
  Il régénère les données et **ouvre une PR** (jamais de push direct sur `main`).
  Un humain relit et merge ; Netlify déploie au merge.
  - **Une seule PR persistante** (branche `chore/maj-elus`) : on régénère
    toujours depuis `main` et le commit (réécrit par force-push) contient à
    chaque exécution l'intégralité des modifications en cours. Pas d'accumulation
    de PR ; la PR montre toujours le diff complet à jour.
- **Filet de secours manuel** : workflow GitHub `update-elus.yml`
  (déclenchement manuel uniquement, pour régénérer si le serveur est indispo).
- **Alerte** : en cas d'échec, notification via `ALERT_WEBHOOK` (Discord/Slack)
  avec repli mail (`ALERT_EMAIL`).

---

## 3. Contenu des mails

Le contenu et la cible de chaque campagne vivent dans **`src/lib/data/elu-actions.ts`**
(« moteur d'actions »). La page sélectionne une action via `?action=<id>` ; sans
paramètre, c'est l'action `default` (message générique vers les élus de
l'utilisateur). Une action peut cibler **les élus de l'utilisateur** (par code
postal) **ou une liste de destinataires précis** (un ministre, une commission).
Voir `docs/ecrire-a-mes-elus-actions.md` pour créer une action ciblée.

Le corps est **modulaire** et assemblé côté client (`buildParagraphs`). Voir le
document séparé `docs/ecrire-a-mes-elus-textes.md` pour le texte complet destiné
à la validation par l'équipe communication.

Structure d'un mail :

1. **Salutation** genrée selon la civilité et le rôle
   (« Madame la Députée », « Monsieur le Sénateur », repli neutre).
2. **Phrase d'introduction** : « Je m'appelle X et je vous écris en tant
   qu'habitant de votre circonscription/département. » (la localité précise est
   dans la signature).
3. **Accroche** (`HOOKS`) : tirée au hasard parmi 3 par visiteur.
4. **Focus** (`FOCUS`) : selon l'angle choisi (3 angles).
5. _(version détaillée)_ **Complément** (`COMPLEMENT`) + **Sondage** (`POLL`).
6. _(si renseignée)_ **Phrase personnelle** de l'utilisateur.
7. **Reconnaissance des bénéfices** (`BALANCE`) : présente dans toutes les
   versions, juste avant l'appel, pour désamorcer le ton alarmiste.
8. **Appel** (`ASK`) : demande de soutenir une gouvernance internationale de
   pause sur les modèles les plus avancés, aux niveaux français et européen.
9. **Signature** : nom + ville (ou localité de l'élu en repli).

**Objet** : tiré au hasard parmi 4 (`SUBJECTS`), pour éviter qu'un objet
identique se répète dans toutes les boites parlementaires.

**Accroches et objets tournants** : la rotation diversifie les envois et limite
le repérage « copier-coller » par les équipes parlementaires.

**Règle de style** : aucun tiret long (—) dans le texte destiné aux
utilisateurs.

---

## 4. Persistance locale (cache)

Stockage **`localStorage`**, donc **par navigateur et par appareil**, persistant
au rafraîchissement et à la fermeture. Aucune synchronisation serveur.

| Clé              | Contenu                                     |
| ---------------- | ------------------------------------------- |
| `elus-contactes` | IDs des élus cochés « Écrit ✓ »             |
| `elus-user`      | `{ userName, userVille, personalSentence }` |

- Un bouton **« Réinitialiser ma progression »** efface `elus-contactes`
  (sans toucher au nom / à la ville).
- La coche « Écrit ✓ » = « a cliqué pour ouvrir le mail sur cet appareil »,
  **pas** une preuve d'envoi.

---

## 5. Mesure des envois

`mailto:` ne permet aucune confirmation d'envoi réelle. Deux signaux distincts :

- **Intention** (`/api/log-intent`) : le clic sur « Ouvrir mon email » est
  envoyé via `navigator.sendBeacon` (qui survit à la navigation) et journalisé
  comme **Activité CiviCRM** (type `76` par défaut, surchargé par
  `CIVICRM_ELU_INTENT_ACTIVITY_ID`). **Aucune donnée personnelle** : seulement
  l'élu visé et les réglages (angle, longueur). Best-effort, jamais bloquant.
- **Envois réels** : la **copie cachée (BCC)** reçue à `campagne@pauseia.fr`.
  C'est le seul compteur fiable. La FAQ informe que ce BCC peut être retiré
  avant l'envoi.

---

## 6. Accessibilité / mobile

- Puces de sujet et toggle de longueur : `<button>` avec `aria-pressed` et
  `role="group"` + `aria-label`.
- Avatars décoratifs : `alt=""` ; photo en erreur masquée via `on:error`
  (les initiales restent).
- Mise en page responsive (cartes, liste d'élus en colonne sur petit écran).

---

## 7. Cas « pas d'adresse email »

Si l'élu ne publie pas d'email :

- une note explique de copier le texte et d'utiliser le **formulaire de
  contact** (ou la fiche officielle si aucun formulaire) ;
- la note BCC est masquée (un formulaire web n'a pas de copie cachée).

---

## 8. Fichiers principaux

| Fichier                                                 | Rôle                                 |
| ------------------------------------------------------- | ------------------------------------ |
| `src/routes/[lang=lang]/ecrire-a-mes-elus/+page.svelte` | Page (UI + contenu des mails)        |
| `src/lib/data/elu-actions.ts`                           | Moteur d'actions (contenu + ciblage) |
| `src/routes/api/log-intent/+server.ts`                  | Journalisation des intentions        |
| `src/lib/data/elus.ts`                                  | Résolution code postal → élus        |
| `src/lib/data/elus.json`                                | Données générées (élus + emails)     |
| `src/lib/data/code-postal-circo.json`                   | Géocodage code postal → circo        |
| `src/lib/data/commune-circo.json`                       | Table commune → circonscription      |
| `scripts/generate-elus.js`                              | Génération des données               |
| `scripts/build-commune-circo.py`                        | Construction de la table communes    |
| `scripts/update-elus-server.sh`                         | Runner serveur (PR + alerte)         |
| `scripts/systemd/update-elus.{service,timer}`           | Planification serveur                |
| `.github/workflows/update-elus.yml`                     | Filet de secours manuel (GitHub)     |
| `docs/ecrire-a-mes-elus-textes.md`                      | Textes des mails (validation comm')  |
| `docs/ecrire-a-mes-elus-actions.md`                     | Guide : créer une action ciblée      |

---

## 9. Variables d'environnement

Réutilise les identifiants CiviCRM existants (`CIVICRM_BASE_URL`,
`CIVICRM_API_KEY`, `CIVICRM_SITE_KEY`, `CIVICRM_NEWSLETTER_API_CONTACT_ID`).
Optionnel :

- `CIVICRM_ELU_INTENT_ACTIVITY_ID` : type d'activité pour la journalisation des
  intentions (défaut `76`).

Côté serveur (hors `.env` applicatif) : `GITHUB_TOKEN`, `ALERT_WEBHOOK`,
`ALERT_EMAIL`, `COMMUNE_CIRCO_URL` (cf. scripts).

---

## 10. Installation et exploitation serveur

La mise à jour planifiée tourne sur le serveur via un timer systemd. Le repo doit
vivre dans `/opt/bots/pauseai-france` et tourner sous l'utilisateur `romain`
(adapter chemin/utilisateur dans les unités systemd si besoin).

### Installation (une fois)

```bash
# a) Cloner le repo à l'emplacement attendu
sudo mkdir -p /opt/bots && sudo chown romain:romain /opt/bots
git clone https://github.com/Pause-IA/pauseai-france.git /opt/bots/pauseai-france
cd /opt/bots/pauseai-france

# b) Vérifier Node 18+ (le script ne dépend que de Node, git, curl)
node --version

# c) Créer le fichier de secrets (déjà dans .gitignore), lisible par son seul propriétaire
sudo tee /opt/bots/pauseai-france/.elus.env >/dev/null <<'EOF'
GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxxxxxx
ALERT_WEBHOOK=https://discord.com/api/webhooks/XXXX/YYYY
ALERT_EMAIL=romain@pauseia.fr
EOF
sudo chmod 600 /opt/bots/pauseai-france/.elus.env
sudo chown romain:romain /opt/bots/pauseai-france/.elus.env

# d) Rendre le script exécutable
chmod +x /opt/bots/pauseai-france/scripts/update-elus-server.sh

# e) Installer les unités systemd et activer le timer (lundi 04h00)
sudo cp /opt/bots/pauseai-france/scripts/systemd/update-elus.service /etc/systemd/system/
sudo cp /opt/bots/pauseai-france/scripts/systemd/update-elus.timer   /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now update-elus.timer
```

Le PAT GitHub doit être _fine-grained_ sur ce repo, avec **Contents: Read and
write** + **Pull requests: Read and write**.

### Exploitation

```bash
# Etat du timer et prochaine exécution
systemctl status update-elus.timer
systemctl list-timers update-elus.timer

# Lancer une exécution maintenant (génère + ouvre une PR si changement)
sudo systemctl start update-elus.service

# Journaux
journalctl -u update-elus -n 100 --no-pager
```

### Tester l'alerte Discord

```bash
# Test rapide : connectivité + URL du webhook (format identique au script)
set -a; source /opt/bots/pauseai-france/.elus.env; set +a
curl -s -m 15 -H 'Content-Type: application/json' \
  -d '{"content":"[Pause IA] Test alerte elus : si vous lisez ceci, le webhook fonctionne.","text":"[Pause IA] Test alerte elus"}' \
  "$ALERT_WEBHOOK"; echo

# Test bout-en-bout : déclenche réellement le trap notify_failure (token bidon)
cd /opt/bots/pauseai-france
set -a; source .elus.env; set +a
GITHUB_TOKEN=mauvais_token_de_test ./scripts/update-elus-server.sh
```

> Sécurité : ne jamais committer `.elus.env`. Si un token ou un webhook a été
> exposé, le régénérer et ne mettre que la nouvelle valeur dans `.elus.env`.

---

## 11. Pistes d'amélioration (non faites)

- **Preuve sociale** : « déjà X mails envoyés » (à activer quand le volume BCC
  le permet).
- Mécanisme actif de **relance** (aujourd'hui seulement expliqué en FAQ).
- Partage natif mobile (`navigator.share`) si l'on veut de la diffusion.
