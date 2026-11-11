# Photos de l'équipe

Fichiers produits par `pnpm run photos-equipe`, à ne pas modifier à la main.

Ils sont versionnés volontairement. Notion ne sert ses fichiers que derrière une
URL S3 signée qui expire au bout d'une heure : utilisée telle quelle, elle casse
dès que la page est mise en cache, et pèse le poids de l'original.

Pour changer une photo : la remplacer dans Notion, lancer `pnpm run
photos-equipe`, puis committer ce dossier et `src/lib/data/photos-equipe.json`.
