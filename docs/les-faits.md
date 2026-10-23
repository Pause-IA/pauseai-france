# Espace « Les faits »

La page `/fr/faits` (menu Comprendre, site français seulement) mène à trois
sections. Chacune lit sa table Notion, remplie par les bénévoles, et retombe
sur un fichier JSON du dépôt si la table n'est pas configurée, ne répond pas
ou est vide (aucune régression) :

| Section      | Page                     | Table Notion (variable Netlify)         | Repli                            |
| ------------ | ------------------------ | --------------------------------------- | -------------------------------- |
| Démissions   | `/fr/faits/demissions`   | `NOTION_FAITS_DEMISSIONS_DATABASE_ID`   | `src/lib/data/demissions.json`   |
| Déclarations | `/fr/faits/declarations` | `NOTION_FAITS_DECLARATIONS_DATABASE_ID` | `src/lib/data/declarations.json` |
| Sondages     | `/fr/faits/sondages`     | `NOTION_FAITS_SONDAGES_DATABASE_ID`     | `src/lib/data/sondages.json`     |

La clé est celle déjà utilisée par le site (`NOTION_API_KEY`). Les sections
sont rendues à chaque visite (`prerender = false`, comme `/presse`) : une ligne
cochée dans Notion apparaît sans reconstruire le site. La page d'accueil
`/fr/faits` est prérendue.

Code : `src/lib/server/faits.ts` (lecture, contrôle, repli) ; tests :
`tests/faits.test.ts`.

## Brancher une table

1. Dans Notion, partager la table avec l'intégration déjà utilisée par le site
   (menu « ⋯ » de la table → Connexions).
2. Copier l'identifiant de la table (les 32 caractères de son adresse, avant
   `?v=`) dans la variable Netlify correspondante, puis redéployer.
3. Si les noms de colonnes diffèrent de ceux ci-dessous, les modifier dans
   `COLONNES`, en haut de `src/lib/server/faits.ts` : c'est le seul endroit.

## Contrôle des lignes

- Seules les lignes cochées **`Visible`** sont lues.
- Une ligne incomplète (champ obligatoire vide, date illisible, lien qui ne
  commence pas par `https://`, catégorie inconnue) est **écartée**, avec un
  avertissement `[faits]` dans le journal Netlify, au lieu de s'afficher cassée.
- Dès qu'au moins une ligne valide existe dans Notion, c'est Notion qui prime
  entièrement pour cette section.

## Colonnes communes

| Colonne   | Type Notion | Obligatoire | Rôle                                               |
| --------- | ----------- | ----------- | -------------------------------------------------- |
| `Visible` | Checkbox    | oui         | Cocher pour publier, décocher pour masquer         |
| `Source`  | Text        | oui         | Titre de la source (ex. « Axios, septembre 2025 ») |
| `URL`     | URL         | oui         | Lien de la source (`https://`)                     |

## Démissions

| Colonne              | Type Notion | Obligatoire | Rôle                                      |
| -------------------- | ----------- | ----------- | ----------------------------------------- |
| `Nom`                | Title       | oui         | Nom de la personne                        |
| `Labo`               | Select      | oui         | Labo quitté (sert aux filtres)            |
| `Poste`              | Text        | oui         | Poste occupé                              |
| `Date`               | Date        | oui         | Date du départ (seul le mois est affiché) |
| `Citation`           | Text        | oui         | Citation en français                      |
| `Citation originale` | Text        | non         | Citation dans sa langue d'origine         |
| `Contexte`           | Text        | non         | Ce qu'il faut savoir pour bien la lire    |
| `Photo`              | URL         | non         | Photo sous licence libre seulement…       |
| `Photo – auteur`     | Text        | non         | … avec son auteur…                        |
| `Photo – licence`    | Text        | non         | … et sa licence (sinon : initiales)       |

## Déclarations

| Colonne              | Type Notion  | Obligatoire        | Rôle                                                                 |
| -------------------- | ------------ | ------------------ | -------------------------------------------------------------------- |
| `Auteur`             | Title        | oui                | La personne, ou le nom du texte collectif                            |
| `Type`               | Select       | oui                | « Texte collectif » ou « Voix individuelle » (onglets)               |
| `Fonction`           | Text         | oui                | Sa fonction, ou qui a signé le texte                                 |
| `Catégorie`          | Select       | voix individuelles | Scientifiques, Dirigeants de labos, Personnalités, Lanceurs d'alerte |
| `Date`               | Date ou Text | oui                | `AAAA` ou `AAAA-MM` (ex. 1951)                                       |
| `Citation`           | Text         | oui                | Traduction française (ou citation, si déjà en français)              |
| `Citation originale` | Text         | non                | Version originale, affichée en premier                               |
| `Contexte`           | Text         | non                | Ce qu'il faut savoir pour bien la lire                               |

## Sondages

| Colonne      | Type Notion | Obligatoire | Rôle                                             |
| ------------ | ----------- | ----------- | ------------------------------------------------ |
| `Titre`      | Title       | oui         | Ex. « Enquête auprès de 2 778 chercheurs en IA » |
| `Organisme`  | Text        | oui         | Qui a mené le sondage                            |
| `Date`       | Date        | oui         | Publication des résultats                        |
| `Répondants` | Text        | oui         | Qui a été interrogé, combien, quand              |
| `Chiffre`    | Text        | oui         | Le résultat clé, affiché en grand (ex. « 5 % »)  |
| `Résultat`   | Text        | oui         | Ce que mesure ce chiffre                         |
| `Précision`  | Text        | non         | Un second résultat utile                         |
