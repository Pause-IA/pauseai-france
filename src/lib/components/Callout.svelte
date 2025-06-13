<script lang="ts">
	export let title: string = ''
</script>

<div class="callout">
	{#if title}
		<div class="callout-title">
			{title}
		</div>
	{/if}
	<div class="callout-content">
		<slot />
	</div>
</div>

<style>
	.callout {
		background-color: var(--bg-subtle);
		border: 2px solid var(--brand);
		border-radius: 0.3125rem;
		padding: 1.5rem;
		margin: 2rem 0;
		font-size: 1rem;
		line-height: 1.5;
	}

	.callout-title {
		font-weight: 700;
		font-family: var(--font-heading);
		color: var(--text);
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.callout-content {
		color: var(--text);
	}

	/* Ensure proper spacing for nested elements */
	.callout-content > :first-child {
		margin-top: 0;
	}

	.callout-content > :last-child {
		margin-bottom: 0;
	}

	/* Handle nested lists with brand-colored bullets */
	.callout-content :global(ul) {
		padding-left: 1.2rem;
	}

	.callout-content :global(li) {
		margin: 0.3rem 0;
		padding-left: 0.5rem;
	}

	/* Handle paragraphs within callout */
	.callout-content :global(p) {
		margin-bottom: 1rem;
	}

	.callout-content :global(p:last-child) {
		margin-bottom: 0;
	}

	@media (min-width: 640px) {
		.callout {
			padding: 2rem;
		}
	}
</style> 