<script lang="ts">
	import { openActivoiceForm } from '$lib/activoice'
	import { Badge } from '$components/ui'
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$lib/components/Button.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: isEn = lang === 'en'

	$: title = isEn ? 'Municipal elections 2026 | Pause AI' : 'Élections municipales 2026 | Pause IA'
	$: description = isEn
		? 'The March 2026 municipal elections represent a major opportunity for local awareness. Pause AI is calling on candidates to make a concrete commitment by signing our charter.'
		: "Les élections municipales de mars 2026 représentent une opportunité majeure de sensibilisation au niveau local. À cette occasion, Pause IA appelle les candidats à s'engager concrètement en signant notre charte."

	interface Candidate {
		id: string
		name: string
		city: string
		commitments: string
		charterFile?: string
		charterType?: 'image' | 'pdf'
		engagements?: string[]
	}

	const candidates: Candidate[] = [
		{
			id: 'stephane-baly-lille',
			name: 'Stéphane Baly',
			city: 'Lille',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Baly.pdf',
			charterType: 'pdf'
		},
		{
			id: 'jean-marc-governatori-nice',
			name: 'Jean-Marc Governatori',
			city: 'Nice',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Governatori.pdf',
			charterType: 'pdf'
		},
		{
			id: 'sebastien-muscat-brest',
			name: 'Sébastien Muscat',
			city: 'Brest',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Muscat.pdf',
			charterType: 'pdf'
		},
		{
			id: 'johanna-rolland-nantes',
			name: 'Johanna Rolland',
			city: 'Nantes',
			commitments: '13/14',
			charterFile: '/chartes-municipales-2026/Rolland.pdf',
			charterType: 'pdf'
		},
		{
			id: 'jeremy-roques-metz',
			name: 'Jérémy Roques',
			city: 'Metz',
			commitments: '12/14',
			charterFile: '/chartes-municipales-2026/Roques.webp',
			charterType: 'image'
		},
		{
			id: 'mariane-maximi-clermont-ferrand',
			name: 'Mariane Maximi',
			city: 'Clermont-Ferrand',
			commitments: '6/14',
			charterFile: '/chartes-municipales-2026/Maximi.pdf',
			charterType: 'pdf'
		},
		{
			id: 'vincent-belloteau-perigueux',
			name: 'Vincent Belloteau',
			city: 'Périgueux',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Belloteau.webp',
			charterType: 'image'
		},
		{
			id: 'sarah-hamza-reguig-paris11',
			name: 'Sarah Hamza Reguig',
			city: 'Paris 11e',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Charte Pause IA-Equinoxe.jpg',
			charterType: 'image'
		},
		{
			id: 'thomas-simon-grenoble',
			name: 'Thomas Simon',
			city: 'Grenoble',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Thomas_Simon.pdf',
			charterType: 'pdf'
		},
		{
			id: 'antoine-mikolajczak-paris5',
			name: 'Antoine Mikolajczak',
			city: 'Paris 5e',
			commitments: '10/14',
			charterFile: '/chartes-municipales-2026/Antoine_Mikolajczak.pdf',
			charterType: 'pdf'
		},
		{
			id: 'cecile-baudouin-brest',
			name: 'Cécile Baudouin',
			city: 'Brest',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Cecile_Baudouin.pdf',
			charterType: 'pdf'
		},
		{
			id: 'romain-laveau-angers',
			name: 'Romain Laveau',
			city: 'Angers',
			commitments: '9/14',
			engagements: [
				"mettre à disposition dans les bibliothèques 5 livres de référence sur l'IA",
				'adopter un vœu municipal appelant le gouvernement à une pause du développement des modèles les plus avancés',
				'signer et relayer publiquement une tribune nationale portée par Pause IA appelant à une pause',
				"publier une prise de position officielle du maire sur les risques de l'IA et la nécessité d'une pause",
				'interpeller les parlementaires via un courrier',
				'afficher le soutien de la commune sur les supports institutionnels',
				"relayer la démarche auprès des associations d'élu·es",
				'soutenir les associations locales sur les enjeux numériques et démocratiques',
				"encourager les établissements scolaires et préscolaires à aborder l'IA sous un angle critique"
			]
		}
	]

	interface PressArticle {
		source: string
		title: string
		url: string
		date?: string
	}

	const pressArticles: PressArticle[] = [
		{
			source: 'Le Dauphiné Libéré',
			title:
				"Isère / Grenoble : l'association Pause IA appelle les candidats à s'engager sur sa charte",
			url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte',
			date: '2026-03-06'
		},
		{
			source: "Place Gre'net",
			title:
				"Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l'intelligence artificielle",
			url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506',
			date: '2026-03-08'
		},
		{
			source: "L'Opinion",
			title: "Risques IA : l'association interpelle les candidats aux municipales de Toulouse",
			url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse',
			date: '2026-03-10'
		},
		{
			source: 'Presse Agence',
			title: "Nice : Jean-Marc Governatori s'engage sur la charte de Pause IA pour les municipales",
			url: 'https://presseagence.fr/nice-jean-marc-governatori-sengage-sur-la-charte-de-pause-ia-pour-les-municipales/',
			date: '2026-02-06'
		},
		{
			source: 'Contexte',
			title: "Pause IA s'incruste dans les municipales",
			url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-sincruste-dans-les-municipales_257807',
			date: '2026-03-11'
		},
		{
			source: 'ODS Radio',
			title: "Annecy : une association interpelle les candidats sur l'intelligence artificielle",
			url: 'https://www.odsradio.com/news/locales/108150/annecy-une-association-interpelle-les-candidats-sur-l-intelligence-artificielle',
			date: '2026-03-12'
		},
		{
			source: 'France Culture',
			title: 'Journal de 18h du vendredi 13 mars 2026 (15:30 – 17:22)',
			url: 'https://www.radiofrance.fr/franceculture/podcasts/journal-de-18h/journal-de-18h-emission-du-vendredi-13-mars-2026-9405796',
			date: '2026-03-13'
		},
		{
			source: 'Next',
			title: "Quand l'IA s'invite dans les municipales",
			url: 'https://next.ink/229085/quand-lia-sinvite-dans-les-municipales/',
			date: '2026-03-17'
		},
		{
			source: 'Presse Agence',
			title: 'Avignon : Clémence Peyrot : « Les candidats aux municipales doivent se positionner »',
			url: 'https://presseagence.fr/avignon-clemence-peyrot-les-candidats-aux-municipales-doivent-se-positionner/',
			date: '2026-03-13'
		},
		{
			source: 'Presse Agence',
			title:
				'Nice : Maxime Fournes : « Les candidats aux municipales doivent se positionner clairement »',
			url: 'https://presseagence.fr/nice-maxime-fournes-les-candidats-aux-municipales-doivent-se-positionner-clairement/',
			date: '2026-03-10'
		}
	].sort((a, b) => {
		if (!a.date && !b.date) return 0
		if (!a.date) return 1
		if (!b.date) return -1
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	})

	let showCharterModal = false
	let selectedCandidate: Candidate | null = null
	let showGeneralModal = false

	function openCandidate(candidate: Candidate) {
		selectedCandidate = candidate
		showCharterModal = true
	}

	// Seul un clic sur le fond ferme : un clic dans la boîte remonte jusqu'ici,
	// on le distingue par sa cible.
	function closeOnBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) closeModal()
	}

	function closeModal() {
		showCharterModal = false
		showGeneralModal = false
		selectedCandidate = null
	}

	function openActivoice() {
		void openActivoiceForm(
			'activoice-embed-1d572d9b_9638_4731_84c0_ce7fd867cccb',
			'1d572d9b-9638-4731-84c0-ce7fd867cccb'
		)
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	function getCommitmentLabel(c: string): string {
		if (c === '14/14') return isEn ? 'Full charter' : 'Charte complète'
		const num = parseInt(c.split('/')[0])
		return isEn ? `${num} of 14 commitments` : `${num}/14 engagements`
	}

	function getCommitmentClass(c: string): string {
		if (c === '14/14') return 'badge-full'
		const num = parseInt(c.split('/')[0])
		if (num >= 12) return 'badge-high'
		if (num >= 8) return 'badge-mid'
		return 'badge-low'
	}
</script>

<svelte:head>
	<script src="https://activoice.online/embed/activoice-12.0.0.js"></script>
</svelte:head>

<PostMeta {title} {description} />

<article>
	<!-- ── Hero ── -->
	<section class="hero">
		<p class="eyebrow">{isEn ? 'Campaign' : 'Campagne'}</p>
		<h1>{isEn ? 'Municipal elections 2026' : 'Élections municipales 2026'}</h1>
		<p class="intro">{description}</p>
	</section>

	<!-- ── 1. Agir : campagne en cours ── -->
	<section class="action-section">
		<div class="action-inner">
			<div class="action-text">
				{#if isEn}
					<h2>Act for your city</h2>
					<p>
						Challenge the candidates in your city and invite them to discover and sign the Pause AI
						charter on AI risks. All signatories are displayed below.
					</p>
				{:else}
					<h2>Agir pour votre ville</h2>
					<p>
						Interpellez les candidats de votre ville et invitez-les à découvrir et signer la charte
						de Pause IA sur les risques de l’IA. Les signataires sont affichés ci-dessous.
					</p>
				{/if}
				<div class="cta-container">
					<Button on:click={() => (showGeneralModal = true)}>
						{isEn ? 'Discover the charter' : 'Je découvre la charte'}
					</Button>
					<Button alt on:click={openActivoice}>
						{isEn ? 'Challenge my city candidates' : 'J’interpelle les candidats de ma ville'}
					</Button>
				</div>
			</div>
		</div>
		<activoice-embed id="activoice-embed-1d572d9b_9638_4731_84c0_ce7fd867cccb"></activoice-embed>
	</section>

	<!-- ── 2. Candidats signataires ── -->
	<section class="signatories-section">
		<div class="section-header">
			<h2>{isEn ? 'Committed candidates' : 'Les candidat·es engagé·es'}</h2>
			<Badge>{candidates.length} {isEn ? 'signatories' : 'signataires'}</Badge>
		</div>
		<p class="section-intro">
			{#if isEn}
				These candidates have signed the Pause AI charter on the risks of artificial intelligence.
				Click on a card to view their signed charter.
			{:else}
				Ces candidat·es ont signé la charte de Pause IA sur les risques de l’intelligence
				artificielle. Cliquez sur une carte pour consulter leur charte signée.
			{/if}
		</p>

		<div class="candidates-grid">
			{#each candidates as candidate}
				<button
					class="candidate-card"
					on:click={() => {
						openCandidate(candidate)
					}}
				>
					<div class="card-top">
						<div class="candidate-info">
							<span class="candidate-name">{candidate.name}</span>
							<span class="candidate-city">
								<svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true">
									<path
										d="M5.5 0C2.46 0 0 2.46 0 5.5c0 3.85 5.5 8.5 5.5 8.5S11 9.35 11 5.5C11 2.46 8.54 0 5.5 0zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
										fill="currentColor"
									/>
								</svg>
								{candidate.city}
							</span>
						</div>
						<span class="commitment-badge {getCommitmentClass(candidate.commitments)}">
							{getCommitmentLabel(candidate.commitments)}
						</span>
					</div>
					<span class="view-charter">
						{candidate.engagements
							? isEn
								? 'View commitments'
								: 'Voir les engagements'
							: isEn
								? 'View charter'
								: 'Voir la charte'}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path
								d="M5 12h14M13 6l6 6-6 6"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</button>
			{/each}
		</div>
	</section>

	<!-- ── 3. Revue de presse ── -->
	{#if pressArticles.length > 0}
		<section class="press-section">
			<div class="section-header">
				<h2>{isEn ? 'Campaign press review' : 'Revue de presse de la campagne'}</h2>
				<Badge>{pressArticles.length} articles</Badge>
			</div>
			<div class="press-list">
				{#each pressArticles as article}
					<a class="press-card" href={article.url} target="_blank" rel="noopener noreferrer">
						<div class="press-meta">
							<span class="press-source">{article.source}</span>
							{#if article.date}
								<time class="press-date" datetime={article.date}>{formatDate(article.date)}</time>
							{/if}
						</div>
						<span class="press-title">{article.title}</span>
						<span class="press-link-icon" aria-hidden="true">↗</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</article>

<!-- Modal : Charte d’un candidat -->
{#if showCharterModal && selectedCandidate}
	<div class="modal-overlay" role="presentation" on:click={closeOnBackdrop}>
		<div
			class="modal-content"
			role="dialog"
			aria-modal="true"
			aria-label={isEn
				? `Charter signed by ${selectedCandidate.name}`
				: `Charte de ${selectedCandidate.name}`}
		>
			<div class="modal-header">
				<div class="modal-title">
					<strong>{selectedCandidate.name}</strong>
					<span class="modal-city">{selectedCandidate.city}</span>
					<span
						class="commitment-badge modal-badge {getCommitmentClass(selectedCandidate.commitments)}"
					>
						{getCommitmentLabel(selectedCandidate.commitments)}
					</span>
				</div>
				<button class="close-button" on:click={closeModal} aria-label={isEn ? 'Close' : 'Fermer'}>
					&times;
				</button>
			</div>
			{#if selectedCandidate.engagements}
				<div class="charter-engagements">
					<p class="engagements-intro">
						{isEn
							? `${selectedCandidate.name} commits, once elected, to carry out the following actions:`
							: `${selectedCandidate.name} s’engage, une fois élu·e, à réaliser les actions suivantes :`}
					</p>
					<ul class="engagements-list">
						{#each selectedCandidate.engagements as engagement}
							<li>{engagement}</li>
						{/each}
					</ul>
				</div>
			{:else if selectedCandidate.charterType === 'pdf'}
				<iframe
					src={selectedCandidate.charterFile}
					title={isEn
						? `Charter signed by ${selectedCandidate.name}`
						: `Charte signée par ${selectedCandidate.name}`}
					class="charter-iframe"
				></iframe>
			{:else}
				<div class="charter-img-wrapper">
					<img
						src={selectedCandidate.charterFile}
						alt={isEn
							? `Charter signed by ${selectedCandidate.name}`
							: `Charte signée par ${selectedCandidate.name}`}
						class="charter-img"
					/>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- Modal : Charte générale -->
{#if showGeneralModal}
	<div class="modal-overlay" role="presentation" on:click={closeOnBackdrop}>
		<div
			class="modal-content modal-content--img"
			role="dialog"
			aria-modal="true"
			aria-label={isEn ? 'Pause AI Charter' : 'Charte Pause IA'}
		>
			<button
				class="close-button close-button--top"
				on:click={closeModal}
				aria-label={isEn ? 'Close' : 'Fermer'}
			>
				&times;
			</button>
			<img
				src="/charte-municipales-2026.png"
				alt={isEn
					? 'The Pause AI charter for municipal elections'
					: 'La charte Pause IA pour les municipales'}
			/>
		</div>
	</div>
{/if}

<style>
	/* Étiquette et titre du modèle, à la place du titre au filet dégradé. */
	.eyebrow {
		display: inline-block;
		margin: 0 0 1rem;
		padding: 0.3rem 0.7rem;
		border-radius: 3px;
		background: var(--brand);
		color: var(--on-brand);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	h1 {
		font-size: clamp(2.1rem, 6vw, 3.2rem);
		line-height: 1.06;
		letter-spacing: -0.025em;
		margin-bottom: 1.25rem;
	}

	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem 4rem;
	}

	/* ── Hero ── */
	.hero {
		margin-bottom: 3rem;
	}

	.intro {
		font-size: 1.2rem;
		line-height: 1.7;
		color: var(--text-muted);
		max-width: var(--width-content);
	}

	/* ── Section header pattern ── */
	.section-header {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		margin-bottom: 0.75rem;
	}

	.section-header h2 {
		margin: 0;
		font-size: 1.75rem;
		color: var(--text);
	}

	.section-intro {
		font-size: 1rem;
		line-height: 1.65;
		color: var(--text-muted);
		margin: 0 0 1.75rem;
		max-width: var(--width-content);
	}

	h2 {
		font-size: 1.75rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text);
	}

	/* ── 1. Action section ── */
	.action-section {
		background: var(--bg-card);
		border: 1px solid rgba(var(--brand-rgb), 0.25);
		border-radius: var(--radius-lg);
		padding: 2.5rem 2.5rem 2rem;
		margin-bottom: 4rem;
		box-shadow: 0 2px 16px rgba(var(--brand-rgb), 0.08);
	}

	.action-inner h2 {
		font-size: 1.6rem;
		margin-bottom: 0.75rem;
	}

	.action-inner p {
		font-size: 1.05rem;
		line-height: 1.65;
		color: var(--text-muted);
		margin: 0 0 1.75rem;
		max-width: var(--width-text);
	}

	.cta-container {
		display: flex;
		gap: 0.875rem;
		flex-wrap: wrap;
	}

	/* ── 2. Signatories ── */
	.signatories-section {
		margin-bottom: 4rem;
	}

	.candidates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 1rem;
	}

	.candidate-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.25rem 1.375rem;
		background: var(--bg-card);
		border: 1.5px solid var(--border);
		border-left: 4px solid var(--brand);
		border-radius: var(--radius-md);
		cursor: pointer;
		text-align: left;
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			border-color 0.18s ease;
		font-family: var(--font-body);
	}

	.candidate-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 28px rgba(var(--ink-rgb), 0.1);
		border-color: var(--brand);
		border-left-color: var(--accent);
	}

	.card-top {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.candidate-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.candidate-name {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text);
		line-height: 1.3;
	}

	.candidate-city {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.commitment-badge {
		display: inline-block;
		padding: 0.18rem 0.55rem;
		border-radius: var(--radius-pill);
		font-size: 0.72rem;
		font-weight: 700;
		width: fit-content;
		letter-spacing: 0.01em;
	}

	/* Pastilles d'engagement : quatre teintes distinctes, mélangées au fond
	   de la carte pour rester lisibles en clair comme en sombre. */
	.badge-full {
		--badge-hue: var(--hue-green);
	}

	.badge-high {
		--badge-hue: var(--hue-blue);
	}

	.badge-mid {
		--badge-hue: var(--hue-amber);
	}

	.badge-low {
		--badge-hue: var(--hue-pink);
	}

	.commitment-badge {
		background: color-mix(in srgb, var(--badge-hue) 16%, var(--bg-card));
		color: color-mix(in srgb, var(--badge-hue) 45%, var(--text));
	}

	.view-charter {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--accent);
		margin-top: auto;
	}

	/* ── 3. Press section ── */
	.press-section {
		margin-bottom: 2rem;
	}

	.press-list {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.press-card {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1.25rem;
		padding: 1rem 1.25rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--text);
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			border-color 0.18s ease;
	}

	.press-card:hover {
		transform: translateX(3px);
		box-shadow: 0 4px 16px rgba(var(--ink-rgb), 0.08);
		border-color: var(--brand);
		color: var(--text);
	}

	.press-meta {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 9rem;
	}

	.press-source {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--accent);
		white-space: nowrap;
	}

	.press-date {
		font-size: 0.78rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.press-title {
		font-size: 0.925rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text);
	}

	.press-link-icon {
		font-size: 1.1rem;
		color: var(--text-secondary);
		flex-shrink: 0;
		transition: color 0.18s;
	}

	.press-card:hover .press-link-icon {
		color: var(--accent);
	}

	/* ── Modal ── */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(var(--ink-rgb), 0.75);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000;
		cursor: pointer;
		padding: 1.5rem;
		backdrop-filter: blur(3px);
	}

	.modal-content {
		position: relative;
		width: min(92vw, 58rem);
		height: 90vh;
		max-height: 90vh;
		background: var(--bg-card);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(var(--ink-rgb), 0.4);
		cursor: default;
		display: flex;
		flex-direction: column;
	}

	.modal-content--img {
		width: auto;
		height: auto;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.875rem 1.25rem;
		border-bottom: 1px solid var(--border);
		background: var(--bg-secondary);
		flex-shrink: 0;
	}

	.modal-title {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.375rem;
		font-size: 0.9rem;
	}

	.modal-city {
		color: var(--text-secondary);
	}

	.modal-badge {
		font-size: 0.7rem;
	}

	.close-button {
		background: transparent;
		color: var(--text-2);
		border: 1px solid var(--border);
		border-radius: 50%;
		width: 2rem;
		height: 2rem;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.close-button:hover {
		background: var(--text);
		color: var(--bg);
		border-color: var(--text);
	}

	.close-button--top {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(var(--ink-rgb), 0.5);
		color: var(--on-dark);
		border: none;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.5rem;
		z-index: 10;
	}

	.close-button--top:hover {
		background: rgba(var(--ink-rgb), 0.85);
		color: var(--on-dark);
	}

	.charter-engagements {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 1.5rem 2rem;
	}

	.engagements-intro {
		font-size: 0.95rem;
		color: var(--text-secondary);
		margin-bottom: 1.25rem;
		font-style: italic;
	}

	.engagements-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.engagements-list li {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		font-size: 0.975rem;
		line-height: 1.55;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary);
		border-left: 3px solid var(--brand);
		border-radius: 0 6px 6px 0;
	}

	.engagements-list li::before {
		content: '✓';
		color: var(--accent);
		font-weight: 700;
		flex-shrink: 0;
		margin-top: 0.05em;
	}

	.charter-iframe {
		width: 100%;
		flex: 1;
		min-height: 0;
		border: none;
	}

	.charter-img-wrapper {
		flex: 1;
		min-height: 0;
		overflow: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary);
		padding: 1rem;
	}

	.charter-img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 4px;
	}

	.modal-content > img {
		display: block;
		max-width: 100%;
		max-height: calc(90vh - 2rem);
		object-fit: contain;
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		article {
			padding: 0 1rem 3rem;
		}

		.section-header h2,
		h2 {
			font-size: 1.3rem;
		}

		.intro {
			font-size: 1rem;
		}

		.action-section {
			padding: 1.5rem 1.25rem 1.5rem;
			border-radius: var(--radius-lg);
			margin-bottom: 2.5rem;
		}

		.action-inner h2 {
			font-size: 1.3rem;
		}

		.action-inner p {
			font-size: 0.95rem;
			margin-bottom: 1.25rem;
		}

		.cta-container {
			flex-direction: column;
			align-items: stretch;
		}

		/* Make buttons fill the full width on mobile */
		.cta-container :global(a),
		.cta-container :global(button) {
			width: 100%;
			max-width: 100%;
			text-align: center;
			justify-content: center;
		}

		.candidates-grid {
			grid-template-columns: 1fr;
		}

		.signatories-section {
			margin-bottom: 2.5rem;
		}

		/* Press: stack vertically on mobile */
		.press-card {
			display: flex;
			flex-direction: column;
			gap: 0.375rem;
			padding: 0.875rem 1rem;
		}

		.press-meta {
			flex-direction: row;
			align-items: center;
			gap: 0.75rem;
			min-width: unset;
		}

		.press-link-icon {
			align-self: flex-end;
		}
	}
</style>
