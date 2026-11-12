<script lang="ts">
	/** Ancre facultative : sans valeur, aucun attribut id n'est posé. */
	export let id: string | undefined = undefined
	export let as = 'h2'
	export let underlineColor = 'var(--brand)'
</script>

{#if as === 'h1'}
	<h1 id={id || undefined} style={`--underline-color: ${underlineColor}`}>
		<span>
			<slot />
		</span>
	</h1>
{:else if as === 'h2'}
	<h2 id={id || undefined} style={`--underline-color: ${underlineColor}`}>
		<span>
			<slot />
		</span>
	</h2>
{/if}

<style>
	h1,
	h2 {
		margin-top: 0;
		margin-bottom: 2rem;
		padding-bottom: 1.25rem;
		position: relative;
	}

	/* Filet dégradé, de l'orange plein vers le transparent.

	   Il partait à 0 % et s'éteignait à 75 % : sur la plus grande partie de
	   sa longueur, l'orange était déjà très dilué, et le trait paraissait
	   délavé — le « désaturé » signalé à la relecture. Il garde maintenant
	   l'orange plein sur son premier tiers avant de s'éteindre, donc la même
	   idée de fondu mais une attaque franche. */
	h1::after,
	h2::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(
			to right,
			var(--underline-color, var(--brand)) 0%,
			var(--underline-color, var(--brand)) 32%,
			transparent 85%
		);
		border-radius: 2px;
	}

	@media (min-width: 640px) {
		h1,
		h2 {
			margin-bottom: 4rem;
			padding-bottom: 1.5rem;
		}

		h1::after,
		h2::after {
			height: 5px;
		}
	}
</style>
