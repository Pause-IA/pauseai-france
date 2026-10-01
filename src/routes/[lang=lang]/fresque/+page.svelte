<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Card, SectionTitle } from '$components/ui'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'

	const SITE = 'https://fresquedesrisquesdelia.org'
	/* Formulaire d'expression d'intérêt (Notion). */
	const INTERET = 'https://pauseia.notion.site/3e728fc94b7780f6bda6c4770042b859'

	/* Trois photos d'atelier, fixes. Il n'en existe que cinq : un ruban qui
	   défile les répétait quatre fois, et la boucle se voyait. Trois images
	   posées, plus grandes, montrent mieux ce qu'est un atelier. */
	const P = '/campaigns/fresque/photos'
	const PHOTOS = [
		{
			src: `${P}/table-et-cartes.webp`,
			fr: 'Les cartes disposées sur la table d’un atelier.',
			en: 'The cards laid out on a workshop table.'
		},
		{
			src: `${P}/fresque-en-cours.webp`,
			fr: 'Un groupe relie les cartes entre elles.',
			en: 'A group linking the cards together.'
		},
		{
			src: `${P}/tour-de-table.webp`,
			fr: 'Un tour de table en fin d’atelier.',
			en: 'A closing round of discussion.'
		}
	]

	/* Prochains ateliers, lus sur l'agenda public du site de la fresque.
	   `/api/ateliers.json` est prévu pour ça : lecture seule, sans
	   authentification, `Access-Control-Allow-Origin: *`, et aucun atelier
	   privé ni adresse e-mail n'y figure. Appelé au montage et jamais au
	   prérendu : si le site est indisponible, la page reste entière et seul ce
	   bloc disparaît. */
	type Atelier = {
		code: string
		debutMs: number
		mode: string
		lieu: string
		places: number
		complet: boolean
		url: string
	}
	let ateliers: Atelier[] = []

	onMount(async () => {
		try {
			const r = await fetch(`${SITE}/api/ateliers.json`)
			if (!r.ok) return
			const d = await r.json()
			ateliers = (d.ateliers || []).filter((a: Atelier) => !a.complet).slice(0, 3)
		} catch {
			/* Site injoignable : on n'affiche rien, le bouton suffit. */
		}
	})

	function quand(a: Atelier) {
		return new Intl.DateTimeFormat(isEn ? 'en-GB' : 'fr-FR', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(a.debutMs))
	}

	/* Les trois cartes du hero du site de la fresque, recto et verso.
	   Visuels issus du dépôt de la fresque (Pause IA, CC BY-SA 4.0). */
	const CARTES = [
		{
			recto: '/campaigns/fresque/14.webp',
			verso: '/campaigns/fresque/14-verso.webp',
			fr: 'Deepfake',
			en: 'Deepfake'
		},
		{
			recto: '/campaigns/fresque/08.webp',
			verso: '/campaigns/fresque/08-verso.webp',
			fr: 'Génération d’images',
			en: 'Image generation'
		},
		{
			recto: '/campaigns/fresque/28.webp',
			verso: '/campaigns/fresque/28-verso.webp',
			fr: 'Systèmes d’armes létales autonomes',
			en: 'Lethal autonomous weapons'
		}
	]
	// Une carte retournée à la fois : deux versos ouverts côte à côte dans un
	// éventail se recouvrent et deviennent illisibles.
	let retournee: number | null = null
	const retourner = (i: number) => (retournee = retournee === i ? null : i)
</script>

<PostMeta
	title={isEn ? 'The AI Risks Fresk' : 'La Fresque des risques de l’IA'}
	description={isEn
		? 'A collaborative card-game workshop to build an overall picture of artificial intelligence, from its capabilities to its risks and the possible solutions.'
		: 'Un atelier collaboratif autour d’un jeu de cartes pour se faire une vision d’ensemble de l’intelligence artificielle, de ses capacités à ses risques, jusqu’aux solutions possibles.'}
/>

<div class="page">
	<header class="hero">
		<h1>{isEn ? 'The AI Risks Fresk' : 'La Fresque des risques de l’IA'}</h1>
		<span class="filet" aria-hidden="true"></span>
		<p class="lede">
			{isEn
				? 'A collaborative workshop built around a deck of cards, to build an overall picture of artificial intelligence — from what it can do to the risks it carries, through to the possible solutions.'
				: 'Un atelier collaboratif autour d’un jeu de cartes pour se faire une vision d’ensemble de l’intelligence artificielle, de ses capacités à ses risques, jusqu’aux solutions possibles.'}
		</p>
		<!-- Une seule action dominante : s'inscrire à un atelier, la vraie
		     conversion de la page. « Découvrir la Fresque » reste accessible,
		     en second rang : quatre boutons de poids égal ne hiérarchisaient
		     rien. -->
		<p class="hero-action">
			<Button href="{SITE}/participer/" target="_blank" rel="noopener noreferrer">
				{isEn ? 'See the workshops' : 'Voir les ateliers'}
			</Button>
			<a class="lien-second" href={SITE} target="_blank" rel="noopener noreferrer">
				{isEn ? 'Discover the Fresk' : 'Découvrir la Fresque'}
			</a>
		</p>
	</header>
</div>

<!-- Bande de photos, pleine largeur : elle sort de la colonne de contenu. -->
<div class="bandeau">
	{#each PHOTOS as photo}
		<img src={photo.src} alt={isEn ? photo.en : photo.fr} loading="lazy" />
	{/each}
</div>

<div class="page">
	<section class="atelier">
		<div class="prose">
			<p>
				{isEn
					? 'Each workshop brings together two to eight participants. They are handed cards standing for key concepts, connect them with arrows and talk them through. Little by little the fresk takes shape: it starts from what AI is and what it can do, passes through current and existential risks, and ends with the solutions.'
					: 'Chaque atelier réunit deux à huit participants. Ils reçoivent des cartes représentant des concepts clés, les relient par des flèches et en discutent. Peu à peu, la fresque prend forme : elle part de ce qu’est l’IA et de ce qu’elle sait faire, passe par les risques actuels et existentiels, et aboutit aux solutions.'}
			</p>
			<p>
				{isEn
					? 'The workshop needs no prior knowledge. Everything is on the cards: nobody has to be an expert, not even the facilitator. It runs around a table or online, on a shared board. The deck is free, openly licensed and ready to print.'
					: 'L’atelier ne demande aucun prérequis. Toutes les informations sont sur les cartes : personne n’a besoin d’être expert, pas même l’animateur. Il a lieu autour d’une table ou en ligne, sur un tableau partagé. Le jeu de cartes est gratuit, en licence libre et prêt à imprimer.'}
			</p>
		</div>

		<div class="visuel">
			<div class="pile">
				{#each CARTES as carte, i}
					<button
						type="button"
						class="carte carte-{i}"
						class:ouverte={retournee === i}
						aria-pressed={retournee === i}
						on:click={() => retourner(i)}
					>
						<span class="face recto">
							<img src={carte.recto} alt="" loading="lazy" />
						</span>
						<span class="face verso">
							<img src={carte.verso} alt="" loading="lazy" />
						</span>
						<span class="sr">
							{isEn
								? `“${carte.en}” card — flip to read the back`
								: `Carte « ${carte.fr} » — retourner pour lire le verso`}
						</span>
					</button>
				{/each}
			</div>
			<p class="legende">
				{isEn
					? 'Three of the 39 cards. Click one to read its back.'
					: 'Trois des 39 cartes. Cliquez une carte pour lire son verso.'}
			</p>
		</div>
	</section>

	<section class="rejoindre">
		<SectionTitle>
			{isEn ? 'Attend or run a workshop' : 'Participer ou animer un atelier'}
		</SectionTitle>
		<p class="intro">
			{#if isEn}
				Anyone can join or run a workshop <strong>near them</strong> or
				<strong>online</strong>.
			{:else}
				Chacun peut rejoindre ou animer un atelier <strong>près de chez soi</strong> ou
				<strong>en ligne</strong>.
			{/if}
		</p>

		{#if ateliers.length}
			<!-- Ateliers réels plutôt qu'une promesse : rempli au montage depuis
			     l'agenda public de la fresque. Absent si le site est injoignable. -->
			<ul class="agenda">
				{#each ateliers as a}
					<li>
						<a href={a.url} target="_blank" rel="noopener noreferrer">
							<span class="quand">{quand(a)}</span>
							<span class="ou"
								>{a.mode === 'enligne' ? (isEn ? 'Online' : 'En ligne') : a.lieu}</span
							>
							<span class="places">
								{a.places}
								{isEn ? 'seats left' : a.places > 1 ? 'places' : 'place'}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="duo">
			<Card variant="plain" class="carte-participer">
				<h3>{isEn ? 'Attend' : 'Participer'}</h3>
				<p>
					{isEn
						? 'Scheduled workshops, online as well as in person, are listed on the Fresk website. Pick the one that suits you and sign up. You then get all the details by e-mail.'
						: 'Les ateliers programmés, en ligne comme en présentiel, sont listés sur le site de la Fresque. Il suffit de choisir celui qui vous convient et de vous inscrire. Vous recevez ensuite toutes les informations par e-mail.'}
				</p>
				<p class="action">
					<Button href="{SITE}/participer/" target="_blank" rel="noopener noreferrer">
						{isEn ? 'See the workshops' : 'Voir les ateliers'}
					</Button>
				</p>
			</Card>

			<Card variant="plain" class="carte-animer">
				<h3>{isEn ? 'Facilitate' : 'Animer'}</h3>
				<p>
					{isEn
						? 'Everything you need to facilitate is freely available: the facilitation guide, the deck of cards and the online tool. You can schedule your workshop directly on the website. In public mode it appears in the list of workshops and anyone can sign up. In private mode, only the people you send the link to can take part.'
						: 'Tout le nécessaire pour animer est en accès libre : le guide d’animation, le jeu de cartes et l’outil en ligne. Vous pouvez programmer votre atelier directement sur le site. En mode public, il apparaît dans la liste des ateliers et chacun peut s’y inscrire. En mode privé, seules les personnes à qui vous transmettez le lien y ont accès.'}
				</p>
				<p class="action">
					<Button href="{SITE}/devenir-animateur/" target="_blank" rel="noopener noreferrer">
						{isEn ? 'Become a facilitator' : 'Devenir animateur·ice'}
					</Button>
				</p>
			</Card>
		</div>
	</section>

	<!-- Pas de formulaire ici : l'expression d'intérêt vit déjà sur un
	     formulaire dédié, qui pose les bonnes questions et ne confond pas une
	     marque d'intérêt avec un abonnement à la lettre d'information. -->
	<section class="interet">
		<Card variant="plain" class="bande-interet">
			<h3>
				{isEn
					? 'Interested in the project, for yourself or for your organisation?'
					: 'Le projet vous intéresse, à titre personnel ou pour votre association ?'}
			</h3>
			<p class="intro">
				{isEn ? 'Tell us about your interest.' : 'Faites-nous part de votre intérêt.'}
			</p>
			<Button href={INTERET} target="_blank" rel="noopener noreferrer">
				{isEn ? 'Express my interest' : 'Faire part de mon intérêt'}
			</Button>
		</Card>
	</section>

	<footer class="credits">
		<p>
			{isEn
				? 'The Fresk is inspired by the Climate Fresk. It was built by the Pause IA volunteer team from the AI Safety Fresk shared by CeSIA. The cards are licensed CC BY-SA 4.0.'
				: 'La Fresque s’inspire de la Fresque du Climat. Elle a été construite par l’équipe bénévole de Pause IA à partir de la Fresque de la sécurité de l’IA, partagée par le CeSIA. Les cartes sont sous licence CC BY-SA 4.0.'}
		</p>
	</footer>
</div>

<style>
	/* `main` est un conteneur flex : sans largeur explicite, chaque bloc se
	   rétrécit à son contenu et `margin-inline: auto` le centre sur sa propre
	   largeur. Le hero se retrouvait décalé de 120 px par rapport au reste. */
	/* Même rythme vertical que les pages campagne (`CampaignPage`) : un seul pas
	   entre sections, resserré en mobile. Toutes les marges de section s'y
	   réfèrent, aucune valeur isolée. Le bandeau pleine largeur vit en dehors de
	   `.page` : il lui faut sa propre déclaration, sinon `var(--pas)` n'y est
	   pas défini et sa marge basse tombe à zéro. */
	.page,
	.bandeau {
		--pas: 3.5rem;
	}

	.page {
		inline-size: 100%;
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	/* Échelle typographique reprise de `PageHero`. Le filet orange est placé
	   SOUS le titre, comme sur le croquis — la charte le met au-dessus, d'où le
	   hero écrit ici plutôt qu'une option ajoutée à la brique partagée. */
	.hero {
		margin-block: 2.5rem var(--pas);
	}

	.hero h1 {
		margin: 0;
		font-size: clamp(2rem, 5.5vw, 3rem);
		line-height: 1.08;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.filet {
		display: block;
		inline-size: 3rem;
		block-size: 4px;
		border-radius: var(--radius-pill);
		background: var(--brand);
		margin-block: 1.25rem 0;
	}

	.lede {
		margin: 1.25rem 0 0;
		max-inline-size: var(--width-text);
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.hero-action {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.25rem;
		margin: 1.75rem 0 0;
	}

	.lien-second {
		font-size: 1rem;
		color: var(--brand-subtle);
	}

	/* --- Bande de photos ---------------------------------------------------
	   Quatre des cinq photos sont en portrait (575 x 768) : les écraser dans
	   une bande paysage jetait les deux tiers de l'image et coupait les têtes.
	   Les tuiles sont donc en 4/5, proche du format d'origine, et le cadrage
	   est calé vers le haut, là où sont les visages. En mobile elles défilent
	   horizontalement au doigt plutôt que de rétrécir à la vignette — et les
	   trois restent accessibles, au lieu d'en masquer une. */
	.bandeau {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		inline-size: 100vw;
		margin-inline: calc(50% - 50vw);
		margin-block: 0 var(--pas);
	}

	.bandeau img {
		inline-size: 100%;
		aspect-ratio: 4 / 5;
		max-block-size: 26rem;
		object-fit: cover;
		object-position: center 30%;
		display: block;
	}

	/* --- L'atelier : texte et éventail de cartes ---------------------------- */
	.atelier {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
		gap: 2.5rem;
		align-items: start;
		margin-bottom: var(--pas);
	}

	.prose {
		max-inline-size: var(--width-text);
	}

	.prose p {
		margin: 0 0 1rem;
		color: var(--text-2);
		line-height: 1.7;
	}

	.prose p:last-child {
		margin-bottom: 0;
	}

	.legende {
		margin: 1rem 0 0;
		font-size: 0.88rem;
		color: var(--text-2);
		text-align: center;
	}

	/* Éventail repris du hero du site de la fresque, mais plus ouvert : avec
	   l'écartement d'origine, la carte du milieu recouvrait les trois quarts de
	   ses voisines, qui n'étaient donc cliquables que sur un quart de leur
	   surface — on visait une carte et c'est une autre qui se retournait.
	   La hauteur suit la largeur (aspect-ratio) : une hauteur fixe laissait les
	   cartes dépasser du bloc dès que la colonne se resserrait. */
	.pile {
		position: relative;
		aspect-ratio: 1.35 / 1;
	}

	.carte {
		position: absolute;
		top: 50%;
		left: 50%;
		inline-size: 66%;
		aspect-ratio: 1.41 / 1;
		padding: 0;
		border: 0;
		background: transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: translate 0.18s ease;
	}

	.face {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-sm);
		overflow: hidden;
		box-shadow:
			0 2px 5px rgb(27 26 23 / 16%),
			0 14px 28px -10px rgb(27 26 23 / 35%);
		transition: opacity 0.3s ease;
	}

	.face img {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}

	.verso {
		opacity: 0;
	}

	.carte.ouverte .recto {
		opacity: 0;
	}

	.carte.ouverte .verso {
		opacity: 1;
	}

	/* L'éventail : la carte du milieu devant, les deux autres inclinées. Le
	   `rotate`/`translate` de l'éventail est porté par `transform`, et le
	   soulèvement au survol par `translate` — sinon le survol écrase
	   l'inclinaison. */
	.carte-0 {
		transform: translate(-50%, -50%) rotate(-9deg) translate(-36%, 9%);
		z-index: 1;
	}

	.carte-1 {
		transform: translate(-50%, -50%) translateY(-8%);
		z-index: 3;
	}

	.carte-2 {
		transform: translate(-50%, -50%) rotate(9deg) translate(36%, 9%);
		z-index: 2;
	}

	.carte:hover,
	.carte:focus-visible {
		translate: 0 -8px;
		z-index: 5;
	}

	.carte.ouverte {
		z-index: 5;
	}

	.sr {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* --- Participer ou animer ---------------------------------------------- */
	.rejoindre {
		margin-bottom: var(--pas);
	}

	.intro {
		margin: 0 0 1.5rem;
		max-inline-size: var(--width-text);
		color: var(--text-2);
		line-height: 1.7;
	}

	.agenda {
		list-style: none;
		display: grid;
		gap: 0.5rem;
		margin: 0 0 1.5rem;
		padding: 0;
		max-inline-size: var(--width-text);
	}

	.agenda a {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.9rem;
		padding: 0.8rem 1rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: var(--text);
	}

	.agenda a:hover {
		border-color: var(--brand);
	}

	.quand {
		font-weight: 600;
	}

	.ou,
	.places {
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.places {
		margin-inline-start: auto;
	}

	.duo {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1.5rem;
		/* Chaque carte épouse son texte. Étirées à la même hauteur, la plus
		   courte laissait un grand vide au-dessus de son bouton. */
		align-items: start;
	}

	.duo :global(.ui-card) {
		display: flex;
		flex-direction: column;
		background: var(--bg-card);
		border-color: var(--border);
		box-shadow: var(--shadow-card);
		overflow: hidden;
	}

	.duo .action {
		margin-block-start: 1.5rem;
	}

	.interet h3 {
		margin: 0 0 0.75rem;
		font-size: 1.25rem;
		color: var(--text);
	}

	/* Chapeau de marque : le titre occupe une bande orange en tête de carte,
	   à la taille de titre de la charte (h3, 1,5 rem). Les marges négatives
	   annulent la gouttière de la carte pour que la bande aille d'un bord à
	   l'autre ; `overflow: hidden` sur la carte lui redonne ses angles.
	   Texte sur aplat orange : --on-brand, jamais blanc (2,2:1). */
	.duo h3 {
		margin: -2rem -2rem 1.5rem;
		padding: 0.8rem 2rem;
		background: var(--brand);
		color: var(--on-brand);
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.duo p {
		margin: 0;
		color: var(--text-2);
		line-height: 1.65;
	}

	/* « Participer » est l'action principale, mais l'aplat orange plein du
	   croquis pesait lourd : cinq lignes de texte foncé sur un bloc saturé, et
	   un grand vide orange au-dessus du bouton parce que l'autre carte est plus
	   longue. On garde la carte de la charte et on marque la priorité par un
	   bandeau de marque en tête, pas par un fond intégral. */
	.duo :global(.carte-participer) {
		border-color: var(--brand);
	}

	/* --- Formulaire d'intérêt ---------------------------------------------- */
	.interet {
		margin-bottom: var(--pas);
	}

	/* Bande orange pâle du croquis. Le fond de page est déjà le crème
	   `--bg-subtle` : un `--brand-light` par-dessus serait invisible, d'où un
	   voile d'orange construit sur `--brand-rgb`, que la charte fournit
	   justement pour les `rgba()`. */
	.interet :global(.bande-interet) {
		background: rgb(var(--brand-rgb) / 10%);
		border-color: var(--brand);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		padding: 2rem;
	}

	.interet .intro {
		margin-bottom: 1.5rem;
	}

	/* --- Crédits ----------------------------------------------------------- */
	.credits {
		max-inline-size: var(--width-text);
		padding-top: 1.5rem;
		margin-bottom: 5rem;
		border-top: 1px solid var(--border);
	}

	.credits p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	@media (max-width: 600px) {
		.page,
		.bandeau {
			--pas: 2.5rem;
		}

		.page {
			padding-inline: 1.1rem;
		}

		.interet :global(.bande-interet) {
			padding: 1.25rem;
		}

		/* La carte passe à 1,25 rem de gouttière : la bande suit. */
		.duo h3 {
			margin: -1.25rem -1.25rem 1.25rem;
			padding: 0.7rem 1.25rem;
			font-size: 1.35rem;
		}
	}

	@media (max-width: 820px) {
		.bandeau {
			display: flex;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
		}

		.bandeau img {
			flex: 0 0 62vw;
			scroll-snap-align: center;
		}

		.atelier {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.pile {
			aspect-ratio: 1.78 / 1;
		}

		.carte {
			inline-size: 54%;
		}
	}
</style>
