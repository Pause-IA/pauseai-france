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
{:else if as === 'h3'}
	<h3 id={id || undefined} style={`--underline-color: ${underlineColor}`}>
		<span>
			<slot />
		</span>
	</h3>
{/if}

<style>
	h1,
	h2,
	h3 {
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
	h2::after,
	h3::after {
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

	/* Le h3 est un titre de bloc À L'INTÉRIEUR d'une bande déjà titrée en h2 :
	   avec le même filet de 4 px, deux traits pleins se répondaient à quelques
	   centaines de pixels et la hiérarchie se perdait. Filet plus fin, plus
	   court, et moins d'air sous le titre. */
	h3 {
		font-size: clamp(1.15rem, 2.2vw, 1.35rem);
		margin-bottom: 1.5rem;
		padding-bottom: 0.65rem;
	}

	h3::after {
		height: 2px;
		right: auto;
		inline-size: 4rem;
		background: var(--underline-color, var(--brand));
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

		h3 {
			margin-bottom: 1.75rem;
		}
	}
</style>
