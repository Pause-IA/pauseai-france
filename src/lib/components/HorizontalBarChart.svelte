<script lang="ts">
	export let data: { label: string; value: number; color: string; count?: number }[] = []
	export let title: string = ''
	export let withMargin = false

	$: max = 100
	let hoveredIndex: number | null = null
</script>

<div class="bar-chart-container" class:withMargin>
	<h3>{title}</h3>
	<div class="chart-wrapper">
		<div class="bars-list">
			{#each data as item, i}
				<div
					class="bar-item"
					class:active={hoveredIndex === i}
					on:mouseenter={() => (hoveredIndex = i)}
					on:mouseleave={() => (hoveredIndex = null)}
				>
					<div class="label-row">
						<span class="color-box" style="background-color: {item.color}"></span>
						<span class="label">{item.label}</span>
						{#if item.count}
							<span class="count-label">
								{item.count}
								{item.count > 1 ? 'participants' : 'participant'}
							</span>
						{/if}
						<span class="value">{item.value.toFixed(1)}%</span>
					</div>
					<div class="bar-bg">
						<div
							class="bar-fill"
							style="width: {(item.value / max) * 100}%; background-color: {item.color}"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.bar-chart-container {
		flex: 1;
		min-width: 300px;
		background: var(--bg-card, #fafafa);
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		transition: transform 0.3s ease;
		display: flex;
		flex-direction: column;
		max-height: 600px;
		overflow-y: auto;
	}

	.withMargin {
		margin: 2rem 0;
	}

	.bar-chart-container:hover {
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
		width: 100%;
	}

	.bars-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.bar-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 8px;
		transition: background 0.2s ease;
	}

	.bar-item:hover {
		background: rgba(0, 0, 0, 0.03);
	}

	.label-row {
		display: flex;
		align-items: center;
		font-size: 0.85rem;
		gap: 0.75rem;
		margin-bottom: 0.2rem;
	}

	.color-box {
		width: 12px;
		height: 12px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.label {
		color: var(--text-secondary);
		font-weight: 500;
		line-height: 1.2;
		flex: 1;
	}

	.count-label {
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin-left: auto;
		white-space: nowrap;
	}

	.value {
		font-weight: 700;
		color: var(--text);
		margin-left: 0.5rem;
		min-width: 50px;
		text-align: right;
	}

	.bar-bg {
		height: 8px;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 4px;
		overflow: hidden;
		margin-left: 1.5rem; /* Align with label text, after color-box */
	}

	.bar-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@media (max-width: 640px) {
		.bar-chart-container {
			min-width: 100%;
		}
	}
</style>
