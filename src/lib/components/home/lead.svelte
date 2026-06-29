<script lang="ts">
	import Button from '$components/Button.svelte'
	import Fly from '$components/Fly.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { fly } from 'svelte/transition'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'

	$: prefix = lang === 'en' ? '/en' : ''
	const label_id = 'lead-title'
</script>

<section class="lead" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id}>
			{#if lang === 'en'}
				The rise of artificial intelligence: an unprecedented challenge for humanity
			{:else}
				L'avènement de l'intelligence artificielle{'\u00A0'}: un défi sans précédent pour l'humanité
			{/if}
		</UnderlinedTitle>
	</Fly>
	<Fly>
		<div class="lead" aria-labelledby={label_id}>
			{#if lang === 'en'}
				<p>
					AI development is <a href="https://arxiv.org/abs/2001.08361"
						>progressing at breakneck speed</a
					>: in 2020, AI systems struggled to count to ten; today they already surpass human
					capabilities in many domains. While AI promises potential positive advances, the flip side
					is terrifying.
				</p>
				<p>
					According to <a href="https://www.safe.ai/work/statement-on-ai-risk#open-letter"
						>AI safety and ethics experts</a
					>, unchecked development also entails major risks: large-scale disinformation, mass
					manipulation, devastating cyberattacks, engineered pandemics, and loss of control over
					autonomous systems, even threatening the very survival of humanity.
				</p>
				<p>
					Pause AI, in line with the warnings of AI safety researchers, promotes responsible
					development of this rapidly evolving technology. We call for a moratorium on training more
					dangerous systems, to avoid a global catastrophe.
				</p>
				<p>
					The dangers are real, but hope exists. By acting together, we can shape a future where AI
					remains a beneficial tool for humanity.
				</p>
				<div class="buttons" in:fly={{ y: 20, duration: 300, delay: 700 }}>
					<Button href="{prefix}/dangers">Learn more</Button>
					<Button href="{prefix}/rejoindre">Join us</Button>
					<Button href="{prefix}/agir">Take action</Button>
				</div>
			{:else}
				<p>
					Le développement d'intelligences artificielles <a href="https://arxiv.org/abs/2001.08361"
						>progresse à une vitesse fulgurante</a
					>{'\u00A0'}: en 2020, elles peinaient à compter jusqu'à dix{'\u00A0'}; aujourd'hui, elles
					surpassent déjà les capacités humaines dans de nombreux domaines. Bien que l'IA promette
					des avancées positives potentielles, le revers de la médaille est terrifiant.
				</p>
				<p>
					D'après <a href="https://www.safe.ai/work/statement-on-ai-risk#open-letter"
						>les experts en sécurité et éthique de l'IA</a
					>, un développement incontrôlé comporte des risques majeurs{'\u00A0'}: désinformation à
					grande échelle, manipulation de masse, cyberattaques dévastatrices, pandémies
					artificielles, et perte de contrôle de systèmes autonomes, allant jusqu'à menacer la
					survie même de l'humanité.
				</p>
				<p>
					Pause IA, en accord avec les alertes des chercheurs en sécurité de l'IA, promeut un
					développement responsable de cette technologie en pleine expansion. Nous appelons à un
					moratoire sur l'entraînement de systèmes plus dangereux, afin d'éviter une catastrophe
					mondiale.
				</p>
				<p>
					Les dangers sont réels, mais l'espoir existe. En agissant ensemble, nous pouvons façonner
					un futur où l'IA demeure un outil bénéfique pour l'humanité.
				</p>
				<div class="buttons" in:fly={{ y: 20, duration: 300, delay: 700 }}>
					<Button href="/dangers">Informez-vous</Button>
					<Button href="/rejoindre">Rejoignez-nous</Button>
					<Button href="/agir">Passez à l'action</Button>
				</div>
			{/if}
		</div>
	</Fly>
</section>

<style>
	.lead {
		align-self: center;
		max-width: 60rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.buttons {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2rem;
		justify-content: center;
	}
</style>
