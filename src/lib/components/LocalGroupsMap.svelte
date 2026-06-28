<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { localGroups as groups } from '$lib/data/local-groups'

	let mapContainer: HTMLDivElement
	let map: import('leaflet').Map | null = null

	onMount(async () => {
		const L = (await import('leaflet')).default
		await import('leaflet/dist/leaflet.css')

		map = L.map(mapContainer, {
			scrollWheelZoom: false,
			zoomControl: true,
			attributionControl: true
		})

		map.fitBounds(
			[
				[41.3, -5.5],
				[51.6, 10.0]
			],
			{ padding: [20, 20] }
		)

		// Jawg Light — clean minimal design, French labels via lang=fr
		L.tileLayer(
			'https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=tPbKo2PQZw6CPVmNp3lYWRAV1aFiXbviN8bPJIo0K36w58mikRPrQdsLgVNqWhrT&lang=fr',
			{
				attribution:
					'&copy; <a href="https://jawg.io">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

			const tooltipContent = group.forming
				? `<div class="tt-name">${group.name}</div><div class="tt-status">En cours de création</div>`
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
			En cours de création
		</span>
	</div>
</div>

<style>
	.map-wrap {
		width: 100%;
	}

	.map-container {
		height: 500px;
		border-radius: 16px;
		overflow: hidden;
		box-shadow:
			0 4px 6px rgba(0, 0, 0, 0.04),
			0 10px 40px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--border, #e5e7eb);
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
		background: #ff9416;
		border: 2.5px solid #fff;
		box-shadow: 0 2px 8px rgba(255, 148, 22, 0.55);
		z-index: 2;
	}

	:global(.lm-forming .lm-dot) {
		background: rgba(255, 148, 22, 0.35);
		border: 2px dashed #ff9416;
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
		background: rgba(255, 148, 22, 0.28);
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
		background: rgba(17, 17, 17, 0.93) !important;
		color: #fff !important;
		border: none !important;
		border-radius: 8px !important;
		padding: 0 !important;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
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
		color: rgba(255, 255, 255, 0.65);
		padding: 0 13px 8px;
		line-height: 1;
	}

	:global(.map-tooltip.leaflet-tooltip-top::before) {
		border-top-color: rgba(17, 17, 17, 0.93) !important;
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
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
	}

	:global(.leaflet-control-zoom a) {
		border-radius: 6px !important;
		color: var(--text, #111) !important;
		border-color: var(--border, #e5e7eb) !important;
	}

	/* ── Legend ───────────────────────────────────────────────────────── */

	.legend {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		margin-top: 0.875rem;
		font-size: 0.82rem;
		color: var(--text-secondary, #676e7a);
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
		background: #ff9416;
		border: 2.5px solid #fff;
		box-shadow: 0 0 0 1.5px #ff9416;
	}

	.legend-dot.forming {
		background: rgba(255, 148, 22, 0.35);
		border: 2px dashed #ff9416;
	}
</style>
