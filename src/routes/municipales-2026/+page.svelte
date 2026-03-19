<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'

	const title = 'Élections municipales 2026'
	const description =
		"Les élections municipales de mars 2026 représentent une opportunité majeure de sensibilisation au niveau local. À cette occasion, Pause IA appelle les candidats à s'engager concrètement en signant notre charte."

	interface Candidate {
		id: string
		name: string
		city: string
		commitments: string
		charterFile: string
		charterType: 'image' | 'pdf'
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

	function closeModal() {
		showCharterModal = false
		showGeneralModal = false
		selectedCandidate = null
	}

	function openActivoice() {
		const embedEl = document.getElementById(
			'activoice-embed-1d572d9b_9638_4731_84c0_ce7fd867cccb'
		) as any
		if ((window as any).Activoice) {
			;(window as any).Activoice.bootstrap().then(() => {
				embedEl?.openWithId('1d572d9b-9638-4731-84c0-ce7fd867cccb')
			})
		}
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
	}

	function getCommitmentLabel(c: string): string {
		if (c === '14/14') return 'Charte complète'
		const num = parseInt(c.split('/')[0])
		return `${num}/14 engagements`
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
		<UnderlinedTitle as="h1">Élections municipales 2026</UnderlinedTitle>
		<p class="intro">{description}</p>
	</section>

	<!-- ── 1. Agir ── -->
	<section class="action-section">
		<div class="action-inner">
			<h2>Agir pour votre ville</h2>
			<p>
				Interpellez les candidats de votre ville et invitez-les à découvrir et signer la charte de
				Pause IA sur les risques de l'IA. Les signataires sont affichés ci-dessous.
			</p>
			<div class="cta-container">
				<Button on:click={() => (showGeneralModal = true)}>Je découvre la charte</Button>
				<Button alt on:click={openActivoice}>J'interpelle les candidats de ma ville</Button>
			</div>
		</div>
		<activoice-embed id="activoice-embed-1d572d9b_9638_4731_84c0_ce7fd867cccb" />
	</section>

	<!-- ── 2. Candidats signataires ── -->
	<section class="signatories-section">
		<div class="section-header">
			<h2>Les candidat·es engagé·es</h2>
			<span class="count-pill">{candidates.length} signataires</span>
		</div>
		<p class="section-intro">
			Ces candidat·es ont signé la charte de Pause IA sur les risques de l'intelligence
			artificielle. Cliquez sur une carte pour consulter leur charte signée.
		</p>

		<div class="candidates-grid">
			{#each candidates as candidate}
				<button class="candidate-card" on:click={() => openCandidate(candidate)}>
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
						Voir la charte
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
				<h2>Revue de presse de la campagne</h2>
				<span class="count-pill">{pressArticles.length} articles</span>
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

<!-- Modal : Charte d'un candidat -->
{#if showCharterModal && selectedCandidate}
	<button class="modal-overlay" aria-label="Fermer" on:click={closeModal}></button>
	<div
		class="modal-content"
		role="dialog"
		aria-modal="true"
		aria-label="Charte de {selectedCandidate.name}"
	>
		<div class="modal-header">
			<div class="modal-title">
				<strong>{selectedCandidate.name}</strong>
				<span class="modal-city">— {selectedCandidate.city}</span>
				<span
					class="commitment-badge modal-badge {getCommitmentClass(selectedCandidate.commitments)}"
				>
					{getCommitmentLabel(selectedCandidate.commitments)}
				</span>
			</div>
			<button class="close-button" on:click={closeModal} aria-label="Fermer">&times;</button>
		</div>
		{#if selectedCandidate.charterType === 'pdf'}
			<iframe
				src={selectedCandidate.charterFile}
				title="Charte signée par {selectedCandidate.name}"
				class="charter-iframe"
			></iframe>
		{:else}
			<div class="charter-img-wrapper">
				<img
					src={selectedCandidate.charterFile}
					alt="Charte signée par {selectedCandidate.name}"
					class="charter-img"
				/>
			</div>
		{/if}
	</div>
{/if}

<!-- Modal : Charte générale -->
{#if showGeneralModal}
	<button class="modal-overlay" aria-label="Fermer" on:click={closeModal}></button>
	<div
		class="modal-content modal-content--img"
		role="dialog"
		aria-modal="true"
		aria-label="Charte Pause IA"
	>
		<button class="close-button close-button--top" on:click={closeModal} aria-label="Fermer">
			&times;
		</button>
		<img src="/charte-municipales-2026.png" alt="La charte Pause IA pour les municipales" />
	</div>
{/if}

<style>
	article {
		max-inline-size: 62rem;
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
		color: var(--text-muted, #555);
		max-width: 52rem;
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
		color: var(--text-heading, #111);
	}

	.count-pill {
		background: var(--brand, #ff9416);
		color: #fff;
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.section-intro {
		font-size: 1rem;
		line-height: 1.65;
		color: var(--text-muted, #555);
		margin: 0 0 1.75rem;
		max-width: 52rem;
	}

	h2 {
		font-size: 1.75rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text-heading, #111);
	}

	/* ── 1. Action section ── */
	.action-section {
		background: linear-gradient(135deg, #fff8f0 0%, #fff3e0 100%);
		border: 1px solid rgba(255, 148, 22, 0.25);
		border-radius: 20px;
		padding: 2.5rem 2.5rem 2rem;
		margin-bottom: 4rem;
		box-shadow: 0 2px 16px rgba(255, 148, 22, 0.08);
	}

	.action-inner h2 {
		font-size: 1.6rem;
		margin-bottom: 0.75rem;
	}

	.action-inner p {
		font-size: 1.05rem;
		line-height: 1.65;
		color: var(--text-muted, #555);
		margin: 0 0 1.75rem;
		max-width: 48rem;
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
		background: #fff;
		border: 1.5px solid #e8e8e8;
		border-left: 4px solid var(--brand, #ff9416);
		border-radius: 10px;
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
		box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
		border-color: var(--brand, #ff9416);
		border-left-color: var(--brand, #ff9416);
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
		color: var(--text-heading, #111);
		line-height: 1.3;
	}

	.candidate-city {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.85rem;
		color: var(--text-secondary, #777);
	}

	.commitment-badge {
		display: inline-block;
		padding: 0.18rem 0.55rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		width: fit-content;
		letter-spacing: 0.01em;
	}

	.badge-full {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-high {
		background: #dbeafe;
		color: #1e40af;
	}

	.badge-mid {
		background: #fef9c3;
		color: #854d0e;
	}

	.badge-low {
		background: #fce7f3;
		color: #831843;
	}

	.view-charter {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--brand, #ff9416);
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
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 10px;
		text-decoration: none;
		color: var(--text-heading, #111);
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			border-color 0.18s ease;
	}

	.press-card:hover {
		transform: translateX(3px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		border-color: var(--brand, #ff9416);
		color: var(--text-heading, #111);
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
		color: var(--brand, #ff9416);
		white-space: nowrap;
	}

	.press-date {
		font-size: 0.78rem;
		color: var(--text-secondary, #888);
		white-space: nowrap;
	}

	.press-title {
		font-size: 0.925rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-heading, #111);
	}

	.press-link-icon {
		font-size: 1.1rem;
		color: var(--text-secondary, #aaa);
		flex-shrink: 0;
		transition: color 0.18s;
	}

	.press-card:hover .press-link-icon {
		color: var(--brand, #ff9416);
	}

	/* ── Modal ── */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		z-index: 2000;
		cursor: pointer;
		border: none;
		padding: 0;
		backdrop-filter: blur(3px);
	}

	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(92vw, 58rem);
		height: 90vh;
		max-height: 90vh;
		background: #fff;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		z-index: 2001;
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
		border-bottom: 1px solid #eee;
		background: #fafafa;
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
		color: var(--text-secondary, #777);
	}

	.modal-badge {
		font-size: 0.7rem;
	}

	.close-button {
		background: transparent;
		color: #555;
		border: 1px solid #ddd;
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
		background: #111;
		color: #fff;
		border-color: #111;
	}

	.close-button--top {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.5rem;
		z-index: 10;
	}

	.close-button--top:hover {
		background: rgba(0, 0, 0, 0.85);
		color: white;
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
		background: #f5f5f5;
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
			border-radius: 14px;
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
