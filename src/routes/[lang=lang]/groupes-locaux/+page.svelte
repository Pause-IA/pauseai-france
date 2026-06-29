<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import LocalGroupsMap from '$components/LocalGroupsMap.svelte'
	import {
		MessageSquare,
		PlusCircle,
		MapPin,
		Megaphone,
		Newspaper,
		Users,
		CalendarDays,
		Mic,
		Lightbulb,
		Radio,
		Landmark,
		FileText,
		Clock,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte'
	import type { ComponentType } from 'svelte'
	import { localGroups, activeGroupsCount, formingGroupsCount } from '$lib/data/local-groups'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: isEn = lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	// Villes triées : groupes actifs d'abord, puis ceux en création.
	$: sortedGroups = [...localGroups].sort(
		(a, b) => Number(!!a.forming) - Number(!!b.forming) || a.name.localeCompare(b.name)
	)

	// ── Agenda des actions (depuis Notion, via /api/events, non prérendu) ──
	interface LocalEvent {
		id: string
		title: string
		date: string
		city: string
		type: string
		url: string
		time: string
		place: string
		description: string
		images: string[]
		featured: boolean
		volunteers: number
	}

	// Compression à la volée via le CDN d'images de Netlify : on demande l'image
	// redimensionnée et recompressée (au lieu de la photo Notion brute, souvent
	// lourde). En local (URL relative) ou si le CDN échoue, on retombe sur l'URL
	// d'origine via `on:error` → aucune régression.
	function cdnImg(url: string, w: number, fit?: 'cover'): string {
		if (!url || !/^https?:\/\//.test(url)) return url
		return `/.netlify/images?url=${encodeURIComponent(url)}&w=${w}&q=72${fit ? `&fit=${fit}` : ''}`
	}
	function cdnFallback(e: Event) {
		const img = e.currentTarget as HTMLImageElement
		if (img.dataset.raw && img.src !== img.dataset.raw) img.src = img.dataset.raw
	}

	// Carrousel des photos pour les actions « à la une » (index par action).
	let galleryIdx: Record<string, number> = {}
	function galStep(id: string, len: number, dir: number) {
		const cur = galleryIdx[id] ?? 0
		galleryIdx = { ...galleryIdx, [id]: (cur + dir + len) % len }
	}

	// Icône selon le type d'action, pour un repérage visuel rapide.
	function typeIcon(t: string): ComponentType {
		const k = (t || '').toLowerCase()
		if (k.includes('manif')) return Megaphone
		if (k.includes('tract')) return FileText
		if (k.includes('conf')) return Mic
		if (k.includes('atelier') || k.includes('fresque')) return Lightbulb
		if (k.includes('média') || k.includes('media') || k.includes('radio') || k.includes('presse'))
			return Radio
		if (k.includes('plaidoyer') || k.includes('élu') || k.includes('elu')) return Landmark
		return CalendarDays
	}
	let events: LocalEvent[] = []
	onMount(async () => {
		try {
			const res = await fetch('/api/events')
			if (res.ok) events = await res.json()
		} catch {
			/* agenda indisponible : la page reste fonctionnelle */
		}
	})

	const startOfToday = new Date()
	startOfToday.setHours(0, 0, 0, 0)
	$: upcoming = events.filter((e) => new Date(e.date) >= startOfToday)
	// Actions passées : les plus récentes d'abord.
	$: pastAll = events
		.filter((e) => new Date(e.date) < startOfToday)
		.slice()
		.reverse()
	// Les actions « à la une » sont mises en avant (grandes, avec galerie) ;
	// les autres vont dans la grille compacte (6 visibles + bouton « tout voir »).
	$: pastFeatured = pastAll.filter((e) => e.featured)
	$: pastNormal = pastAll.filter((e) => !e.featured)
	// Total de bénévoles mobilisés (sur les actions qui renseignent ce nombre).
	$: totalVolunteers = pastAll.reduce((sum, e) => sum + (e.volunteers || 0), 0)
	const PAST_PREVIEW = 6
	let showAllPast = false
	$: pastNormalShown = showAllPast ? pastNormal : pastNormal.slice(0, PAST_PREVIEW)

	function fmtDate(d: string): string {
		const dt = new Date(d)
		if (Number.isNaN(dt.getTime())) return d
		return dt.toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	function eventMeta(e: LocalEvent): string {
		return [e.city, e.type].filter(Boolean).join(' · ')
	}

	$: title = isEn ? 'Local groups | Pause AI' : 'Groupes locaux | Pause IA'
	$: description = isEn
		? 'Find a local Pause AI group near you or create one to take concrete action for a pause on artificial intelligence.'
		: "Trouvez un groupe local Pause IA près de chez vous ou créez-en un pour agir concrètement en faveur d'une pause sur l'intelligence artificielle."
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">{isEn ? 'Local groups' : 'Groupes locaux'}</UnderlinedTitle>
		<p class="hero-description">
			{#if isEn}
				Local action is essential for raising public awareness, engaging elected officials and
				building a strong citizen movement. Join a team near you or start the momentum in your city.
			{:else}
				L'action locale est essentielle pour sensibiliser le public, interpeller les élus et
				construire un mouvement citoyen fort. Rejoignez une équipe près de chez vous ou lancez la
				dynamique dans votre ville.
			{/if}
		</p>
	</section>

	<section class="impact-section">
		<div class="impact-card">
			<Megaphone size="1.6rem" />
			<h3>{isEn ? 'Demonstrations & gatherings' : 'Manifestations & rassemblements'}</h3>
			<p>
				{isEn
					? 'Carry the message into the street, in several cities at once, to make the risks of AI visible.'
					: "Porter le message dans la rue, dans plusieurs villes à la fois, pour rendre visibles les risques de l'IA."}
			</p>
		</div>
		<div class="impact-card">
			<Users size="1.6rem" />
			<h3>{isEn ? 'Leafleting & outreach' : 'Tractage & sensibilisation'}</h3>
			<p>
				{isEn
					? 'Meet the public, hand out leaflets and start conversations to grow awareness on the ground.'
					: 'Aller à la rencontre du public, distribuer des tracts et engager la discussion pour sensibiliser sur le terrain.'}
			</p>
		</div>
		<div class="impact-card">
			<Newspaper size="1.6rem" />
			<h3>{isEn ? 'Press coverage' : 'Retombées presse'}</h3>
			<p>
				{#if isEn}
					These actions draw local media and give the movement real visibility. <a
						href="{prefix}/presse">See the press coverage</a
					>.
				{:else}
					Ces actions attirent les médias locaux et donnent de la visibilité au mouvement. <a
						href="{prefix}/presse">Voir la revue de presse</a
					>.
				{/if}
			</p>
		</div>
	</section>

	{#if upcoming.length}
		<section class="agenda-section">
			<div class="section-title-row">
				<CalendarDays size="1.2em" class="section-icon" />
				<h2>{isEn ? 'Upcoming actions' : 'Prochaines actions'}</h2>
			</div>
			<ul class="event-list">
				{#each upcoming as e (e.id)}
					<li class="event-card">
						<div class="event-date">
							{fmtDate(e.date)}{#if e.time}<span class="event-time">
									<Clock size="0.85em" />{e.time}</span
								>{/if}
						</div>
						<div class="event-body">
							<strong>{e.title}</strong>
							{#if eventMeta(e) || e.place}
								<small>
									<svelte:component this={typeIcon(e.type)} size="0.9em" />
									{[e.city, e.type, e.place].filter(Boolean).join(' · ')}
								</small>
							{/if}
							{#if e.description}<p>{e.description}</p>{/if}
						</div>
						{#if e.url}
							<a
								class="event-cta"
								href={e.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${isEn ? 'Take part' : 'Participer'} : ${e.title}`}
							>
								{isEn ? 'Take part' : 'Participer'}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="cta-section">
		<div class="cta-card join">
			<span class="cta-icon"><MessageSquare size="1.6rem" /></span>
			<h2>{isEn ? 'Join a group' : 'Rejoindre un groupe'}</h2>
			<p>
				{#if isEn}
					Fill in the registration form to contribute concretely to Pause AI's local action by
					participating in collective awareness and citizen mobilization actions, and by nurturing
					an engaged community around the challenges linked to artificial intelligence.
				{:else}
					Remplissez le formulaire d'inscription pour contribuer concrètement à l'action de Pause IA
					au niveau local, en participant à des actions collectives de sensibilisation et de
					mobilisation citoyenne, et en faisant vivre une communauté engagée autour des enjeux liés
					à l'intelligence artificielle.
				{/if}
			</p>
			<Button href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac">
				{isEn ? 'Sign up' : "S'inscrire"}
			</Button>
		</div>

		<div class="cta-card create">
			<span class="cta-icon"><PlusCircle size="1.6rem" /></span>
			<h2>{isEn ? 'Start a group' : 'Lancer un groupe'}</h2>
			<p>
				{#if isEn}
					Help Pause AI grow locally by leading a community of engaged volunteers, coordinating
					awareness and mobilization actions, and ensuring the link between the field and the
					national team.
				{:else}
					Faites vivre et grandir Pause IA localement en animant une communauté de bénévoles
					engagés, en coordonnant des actions de sensibilisation et de mobilisation, et en assurant
					le lien entre le terrain et l'équipe nationale.
				{/if}
			</p>
			<Button alt href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac">
				{isEn ? 'Create a group' : 'Créer un groupe'}
			</Button>
		</div>
	</section>

	<section class="map-section">
		<div class="map-header">
			<div class="map-title-row">
				<MapPin size="1.2em" class="map-pin-icon" />
				<h2>{isEn ? 'Our local groups' : 'Nos groupes locaux'}</h2>
			</div>
			<div class="map-meta">
				<span class="map-stat">
					{activeGroupsCount}
					{isEn
						? activeGroupsCount === 1
							? 'active group'
							: 'active groups'
						: activeGroupsCount === 1
							? 'groupe actif'
							: 'groupes actifs'}
				</span>
				{#if formingGroupsCount > 0}
					<span class="map-sep">·</span>
					<span class="map-stat forming">
						{formingGroupsCount}
						{isEn ? 'forming' : 'en cours de création'}
					</span>
				{/if}
				<span class="map-sep">·</span>
				<span class="map-hint"
					>{isEn
						? 'hover a marker to see the city'
						: 'survolez un marqueur pour voir la ville'}</span
				>
			</div>
		</div>
		<LocalGroupsMap />

		<ul class="city-list" aria-label={isEn ? 'Cities with a group' : 'Villes avec un groupe'}>
			{#each sortedGroups as group}
				<li class="city-chip" class:forming={group.forming}>
					{group.name}
					{#if group.forming}<span class="city-tag">{isEn ? 'forming' : 'en création'}</span>{/if}
				</li>
			{/each}
		</ul>
	</section>

	{#if pastAll.length}
		<section class="past-section">
			<div class="stats-band">
				<div class="stat">
					<span class="stat-num">{activeGroupsCount}</span>
					<span class="stat-label">{isEn ? 'active groups' : 'groupes actifs'}</span>
				</div>
				<div class="stat">
					<span class="stat-num">{pastAll.length}</span>
					<span class="stat-label">{isEn ? 'actions carried out' : 'actions menées'}</span>
				</div>
				{#if totalVolunteers > 0}
					<div class="stat">
						<span class="stat-num">{totalVolunteers}+</span>
						<span class="stat-label">{isEn ? 'volunteers mobilised' : 'bénévoles mobilisés'}</span>
					</div>
				{/if}
			</div>

			<div class="section-title-row">
				<Megaphone size="1.2em" class="section-icon" />
				<h2>{isEn ? 'Recent actions' : 'Actions passées'}</h2>
			</div>

			<!-- Actions « à la une » : grandes cartes, orientation alternée -->
			{#each pastFeatured as e, i (e.id)}
				{@const gi = galleryIdx[e.id] ?? 0}
				<article class="feature-card" class:reverse={i % 2 === 1}>
					{#if e.images.length}
						<div class="feature-media">
							<div class="feature-main">
								<div
									class="feature-main-bg"
									style="background-image:url('{cdnImg(e.images[gi], 48)}')"
								></div>
								<img
									src={cdnImg(e.images[gi], 1100)}
									data-raw={e.images[gi]}
									on:error={cdnFallback}
									alt=""
									loading="lazy"
									decoding="async"
								/>
								{#if e.images.length > 1}
									<button
										class="gallery-nav prev"
										on:click={() => galStep(e.id, e.images.length, -1)}
										aria-label={isEn ? 'Previous photo' : 'Photo précédente'}
									>
										<ChevronLeft size="1.2em" />
									</button>
									<button
										class="gallery-nav next"
										on:click={() => galStep(e.id, e.images.length, 1)}
										aria-label={isEn ? 'Next photo' : 'Photo suivante'}
									>
										<ChevronRight size="1.2em" />
									</button>
									<span class="gallery-counter">{gi + 1}/{e.images.length}</span>
								{/if}
							</div>
							{#if e.images.length > 1}
								<div class="feature-thumbs">
									{#each e.images.slice(0, 5) as src, idx}
										<button
											class="feature-thumb"
											class:active={idx === gi}
											on:click={() => (galleryIdx = { ...galleryIdx, [e.id]: idx })}
											aria-label={`${isEn ? 'Photo' : 'Photo'} ${idx + 1}`}
										>
											<img
												src={cdnImg(src, 240, 'cover')}
												data-raw={src}
												on:error={cdnFallback}
												alt=""
												loading="lazy"
												decoding="async"
											/>
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
					<div class="feature-body">
						<span class="feature-meta">
							{#if e.type}
								<span class="feature-tag">
									<svelte:component this={typeIcon(e.type)} size="0.8em" />
									{e.type}
								</span>
							{/if}
							{fmtDate(e.date)}{e.city ? ` · ${e.city}` : ''}
						</span>
						<h3>{e.title}</h3>
						{#if e.volunteers > 0}
							<span class="volunteers">
								<Users size="0.95em" />
								{e.volunteers}
								{isEn ? (e.volunteers > 1 ? 'volunteers' : 'volunteer') : 'bénévoles'}
							</span>
						{/if}
						{#if e.description}<p>{e.description}</p>{/if}
						{#if e.url}
							<a
								class="feature-link"
								href={e.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${isEn ? 'Read more' : 'En savoir plus'} : ${e.title}`}
							>
								{isEn ? 'Read more ↗' : 'En savoir plus ↗'}
							</a>
						{/if}
					</div>
				</article>
			{/each}

			<!-- Autres actions : grille de cartes -->
			{#if pastNormal.length}
				<ul class="past-grid">
					{#each pastNormalShown as e (e.id)}
						<li class="past-card">
							<div class="past-card-media">
								{#if e.images.length}
									<div
										class="past-card-bg"
										style="background-image:url('{cdnImg(e.images[0], 48)}')"
									></div>
									<img
										src={cdnImg(e.images[0], 600)}
										data-raw={e.images[0]}
										on:error={cdnFallback}
										alt=""
										loading="lazy"
										decoding="async"
									/>
								{:else}
									<div class="past-card-noimg"><Megaphone size="1.7rem" /></div>
								{/if}
								{#if e.type}
									<span class="past-card-tag">
										<svelte:component this={typeIcon(e.type)} size="0.78em" />
										{e.type}
									</span>
								{/if}
							</div>
							<div class="past-card-body">
								<span class="past-card-meta">{fmtDate(e.date)}{e.city ? ` · ${e.city}` : ''}</span>
								<strong class="past-card-title">{e.title}</strong>
								<div class="past-card-foot">
									{#if e.volunteers > 0}
										<span class="past-card-vol">
											<Users size="0.85em" />
											{e.volunteers}
										</span>
									{/if}
									{#if e.url}
										<a
											class="past-card-link"
											href={e.url}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`${isEn ? 'Read more' : 'En savoir plus'} : ${e.title}`}
										>
											{isEn ? 'Read more ↗' : 'En savoir plus ↗'}
										</a>
									{/if}
								</div>
							</div>
						</li>
					{/each}
				</ul>
				{#if pastNormal.length > PAST_PREVIEW}
					<button class="show-all-btn" on:click={() => (showAllPast = !showAllPast)}>
						{#if showAllPast}
							{isEn ? 'Show less' : 'Voir moins'}
						{:else}
							{isEn
								? `See all actions (${pastNormal.length})`
								: `Voir toutes les actions (${pastNormal.length})`}
						{/if}
					</button>
				{/if}
			{/if}
		</section>
	{/if}
</article>

<style>
	article {
		max-inline-size: 62rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	/* ── Hero ─────────────────────────────────────────────────────────── */

	.hero {
		text-align: left;
		margin-bottom: 3rem;
	}

	.hero-description {
		font-size: 1.2rem;
		color: var(--text-muted);
		line-height: 1.65;
		max-inline-size: 48rem;
	}

	.stats-band {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem 3.5rem;
		justify-content: center;
		padding: 1.5rem 1.75rem;
		margin-bottom: 2.5rem;
		border: 1px solid var(--border);
		border-radius: 16px;
		background: color-mix(in srgb, var(--brand) 7%, var(--bg));
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.stat-num {
		font-size: 2.1rem;
		font-weight: 800;
		line-height: 1;
		color: var(--brand);
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 0.3rem;
	}

	/* ── Impact (ce que font les groupes) ────────────────────────────── */

	.impact-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.25rem;
		margin-bottom: 3.5rem;
	}

	.impact-card {
		padding: 1.5rem 1.5rem 1.6rem;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--bg-card);
	}

	.impact-card :global(svg) {
		color: var(--brand);
	}

	.impact-card h3 {
		margin: 0.6rem 0 0.4rem;
		font-size: 1.1rem;
	}

	.impact-card p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--text-2);
	}

	.impact-card a {
		color: var(--brand-subtle);
		font-weight: 600;
	}

	/* ── Liste des villes ─────────────────────────────────────────────── */

	.city-list {
		list-style: none;
		padding: 0;
		margin: 1.25rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.city-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--bg-card);
		font-size: 0.88rem;
		font-weight: 600;
	}

	.city-chip.forming {
		color: var(--text-secondary);
		font-weight: 500;
	}

	.city-tag {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--text-secondary);
	}

	/* ── Sections titrées (agenda, actions passées) ──────────────────── */

	.section-title-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.section-title-row h2 {
		margin: 0;
	}

	.section-title-row :global(.section-icon) {
		color: var(--brand);
		flex-shrink: 0;
	}

	/* ── Agenda (prochaines actions) ──────────────────────────────────── */

	.agenda-section {
		margin-bottom: 3.5rem;
	}

	.event-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.event-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1rem 1.25rem;
		border: 1px solid var(--border);
		border-left: 4px solid var(--brand);
		border-radius: 12px;
		background: var(--bg-card);
	}

	.event-date {
		font-weight: 700;
		color: var(--brand-subtle);
		font-size: 0.9rem;
		min-inline-size: 8rem;
	}

	.event-time {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-left: 0.5rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.event-body {
		flex: 1;
		min-inline-size: 12rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.event-body small {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.82rem;
		color: var(--text-secondary);
	}

	.event-body small :global(svg) {
		color: var(--brand);
		flex-shrink: 0;
	}

	.event-body p {
		margin: 0.25rem 0 0;
		font-size: 0.9rem;
		color: var(--text-2);
		line-height: 1.5;
	}

	.event-cta {
		padding: 0.45rem 1rem;
		border-radius: 8px;
		background: var(--brand);
		color: #1a1a1a;
		font-size: 0.88rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.event-cta:hover {
		filter: brightness(0.95);
	}

	/* ── Actions passées ──────────────────────────────────────────────── */

	.past-section {
		margin-bottom: 5rem;
	}

	/* Action « à la une » : grande carte, orientation alternée photo / texte */
	.feature-card {
		display: grid;
		grid-template-columns: 1.05fr 1fr;
		border: 1px solid var(--border);
		border-radius: 18px;
		overflow: hidden;
		background: var(--bg-card);
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 14px rgba(0, 0, 0, 0.05);
	}

	.feature-card.reverse .feature-media {
		order: 2;
	}

	/* Média : photo principale + bande de vignettes */
	.feature-media {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-block-size: 17rem;
		padding: 0.6rem;
	}

	/* Photo principale adaptative : l'image est montrée en entier (contain),
	   quelle que soit sa forme, sur un fond flou de la même image. */
	.feature-main {
		position: relative;
		flex: 1;
		inline-size: 100%;
		min-block-size: 0;
		overflow: hidden;
		border-radius: 12px;
	}

	.feature-main-bg {
		position: absolute;
		inset: -8%;
		background-size: cover;
		background-position: center;
		filter: blur(22px) brightness(0.9);
	}

	.feature-main img {
		position: relative;
		z-index: 1;
		inline-size: 100%;
		block-size: 100%;
		object-fit: contain;
	}

	/* Flèches de navigation du carrousel */
	.gallery-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 2.1rem;
		block-size: 2.1rem;
		border: none;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.45);
		color: #fff;
		cursor: pointer;
		transition: background 0.15s;
	}

	.gallery-nav:hover {
		background: rgba(0, 0, 0, 0.7);
	}

	.gallery-nav.prev {
		left: 0.5rem;
	}

	.gallery-nav.next {
		right: 0.5rem;
	}

	.gallery-counter {
		position: absolute;
		z-index: 2;
		bottom: 0.5rem;
		right: 0.5rem;
		padding: 0.08rem 0.5rem;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.55);
		color: #fff;
		font-size: 0.72rem;
		font-weight: 600;
	}

	.feature-thumbs {
		display: flex;
		gap: 0.5rem;
		block-size: 5rem;
		flex-shrink: 0;
	}

	.feature-thumb {
		flex: 1;
		inline-size: 0;
		block-size: 100%;
		padding: 0;
		border: 2px solid transparent;
		border-radius: 9px;
		overflow: hidden;
		background: none;
		cursor: pointer;
	}

	.feature-thumb.active {
		border-color: var(--brand);
	}

	.feature-thumb img {
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
		display: block;
	}

	.feature-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.55rem;
		padding: 2rem 2.25rem;
	}

	.feature-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.feature-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		background: var(--brand);
		color: #1a1a1a;
		padding: 0.12rem 0.55rem;
		border-radius: 999px;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.feature-body h3 {
		margin: 0;
		font-size: clamp(1.3rem, 2.5vw, 1.7rem);
		line-height: 1.15;
	}

	.volunteers {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--brand-subtle);
		background: var(--brand-light);
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
	}

	.feature-body p {
		margin: 0;
		line-height: 1.65;
		color: var(--text-2);
	}

	.feature-link {
		align-self: flex-start;
		margin-top: 0.35rem;
		font-size: 0.92rem;
		font-weight: 700;
		color: var(--brand-subtle);
	}

	.feature-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 760px) {
		.feature-card,
		.feature-card.reverse {
			grid-template-columns: 1fr;
		}

		.feature-card.reverse .feature-media {
			order: 0;
		}

		.feature-media {
			min-block-size: 0;
		}

		.feature-main {
			block-size: 13rem;
		}

		.feature-body {
			padding: 1.4rem 1.5rem 1.6rem;
		}
	}

	/* Autres actions : cartes avec image en bandeau */
	.past-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
		gap: 1.25rem;
	}

	.past-card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
		background: var(--bg-card);
		transition:
			transform 0.18s,
			box-shadow 0.18s;
	}

	.past-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
	}

	.past-card-media {
		position: relative;
		block-size: 9.5rem;
		margin: 0.5rem 0.5rem 0;
		border-radius: 10px;
		overflow: hidden;
		background: var(--brand-light);
	}

	.past-card-bg {
		position: absolute;
		inset: -8%;
		background-size: cover;
		background-position: center;
		filter: blur(16px) brightness(0.9);
	}

	.past-card-media img {
		position: relative;
		z-index: 1;
		inline-size: 100%;
		block-size: 100%;
		object-fit: contain;
	}

	.past-card-noimg {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--brand);
		opacity: 0.55;
	}

	.past-card-tag {
		position: absolute;
		z-index: 2;
		top: 0.6rem;
		left: 0.6rem;
		display: inline-flex;
		align-items: center;
		gap: 0.28rem;
		background: var(--brand);
		color: #1a1a1a;
		padding: 0.15rem 0.6rem;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.past-card-body {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.9rem 1rem 1rem;
		flex: 1;
	}

	.past-card-meta {
		font-size: 0.78rem;
		color: var(--text-secondary);
	}

	.past-card-title {
		font-size: 1rem;
		line-height: 1.3;
	}

	.past-card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 0.4rem;
	}

	.past-card-vol {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-2);
	}

	.past-card-link {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--brand-subtle);
		white-space: nowrap;
	}

	.past-card-link:hover {
		text-decoration: underline;
	}

	.show-all-btn {
		display: block;
		margin: 1.25rem auto 0;
		padding: 0.55rem 1.4rem;
		border: 1px solid var(--brand);
		border-radius: 999px;
		background: transparent;
		color: var(--brand-subtle);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.show-all-btn:hover {
		background: var(--brand-light);
	}

	/* ── CTA cards ────────────────────────────────────────────────────── */

	.cta-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 4rem;
	}

	.cta-card {
		padding: 2.25rem 2rem;
		border-radius: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		transition: transform 0.2s;
	}

	.cta-card:hover {
		transform: translateY(-4px);
	}

	.cta-card.join {
		background: var(--bg-subtle, color-mix(in srgb, var(--brand) 7%, var(--bg)));
		border: 2px solid var(--brand);
	}

	.cta-card.create {
		background: var(--brand);
		color: white;
	}

	.cta-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 3.2rem;
		block-size: 3.2rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--brand) 18%, transparent);
		color: var(--brand);
	}

	.cta-card.create .cta-icon {
		background: rgba(255, 255, 255, 0.22);
		color: white;
	}

	.cta-card h2 {
		margin: 0;
		font-size: 1.4rem;
	}

	.cta-card p {
		margin: 0;
		font-size: 1rem;
		opacity: 0.88;
		flex-grow: 1;
		line-height: 1.55;
	}

	/* ── Map section ──────────────────────────────────────────────────── */

	.map-section {
		margin-bottom: 5rem;
	}

	.map-header {
		margin-bottom: 1rem;
	}

	.map-title-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.4rem;
	}

	.map-title-row h2 {
		margin: 0;
	}

	.map-title-row :global(.map-pin-icon) {
		color: var(--brand, #ff9416);
		flex-shrink: 0;
	}

	.map-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		font-size: 0.875rem;
	}

	.map-stat {
		font-weight: 600;
		color: var(--brand, #ff9416);
	}

	.map-stat.forming {
		color: var(--text-secondary, #888);
	}

	.map-sep {
		color: var(--border, #d1d5db);
	}

	.map-hint {
		color: var(--text-secondary, #888);
	}

	/* ── Responsive ───────────────────────────────────────────────────── */

	@media (max-width: 640px) {
		article {
			padding: 0 1rem;
		}

		.cta-card {
			padding: 1.75rem 1.25rem;
		}
	}
</style>
