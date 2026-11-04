<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { localGroups } from '$lib/data/local-groups'

	// Les groupes en sommeil ne sont pas montrés : un point sur la carte est une
	// promesse de pouvoir rejoindre quelqu'un, et il n'y a personne à rejoindre.
	const groups = localGroups.filter((g) => !g.inactif)

	let mapContainer: HTMLDivElement
	let map: import('leaflet').Map | null = null

	onMount(async () => {
		const L = (await import('leaflet')).default
		await import('leaflet/dist/leaflet.css')

		map = L.map(mapContainer, {
			scrollWheelZoom: false,
			zoomControl: true,
			attributionControl: true,
			// Sans cela, Leaflet n'utilise que des niveaux entiers : il arrondit le
			// cadrage vers le bas et laisse une large marge vide autour des villes.
			zoomSnap: 0.25,
			// Les boutons + et − gardent un cran entier, plus lisible à l'usage.
			zoomDelta: 1
		})

		// Cadrage calculé sur les groupes eux-mêmes plutôt que sur les bornes de
		// la France : les villes s'arrêtent à Lille au nord et à Marseille au
		// sud, donc un cadre « France entière » laissait de larges marges vides.
		// `maxZoom` évite de coller à une seule ville le jour où il n'en reste
		// qu'une dans la liste.
		map.fitBounds(L.latLngBounds(groups.map((g) => [g.lat, g.lon] as [number, number])).pad(0.12), {
			padding: [16, 16],
			maxZoom: 9
		})

		// Jawg Light, clean minimal design, French labels via lang=fr
		L.tileLayer(
			'https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=tPbKo2PQZw6CPVmNp3lYWRAV1aFiXbviN8bPJIo0K36w58mikRPrQdsLgVNqWhrT&lang=fr',
			{
				attribution:
					'&copy; <a href="https://jawg.io" target="_blank" rel="noopener noreferrer">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
				maxZoom: 22
			}
		).addTo(map)

		for (const group of groups) {
			const markerHtml = group.forming
				? `<div class="lm-forming"><div class="lm-dot"></div></div>`
				: `<div class="lm-active"><div class="lm-pulse"></div><div class="lm-dot"></div></div>`

			const icon = L.divIcon({
				html: markerHtml,
				className: '',
				iconSize: [32, 32],
				iconAnchor: [16, 16],
				tooltipAnchor: [0, -18]
			})

			const marker = L.marker([group.lat, group.lon], { icon }).addTo(map)

			const statut = group.forming ? 'En cours de création' : ''
			const tooltipContent = statut
				? `<div class="tt-name">${group.name}</div><div class="tt-status">${statut}</div>`
				: `<div class="tt-name">${group.name}</div>`

			marker.bindTooltip(tooltipContent, {
				direction: 'top',
				offset: [0, -6],
				className: 'map-tooltip'
			})
		}
	})

	onDestroy(() => {
		map?.remove()
	})
</script>

<div class="map-wrap">
	<div bind:this={mapContainer} class="map-container"></div>

	<div class="legend">
		<span class="legend-item">
			<span class="legend-dot active"></span>
			Groupe actif
		</span>
		<span class="legend-item">
			<span class="legend-dot forming"></span>
			En création
		</span>
	</div>
</div>

<style>
	.map-wrap {
		width: 100%;
	}

	.map-container {
		/* Leaflet met ses tuiles en z-index 400 et ses contrôles en 1000. Sans
		   contexte d'empilement ici, ces valeurs se comparent à celles de la page
		   et passent au-dessus de l'en-tête collant (z-index 100) au défilement.
		   `position: relative` + `z-index: 0` les enferment dans ce conteneur. */
		position: relative;
		z-index: 0;
		height: 500px;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow:
			0 4px 6px rgba(var(--ink-rgb), 0.04),
			0 10px 40px rgba(var(--ink-rgb), 0.1);
		border: 1px solid var(--border);
	}

	/* ── Marker styles (injected into DOM, need :global) ──────────────── */

	:global(.lm-active),
	:global(.lm-forming) {
		position: relative;
		width: 32px;
		height: 32px;
	}

	:global(.lm-dot) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--brand);
		border: 2.5px solid var(--white);
		box-shadow: 0 2px 8px rgba(var(--brand-rgb), 0.55);
		z-index: 2;
	}

	:global(.lm-forming .lm-dot) {
		background: rgba(var(--brand-rgb), 0.35);
		border: 2px dashed var(--brand);
		box-shadow: none;
		width: 16px;
		height: 16px;
	}

	:global(.lm-pulse) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(var(--brand-rgb), 0.28);
		animation: lm-pulse 2.5s ease-out infinite;
		z-index: 1;
	}

	@keyframes lm-pulse {
		0% {
			transform: translate(-50%, -50%) scale(0.4);
			opacity: 0.9;
		}
		70% {
			opacity: 0.15;
		}
		100% {
			transform: translate(-50%, -50%) scale(2);
			opacity: 0;
		}
	}

	/* ── Tooltip ──────────────────────────────────────────────────────── */

	:global(.map-tooltip) {
		background: rgba(var(--tooltip-dark-rgb), 0.93) !important;
		color: var(--on-dark) !important;
		border: none !important;
		border-radius: 8px !important;
		padding: 0 !important;
		box-shadow: 0 4px 16px rgba(var(--ink-rgb), 0.25) !important;
		font-family: inherit !important;
	}

	:global(.map-tooltip .leaflet-tooltip-content) {
		padding: 0;
	}

	:global(.tt-name) {
		font-size: 13px;
		font-weight: 700;
		padding: 7px 13px 6px;
		line-height: 1;
	}

	:global(.tt-status) {
		font-size: 11px;
		font-weight: 400;
		color: rgba(var(--on-dark-rgb), 0.65);
		padding: 0 13px 8px;
		line-height: 1;
	}

	:global(.map-tooltip.leaflet-tooltip-top::before) {
		border-top-color: rgba(var(--tooltip-dark-rgb), 0.93) !important;
	}

	/* ── Leaflet overrides ────────────────────────────────────────────── */

	:global(.leaflet-attribution-flag) {
		display: none !important;
	}

	:global(.leaflet-control-attribution) {
		font-size: 10px;
		opacity: 0.55;
		border-radius: 6px 0 0 0;
	}

	:global(.leaflet-control-zoom) {
		border: none !important;
		box-shadow: 0 2px 8px rgba(var(--ink-rgb), 0.12) !important;
	}

	:global(.leaflet-control-zoom a) {
		border-radius: 6px !important;
		color: var(--text) !important;
		border-color: var(--border) !important;
	}

	/* ── Legend ───────────────────────────────────────────────────────── */

	.legend {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		margin-top: 0.875rem;
		font-size: 0.82rem;
		color: var(--text-secondary);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.legend-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		display: inline-block;
		flex-shrink: 0;
	}

	.legend-dot.active {
		background: var(--brand);
		border: 2.5px solid var(--white);
		box-shadow: 0 0 0 1.5px var(--brand);
	}

	.legend-dot.forming {
		background: rgba(var(--brand-rgb), 0.35);
		border: 2px dashed var(--brand);
	}
</style>
