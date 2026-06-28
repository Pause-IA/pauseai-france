# Lancer une action ciblée « Écrire à mes élus »

Guide pour l'équipe com : comment créer une **campagne email ciblée** (un vote,
une audition, le G7, un ministre, une commission…) à partir du moteur de la page
« Écrire à mes élus », **sans toucher au code de la page**.

Tout se passe dans un seul fichier : **`src/lib/data/elu-actions.ts`**.

---

## Principe

Chaque « action » définit le **contenu de l'email** (objet, accroches, angles,
appel) **et sa cible**. On choisit l'action via l'URL :

```
/fr/ecrire-a-mes-elus                         → action « default » (générique)
/fr/ecrire-a-mes-elus?action=mon-identifiant  → action ciblée
```

Deux modes de ciblage :

| `targeting`       | Cible                                                                           |
| ----------------- | ------------------------------------------------------------------------------- |
| `representatives` | Les élus de l'utilisateur, trouvés par **code postal** (générique)              |
| `fixed`           | Une **liste de destinataires précis** (ministre, commission…), sans code postal |

---

## Recette : créer une action ciblée

1. Ouvrir `src/lib/data/elu-actions.ts`.
2. Dupliquer une action existante (`DEFAULT_ACTION` pour un envoi aux élus de
   l'utilisateur, `EXEMPLE_GOUVERNEMENT` pour des destinataires précis).
3. Donner un `id` unique en minuscules (ex. `vote-loi-ia-2026`).
4. Mettre `status: 'active'`.
5. Adapter les textes (objet, hero, accroches, angles, appel). Tout est bilingue
   `{ fr, en }`. **Pas de tiret long (—)** dans les textes.
6. Définir la cible (voir ci-dessous).
7. Ajouter l'action au tableau `eluActions`.
8. Ouvrir une PR. Une fois mergée et déployée, partager le lien
   `/fr/ecrire-a-mes-elus?action=<id>` (et `/en/...` pour l'anglais).

### Cibler des destinataires précis (mode `fixed`)

```ts
targeting: 'fixed',
targetsHeading: { fr: 'La commission des lois', en: 'The Law Committee' },
fixedTargets: [
  {
    id: 'depute-untel',
    nom: 'Prénom Nom',
    civ: 'Mme',                 // 'M' | 'Mme' | null
    role: 'depute',             // 'depute' | 'senateur' | 'ministre' | 'autre'
    email: 'prenom.nom@assemblee-nationale.fr',
    contactUrl: 'https://...',  // facultatif (utilisé si pas d'email)
    fonction: { fr: 'Rapporteur', en: 'Rapporteur' },         // facultatif
    salutation: { fr: 'Madame la Députée,', en: 'Dear MP,' }  // facultatif
  }
]
```

- Si `email` est absent (`null`), la page propose de **copier le texte** et
  d'utiliser le **formulaire de contact** (`contactUrl`). Le rappel BCC est masqué.
- Sans `salutation`, la formule d'appel est déduite de `role` + `civ`
  (« Madame la Députée, », « Monsieur le Ministre, »…).
- La formule d'introduction devient générique (« en tant que citoyen
  préoccupé ») car le destinataire n'est pas l'élu local de l'utilisateur.

### Important sur les emails

- Pour des **élus**, récupérer les emails fiables depuis `src/lib/data/elus.json`
  (déjà vérifiés). Ne pas inventer d'adresse.
- Pour un **ministre / cabinet**, privilégier le **formulaire officiel**
  (`email: null` + `contactUrl`) si l'email n'est pas public.

---

## Champs d'une action (référence rapide)

| Champ            | Rôle                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `id`             | Identifiant dans l'URL (`?action=<id>`)                              |
| `status`         | `active` ou `ended` (gabarits / archives en `ended`)                 |
| `targeting`      | `representatives` ou `fixed`                                         |
| `fixedTargets`   | Destinataires précis (si `fixed`)                                    |
| `targetsHeading` | Titre du groupe de destinataires (si `fixed`)                        |
| `meta`           | Titre + description SEO de la page                                   |
| `hero`           | Bandeau (titre + sous-titre)                                         |
| `subjects`       | Objets tournants (un tiré au hasard)                                 |
| `hooks`          | Accroches tournantes (une tirée au hasard)                           |
| `angles`         | Angles proposés (le 1er est par défaut) ; `focus` + `complementLong` |
| `poll`           | Paragraphe « sondage » ajouté en version détaillée (facultatif)      |
| `balance`        | Reconnaissance des bénéfices (toujours, avant l'appel)               |
| `ask`            | L'appel à l'action (toujours)                                        |
| `hasDetailed`    | Proposer le choix courte / détaillée                                 |

Ordre d'assemblage du corps : salutation, introduction, accroche, focus
(puis complément et sondage en version détaillée), phrase personnelle, bénéfices,
appel, signature. Voir `docs/ecrire-a-mes-elus-textes.md` pour les textes de
l'action par défaut.

---

## Exemple fourni

Une action gabarit `exemple-gouvernement` (en `status: 'ended'`) montre le mode
`fixed` en ciblant une fonction institutionnelle. À voir via
`/fr/ecrire-a-mes-elus?action=exemple-gouvernement`. À dupliquer pour un vrai
moment-clé.
