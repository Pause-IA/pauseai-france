<script lang="ts">
	export let data: { label: string; value: number; color: string }[] = []
	export let title: string = ''
	export let withMargin = false

	$: total = data.reduce((acc, item) => acc + item.value, 0)

	function getPathData() {
		if (total === 0 || data.length === 0) return []
		let cumulativePercent = 0
		return data.map((item) => {
			const startPercent = cumulativePercent
			// Clamp to slightly less than 1 when a single slice fills 100%
			// to avoid coincident start/end points (degenerate arc → NaN)
			const slicePercent = item.value / total
			const endPercent = cumulativePercent + (slicePercent >= 1 ? 0.9999 : slicePercent)
			cumulativePercent = endPercent

			const x1 = Math.cos(2 * Math.PI * startPercent)
			const y1 = Math.sin(2 * Math.PI * startPercent)
			const x2 = Math.cos(2 * Math.PI * endPercent)
			const y2 = Math.sin(2 * Math.PI * endPercent)

			const largeArcFlag = slicePercent > 0.5 ? 1 : 0

			return `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
		})
	}

	$: paths = total > 0 ? getPathData() : []

	let hoveredIndex: number | null = null
</script>

<div class="pie-chart-container" class:withMargin>
	<h3>{title}</h3>
	<div class="chart-wrapper">
		<svg viewBox="-1.1 -1.1 2.2 2.2" class="pie-svg">
			{#each paths as path, i}
				<path
					d={path}
					fill={data[i].color}
					class:hovered={hoveredIndex === i}
					on:mouseenter={() => (hoveredIndex = i)}
					on:mouseleave={() => (hoveredIndex = null)}
				>
					<title>{data[i].label}: {((data[i].value / total) * 100).toFixed(1)}%</title>
				</path>
			{/each}
		</svg>

		<div class="legend">
			{#each data as item, i}
				<div
					class="legend-item"
					class:active={hoveredIndex === i}
					on:mouseenter={() => (hoveredIndex = i)}
					on:mouseleave={() => (hoveredIndex = null)}
				>
					<span class="color-box" style="background-color: {item.color}"></span>
					<span class="label">{item.label}</span>
					<span class="value">{((item.value / total) * 100).toFixed(1)}%</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.pie-chart-container {
		flex: 1;
		min-width: 300px;
		background: var(--bg-card, #fafafa);
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		transition: transform 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-height: 500px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.withMargin {
		margin: 2rem;
	}

	.pie-chart-container:hover {
		transform: translateY(-5px);
	}

	h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
		text-align: center;
		color: var(--text);
	}

	.chart-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
	}

	.pie-svg {
		width: 150px;
		height: 150px;
		transform: rotate(-90deg);
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
	}

	path {
		transition:
			transform 0.2s ease,
			filter 0.2s ease;
		cursor: pointer;
		stroke: var(--bg-card, #fafafa);
		stroke-width: 0.01;
	}

	path.hovered {
		transform: scale(1.05);
		filter: brightness(1.1);
		z-index: 10;
	}

	.legend {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.85rem;
		padding: 0.25rem;
		border-radius: 4px;
		transition: background 0.2s ease;
		cursor: default;
	}

	.legend-item.active {
		background: rgba(0, 0, 0, 0.05);
	}

	.color-box {
		width: 12px;
		height: 12px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.label {
		flex: 1;
		color: var(--text-secondary);
	}

	.value {
		font-weight: 600;
		color: var(--text);
	}

	@media (max-width: 640px) {
		.pie-chart-container {
			min-width: 100%;
		}
	}
</style>
