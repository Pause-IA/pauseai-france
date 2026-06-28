# Espace presse

La page `/presse` agrège trois sources :

| Bloc                               | Source                                                       |
| ---------------------------------- | ------------------------------------------------------------ |
| Communiqués **nationaux**          | Notion (`NOTION_PRESS_DATABASE_ID`)                          |
| Communiqués **locaux**             | Notion (`NOTION_LOCAL_PRESS_DATABASE_ID`)                    |
| **Revue de presse** (« À la une ») | Notion (`NOTION_PRESS_COVERAGE_DATABASE_ID`), repli statique |

Les **résumés de campagnes** (Sommet IA, Municipales, G7, avec leurs chiffres)
sont gérés ailleurs, dans `src/lib/campaigns.ts`.

## Revue de presse (articles qui parlent de Pause IA)

- Source : base Notion `NOTION_PRESS_COVERAGE_DATABASE_ID`.
- **Repli** : si la base est vide ou non configurée, la page utilise le fichier
  `src/lib/press-coverage-static.ts` (aucune régression). Dès qu'au moins un
  article visible existe dans Notion, c'est Notion qui prime entièrement.
- Pour reprendre l'historique, recopier les articles de
  `press-coverage-static.ts` dans la base Notion (puis on pourra vider le
  fichier statique si on le souhaite).

### Colonnes de la base Notion (revue de presse)

| Colonne   | Type Notion | Obligatoire | Rôle                                                        |
| --------- | ----------- | ----------- | ----------------------------------------------------------- |
| `Titre`   | Title       | oui         | Titre de l'article                                          |
| `Source`  | Text        | oui         | Média (ex. « Le Monde »)                                    |
| `Date`    | Date        | oui         | Date de parution (sert au tri et au regroupement par année) |
| `URL`     | URL         | oui         | Lien vers l'article                                         |
| `Ordre`   | Number      | non         | Tri secondaire (à date égale)                               |
| `Visible` | Checkbox    | oui         | Décocher pour masquer sans supprimer                        |

Les noms de colonnes doivent être **exactement** ceux ci-dessus (même convention
que les autres bases Notion du site). Ne pas oublier de **partager la base avec
l'intégration Notion**.

## Articles repérés mais pas encore en ligne

À ajouter (il manque l'URL au moment de la rédaction) :

- **Le Monde**, 6 juin 2026 : « De la réticence au refus, ces cadres qui vivent
  mal l'injonction d'utiliser l'IA » (s'appuie sur la campagne de témoignages).
- **Le Nouvel Obs**, juin 2026 : « Le G7 ne doit pas accélérer mais sécuriser
  l'IA » (tribune).
- **Channel News**, juin 2026 : « Pause IA salue la prise de conscience par le
  G7 des risques posés par l'IA ».
