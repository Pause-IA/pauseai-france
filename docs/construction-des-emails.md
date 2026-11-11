# Construction des emails (« Écrire à mes élus » / « Écrire à la presse »)

Ce document explique **comment sont fabriqués les emails** proposés sur la page
`/[lang]/ecrire-a-mes-elus`, dans les deux cas : contacter ses **élus** et
contacter la **presse**. Il s'adresse à l'équipe com (pour éditer les textes) et
aux développeurs (pour comprendre le moteur).

- Données / contenu : `src/lib/data/elu-actions.ts`
- Logique d'assemblage et UI : `src/routes/[lang=lang]/ecrire-a-mes-elus/+page.svelte`
- Cibles élus (générées) : `src/lib/data/elus.ts`
- Géocodage circonscription : `src/lib/data/circo-geo.ts`

---

## 1. Un seul moteur, deux outils

La page est pilotée par un moteur d'« **actions** ». Une action = **le contenu
d'un email** + **sa cible**. On sélectionne l'action par l'URL :

```
/fr/ecrire-a-mes-elus                 → action « default » (élus)
/fr/ecrire-a-mes-elus?action=medias   → action « presse »
/fr/ecrire-a-mes-elus?action=<autre>  → campagne ponctuelle (ex. un ministre)
```

Les deux outils principaux (`default` et `medias`) sont présentés côte à côte
via **deux onglets** en haut de la page (« Que voulez-vous faire ? »). Les
campagnes ponctuelles n'affichent pas les onglets (elles ont leur propre lien).

Deux types de ciblage (`targeting`) :

| `targeting`       | Cible                                              | Utilisé par           |
| ----------------- | -------------------------------------------------- | --------------------- |
| `representatives` | Les élus de l'utilisateur, trouvés par code postal | élus                  |
| `fixed`           | Une liste de destinataires précis (`fixedTargets`) | presse, gouvernement… |

---

## 2. Structure d'un email

Quel que soit l'outil, le corps est assemblé **dans cet ordre** (fonction
`buildParagraphs` + `buildBodyText` dans `+page.svelte`) :

```
<salutation>

<introLine>            ← 1re phrase, situe l'expéditeur

<hook>                 ← accroche (tirée au hasard)
<focus>                ← paragraphe du SUJET choisi (base ou variante, au hasard)
[<complementLong>]     ← seulement en version « Détaillée »
[<poll>]               ← seulement en version « Détaillée »
[<phrase personnelle>] ← seulement si l'utilisateur en écrit une
<balance>              ← nuance « je ne suis pas contre le progrès » (au hasard)
<ask>                  ← la demande concrète (au hasard)

<signature>           ← « Cordialement, » + nom + ville/localité
```

L'**objet** de l'email est un `subject` tiré au hasard.

### D'où vient chaque partie ?

| Partie            | Source                                   | Comment c'est choisi                                                 |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| Salutation        | `salutation()` selon rôle + civilité     | déterministe (ex. « Madame la Députée, »)                            |
| introLine         | `introLine()` selon `introKind`          | déterministe (voir §4)                                               |
| Objet (`subject`) | `action.subjects[]`                      | **aléatoire**                                                        |
| Accroche (`hook`) | `action.hooks[]`                         | **aléatoire**                                                        |
| Sujet (`focus`)   | `angle.focus` + `angle.focusVariants[]`  | **choix utilisateur** (quel angle) + **aléatoire** (quelle variante) |
| complementLong    | `angle.complementLong`                   | ajouté si version « Détaillée »                                      |
| poll              | `action.poll`                            | ajouté si version « Détaillée »                                      |
| Phrase perso      | champ libre                              | saisie utilisateur (recommandée)                                     |
| balance           | `action.balance` + `action.balances[]`   | **aléatoire**                                                        |
| ask               | `action.ask` + `action.asks[]`           | **aléatoire**                                                        |
| Signature         | nom + `userVille` ou `signatureLocality` | saisie utilisateur                                                   |

---

## 3. Aléatoire, « seed » et bouton « Proposer une autre version »

Pour éviter que tous les emails se ressemblent (détection de spam, faible
impact), les parties marquées « aléatoire » sont tirées **au hasard par
visiteur**. Les index de tirage sont posés une fois par action :

```ts
hookIndex, subjectIndex, focusIndex, balanceIndex, askIndex
```

- `focusIndex`, `balanceIndex`, `askIndex` sont de grands entiers aléatoires,
  ramenés par **modulo** à la taille du pool concerné au moment de l'usage
  (`pool = [valeur de base, ...variantes]`).
- L'**angle** (le « Sujet principal ») n'est **pas** aléatoire : c'est un choix
  explicite de l'utilisateur. Le tirage ne fait varier que **la formulation** de
  cet angle (`focus` ↔ `focusVariants`).

Le bouton **« Proposer une autre version »** (`shuffleWording()`) re-tire ces
index, donc objet + accroche + variante de paragraphe + équilibrage + appel **sans toucher** aux choix de l'utilisateur (angle, longueur, nom, ville, phrase
perso). Les index sont passés en paramètres à `buildParagraphs` pour que
l'aperçu se recalcule à chaque re-tirage.

> ⚠️ Le tirage est fait côté client au montage. La page est prérendue : le
> contenu « au hasard » n'existe donc pas au build, seulement à l'affichage.

---

## 4. La 1re phrase (`introLine`) selon le destinataire

`introLine()` adapte l'ouverture au type de destinataire (`introKind`), en
formulations **neutres (non genrées)** :

| `introKind` | Utilisé pour        | Phrase (FR)                                                                                                                                  |
| ----------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `depute`    | députés             | « …je vous écris car je réside dans **votre circonscription / votre ville / votre département** » (selon la fiabilité du géocodage, voir §6) |
| `senateur`  | sénateurs           | « …je réside dans **votre département**. »                                                                                                   |
| `media`     | presse              | « …je vous écris **au sujet de votre couverture de l'IA**. »                                                                                 |
| `generic`   | autres cibles fixes | « …je vous écris car le développement de l'IA me préoccupe. »                                                                                |

L'intro `media` a été pensée pour **ne pas faire doublon** avec les accroches
presse (qui ouvrent déjà par « en vous lisant… »).

---

## 5. Différences élus vs presse

|                 | **Élus** (`default`)                                   | **Presse** (`medias`)                                       |
| --------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| Ciblage         | par **code postal** (`representatives`)                | **liste fixe** de 19 rédactions (`fixed`)                   |
| Salutation      | « Madame la Députée / le Sénateur… »                   | « Madame, Monsieur, »                                       |
| introLine       | circonscription / ville / département                  | « au sujet de votre couverture de l'IA »                    |
| Demande (`ask`) | soutenir une gouvernance / pause                       | couvrir davantage le sujet                                  |
| Progression     | compteur « X/Y contactés » + célébration               | **aucune** (on choisit un titre, on ne coche pas une liste) |
| Invitation      | « écrivez à chacun de vos élus »                       | « écrivez au titre que vous lisez le plus »                 |
| Fin de parcours | passerelle **→ presse** (« et maintenant, la presse ») | remerciement, pas de push multi-envoi                       |

### Richesse du contenu (état actuel)

|        | Objets | Accroches | Angles | Variantes / angle | Équilibrages | Appels       |
| ------ | ------ | --------- | ------ | ----------------- | ------------ | ------------ |
| Élus   | 8      | 6         | 3      | oui (2)           | 3 (base + 2) | 3 (base + 2) |
| Presse | 12     | 7         | 4      | oui (2-3)         | 3 (base + 2) | 3 (base + 2) |

---

## 6. Cas particulier des députés : circonscription exacte

Un code postal peut couvrir **plusieurs circonscriptions** (grandes villes). La
page adapte alors la portée affirmée dans l'email (`deputeScope`) :

- **1 seul député** pour ce code postal → `circonscription` (certain).
- **Plusieurs députés** → `ville` (on n'affirme que la ville), et un encart
  invite à préciser son adresse pour trouver **sa** circonscription
  (géocodage BAN + point-in-polygon, `circo-geo.ts`). Le député résolu est
  alors marqué **prioritaire** (pastille, remonté en tête) et son email repasse
  en « votre circonscription ».
- **Repli** (pas d'info) → `departement`.

Tout échec du géocodage retombe silencieusement sur le comportement par défaut.

---

## 7. Envoi, mesure et vie privée

- L'email part de la **messagerie de l'utilisateur** (`mailto:`), avec repli
  **webmail** (Gmail / Outlook / Yahoo) si aucun client n'est configuré.
- **CCI** `campagne@pauseia.fr` pour tenter de mesurer la campagne (retirable
  par l'utilisateur → mesure imparfaite).
- Nom, ville et phrase personnelle **restent sur l'appareil** (localStorage),
  jamais envoyés à un serveur. L'email n'est transmis **que** si l'utilisateur
  coche l'inscription newsletter.
- Le corps est reconstruit à partir des mêmes fonctions que l'aperçu
  (`buildBodyText`), **sans lire le DOM** → fiable même si l'aperçu est scrollé.

---

## 8. Éditer ou ajouter du contenu

Tout se passe dans `src/lib/data/elu-actions.ts`.

- **Ajouter un objet / une accroche** : ajoute une entrée bilingue dans
  `subjects[]` / `hooks[]` de l'action concernée. Plus il y en a, plus les
  emails divergent (bon pour l'anti-spam).
- **Ajouter une variante de paragraphe** : ajoute dans `angle.focusVariants[]`
  (le pool devient `[focus, ...focusVariants]`).
- **Ajouter un équilibrage / un appel** : ajoute dans `balances[]` / `asks[]`
  (pool = `[balance, ...balances]` / `[ask, ...asks]`).
- **Créer une campagne ponctuelle** : dupliquer une action, lui donner un `id`,
  puis partager le lien `?action=<id>`. En `targeting: 'fixed'`, renseigner
  `fixedTargets` (email public **vérifié** ou `contactUrl` de formulaire).

Règles de style :

- **Aucun tiret cadratin ( )** dans les textes destinés aux utilisateurs.
- Registre **naturel**, comme écrirait un citoyen / un lecteur ordinaire :
  éviter le vocabulaire trop soutenu (« dans vos colonnes », « au regard de son
  importance », etc.).
- Formulations **non genrées** (verbes plutôt que « lecteur/lectrice »,
  « inquiet/inquiète »…).
- Toujours fournir **`fr` et `en`**.

Après édition : `pnpm check` (types + tests) et vérifier l'aperçu sur les deux
onglets et les deux longueurs.
