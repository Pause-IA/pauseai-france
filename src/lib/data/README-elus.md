# Données des élus (`elus.json`)

Alimente la page **« Écrire à mes élus »** (`/ecrire-a-mes-elus`) : recherche des
députés et sénateurs par code postal, avec email pré-rempli.

## Mise à jour automatique

La génération est **idempotente** : sortie JSON canonique (clés triées, ordre
stable) et `generatedAt` conservé tant que le contenu ne bouge pas. Le fichier
ne change donc **que si un contact change réellement**, et une PR n'est ouverte
que dans ce cas (pas de PR hebdomadaire à vide).

Deux mécanismes possibles (en choisir un) :

### a) GitHub Actions (sans serveur)

Le workflow **`.github/workflows/update-elus.yml`** régénère les données chaque
semaine (cron du lundi) et **ouvre une PR** quand elles ont changé. Plus rien à
faire à la main : il suffit de relire le diff et de merger. Déclenchable aussi
manuellement via l'onglet _Actions_ → _Mise à jour des élus_ → _Run workflow_.

### b) Serveur (timer systemd)

Pour faire tourner la mise à jour sur le serveur Hetzner (comme les autres
bots), `scripts/update-elus-server.sh` régénère les données et **ouvre une pull
request**. Rien n'est poussé sur `main` directement : on relit puis on merge la
PR, ce qui déclenche le redéploiement Netlify.

```bash
# 1. Cloner le repo sur le serveur (une fois)
sudo git clone https://github.com/Pause-IA/pauseai-france.git /opt/bots/pauseai-france
sudo chown -R romain:romain /opt/bots/pauseai-france

# 2. Créer un PAT GitHub « fine-grained » sur le repo pauseai-france avec
#    Permissions : Contents = Read and write ET Pull requests = Read and write.
#    Le mettre dans un fichier d'env lisible par root uniquement :
echo 'GITHUB_TOKEN=github_pat_xxxxx' | sudo tee /opt/bots/pauseai-france/.elus.env
sudo chmod 600 /opt/bots/pauseai-france/.elus.env

# 3. Test manuel
cd /opt/bots/pauseai-france
chmod +x scripts/update-elus-server.sh
GITHUB_TOKEN=github_pat_xxxxx ./scripts/update-elus-server.sh   # doit ouvrir une PR

# 4. Installer le timer hebdomadaire
sudo cp scripts/systemd/update-elus.service /etc/systemd/system/
sudo cp scripts/systemd/update-elus.timer   /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now update-elus.timer
systemctl list-timers update-elus.timer     # vérifier la prochaine exécution
```

> Adapter `User=`, `WorkingDirectory=`, `REPO_DIR=` et le chemin de
> `EnvironmentFile=` dans `update-elus.service` si le clone n'est pas dans
> `/opt/bots/pauseai-france`. Le script ne requiert que **Node 18+**, **git** et
> **curl** (aucune dépendance npm). `.elus.env` ne doit jamais être commité.

## Régénérer manuellement

```bash
pnpm run generate-elus                    # régénère src/lib/data/elus.json
node scripts/generate-elus.js --report    # + rapport de qualité des emails
```

> ⚠️ Nécessite un accès réseau ouvert vers `data.gouv.fr`, `data.senat.fr` et
> `geo.api.gouv.fr`. Certains environnements (CI sandboxée, proxy d'entreprise)
> bloquent ces hôtes.

## Géocodage code postal → circonscription (cibler le bon député)

Le générateur produit `code-postal-circo.json` en croisant deux choses :

- **`commune-circo.json`** : table statique commune INSEE → circonscription(s),
  committée dans le repo. Construite depuis la table officielle commune ↔
  circonscription (découpage **inchangé depuis 2012**), donc à ne régénérer que
  si le découpage change, via `python3 scripts/build-commune-circo.py`
  (nécessite `pip install openpyxl`).
- les **codes postaux** des communes (`geo.api.gouv.fr`).

Les **grandes villes découpées** (Paris, Toulouse, Nantes…) sont une seule
commune répartie sur plusieurs circonscriptions : toutes sont conservées, et la
page propose alors les **députés candidats** de la ville (jamais un seul faux).
Pour les ~35 000 autres communes, le ciblage désigne le **député exact**.

## Fiabilité des emails

- **Députés** : email officiel du CSV de l'Assemblée, sinon déduit du motif
  `prenom.nom@assemblee-nationale.fr` (motif réel et fiable).
- **Sénateurs** : email public de l'open data du Sénat ; sinon lien vers
  l'annuaire officiel (`vos-senateurs.html`).

Chaque élu reçoit un niveau de confiance :

| `emailConfidence` | Signification                                           |
| ----------------- | ------------------------------------------------------- |
| `high`            | email confirmé par ≥ 2 sources concordantes             |
| `medium`          | une seule source, cohérente                             |
| `low`             | sources divergentes, ou email seulement déduit du motif |
| `none`            | aucun email → la page propose le formulaire de contact  |

La page affiche un avertissement « vérifiez l'adresse » pour `low`/`none`.

## Données d'exemple

Le `elus.json` versionné est un **échantillon** (`"sample": true`, emails en
`@example.invalid`) pour que le site build sans accès réseau. La page affiche
alors une bannière d'avertissement. Lancer le script ci-dessus le remplace par
les vraies données.

## Sources

- [NosDéputés.fr](https://www.nosdeputes.fr) / [NosSénateurs.fr](https://www.nossenateurs.fr) — Regards Citoyens, licence CC-BY-SA
- Répertoire National des Élus (data.gouv.fr, ministère de l'Intérieur)
