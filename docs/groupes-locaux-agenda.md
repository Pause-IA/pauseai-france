# Agenda des actions (groupes locaux)

La page « Groupes locaux » affiche un **agenda des prochaines actions** et un
**résumé des actions passées**, alimentés depuis **Notion** (comme les articles
et la revue de presse).

## Fonctionnement

- Les événements sont lus depuis une base Notion via `getLocalEvents()`
  (`src/lib/notion.ts`), exposée par l'endpoint **`/api/events`** (non prérendu).
- La page récupère `/api/events` **côté client** au chargement, puis répartit :
  - **Prochaines actions** : événements dont la `Date` est aujourd'hui ou plus tard
    (ordre chronologique) ;
  - **Actions passées** : les 4 plus récentes avant aujourd'hui.
- Comme l'endpoint n'est pas prérendu, l'agenda **reste à jour entre deux
  déploiements** (les actions passées disparaissent automatiquement).
- Si la base n'est pas configurée ou est vide, les sections ne s'affichent pas
  (la page reste fonctionnelle).

## Configuration

Ajouter l'ID de la base à l'environnement :

```
NOTION_EVENTS_DATABASE_ID = <id de la base Notion>
```

(et partager la base avec l'intégration Notion, comme les autres bases.)

## Colonnes de la base Notion

| Colonne       | Type Notion | Obligatoire | Rôle                                                                 |
| ------------- | ----------- | ----------- | -------------------------------------------------------------------- |
| `Titre`       | Title       | oui         | Nom de l'action (ex. « Manifestation pour une pause »)               |
| `Date`        | Date        | oui         | Date de l'action (sert à trier passé / à venir)                      |
| `Ville`       | Text        | non         | Ville (ex. « Lyon »)                                                 |
| `Type`        | Select      | non         | Manifestation, Tractage, Conférence, Autre…                          |
| `URL`         | URL         | non         | Lien d'inscription (à venir) ou article de presse (passé)            |
| `Heure`       | Text        | non         | Heure (ex. « 18h »), affichée pour les actions à venir               |
| `Lieu`        | Text        | non         | Lieu précis (ex. « Turbine.Coop »), affiché pour les actions à venir |
| `Description` | Text        | non         | Phrase courte de contexte                                            |
| `Image`       | Files       | non         | Une **ou plusieurs** photos (galerie pour les actions « à la une »)  |
| `À la une`    | Checkbox    | non         | Met l'action en avant : grande carte avec galerie photo              |
| `Bénévoles`   | Number      | non         | Nombre de participants (affiché si renseigné)                        |
| `Visible`     | Checkbox    | oui         | Décocher pour masquer sans supprimer                                 |

Notes :

- Les noms de colonnes doivent être **exactement** ceux ci-dessus (le code lit
  ces clés). C'est la même convention que les autres bases Notion du site.
- Pour une action **à venir**, mettre dans `URL` le lien d'inscription
  (Mobilizon, Meetup, formulaire…). Pour une action **passée**, mettre le lien
  vers l'article de presse ou le compte-rendu.
- **Affichage des actions passées** : celles cochées `À la une` s'affichent en
  grand avec une galerie (jusqu'à 4 photos) ; les autres apparaissent dans une
  grille compacte (6 visibles, puis bouton « Voir toutes les actions »).
