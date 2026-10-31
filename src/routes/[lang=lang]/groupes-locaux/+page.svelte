<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { Page } from '$components/ui'
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
	import {
		localGroups,
		activeGroupsCount,
		formingGroupsCount,
		moisDepuisLancement
	} from '$lib/data/local-groups'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: isEn = lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	// Mois écoulés depuis le lancement des groupes locaux (mars 2026).
	const mois = moisDepuisLancement()

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
	// Carte chargée en différé, mais suffisamment en avance (grande marge) pour
	// qu'elle soit déjà prête quand l'utilisateur arrive dessus.
	let mapSection: HTMLElement | undefined
	let showMap = false
	onMount(async () => {
		if (mapSection && 'IntersectionObserver' in window) {
			const io = new IntersectionObserver(
				(entries) => {
					if (entries.some((e) => e.isIntersecting)) {
						showMap = true
						io.disconnect()
					}
				},
				{ rootMargin: '800px' }
			)
			io.observe(mapSection)
		} else {
			showMap = true
		}
		try {
			const res = await fetch('/api/events')
			if (res.ok) events = (await res.json()) as LocalEvent[]
		} catch {
			/* agenda indisponible : la page reste fonctionnelle */
		}
		// Préchargement : on déclenche les transformations du CDN d'images dès que
		// l'agenda est connu, pendant que l'utilisateur lit le haut de page. Les
		// photos (et leur fond flou, même URL) sont ainsi en cache au moment du
		// défilement, ce qui évite l'attente du transcodage à froid de Netlify.
		if (typeof Image !== 'undefined') {
			for (const e of events) {
				if (!e.images.length) continue
				if (e.featured) {
					// Toutes les photos du carrousel : la navigation devient instantanée.
					for (const img of e.images) {
						const pre = new Image()
						pre.src = cdnImg(img, 1100)
					}
				} else {
					const pre = new Image()
					pre.src = cdnImg(e.images[0], 400)
				}
			}
		}
	})

	const startOfToday = new Date()
	startOfToday.setHours(0, 0, 0, 0)
	$: upcoming = events.filter((e) => new Date(e.date) >= startOfToday)
	// Actions passées : les plus récentes d'abord (tri explicite pour une frise
	// toujours chronologique, indépendamment de l'ordre de la source).
	$: pastAll = events
		.filter((e) => new Date(e.date) < startOfToday)
		.slice()
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	// Total de bénévoles mobilisés (sur les actions qui renseignent ce nombre).
	$: totalVolunteers = pastAll.reduce((sum, e) => sum + (e.volunteers || 0), 0)
	// Frise chronologique unifiée : toutes les actions sur un même rail, les
	// actions « à la une » formant de plus grands nœuds. On affiche d'abord les
	// plus récentes, puis un bouton déroule le reste.
	const PAST_PREVIEW = 8
	let showAllPast = false
	$: pastShown = showAllPast ? pastAll : pastAll.slice(0, PAST_PREVIEW)

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

<Page width="wide" eyebrow={isEn ? 'Act' : 'Agir'} title={isEn ? 'Local groups' : 'Groupes locaux'}>
	<svelte:fragment slot="lede">
		{#if isEn}
			Local action is essential for raising public awareness, engaging elected officials and
			building a strong citizen movement. Join a team near you or start the momentum in your city.
		{:else}
			L'action locale est essentielle pour sensibiliser le public, interpeller les élus et
			construire un mouvement citoyen fort. Rejoignez une équipe près de chez vous ou lancez la
			dynamique dans votre ville.
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="actions">
		<div class="hero-actions">
			<Button href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac">
				{isEn ? 'Join a group' : 'Rejoindre un groupe'}
			</Button>
		</div>
	</svelte:fragment>

	<section class="impact-section">
		<div class="impact-card">
			<Megaphone size="1.6rem" />
			<h2>{isEn ? 'Demonstrations & gatherings' : 'Manifestations & rassemblements'}</h2>
			<p>
				{isEn
					? 'Carry the message into the street, in several cities at once, to make the risks of AI visible.'
					: "Porter le message dans la rue, dans plusieurs villes à la fois, pour rendre visibles les risques de l'IA."}
			</p>
		</div>
		<div class="impact-card">
			<Users size="1.6rem" />
			<h2>{isEn ? 'Leafleting & outreach' : 'Tractage & sensibilisation'}</h2>
			<p>
				{isEn
					? 'Meet the public, hand out leaflets and start conversations to grow awareness on the ground.'
					: 'Aller à la rencontre du public, distribuer des tracts et engager la discussion pour sensibiliser sur le terrain.'}
			</p>
		</div>
		<div class="impact-card">
			<Newspaper size="1.6rem" />
			<h2>{isEn ? 'Press coverage' : 'Retombées presse'}</h2>
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

	<section class="map-section" bind:this={mapSection}>
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
		{#if showMap}
			<LocalGroupsMap />
		{:else}
			<div class="map-placeholder" aria-hidden="true"></div>
		{/if}

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

			<!-- Frise chronologique : un rail unique, les actions « à la une » en grands nœuds -->
			<div class="timeline">
				{#each pastShown as e (e.id)}
					{@const gi = galleryIdx[e.id] ?? 0}
					<div class="tl-item" class:featured={e.featured}>
						<div class="tl-rail">
							<time class="tl-date" datetime={e.date}>{fmtDate(e.date)}</time>
							{#if e.city}<span class="tl-city">{e.city}</span>{/if}
						</div>
						<div class="tl-marker" aria-hidden="true">
							<span class="tl-dot">
								{#if e.featured}<svelte:component this={typeIcon(e.type)} size="0.85em" />{/if}
							</span>
						</div>
						<div class="tl-card">
							{#if e.featured && e.images.length}
								<div class="feature-main">
									<div
										class="feature-main-bg"
										style="background-image:url('{cdnImg(e.images[gi], 1100)}')"
									></div>
									<img
										src={cdnImg(e.images[gi], 1100)}
										data-raw={e.images[gi]}
										on:error={cdnFallback}
										alt={e.images.length > 1
											? `${e.title} (${gi + 1}/${e.images.length})`
											: e.title}
										loading="lazy"
										decoding="async"
									/>
									{#if e.images.length > 1}
										<button
											class="gallery-nav prev"
											on:click={() => {
												galStep(e.id, e.images.length, -1)
											}}
											aria-label={isEn ? 'Previous photo' : 'Photo précédente'}
										>
											<ChevronLeft size="1.2em" />
										</button>
										<button
											class="gallery-nav next"
											on:click={() => {
												galStep(e.id, e.images.length, 1)
											}}
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
												aria-label={`${e.title}, photo ${idx + 1}`}
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
							{:else if !e.featured}
								<div class="tl-thumb">
									{#if e.images.length}
										<img
											class="tl-thumb-img"
											src={cdnImg(e.images[0], 400)}
											data-raw={e.images[0]}
											on:error={cdnFallback}
											alt={e.title}
											loading="lazy"
											decoding="async"
										/>
									{:else}
										<span class="tl-thumb-icon" aria-hidden="true">
											<svelte:component this={typeIcon(e.type)} size="1.6rem" />
										</span>
									{/if}
								</div>
							{/if}
							<div class="tl-body">
								<span class="tl-meta">
									{#if e.type}
										<span class="tl-tag">
											<svelte:component this={typeIcon(e.type)} size="0.78em" />
											{e.type}
										</span>
									{/if}
									<span class="tl-when">{fmtDate(e.date)}{e.city ? ` · ${e.city}` : ''}</span>
								</span>
								<h3 class="tl-title">{e.title}</h3>
								{#if e.volunteers > 0}
									<span class="volunteers">
										<Users size="0.9em" />
										{e.volunteers}
										{isEn ? (e.volunteers > 1 ? 'volunteers' : 'volunteer') : 'bénévoles'}
									</span>
								{/if}
								{#if e.description}<p class="tl-desc">{e.description}</p>{/if}
								{#if e.url}
									<a
										class="tl-link"
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
					</div>
				{/each}
			</div>

			{#if pastAll.length > PAST_PREVIEW}
				<button class="show-all-btn" on:click={() => (showAllPast = !showAllPast)}>
					{#if showAllPast}
						{isEn ? 'Show less' : 'Voir moins'}
					{:else}
						{isEn
							? `See all actions (${pastAll.length})`
							: `Voir toutes les actions (${pastAll.length})`}
					{/if}
				</button>
			{/if}
		</section>
	{/if}

	<!-- Repère de temps en fin de page : tout ce qui précède (groupes, actions,
	     bénévoles) tient dans ce laps de temps. Le nombre de mois est calculé à
	     partir de la date de lancement, il ne peut pas se périmer. -->
	<section class="depuis" aria-labelledby="depuis-titre">
		<p class="depuis-kicker">{isEn ? 'All of this since' : 'Tout cela depuis'}</p>
		<p class="depuis-date" id="depuis-titre">{isEn ? 'March 2026' : 'mars 2026'}</p>
		<p class="depuis-texte">
			{#if isEn}
				Pause AI's local groups launched {mois} months ago. The groups, the actions and the volunteers
				above were all built in that time, by people who simply decided to start.
			{:else}
				Les groupes locaux de Pause IA ont été lancés il y a {mois} mois. Les groupes, les actions et
				les bénévoles que vous venez de voir ont tous été construits dans ce laps de temps, par des gens
				qui ont simplement décidé de commencer.
			{/if}
		</p>
	</section>
</Page>

<style>
	/* Repère de temps de fin de page : volontairement sobre (pas de carte, pas
	   de bordure orange), la date fait tout le travail. */
	.depuis {
		margin-block-start: 4rem;
		padding-block: 2.75rem;
		text-align: center;
		border-block-start: 1px solid var(--border);
	}
	.depuis-kicker {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-2);
	}
	.depuis-date {
		margin: 0.35rem 0 0;
		font-size: clamp(2.4rem, 8vw, 4rem);
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--brand-subtle);
	}
	.depuis-texte {
		max-inline-size: 36rem;
		margin: 1.1rem auto 0;
		font-size: 1.02rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.hero-actions {
		margin-top: 1.5rem;
	}

	/* Carte chargée en différé : réserve la place pour éviter tout saut de mise
	   en page, avec une légère animation d'attente. */
	.map-placeholder {
		height: 500px;
		border-radius: var(--radius-lg);
		background: linear-gradient(
			100deg,
			var(--brand-light) 30%,
			color-mix(in srgb, var(--brand) 12%, var(--bg)) 50%,
			var(--brand-light) 70%
		);
		background-size: 200% 100%;
		animation: map-shimmer 1.4s ease-in-out infinite;
	}

	@keyframes map-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.map-placeholder {
			animation: none;
		}
	}

	.stats-band {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 0;
		justify-content: center;
		padding: 1.75rem 1.5rem;
		margin-bottom: 2.5rem;
		border: 1px solid color-mix(in srgb, var(--brand) 25%, var(--border));
		border-radius: 18px;
		background: color-mix(in srgb, var(--brand) 10%, var(--bg));
		box-shadow: 0 6px 22px color-mix(in srgb, var(--brand) 14%, transparent);
	}

	.stat {
		flex: 1 1 0;
		min-inline-size: 8rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding-inline: 1.5rem;
	}

	/* Séparateurs verticaux entre les statistiques. */
	.stat + .stat {
		border-inline-start: 1px solid color-mix(in srgb, var(--brand) 22%, transparent);
	}

	.stat-num {
		font-size: clamp(2rem, 5.5vw, 3rem);
		font-weight: 800;
		line-height: 1;
		color: var(--brand-subtle);
		letter-spacing: -0.02em;
	}

	.stat-label {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
		margin-top: 0.45rem;
	}

	@media (max-width: 520px) {
		.stat {
			flex-basis: 40%;
		}

		.stat:nth-child(odd) {
			border-inline-start: none;
		}
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
		border-radius: var(--radius-lg);
		background: var(--bg-card);
	}

	.impact-card :global(svg) {
		color: var(--brand-subtle);
	}

	.impact-card h2 {
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
		border-radius: var(--radius-pill);
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
		color: var(--brand-subtle);
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
		border-radius: var(--radius-md);
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
		color: var(--brand-subtle);
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
		border-radius: var(--radius-sm);
		background: var(--brand);
		color: var(--on-brand);
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

	/* ── Frise chronologique ──────────────────────────────────────────── */
	.timeline {
		position: relative;
		margin-top: 1.5rem;
	}

	/* Ligne verticale continue : tracée une seule fois sur le conteneur, à
	   l'aplomb du centre de la colonne des nœuds (rail 6.5rem + gap 1rem +
	   demi-colonne 0.875rem). Indépendante de la hauteur des cartes. */
	.timeline::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(6.5rem + 1rem + 0.875rem);
		inline-size: 2px;
		transform: translateX(-50%);
		background: var(--border);
	}

	/* Une entrée = date (rail gauche) · nœud · carte. Les actions « à la une »
	   portent la classe .featured (nœud plus gros, carte enrichie). */
	/* Flex (et non grid) : le rail et la colonne du nœud s'étirent exactement à
	   la hauteur de la carte, donc le point centré tombe pile au milieu de la
	   carte (le sizing de ligne de grid ajoutait une hauteur parasite). */
	.tl-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding-bottom: 1.4rem;
		position: relative;
	}

	.tl-item:last-child {
		padding-bottom: 0;
	}

	.tl-rail {
		flex: 0 0 6.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.1rem;
		text-align: right;
		transition: color 0.18s;
	}

	.tl-date {
		font-weight: 700;
		font-size: 0.9rem;
		line-height: 1.2;
	}

	.tl-city {
		font-size: 0.78rem;
		color: var(--text-secondary);
	}

	/* Colonne du nœud : une ligne verticale continue, avec le point centré
	   verticalement par rapport à la carte (donc face à la photo). */
	.tl-marker {
		flex: 0 0 1.75rem;
		position: relative;
	}

	.tl-dot {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		inline-size: 0.9rem;
		block-size: 0.9rem;
		border-radius: 50%;
		background: var(--border);
		box-shadow: 0 0 0 3px var(--bg-card);
		z-index: 1;
		transition:
			transform 0.18s,
			background 0.18s;
	}

	.tl-item.featured .tl-dot {
		inline-size: 1.8rem;
		block-size: 1.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--brand);
		color: var(--on-brand);
	}

	/* Carte */
	.tl-card {
		flex: 1 1 auto;
		min-inline-size: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--bg-card);
		transition:
			transform 0.18s,
			box-shadow 0.18s,
			border-color 0.18s;
	}

	/* Carte compacte (action normale) : vignette carrée + texte côte à côte. */
	.tl-item:not(.featured) .tl-card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
	}

	.tl-item.featured .tl-card {
		box-shadow: 0 2px 14px rgba(var(--ink-rgb), 0.05);
		padding: 0.6rem 0.6rem 0;
	}

	/* Survol = finition décorative uniquement (l'info reste toujours visible). */
	.tl-item:hover .tl-card {
		transform: translateX(4px);
		box-shadow: 0 6px 20px rgba(var(--ink-rgb), 0.09);
		border-color: var(--brand);
	}

	.tl-item:hover .tl-dot {
		transform: translate(-50%, -50%) scale(1.22);
	}

	.tl-item:hover .tl-rail,
	.tl-item:hover .tl-date {
		color: var(--brand-subtle);
	}

	@media (hover: none) {
		.tl-item:hover .tl-card {
			transform: none;
		}
	}

	/* Vignette carrée de taille fixe : remplissage net (cover) sur un carré, donc
	   propre quelle que soit la forme de la photo, sans attente de flou. Repli
	   sur l'icône du type quand il n'y a pas de photo. */
	.tl-thumb {
		position: relative;
		inline-size: 8rem;
		block-size: 8rem;
		margin: 0.65rem;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--brand-light);
		flex-shrink: 0;
	}

	.tl-thumb-img {
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
		display: block;
	}

	.tl-thumb-icon {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--brand-subtle);
		opacity: 0.5;
	}

	.tl-body {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.85rem 1rem;
	}

	.tl-item.featured .tl-body {
		padding: 0.9rem 1.1rem 1.2rem;
	}

	.tl-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.tl-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		background: var(--brand);
		color: var(--on-brand);
		padding: 0.12rem 0.55rem;
		border-radius: var(--radius-pill);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	/* La date est déjà sur le rail à gauche : on la masque dans la carte sur
	   grand écran, et on la réaffiche sur mobile (rail replié). */
	.tl-when {
		display: none;
	}

	.tl-title {
		margin: 0;
		line-height: 1.25;
		font-size: 1.05rem;
	}

	.tl-item.featured .tl-title {
		font-size: clamp(1.2rem, 2.4vw, 1.55rem);
	}

	.tl-desc {
		margin: 0;
		line-height: 1.6;
		color: var(--text-2);
	}

	/* Action non « à la une » : description compacte, tronquée à 2 lignes pour
	   ne pas alourdir la frise. */
	.tl-item:not(.featured) .tl-desc {
		font-size: 0.85rem;
		line-height: 1.45;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.tl-link {
		align-self: flex-start;
		margin-top: 0.15rem;
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--brand-subtle);
		white-space: nowrap;
	}

	.tl-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.timeline::before {
			display: none;
		}

		.tl-item {
			padding-bottom: 1.5rem;
		}

		.tl-rail,
		.tl-marker {
			display: none;
		}

		.tl-when {
			display: inline;
		}

		.tl-card {
			border-left: 3px solid var(--brand);
		}

		.tl-thumb {
			inline-size: 6rem;
			block-size: 6rem;
		}
	}

	/* Carrousel d'une action « à la une » dans la frise : hauteur fixe. */
	.tl-item.featured .feature-main {
		block-size: 18rem;
	}

	.tl-item.featured .feature-thumbs {
		margin-top: 0.5rem;
		margin-bottom: 0.6rem;
	}

	@media (max-width: 640px) {
		.tl-item.featured .feature-main {
			block-size: 13rem;
		}
	}

	/* Photo principale adaptative : l'image est montrée en entier (contain),
	   quelle que soit sa forme, sur un fond flou de la même image. */
	.feature-main {
		position: relative;
		flex: 1;
		inline-size: 100%;
		min-block-size: 0;
		overflow: hidden;
		border-radius: var(--radius-md);
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
		background: rgba(var(--ink-rgb), 0.45);
		color: var(--on-dark);
		cursor: pointer;
		transition: background 0.15s;
	}

	.gallery-nav:hover {
		background: rgba(var(--ink-rgb), 0.7);
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
		border-radius: var(--radius-pill);
		background: rgba(var(--ink-rgb), 0.55);
		color: var(--on-dark);
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
		border-radius: var(--radius-pill);
	}

	.show-all-btn {
		display: block;
		margin: 1.25rem auto 0;
		padding: 0.55rem 1.4rem;
		border: 1px solid var(--brand);
		border-radius: var(--radius-pill);
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
		border-radius: var(--radius-lg);
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
		color: var(--on-brand);
	}

	.cta-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 3.2rem;
		block-size: 3.2rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--brand) 18%, transparent);
		color: var(--brand-subtle);
	}

	.cta-card.create .cta-icon {
		background: rgba(var(--on-dark-rgb), 0.22);
		color: var(--on-dark);
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
		color: var(--brand-subtle);
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
		color: var(--brand-subtle);
	}

	.map-stat.forming {
		color: var(--text-secondary);
	}

	.map-sep {
		color: var(--border);
	}

	.map-hint {
		color: var(--text-secondary);
	}

	/* ── Responsive ───────────────────────────────────────────────────── */

	@media (max-width: 640px) {
		.cta-card {
			padding: 1.75rem 1.25rem;
		}
	}
</style>
