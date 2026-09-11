# Module « page campagne »

Briques réutilisables pour monter une page de campagne conforme à la
[charte graphique](./charte-graphique.md), sans réécrire de CSS.

- Code : `src/lib/components/campaign/`
- Page de référence (tous les blocs assemblés) : `/fr/campagne-modele` et `/en/campagne-modele`
  (`src/routes/[lang=lang]/campagne-modele/+page.svelte`)

## Pourquoi

Les pages campagne existantes (`municipales-2026`, `senat2025`, `geneve-2026`,
`sommet-ia-2026`, `g7-2026`, `une-ia-sest-echappee`) redéfinissent chacune les mêmes
styles : largeur d'article, hero avec filet orange, encadré `#fafafa` arrondi,
grille de chiffres, chronologie, blocs d'action. Les valeurs divergent
(54 rem / 60 rem de large, `#fafafa` en dur au lieu de `--bg-card` — donc cassé en
mode sombre), et chaque nouvelle campagne repart d'un copier-coller.

Le module fixe ces décisions une fois.

## Mise en route

```svelte
<script lang="ts">
	import {
		CampaignPage,
		CampaignHero,
		CampaignSection,
		CampaignActions
	} from '$components/campaign'
	import type { CampaignAction } from '$components/campaign'

	const actions: CampaignAction[] = [
		{
			title: 'Écrire à mon député',
			description: 'Deux minutes.',
			cta: 'J’écris',
			href: '/fr/ecrire-a-mes-elus',
			featured: true
		}
	]
</script>

<CampaignPage title="Ma campagne" description="Résumé pour le référencement.">
	<CampaignHero
		title="Ma campagne"
		eyebrow="Campagne en cours"
		date="Depuis janvier 2026"
		lede="Une phrase."
	>
		<Button href="#agir">Passer à l’action</Button>
	</CampaignHero>

	<CampaignSection id="agir" title="Passer à l’action" variant="accent">
		<CampaignActions {actions} />
	</CampaignSection>
</CampaignPage>
```

Puis ajouter la route dans `prerender.entries` de `svelte.config.js`, et la campagne
dans `src/lib/campaigns.ts` pour qu'elle apparaisse sur `/campagnes` et la page d'accueil.

## Composants

| Composant          | Rôle                                                              | Props principales                                                 |
| ------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `CampaignPage`     | Conteneur : largeur, gouttières, rythme vertical, `PostMeta`      | `title`, `description`, `width` (`narrow` \| `wide`)              |
| `CampaignHero`     | Filet de marque, badge de statut, h1, chapô, boutons (slot)       | `title`, `lede`, `eyebrow`, `date`, `status`                      |
| `CampaignSection`  | Section titrée avec ancre                                         | `title`, `intro`, `id`, `variant` (`plain` \| `card` \| `accent`) |
| `CampaignStats`    | Grille de chiffres clés                                           | `stats: CampaignStat[]`                                           |
| `CampaignTimeline` | Chronologie par phases, axe orange (rouge si `accent`)            | `phases: TimelinePhase[]`                                         |
| `CampaignActions`  | Grille de cartes d'action, la première pouvant être mise en avant | `actions: CampaignAction[]`                                       |
| `CampaignEmbed`    | `iframe` générique responsive et accessible                       | `src`, `title`, `height`, `mobileHeight`, `caption`               |
| `LumaCalendar`     | Calendrier d'événements Luma, thème synchronisé avec le site      | `calendarId`, `title`, `height`, `calendarUrl`                    |

## Calendrier Luma

```svelte
<CampaignSection id="evenements" title="Les prochains événements" variant="card">
	<LumaCalendar
		calendarId="cal-5ZNtr1GO7aUSyiY"
		calendarUrl="https://luma.com/cal-5ZNtr1GO7aUSyiY"
	/>
</CampaignSection>
```

Différences avec le bout de code d'intégration fourni par Luma :

- **largeur fluide** au lieu de `width="600"` — sinon le calendrier déborde sur mobile
  et laisse un blanc sur desktop ;
- **thème synchronisé** : le paramètre `lt` suit le store `theme` du site, donc le
  calendrier passe en sombre avec le reste de la page (le `lt=light` en dur reste blanc) ;
- **`loading="lazy"`** et un `title` accessible ;
- bordure et rayon repris des tokens (`--border`, 12 px) plutôt que le `#bfcbda88` de Luma.

`calendarId` est le segment visible dans l'URL d'intégration :
`https://luma.com/embed/calendar/<calendarId>/events`.

Un calendrier Luma référence aussi les événements créés par d'autres organisateurs,
ce qui permet d'agréger les événements des groupes locaux sans les ressaisir.

Pour une page dédiée « Événements » plutôt qu'une section de campagne, réutiliser
`CampaignPage` + `CampaignSection` + `LumaCalendar` : le rendu est identique.

## Migration des pages existantes

Le module n'est pas branché de force sur les pages actuelles : elles restent en
l'état. La migration se fait campagne par campagne, en commençant par les plus
simples (`sommet-ia-2026`, `geneve-2026`, `g7-2026`), dont le contenu tient
entièrement dans `CampaignHero` + `CampaignSection`.
