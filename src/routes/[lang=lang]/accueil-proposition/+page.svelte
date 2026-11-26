<script lang="ts">
	/**
	 * PROPOSITION de nouvelle page d'accueil, pour validation par l'équipe web.
	 *
	 * Ne contient que les critères de la todo Notion de Jeanne (« Suggestions
	 * pour la nouvelle page d'accueil ») :
	 *   1. boutons vers les formes d'action possibles,
	 *   2. chiffres relatifs à l'activité de l'association,
	 *   3. photos d'événements (mise à jour),
	 *   4. Maxime,
	 *   5. bande de journaux.
	 * Le haut de page reprend le héros actuel (texte déjà validé par Jeanne).
	 *
	 * Hors menu, hors sitemap, non indexée. Aucun chiffre n'est écrit à la main :
	 * tous sont calculés depuis les données du site (voir plus bas).
	 */
	import { onMount } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import Hero from '$components/home/hero.svelte'
	import Bande from '$components/home/Bande.svelte'
	import Button from '$components/Button.svelte'
	import YouTubeEmbed from '$components/YouTubeEmbed.svelte'
	import { activeGroupsCount, localGroups } from '$lib/data/local-groups'
	import { staticPressCoverage } from '$lib/press-coverage-static'
	import type { PageData } from './$types'

	export let data: PageData
	$: lang = data.lang
	$: isEn = lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	/* 1. Formes d'action : libellés et ordre de la colonne « Agir » du pied de
	      page proposé par Jeanne (todo Notion, « Propositions pour les menus et
	      le footer »). */
	$: actions = [
		{ href: `${prefix}/rejoindre`, fr: 'Rejoindre Pause IA', en: 'Join Pause IA' },
		{ href: `${prefix}/groupes-locaux`, fr: 'Rejoindre un groupe local', en: 'Join a local group' },
		{
			href: `${prefix}/ecrire-a-mes-elus`,
			fr: 'Écrire à vos élus et à la presse',
			en: 'Write to your representatives'
		},
		{ href: `${prefix}/declaration`, fr: 'Signer notre déclaration', en: 'Sign our statement' },
		{ href: `${prefix}/dons`, fr: 'Faire un don', en: 'Donate' },
		{ href: `${prefix}/agir`, fr: 'Toutes les façons d’agir', en: 'All the ways to act' }
	]

	/* 2. Chiffres. Groupes locaux et retombées presse : les données du site.
	      Signatures : le compteur de la page Déclaration, lu à l'ouverture. */
	const groupesActifs = activeGroupsCount
	const groupesTotal = localGroups.length
	const retombees = staticPressCoverage.length
	let signatures: number | null = null
	onMount(async () => {
		try {
			const r = await fetch('/api/declaration')
			const d = (await r.json()) as { local?: { count?: number } }
			if (typeof d.local?.count === 'number') signatures = d.local.count
		} catch {
			/* le chiffre reste masqué */
		}
	})

	/* 3. Photos d'événements : la marche du 14 novembre (Drive de Jeanne). */
	const PM = '/campaigns/marche-14-novembre'
	const photos = [
		{
			src: `${PM}/cortege-banderole.webp`,
			fr: 'Le cortège derrière la banderole Pause IA, à Paris.',
			en: 'The march behind the Pause IA banner, in Paris.'
		},
		{
			src: `${PM}/trocadero-megaphone.webp`,
			fr: 'Prise de parole au Trocadéro.',
			en: 'Speaking at the Trocadéro.'
		},
		{
			src: `${PM}/pancarte-tour-eiffel.webp`,
			fr: 'Une pancarte devant la tour Eiffel.',
			en: 'A sign in front of the Eiffel Tower.'
		},
		{
			src: `${PM}/pancartes.webp`,
			fr: 'Pancartes Pause IA pendant la marche.',
			en: 'Pause IA signs during the march.'
		}
	]

	/* 4. Maxime : l'entretien cité dans les ressources de Hugo. */
	const MAXIME_VIDEO = 'WhQViEjkg7s'

	/* 5. Bande de journaux : les médias qui ont parlé de nous, tirés de la revue
	      de presse du site (rien n'est ajouté à la main). On garde les titres
	      nationaux, dans cet ordre, s'ils figurent dans la revue de presse. */
	const NATIONAUX = [
		'Le Monde',
		'France Culture',
		'Le Nouvel Obs',
		'BFM TV',
		'Europe 1',
		'20 Minutes',
		'La Tribune',
		'France 3',
		'Clubic',
		'01net',
		'Next'
	]
	const sources = new Set(staticPressCoverage.map((p) => p.source.replace(/ \(vidéo\)$/, '')))
	const journaux = NATIONAUX.filter((n) =>
		[...sources].some((s) => s === n || s.startsWith(`${n} `))
	)
</script>

<PostMeta
	title="Proposition de page d’accueil | Pause IA"
	description="Proposition de nouvelle page d’accueil, pour validation."
/>
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<p class="prototype">
	Proposition de page d’accueil pour validation (critères de la todo « Révision du site »). Les
	chiffres sont calculés depuis les données du site.
</p>

<Hero {lang} />

<!-- 1. Boutons vers les formes d'action -->
<Bande titre={isEn ? 'Act' : 'Agir'} filet={false}>
	<ul class="actions">
		{#each actions as a, i}
			<li><Button href={a.href} alt={i > 0}>{isEn ? a.en : a.fr}</Button></li>
		{/each}
	</ul>
</Bande>

<!-- 2. Chiffres de l'activité -->
<section class="chiffres" aria-label={isEn ? 'Pause IA in figures' : 'Pause IA en chiffres'}>
	<div class="chiffre">
		<strong>{groupesActifs}</strong>
		<span
			>{isEn
				? `active local groups (out of ${groupesTotal})`
				: `groupes locaux actifs (sur ${groupesTotal})`}</span
		>
	</div>
	{#if signatures !== null}
		<div class="chiffre">
			<strong>{signatures.toLocaleString(isEn ? 'en-GB' : 'fr-FR')}</strong>
			<span>{isEn ? 'signatures of our statement' : 'signatures de notre déclaration'}</span>
		</div>
	{/if}
	<div class="chiffre">
		<strong>{retombees}</strong>
		<span>{isEn ? 'articles and reports about us' : 'articles et reportages sur nos actions'}</span>
	</div>
</section>

<!-- 3. Photos d'événements -->
<Bande titre={isEn ? 'Our latest actions' : 'Nos dernières actions'}>
	<div class="photos">
		{#each photos as p (p.src)}
			<img src={p.src} alt={isEn ? p.en : p.fr} loading="lazy" />
		{/each}
	</div>
	<p class="suite">
		<Button href="{prefix}/perte-de-controle#marche" alt>
			{isEn ? 'The 14 November march' : 'La marche du 14 novembre'}
		</Button>
	</p>
</Bande>

<!-- 4. Maxime -->
<Bande
	titre={isEn ? 'Hear from Maxime Fournes' : 'Écouter Maxime Fournes'}
	fond="gris"
	filet={false}
>
	<div class="maxime">
		<YouTubeEmbed
			id={MAXIME_VIDEO}
			title="Ingénieur en IA : « Ça y est, la perte de contrôle a commencé… »"
		/>
		<p class="legende">
			Le Futurologue, 8 septembre 2026 : « Ingénieur en IA : “Ça y est, la perte de contrôle a
			commencé…” ». Maxime Fournes, cofondateur et président de PauseAI Global.
		</p>
	</div>
</Bande>

<!-- 5. Bande de journaux -->
<section class="journaux" aria-label={isEn ? 'In the press' : 'Ils parlent de nous'}>
	<p class="journaux-titre">{isEn ? 'In the press' : 'Ils parlent de nous'}</p>
	<ul>
		{#each journaux as j}
			<li>{j}</li>
		{/each}
	</ul>
	<p class="suite"><a href="{prefix}/presse">{isEn ? 'Press review' : 'Revue de presse'}</a></p>
</section>

<style>
	.prototype {
		max-inline-size: var(--width-content, 72rem);
		margin: 1rem auto;
		padding: 0.6rem 0.9rem;
		border: 1px dashed var(--brand);
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.actions {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.actions li {
		display: flex;
	}

	/* Le bouton est en `max-width: fit-content` : on l'élargit ici pour que
	   les six forment une grille régulière. */
	.actions li > :global(a) {
		flex: 1;
		max-width: none;
		text-align: center;
	}

	.chiffres {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 1rem;
		margin-block: 2.5rem;
	}

	.chiffre {
		padding: 1.25rem 1.5rem;
		border-top: 3px solid var(--brand);
		background: var(--bg-2, var(--bg));
	}

	.chiffre strong {
		display: block;
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		line-height: 1;
		color: var(--brand);
	}

	.chiffre span {
		display: block;
		margin-top: 0.4rem;
		color: var(--text-2);
	}

	.photos {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 4px;
	}

	.photos img {
		inline-size: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: center 30%;
		display: block;
		border-radius: var(--radius-sm);
	}

	.suite {
		margin-top: 1rem;
	}

	.maxime {
		max-inline-size: 48rem;
	}

	.legende {
		margin-top: 0.75rem;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.journaux {
		margin-block: 3rem;
		text-align: center;
	}

	.journaux p {
		margin-inline: auto;
	}

	.journaux-titre {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-2);
	}

	.journaux ul {
		list-style: none;
		margin: 1rem 0 0;
		padding: 1rem 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem 2rem;
		border-block: 1px solid var(--border);
	}

	.journaux li {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--text);
		opacity: 0.75;
	}

	@media (max-width: 700px) {
		.actions {
			grid-template-columns: 1fr;
		}

		.photos {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
