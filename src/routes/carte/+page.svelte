<script lang="ts">
	import { onMount } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { Maximize2, Minimize2 } from 'lucide-svelte'
	import { theme } from '$lib/stores/theme'
	import { resources } from '$lib/data/resources'

	$: mapSrc = $theme === 'dark' ? '/carte/map-dark.jpg' : '/carte/map.jpg'

	const title = 'Carte des ressources IA - Pause IA'
	const description =
		"Carte interactive des médias, communautés et acteurs francophones et internationaux engagés sur les risques de l'IA."

	const MAP_W = 2048
	const MAP_H = 1152

	// Zone definitions (polygons + label positions)
	const ZONES = [
		{
			id: 'foret',
			name: 'Forêt des blogs',
			label: { left: 430, top: 470 },
			points:
				'505,200 550,237 614,303 669,368 745,379 782,399 802,455 793,492 770,528 762,577 749,623 720,640 677,635 638,656 556,701 477,725 430,729 388,724 350,711 330,685 298,645 218,613 173,564 150,485 169,377 234,311 312,260 392,237 441,205 474,195 505,200'
		},
		{
			id: 'monts',
			name: 'Monts des newsletters',
			label: { left: 820, top: 250 },
			points:
				'1052,444 974,429 906,424 853,435 814,407 786,359 737,339 669,319 641,284 606,265 582,243 552,204 542,176 558,146 605,116 673,99 733,91 781,72 821,56 850,62 890,78 950,112 1002,147 1089,206 1125,256 1140,304 1162,376 1148,421 1114,439 1080,449 1052,444'
		},
		{
			id: 'village',
			name: 'Village de la sécurité',
			label: { left: 880, top: 600 },
			points:
				'833,461 797,519 781,577 782,623 812,663 844,682 889,700 941,727 984,750 1042,760 1086,740 1134,696 1133,640 1105,600 1065,567 1037,527 1018,463 929,444 869,463 834,460'
		},
		{
			id: 'plaine',
			name: 'Plaine militante',
			label: { left: 680, top: 830 },
			points:
				'408,751 457,726 485,714 521,711 560,694 592,672 637,654 686,647 729,647 765,650 790,660 810,674 838,682 858,695 888,704 924,719 948,738 972,763 1000,791 1008,814 1001,836 988,854 944,876 890,887 854,906 806,910 777,898 749,896 705,914 652,962 600,990 552,998 506,988 466,986 434,974 408,939 385,896 349,872 318,835 322,794 346,772 376,758 408,752'
		},
		{
			id: 'rives',
			name: 'Rives des podcasts',
			label: { left: 1280, top: 400 },
			points:
				'1137,441 1088,466 1066,485 1058,531 1086,567 1130,598 1168,638 1244,650 1314,633 1406,610 1488,583 1558,554 1581,509 1569,465 1526,426 1496,387 1449,369 1384,366 1329,349 1254,345 1224,361 1182,397 1166,421 1137,442'
		},
		{
			id: 'delta',
			name: 'Delta des vidéos',
			label: { left: 1380, top: 870 },
			points:
				'1220,650 1308,634 1402,618 1505,582 1561,556 1636,548 1657,571 1686,606 1708,655 1729,740 1724,828 1689,888 1634,944 1540,1015 1457,1050 1402,1062 1329,1068 1237,1068 1160,1050 1108,1034 1029,996 974,968 950,930 966,864 1010,811 1073,748 1149,700 1220,651'
		},
		{
			id: 'avant-poste',
			name: 'Avant-poste des prédictions',
			label: { left: 1350, top: 60 },
			points:
				'1240,324 1290,324 1353,324 1413,323 1473,322 1504,319 1532,303 1548,279 1565,243 1569,203 1570,150 1565,95 1545,76 1514,60 1460,55 1381,55 1312,52 1266,51 1206,56 1142,59 1109,59 1061,68 1041,100 1033,134 1049,178 1093,216 1141,259 1173,303 1206,323 1240,326'
		},
		{
			id: 'ile',
			name: 'Île des ressources',
			label: { left: 1820, top: 170 },
			points:
				'1597,314 1577,263 1568,206 1572,148 1579,106 1608,79 1664,62 1723,59 1789,62 1848,86 1909,138 1971,215 2008,271 2017,335 2015,400 1995,451 1968,485 1928,516 1884,528 1825,517 1763,488 1699,437 1645,376 1597,315'
		}
	]

	type Source = {
		id: string
		title: string
		description: string
		url: string
		lang: string
		zone: string
		logo?: string
		logo_size?: string
		fallback_text?: string
		x?: number
		y?: number
	}

	let viewport: HTMLDivElement
	let stage: HTMLDivElement
	let sourcesContainer: HTMLDivElement
	let tooltip: HTMLDivElement
	let tooltipFlag: HTMLSpanElement
	let tooltipTitle: HTMLSpanElement
	let tooltipDesc: HTMLDivElement
	let isFullscreen = false

	function toggleFullscreen() {
		if (!viewport) return
		if (!document.fullscreenElement) {
			viewport.requestFullscreen?.().catch(() => {})
		} else {
			document.exitFullscreen?.()
		}
	}

	function flagHTML(lang: string) {
		if (lang === 'fr') return '<img src="/flags/fr.svg" alt="FR" class="src-tooltip-flag-img">'
		if (lang === 'en' || lang === 'gb')
			return '<img src="/flags/gb.svg" alt="EN" class="src-tooltip-flag-img">'
		return ''
	}

	function pointInPolygon(point: [number, number], polygon: number[][]) {
		let inside = false
		for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			const [xi, yi] = polygon[i]
			const [xj, yj] = polygon[j]
			const intersect =
				yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi
			if (intersect) inside = !inside
		}
		return inside
	}

	function bbox(polygon: number[][]) {
		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity
		polygon.forEach(([px, py]) => {
			if (px < minX) minX = px
			if (px > maxX) maxX = px
			if (py < minY) minY = py
			if (py > maxY) maxY = py
		})
		return { minX, minY, maxX, maxY }
	}

	function autoPlaceDense(polygon: number[][], n: number, box: ReturnType<typeof bbox>) {
		const w = box.maxX - box.minX
		const h = box.maxY - box.minY
		const step = Math.min(w, h) / 20
		const candidates: { x: number; y: number }[] = []
		for (let py = box.minY + step; py < box.maxY; py += step) {
			for (let px = box.minX + step; px < box.maxX; px += step) {
				if (pointInPolygon([px, py], polygon)) candidates.push({ x: px, y: py })
			}
		}
		if (candidates.length <= n) return candidates
		const stepIdx = candidates.length / n
		const result = []
		for (let i = 0; i < n; i++) result.push(candidates[Math.floor(i * stepIdx)])
		return result
	}

	function autoPlace(polygon: number[][], n: number) {
		if (n <= 0) return []
		const box = bbox(polygon)
		const w = box.maxX - box.minX
		const h = box.maxY - box.minY
		let cols = Math.ceil(Math.sqrt(n * (w / h)))
		let rows = Math.ceil(n / cols)
		if (cols < 1) cols = 1
		if (rows < 1) rows = 1
		const cellW = w / (cols + 1)
		const cellH = h / (rows + 1)
		const candidates: [number, number][] = []
		for (let r = 1; r <= rows; r++) {
			for (let c = 1; c <= cols; c++) {
				const px = box.minX + c * cellW
				const py = box.minY + r * cellH
				if (pointInPolygon([px, py], polygon)) candidates.push([px, py])
			}
		}
		if (candidates.length < n) return autoPlaceDense(polygon, n, box).slice(0, n)
		const cx = (box.minX + box.maxX) / 2
		const cy = (box.minY + box.maxY) / 2
		candidates.sort((a, b) => {
			const da = (a[0] - cx) ** 2 + (a[1] - cy) ** 2
			const db = (b[0] - cx) ** 2 + (b[1] - cy) ** 2
			return da - db
		})
		return candidates.slice(0, n).map((p) => ({ x: p[0], y: p[1] }))
	}

	onMount(() => {
		const margin = 0.92
		let dragMoved = false
		let scale: number
		let x: number
		let y: number
		let MIN_SCALE: number
		const MAX_SCALE = 4

		function computeFit() {
			const vw = viewport.clientWidth
			const vh = viewport.clientHeight
			const s = Math.min((vw / MAP_W) * margin, (vh / MAP_H) * margin)
			return { s, x: (vw - MAP_W * s) / 2, y: (vh - MAP_H * s) / 2 }
		}

		const fit = computeFit()
		scale = fit.s
		x = fit.x
		y = fit.y
		MIN_SCALE = scale * 0.5

		// Cache labels once — querySelectorAll on every frame is the bottleneck.
		const labelEls = Array.from(stage.querySelectorAll<HTMLElement>('.zone-static-label'))
		let rafPending = false
		let visSet = false

		function apply() {
			if (rafPending) return
			rafPending = true
			requestAnimationFrame(() => {
				rafPending = false
				stage.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
				if (!visSet) {
					stage.style.visibility = 'visible'
					visSet = true
				}
				const inv = 1 / scale
				const t = `translate(-50%, -50%) scale(${inv})`
				for (let i = 0; i < labelEls.length; i++) labelEls[i].style.transform = t
			})
		}

		// Drag mouse
		let dragging = false
		let dragStartX = 0,
			dragStartY = 0
		let panStartX = 0,
			panStartY = 0

		const onMouseDown = (e: MouseEvent) => {
			dragging = true
			dragMoved = false
			dragStartX = e.clientX
			dragStartY = e.clientY
			panStartX = x
			panStartY = y
			viewport.style.cursor = 'grabbing'
			e.preventDefault()
		}
		const onMouseMove = (e: MouseEvent) => {
			if (!dragging) return
			const dx = e.clientX - dragStartX
			const dy = e.clientY - dragStartY
			if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true
			x = panStartX + dx
			y = panStartY + dy
			apply()
		}
		const onMouseUp = () => {
			if (!dragging) return
			dragging = false
			viewport.style.cursor = 'grab'
		}
		const onWheel = (e: WheelEvent) => {
			e.preventDefault()
			const rect = viewport.getBoundingClientRect()
			const cursorX = e.clientX - rect.left
			const cursorY = e.clientY - rect.top
			const zoomFactor = -e.deltaY > 0 ? 1.15 : 1 / 1.15
			const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * zoomFactor))
			if (newScale === scale) return
			const ratio = newScale / scale
			x = cursorX - (cursorX - x) * ratio
			y = cursorY - (cursorY - y) * ratio
			scale = newScale
			apply()
		}

		// Touch
		let touchMode: 'pan' | 'pinch' | null = null
		let touchStartDist = 0,
			touchStartScale = 1
		let touchStartX = 0,
			touchStartY = 0
		let touchPanStartX = 0,
			touchPanStartY = 0
		const onTouchStart = (e: TouchEvent) => {
			if (e.touches.length === 1) {
				touchMode = 'pan'
				touchStartX = e.touches[0].clientX
				touchStartY = e.touches[0].clientY
				touchPanStartX = x
				touchPanStartY = y
			} else if (e.touches.length === 2) {
				touchMode = 'pinch'
				const dx = e.touches[0].clientX - e.touches[1].clientX
				const dy = e.touches[0].clientY - e.touches[1].clientY
				touchStartDist = Math.hypot(dx, dy)
				touchStartScale = scale
			}
		}
		const onTouchMove = (e: TouchEvent) => {
			if (touchMode === 'pan' && e.touches.length === 1) {
				x = touchPanStartX + (e.touches[0].clientX - touchStartX)
				y = touchPanStartY + (e.touches[0].clientY - touchStartY)
				apply()
				e.preventDefault()
			} else if (touchMode === 'pinch' && e.touches.length === 2) {
				const dx = e.touches[0].clientX - e.touches[1].clientX
				const dy = e.touches[0].clientY - e.touches[1].clientY
				const dist = Math.hypot(dx, dy)
				const newScale = Math.max(
					MIN_SCALE,
					Math.min(MAX_SCALE, touchStartScale * (dist / touchStartDist))
				)
				const rect = viewport.getBoundingClientRect()
				const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
				const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
				const ratio = newScale / scale
				x = cx - (cx - x) * ratio
				y = cy - (cy - y) * ratio
				scale = newScale
				apply()
				e.preventDefault()
			}
		}
		const onTouchEnd = () => {
			touchMode = null
		}

		let resizeTimer: ReturnType<typeof setTimeout>
		const onResize = () => {
			clearTimeout(resizeTimer)
			resizeTimer = setTimeout(() => {
				const f = computeFit()
				scale = f.s
				x = f.x
				y = f.y
				MIN_SCALE = scale * 0.5
				apply()
			}, 150)
		}

		const onFullscreenChange = () => {
			isFullscreen = document.fullscreenElement === viewport
			onResize()
		}

		viewport.addEventListener('mousedown', onMouseDown)
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
		viewport.addEventListener('wheel', onWheel, { passive: false })
		viewport.addEventListener('touchstart', onTouchStart, { passive: true })
		viewport.addEventListener('touchmove', onTouchMove, { passive: false })
		viewport.addEventListener('touchend', onTouchEnd)
		window.addEventListener('resize', onResize)
		document.addEventListener('fullscreenchange', onFullscreenChange)

		// Hover sync polygon → label
		stage.querySelectorAll('.zone').forEach((poly) => {
			const id = (poly as SVGElement).dataset.zone
			if (!id) return
			const label = stage.querySelector(`.zone-static-label[data-zone="${id}"]`)
			if (!label) return
			poly.addEventListener('mouseenter', () => label.classList.add('active'))
			poly.addEventListener('mouseleave', () => label.classList.remove('active'))
		})

		// Read polygons
		const polygons: Record<string, number[][]> = {}
		ZONES.forEach((z) => {
			polygons[z.id] = z.points
				.trim()
				.split(/\s+/)
				.map((p) => p.split(',').map(Number) as [number, number])
		})

		function showTooltip(src: Source, marker: HTMLElement) {
			tooltipTitle.textContent = src.title || ''
			tooltipDesc.textContent = src.description || ''
			tooltipFlag.innerHTML = flagHTML(src.lang)
			const rect = marker.getBoundingClientRect()
			tooltip.classList.add('visible')
			const tipRect = tooltip.getBoundingClientRect()
			const m = 14
			let left = rect.right + m
			if (left + tipRect.width > window.innerWidth - 10) left = rect.left - tipRect.width - m
			let top = rect.top + (rect.height - tipRect.height) / 2
			if (top < 10) top = 10
			if (top + tipRect.height > window.innerHeight - 10)
				top = window.innerHeight - tipRect.height - 10
			tooltip.style.left = left + 'px'
			tooltip.style.top = top + 'px'
		}
		function hideTooltip() {
			tooltip.classList.remove('visible')
		}

		function renderSources(sources: Source[]) {
			const byZone: Record<string, Source[]> = {}
			sources.forEach((s) => {
				if (!byZone[s.zone]) byZone[s.zone] = []
				byZone[s.zone].push(s)
			})
			Object.keys(byZone).forEach((zoneId) => {
				const poly = polygons[zoneId]
				if (!poly) return
				const list = byZone[zoneId]
				const needAuto = list.filter((s) => s.x == null || s.y == null)
				if (needAuto.length === 0) return
				const positions = autoPlace(poly, needAuto.length)
				needAuto.forEach((src, i) => {
					if (positions[i]) {
						src.x = positions[i].x
						src.y = positions[i].y
					}
				})
			})
			sources.forEach((src) => {
				if (src.x == null || src.y == null) return
				const marker = document.createElement('a')
				marker.className = 'source-marker'
				if (src.logo_size === 'large') marker.classList.add('large')
				marker.href = src.url || '#'
				marker.target = '_blank'
				marker.rel = 'noopener'
				marker.style.left = src.x + 'px'
				marker.style.top = src.y + 'px'
				const fallbackText = src.fallback_text || (src.title || '?').slice(0, 2)
				if (src.logo) {
					const img = document.createElement('img')
					img.src = src.logo
					img.alt = src.title || ''
					img.onerror = () => {
						img.remove()
						const fb = document.createElement('span')
						fb.className = 'source-marker-fallback'
						fb.textContent = fallbackText
						marker.appendChild(fb)
					}
					marker.appendChild(img)
				} else {
					const fb = document.createElement('span')
					fb.className = 'source-marker-fallback'
					fb.textContent = fallbackText
					marker.appendChild(fb)
				}
				marker.addEventListener('click', (e) => {
					if (dragMoved) e.preventDefault()
				})
				marker.addEventListener('mouseenter', () => showTooltip(src, marker))
				marker.addEventListener('mouseleave', () => hideTooltip())
				sourcesContainer.appendChild(marker)
			})
		}

		// Build map sources from the unified resources module — only entries
		// that declare a `zone` appear on the map.
		const mapSources: Source[] = resources
			.filter((r) => r.zone)
			.map((r) => ({
				id: r.id,
				title: r.title,
				description: r.description,
				url: r.url,
				lang: r.langs[0] ?? 'en',
				zone: r.zone as string,
				logo: r.logo,
				logo_size: r.logoSize,
				fallback_text: r.fallbackText
			}))
		renderSources(mapSources)
		apply()

		return () => {
			viewport.removeEventListener('mousedown', onMouseDown)
			window.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener('mouseup', onMouseUp)
			viewport.removeEventListener('wheel', onWheel)
			viewport.removeEventListener('touchstart', onTouchStart)
			viewport.removeEventListener('touchmove', onTouchMove)
			viewport.removeEventListener('touchend', onTouchEnd)
			window.removeEventListener('resize', onResize)
			document.removeEventListener('fullscreenchange', onFullscreenChange)
		}
	})
</script>

<PostMeta {title} {description} />

<div class="carte-page">
	<header class="carte-intro">
		<UnderlinedTitle as="h1">Carte de l'écosystème IA</UnderlinedTitle>
		<p class="subtitle">
			Explorez les médias, communautés et acteurs qui décryptent les risques de l'IA.
		</p>
	</header>

	<div class="map-viewport" class:fullscreen={isFullscreen} bind:this={viewport}>
		<button
			type="button"
			class="fullscreen-btn"
			on:click={toggleFullscreen}
			aria-label={isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'}
			title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
		>
			{#if isFullscreen}
				<Minimize2 size={18} />
			{:else}
				<Maximize2 size={18} />
			{/if}
		</button>
		<div class="map-stage" bind:this={stage} style="visibility: hidden;">
			<img src={mapSrc} alt="Carte des ressources Pause IA" class="map-image" />
			<svg class="map-zones" viewBox="0 0 {MAP_W} {MAP_H}" preserveAspectRatio="xMidYMid meet">
				{#each ZONES as z}
					<polygon
						class="zone"
						data-zone={z.id}
						data-name={z.name}
						fill="transparent"
						stroke="none"
						points={z.points}
					/>
				{/each}
			</svg>
			<div class="zone-labels">
				{#each ZONES as z}
					<div
						class="zone-static-label"
						data-zone={z.id}
						style="left: {z.label.left}px; top: {z.label.top}px;"
					>
						{z.name}
					</div>
				{/each}
			</div>
			<div class="map-sources" bind:this={sourcesContainer}></div>
		</div>
		<div class="hint">Molette : zoom · Glisser : déplacer</div>

		<div class="src-tooltip" bind:this={tooltip}>
			<div class="src-tooltip-header">
				<span class="src-tooltip-flag" bind:this={tooltipFlag}></span>
				<span class="src-tooltip-title" bind:this={tooltipTitle}></span>
			</div>
			<div class="src-tooltip-desc" bind:this={tooltipDesc}></div>
		</div>
	</div>

	<!-- SEO-indexable fallback list, also visible by default on mobile
	     where the interactive map is unusable at finger size. -->
	<section class="map-fallback" aria-label="Liste des sources de la carte">
		<h2>Liste des sources</h2>
		{#each ZONES as z}
			{@const zoneResources = resources.filter((r) => r.zone === z.id)}
			{#if zoneResources.length > 0}
				<div class="fallback-zone">
					<h3>{z.name}</h3>
					<ul>
						{#each zoneResources as r}
							<li>
								<a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
								<span class="fallback-desc">: {r.description}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/each}
		<p class="back-to-ressources">
			<a href="/ressources">← Retour à la page Ressources</a>
		</p>
	</section>
</div>

<style>
	/* Use the parchment tone as the unique page background so the map
	   (whose corners share the same tone) blends seamlessly — only two
	   colors visible: parchment everywhere + the colorful island. */
	.carte-page {
		background: #fff5e8;
		color: var(--text);
		padding-bottom: 0;
		position: relative;
	}

	:global([data-theme='dark']) .carte-page {
		background: #2a241c;
		color: var(--text);
	}

	/* Compact hero — keep enough room for the title + 1 line subtitle,
	   leave the rest of the viewport for the map itself. */
	.carte-intro {
		max-width: 52rem;
		margin: 0 auto;
		padding: 1rem 1.25rem 0.4rem;
		text-align: center;
	}

	.carte-intro :global(h1) {
		margin-bottom: 0.4rem;
		padding-bottom: 0.5rem;
		font-size: clamp(1.4rem, 2.6vw, 1.85rem);
		display: inline-block;
	}

	.carte-intro :global(h1::after) {
		left: 15%;
		right: 15%;
		height: 3px;
	}

	.carte-intro .subtitle {
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.4;
		color: var(--text-secondary);
		margin: 0 auto 0.5rem;
		max-width: 38rem;
	}

	/* The map fills (almost) all remaining viewport height under the header
	   and the compact hero. No border / radius / shadow: it bleeds into the
	   page so only two colors are visible. */
	.map-viewport {
		position: relative;
		width: 100%;
		/* Header sticky (~64px) + hero (~110px) — leave a tiny bottom gap */
		height: calc(100vh - 175px);
		min-height: 480px;
		overflow: hidden;
		cursor: grab;
		background: inherit;
		touch-action: none;
	}

	.map-stage {
		will-change: transform;
		backface-visibility: hidden;
	}

	.map-viewport.fullscreen {
		height: 100vh;
		width: 100vw;
	}

	/* ─── Fullscreen button ───────────────────────────────── */
	.fullscreen-btn {
		position: absolute;
		top: 0.85rem;
		right: 0.85rem;
		z-index: 30;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.85);
		color: var(--text);
		cursor: pointer;
		backdrop-filter: blur(4px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition:
			background 0.18s,
			border-color 0.18s,
			color 0.18s,
			transform 0.18s;
	}

	.fullscreen-btn:hover {
		background: var(--brand);
		border-color: var(--brand);
		color: white;
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .map-viewport {
		background: #2a241c;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
	}

	.map-viewport:active {
		cursor: grabbing;
	}

	.map-stage {
		width: 2048px;
		height: 1152px;
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
	}

	.map-image {
		width: 100%;
		height: 100%;
		display: block;
		user-select: none;
		-webkit-user-drag: none;
		pointer-events: none;
	}

	.map-zones {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.zone {
		fill: transparent !important;
		stroke: transparent !important;
		stroke-width: 0;
		outline: none !important;
		cursor: pointer;
		transition:
			stroke 0.25s ease,
			stroke-width 0.25s ease;
	}
	.zone:hover,
	.zone:focus,
	.zone:active {
		fill: transparent !important;
		stroke: var(--brand, #ff9416) !important;
		stroke-width: 4 !important;
		outline: none !important;
		filter: drop-shadow(0 0 6px var(--brand, #ff9416));
	}

	.zone-labels {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.zone-static-label {
		position: absolute;
		font-family: var(--font-heading, 'IBM Plex Sans', sans-serif);
		font-weight: 700;
		font-size: 22px;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: rgba(255, 148, 22, 0.9);
		text-shadow:
			0 0 12px rgba(0, 0, 0, 0.9),
			0 0 6px rgba(0, 0, 0, 0.9),
			0 2px 4px rgba(0, 0, 0, 1);
		white-space: nowrap;
		user-select: none;
		pointer-events: none;
		padding: 6px 12px;
		border-radius: 3px;
		transition:
			background 0.25s ease,
			border-color 0.25s ease,
			color 0.25s ease;
		border: 1px solid transparent;
		transform-origin: center center;
		transform: translate(-50%, -50%);
	}

	.zone-static-label:global(.active) {
		background: rgba(5, 6, 8, 0.92);
		border-color: var(--brand, #ff9416);
		color: var(--brand, #ff9416);
		box-shadow: 0 0 16px rgba(255, 148, 22, 0.4);
	}

	.map-sources {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	:global(.source-marker) {
		position: absolute;
		width: 50px;
		height: 50px;
		margin-left: -25px;
		margin-top: -25px;
		border-radius: 50%;
		background: #ffffff;
		box-shadow:
			0 0 0 2px rgba(255, 148, 22, 0.4),
			0 4px 12px rgba(0, 0, 0, 0.5);
		cursor: pointer;
		pointer-events: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}
	:global(.source-marker:hover) {
		transform: scale(1.25);
		box-shadow:
			0 0 0 3px var(--brand, #ff9416),
			0 0 16px rgba(255, 148, 22, 0.7),
			0 6px 16px rgba(0, 0, 0, 0.6);
		z-index: 20;
	}
	:global(.source-marker img) {
		width: 100%;
		height: 100%;
		object-fit: contain;
		user-select: none;
		-webkit-user-drag: none;
		pointer-events: none;
	}
	:global(.source-marker.large img) {
		width: 150%;
		height: 150%;
	}
	:global(.source-marker-fallback) {
		font-family: var(--font-heading, 'IBM Plex Sans', sans-serif);
		font-weight: 900;
		font-size: 14px;
		color: #050608;
		text-transform: uppercase;
		text-align: center;
		line-height: 1;
		letter-spacing: -0.5px;
	}

	.src-tooltip {
		position: fixed;
		z-index: 100;
		max-width: 280px;
		padding: 12px 16px;
		background: rgba(5, 6, 8, 0.96);
		border: 1px solid var(--brand, #ff9416);
		border-radius: 4px;
		box-shadow: 0 0 24px rgba(255, 148, 22, 0.35);
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.18s ease,
			transform 0.18s ease;
		pointer-events: none;
	}
	.src-tooltip:global(.visible) {
		opacity: 1;
		transform: translateY(0);
	}
	.src-tooltip-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}
	.src-tooltip-flag {
		font-size: 16px;
		line-height: 1;
		display: flex;
		align-items: center;
	}
	:global(.src-tooltip-flag-img) {
		width: 22px;
		height: auto;
		display: block;
		border-radius: 2px;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
	}
	.src-tooltip-title {
		font-family: var(--font-heading, 'IBM Plex Sans', sans-serif);
		font-weight: 700;
		font-size: 14px;
		color: var(--brand, #ff9416);
		letter-spacing: 0.5px;
	}
	.src-tooltip-desc {
		font-family: var(--font-body, 'IBM Plex Sans', sans-serif);
		font-weight: 300;
		font-size: 13px;
		line-height: 1.5;
		color: #f5f5f5;
	}

	.hint {
		position: absolute;
		bottom: 0.85rem;
		left: 50%;
		transform: translateX(-50%);
		font-family: var(--font-heading);
		font-size: 0.7rem;
		color: var(--text-secondary);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		pointer-events: none;
		z-index: 10;
		opacity: 0.7;
	}

	/* ─── Fallback list (SEO + mobile) ───────────────────── */
	.map-fallback {
		max-width: 52rem;
		margin: 2rem auto 0;
		padding: 2rem 1.25rem;
	}

	.map-fallback h2 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.3rem;
		margin: 0 0 1.25rem;
		color: var(--text);
	}

	.fallback-zone {
		margin-bottom: 1.5rem;
	}

	.fallback-zone h3 {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--brand-subtle, var(--brand));
		margin: 0 0 0.5rem;
	}

	:global([data-theme='dark']) .fallback-zone h3 {
		color: var(--brand);
	}

	.fallback-zone ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.45rem;
	}

	.fallback-zone li {
		padding: 0.55rem 0.75rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 8px;
	}

	.fallback-zone a {
		color: var(--brand-subtle, var(--brand));
		text-decoration: none;
		font-weight: 600;
	}

	:global([data-theme='dark']) .fallback-zone a {
		color: var(--brand);
	}

	.fallback-zone a:hover {
		text-decoration: underline;
	}

	.fallback-desc {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.back-to-ressources {
		margin-top: 2rem;
		text-align: center;
	}

	.back-to-ressources a {
		color: var(--brand-subtle, var(--brand));
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 600;
	}

	.back-to-ressources a:hover {
		text-decoration: underline;
	}

	/* On mobile (< 768px) the interactive map is unusable at finger size,
	   so we hide it and the fallback list becomes the primary view. */
	@media (max-width: 767px) {
		.map-viewport {
			display: none;
		}
		.map-fallback {
			margin-top: 1rem;
		}
	}
</style>
