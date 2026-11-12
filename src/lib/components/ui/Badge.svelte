<script lang="ts">
	/**
	 * Pastille de la charte. `brand` par défaut : le vert et le rouge
	 * signalent un état, jamais une décoration.
	 */
	export let variant: 'brand' | 'neutral' | 'outline' | 'success' | 'error' = 'brand'
	export let size: 'sm' | 'md' = 'md'
</script>

<span class="ui-badge {variant} {size}"><slot /></span>

<style>
	.ui-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		border: 1px solid transparent;
		border-radius: var(--radius-pill);
		font-weight: 700;
		line-height: 1;
		white-space: nowrap;
		width: fit-content;
	}

	.md {
		padding: 0.3rem 0.7rem;
		font-size: 0.8rem;
	}

	.sm {
		padding: 0.18rem 0.55rem;
		font-size: 0.72rem;
	}

	.brand {
		background: var(--brand);
		color: var(--on-brand);
	}

	.neutral {
		background: var(--bg-secondary);
		color: var(--text-secondary);
		border-color: var(--border);
	}

	.outline {
		background: transparent;
		color: var(--accent);
		border-color: var(--brand);
	}

	.success {
		background: var(--success-bg);
		color: var(--success);
		border-color: var(--success-border);
	}

	.error {
		background: var(--error-bg);
		color: var(--error);
		border-color: var(--error-border);
	}
</style>
