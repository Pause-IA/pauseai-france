<script lang="ts">
	import type { TimelinePhase } from './types'

	/** Chronologie d'une campagne ou d'un incident, groupée par phases. */
	export let phases: TimelinePhase[] = []
</script>

<div class="timeline">
	{#each phases as phase}
		<div class="phase" class:accent={phase.accent}>
			<div class="phase-head">
				{#if phase.tag}<span class="phase-tag">{phase.tag}</span>{/if}
				<h3>{phase.label}</h3>
				{#if phase.period}<span class="phase-period">{phase.period}</span>{/if}
			</div>
			<ul class="phase-list">
				{#each phase.events as event}
					<li class="phase-item">
						<span class="event-date">{event.date}</span>
						<span class="event-text">{event.text}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<style>
	.phase:not(:last-child) {
		margin-bottom: 1.75rem;
	}

	.phase-head {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-bottom: 0.9rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border);
	}

	.phase-tag {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--text-2);
	}

	.phase-head h3 {
		margin: 0;
		font-size: 1.15rem;
		line-height: 1.25;
	}

	.phase-period {
		font-size: 0.85rem;
		font-style: italic;
		color: var(--text-2);
	}

	.phase-list {
		list-style: none;
		margin: 0;
		padding: 0 0 0 1.35rem;
		border-left: 2px solid color-mix(in srgb, var(--brand) 30%, transparent);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.phase-item {
		position: relative;
		margin: 0;
		padding-left: 0;
	}

	.phase-item::before {
		content: '';
		position: absolute;
		left: -1.35rem;
		top: 0.4rem;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		background: var(--brand);
		transform: translateX(-50%);
		box-shadow: 0 0 0 3px var(--bg);
	}

	.phase.accent .phase-list {
		border-left-color: color-mix(in srgb, #d92d20 45%, transparent);
	}

	.phase.accent .phase-item::before {
		background: #d92d20;
	}

	.event-date {
		display: block;
		font-weight: 700;
		font-size: 0.9rem;
		margin-bottom: 0.15rem;
	}

	.event-text {
		display: block;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text);
	}
</style>
