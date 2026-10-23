# Idées reçues

La page `/fr/idees-recues` (menu Comprendre, site français seulement) publie les
objections courantes sur l'IA et les réponses de Pause IA. Chaque objection a sa
page : `/fr/idees-recues/<slug>`, avec la réponse courte (« En bref », bouton
Partager), puis l'argumentaire et les sources.

- Source : la table Notion « Idées reçues », remplie par l'équipe com.
- Variable Netlify : `NOTION_IDEES_RECUES_DATABASE_ID` (clé : `NOTION_API_KEY`,
  déjà utilisée par le site).
- Rendu à chaque visite (`prerender = false`) : une ligne cochée apparaît sans
  reconstruire le site.
- Pas de liste de secours : sans ligne publiée, la page annonce « Les premières
  réponses arrivent très bientôt ».
- Code : `src/lib/server/idees-recues.ts` ; tests : `tests/idees-recues.test.ts`.

## Brancher la table

1. Dans Notion, partager **la table elle-même** avec l'intégration du site
   (menu « ⋯ » de la table → Connexions). Partagée ainsi, elle peut être
   déplacée ensuite sans perdre l'accès.
2. Mettre l'identifiant de la table (32 caractères de son adresse, avant `?v=`)
   dans `NOTION_IDEES_RECUES_DATABASE_ID` sur Netlify, puis redéployer.

## Colonnes

| Colonne                                             | Type Notion  | Obligatoire | Rôle                                                                                                                       |
| --------------------------------------------------- | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Objection`                                         | Title        | oui         | L'idée reçue (les « … » finaux sont ajoutés par le site)                                                                   |
| `Slug`                                              | Text         | oui         | Fin de l'adresse (minuscules, chiffres, tirets). **Ne plus la modifier une fois publiée** : les liens partagés casseraient |
| `Numéro`                                            | Text         | non         | Ordre d'affichage (1-1, 2-1…)                                                                                              |
| `Catégorie`                                         | Select       | oui         | Sert aux filtres                                                                                                           |
| `Réponse courte`                                    | Text         | oui         | « En bref », aussi reprise sur les réseaux sociaux                                                                         |
| `Thèmes`                                            | Multi-select | non         | Tags trans-catégories (alignement, emploi…) : second filtre sur la page liste, combiné aux catégories                      |
| `Auteur`                                            | Text         | non         | La signature affichée sur la page de détail                                                                                |
| `Publié le`                                         | Date         | non         | Affichée sous le titre                                                                                                     |
| `Mis à jour le`                                     | Date         | non         | Affichée sous le titre. Saisie à la main : le champ automatique de Notion bougerait pour une virgule corrigée              |
| `Visible`                                           | Checkbox     | oui         | Cocher quand la réponse est validée                                                                                        |
| `Type`, `Récit implicite`, `Fonction psychologique` | —            | non         | Internes à la com, jamais affichés                                                                                         |

Les noms de colonnes sont regroupés dans `COLONNES`, en haut de
`src/lib/server/idees-recues.ts`.

Les quatre dernières colonnes sont facultatives : une base remplie avant leur
ajout continue de fonctionner, et les mentions correspondantes ne s'affichent
simplement pas. Les dates acceptent une colonne Date ou une colonne Texte, et
sont mises en français côté serveur (`dateEnFrancais`) : une date mal saisie
n'affiche rien plutôt qu'une valeur approximative.

Catégories (ordre des filtres) : Nature de l'IA, Contrôle technique, Économie
et monde du travail, Gouvernance et géopolitique, Évaluation du risque,
Dynamiques sociales et psychologiques. Une autre catégorie s'affiche après.

## L'argumentaire (corps de la page Notion)

- Un **titre de niveau 3** par argument (ex. « Argument 1 (technique) »), suivi
  de ses paragraphes.
- Un titre « Sources » suivi d'une **liste à puces**, avec les liens.
- Gras, italique et liens sont repris ; seuls les liens en `https://` sont
  cliquables. Images et tableaux sont ignorés.

## Contrôle

Une ligne cochée mais incomplète (objection, slug, catégorie ou réponse courte
manquants, slug mal formé, slug en double) est écartée, avec un avertissement
`[idees-recues]` dans le journal Netlify.
