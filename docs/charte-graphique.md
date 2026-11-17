# Charte graphique, Pause IA

Extraite du code du site (`src/app.css`, `src/reset.css`, composants de `src/lib/components`).
Source de vérité : **`src/app.css`**. Toute nouvelle page doit utiliser ces variables CSS,
jamais des valeurs en dur, c'est ce qui garantit le fonctionnement du mode sombre.

## 1. Couleurs

### Marque

| Token            | Clair     | Sombre    | Usage                                          |
| ---------------- | --------- | --------- | ---------------------------------------------- |
| `--brand`        | `#ff9416` | identique | Orange Pause IA : boutons, soulignés, puces    |
| `--brand-light`  | `#fff5e8` | `#2a1f0a` | Fond orangé très clair                         |
| `--brand-subtle` | `#a85400` | `#ffab40` | Orange foncé : le seul orange lisible en texte |
| `--surface-sombre` | `rgb(14, 36, 51)` | identique | Couleur secondaire : fond des bandeaux |
| `--surface-sombre-2` | `rgb(34, 56, 72)` | identique | Panneaux et séparateurs sur ce fond |

> Le fond de page est `--bg-subtle` (crème `#fff5e8`) sur **toutes les pages sauf
> l'accueil**, qui seule passe en blanc (`bgWhite` dans `src/routes/+layout.svelte`).
> `--bg-card` est donc un blanc cassé _chaud_, et non un gris : un gris froid posé
> sur ce crème se voit immédiatement.

> `--brand` (#ff9416) n'a **jamais** un contraste suffisant pour du texte : 2,2:1
> sur le crème, en dessous même du seuil des grands caractères. Pour un lien, un
> chiffre ou un sur-titre, c'est `--brand-subtle` (4,9:1). `--brand` reste réservé
> aux aplats, boutons, filets, puces, bordures.

> **Couleur secondaire** : `--surface-sombre` est le complément perceptuel de
> `--brand`, calculé en OKLCH et non en HSL, qui n'est pas perceptuellement
> uniforme et désignerait un autre bleu. Sa chroma est volontairement basse
> (0,04 contre 0,173) pour que l'orange reste la seule couleur saturée de la
> page. Contrastes : blanc 15,9:1, `--brand` 7,2:1. Fixe dans les deux thèmes,
> d'où `--on-dark` pour le texte posé dessus.

> **Texte sur un aplat orange** : toujours `--on-brand` (7,9:1). Le blanc n'y
> donne que 2,2:1.

> `--brand-subtle` est une couleur de **texte**, pas une surface. En aplat elle
> vire au brun et jure avec le reste : un fond, une bordure ou un état actif
> prennent `--brand`, et un survol `--btn-hover-bg` / `--btn-active-bg`.

### Neutres et surfaces

| Token              | Clair     | Sombre    | Usage                                  |
| ------------------ | --------- | --------- | -------------------------------------- |
| `--bg`             | blanc     | `#272727` | Fond de page                           |
| `--bg-subtle`      | `#fff5e8` | `#312e29` | Fond de mise en avant (callout, stats) |
| `--bg-card`        | `#fffcf8` | `#35322c` | Fond de carte / encadré                |
| `--text`           | noir      | `#f0f0f0` | Texte courant                          |
| `--text-2`         | `#555`    | `#a0a8b4` | Texte secondaire, chapô, légendes      |
| `--text-secondary` | `#676e7a` | `#a0a8b4` | Alias UI (`--text-muted` idem)         |
| `--border`         | `#e5e7eb` | `#3e4048` | Bordures et filets                     |
| `--bg-secondary`   | `#fdfaf6` | `#303030` | Fond de zone secondaire (onglets, RIB) |

### Texte sur un fond qui ne change pas

| Token              | Valeur    | Usage                                                            |
| ------------------ | --------- | ---------------------------------------------------------------- |
| `--on-brand`       | `#1a1a1a` | Texte et pictos posés sur un aplat `--brand`                     |
| `--on-brand-muted` | `#3a2600` | Texte secondaire sur un aplat `--brand`                          |
| `--on-dark`        | `#ffffff` | Texte sur un fond sombre fixe : photo, calque noir, orange foncé |

Ces trois tokens ne changent pas d'un thème à l'autre, parce que le fond non plus.

> **Piège** : `--white` et `--black` **s'inversent** en mode sombre (`--white`
> devient `#262626`, `--black` `#f0f0f0`). Ce sont la surface claire et l'encre de
> la page, pas des couleurs fixes. Sur une photo, un calque noir ou un aplat
> orange, c'est `--on-dark` ou `--on-brand`.
> `--brand-rgb` (`255, 148, 22`) donne les composantes de l'orange pour les `rgba()`.

### États

| Token              | Clair     | Sombre    | Usage                           |
| ------------------ | --------- | --------- | ------------------------------- |
| `--success`        | `#2e7d32` | `#6fcf7e` | Texte de confirmation           |
| `--success-bg`     | `#e8f5e9` | `#1d3320` | Fond de bandeau de confirmation |
| `--success-border` | `#a5d6a7` | `#2f5c36` | Bordure associée                |
| `--error`          | `#c0392b` | `#ff8a7a` | Texte d'erreur                  |
| `--error-bg`       | `#fdecee` | `#3a201d` | Fond de bandeau d'erreur        |
| `--error-border`   | `#f6c6cc` | `#5e322d` | Bordure associée                |

Le vert et le rouge signalent un **état** (inscription réussie, paiement refusé).
Un badge décoratif prend l'orange de marque, jamais une couleur d'état.

### Boutons

`--btn-bg` / `--btn-hover-bg` (`#ffa945`) / `--btn-active-bg` (`#e6891d`),
et la variante claire `--btn-alt-*`. Focus visible : contour `#0097d8` de `0.25rem`.

### Accent d'alerte

`#d92d20` (rouge), réservé aux moments critiques d'une chronologie. Pas de rouge
ailleurs dans l'interface.

## 2. Typographie

- Deux polices. Titres : **Libre Franklin** (`--font-heading`), de la lignée
  Franklin Gothic, chasse étroite, proche du poids du logo. Texte :
  **Inter** (`--font-body`), dessinée pour l'écran, hauteur d'x haute.
- Graisses chargées : Libre Franklin 600, 700, 800 ; Inter 400, 500, 600, 700,
  plus les **italiques 400 et 700**. N'employer que celles-là : une graisse non
  chargée est fabriquée par le navigateur en épaississant le trait, et une
  italique absente en penchant le romain. C'était le cas de toutes les
  italiques du site avant cette charte.
- Corps de texte : `1.2rem`, interligne `1.5`.
- `h1`/`h2` : 700, `1.7rem` → `2rem` à partir de 640 px.
- `h3` : 500, `1.5rem`.
- Titres de campagne : `clamp(2rem, 5.5vw, 3rem)` pour le h1, `clamp(1.4rem, 3vw, 1.75rem)` pour les h2.
- Chapô : `clamp(1.05rem, 2vw, 1.25rem)`, couleur `--text-2`, largeur max `44rem`.
- Les liens sont soulignés, en `--brand-subtle`. Au survol, ils s'assombrissent :
  jamais `--brand`, qui n'est pas lisible en texte.
- Typographie française appliquée automatiquement au Markdown
  (`src/lib/typographyPlugin.js`) : espace fine insécable avant `; ? ! %`,
  insécable avant `:`, guillemets `« »`.

## 3. Rythme et mise en page

- Colonne de contenu : **54 rem** (pages éditoriales et campagnes), **60–66 rem**
  pour les pages larges. Gouttière : `1.5rem` (`1.1rem` en mobile).
- Espacement entre sections : `3.5rem` sur les pages campagne (le global d'`app.css`
  est de 5/10 rem, neutralisé par `CampaignPage`).
- Rayons, par token : `--radius-sm` (8px, champs et petits encadrés),
  `--radius-md` (12px, médias et cartes), `--radius-lg` (16px, grands encadrés),
  `--radius-btn` (0.625rem), `--radius-pill` (999px, badges).
- Ombres, par token : `--shadow-card` (très discrète, sur les encadrés),
  `--shadow-raised` (au survol d'une carte cliquable), `--shadow-brand`
  (bouton principal). Elles sont renforcées en mode sombre.
- Largeurs, par token : `--width-text` (44 rem, corps de texte),
  `--width-content` (54 rem, pages éditoriales et campagnes),
  `--width-wide` (62 rem, grilles et cartes). Aucune page ne définit sa propre
  largeur : sept valeurs distinctes coexistaient, elles sont ramenées à ces trois.
- Cibles tactiles : hauteur de bouton `48px` minimum.

## 4. Motifs récurrents

- **Filet de marque** : trait orange de `3rem × 4px`, arrondi, au-dessus du titre de hero.
- **Titre souligné** (`UnderlinedTitle`) : dégradé orange → transparent sur toute la largeur.
- **Callout** (`Callout`) : fond `--bg-subtle`, bordure `2px` `--brand`.
- **Citation** : fond `--bg-subtle`, barre gauche `4px` `--brand`.
- **Chronologie** : axe vertical orange à 30 % d'opacité, pastilles pleines `--brand`.

### Composants partagés (`$components/ui`)

Toute nouvelle page se compose d'abord avec ces briques, plutôt qu'avec des
styles locaux :

| Composant      | Rôle                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| `Card`         | Carte de la charte. `variant` : `default`, `accent`, `plain`.            |
| `Badge`        | Pastille. `variant` : `brand`, `neutral`, `outline`, `success`, `error`. |
| `PageHero`     | Filet de marque, titre, chapô, actions.                                  |
| `SectionTitle` | Titre de section avec pastille de compte optionnelle.                    |
| `FilterChips`  | Barre de filtres (onglets pilule).                                       |

Les pages campagne gardent leur module dédié (`$components/campaign`), construit
sur les mêmes tokens.

## 5. Mode sombre

Piloté par `data-theme="dark"` sur `<html>`, posé avant le premier rendu par le
script anti-FOUC d'`src/app.html`, et basculé via le store `src/lib/stores/theme.ts`.
Une page conforme n'a **rien de spécifique à écrire** pour le mode sombre si elle
n'utilise que les tokens ci-dessus. Les intégrations tierces (iframes) doivent en
revanche recevoir le thème explicitement, voir `LumaCalendar.svelte`.

## 6. Accessibilité

- Mouvement réduit respecté globalement (`prefers-reduced-motion`).
- Focus visible conservé sur tous les éléments interactifs.
- Toute `iframe` doit porter un `title` descriptif.

## 7. Contrôle automatique

`pnpm lint` exécute **stylelint** en plus de Prettier et ESLint. Trois règles
tiennent la charte :

- `color-no-hex`, aucune couleur en dur hors d'`app.css` ;
- `color-named`, pas de `white` / `black` non plus ;
- pas de `text-align: justify`.

Les seules exceptions, déclarées dans `.stylelintrc.json` : `app.css` (la palette
elle-même), la palette Wait But Why, les fills du logo et les drapeaux SVG.
Le hook de pre-commit lance stylelint sur les fichiers modifiés.

## 8. Version imprimable

Un résumé mis en page de cette charte, nuancier, spécimens typographiques,
briques, vit à côté de ce fichier :

- `docs/charte-graphique.html` : la source, à ouvrir dans un navigateur ;
- `docs/charte-graphique.pdf` : la version à diffuser.

Régénérer le PDF après modification du HTML : `node scripts/charte-pdf.mjs`,
ou simplement imprimer la page en PDF depuis le navigateur (A4, fonds
d'impression activés). Le HTML recopie les valeurs de `src/app.css` pour
pouvoir les montrer ; en cas d'écart, c'est `app.css` qui a raison.
