<script lang="ts">
	import { onMount } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'

	const CAMPAIGN_ID = '62242118-a2d0-4cfc-b9a9-b93e24ac319f'

	$: title = isEn
		? 'Geneva 2026: support an international AI treaty'
		: 'Genève 2026 : soutenir un traité international sur l’IA'
	$: description = isEn
		? 'On 6-7 July 2026, the UN convenes the Global Dialogue on AI Governance in Geneva. Write to the French delegation to ask it to support an international AI treaty.'
		: 'Les 6 et 7 juillet 2026, l’ONU réunit à Genève le Dialogue mondial sur la gouvernance de l’IA. Écrivez à la délégation française pour lui demander de soutenir un traité international sur l’IA.'

	onMount(() => {
		const SCRIPT_SRC = 'https://app.activoice.org/embed/v1/loader.js'

		function initEmbed() {
			const w = window as Window & {
				Activoice?: { init: (opts: Record<string, unknown>) => void }
			}
			if (!w.Activoice) return
			w.Activoice.init({
				container: '#av-embed-container',
				campaignId: CAMPAIGN_ID,
				embedOptions: { spinnerColor: '#005DCA' }
			})
		}

		const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
		if (existing) {
			if ((window as Window & { Activoice?: unknown }).Activoice) {
				initEmbed()
			} else {
				existing.addEventListener('load', initEmbed, { once: true })
			}
			return
		}

		const script = document.createElement('script')
		script.src = SCRIPT_SRC
		script.async = true
		script.addEventListener('load', initEmbed, { once: true })
		document.head.appendChild(script)
	})
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		{#if isEn}
			<p class="eyebrow">{isEn ? 'Campaign' : 'Campagne'}</p>
			<h1>Geneva 2026</h1>
			<p class="lede">
				<strong>Ask France to support an international treaty on AI.</strong>
			</p>
		{:else}
			<p class="eyebrow">{isEn ? 'Campaign' : 'Campagne'}</p>
			<h1>Genève 2026</h1>
			<p class="lede">
				<strong
					>Demandez à la France de soutenir un traité international sur l’intelligence artificielle.</strong
				>
			</p>
		{/if}
	</section>

	<section class="prose">
		{#if isEn}
			<p>
				On 6 and 7 July 2026, the United Nations brings together representatives of member states in
				Geneva for the first summit meeting of a new international body: the
				<strong>Global Dialogue on AI Governance</strong>.
			</p>
			<p>
				This is a decisive moment. As the most advanced AI systems progress rapidly, no binding
				international framework currently guarantees that their development remains under democratic
				control.
			</p>
			<blockquote>
				“The question is no longer whether AI will transform our world, it already is. The question
				is whether we will govern this transformation together, or let it govern us.”
				<cite>António Guterres, Secretary-General of the United Nations</cite>
			</blockquote>
			<p>
				While the French delegation is gathered in Geneva to discuss AI governance, let us ask it
				for one concrete measure: <strong
					>to support an international treaty establishing a pause on the training of the most
					advanced AI models, until the conditions for safety and democratic control are met.</strong
				>
			</p>

			<hr class="section-divider" />

			<h2>Write to the French delegation</h2>
			<p>
				The diplomats, ministers and other political leaders present in Geneva are precisely the
				people tasked with carrying their country’s position into international discussions.
			</p>
			<p>
				For two days, they will exchange with their counterparts on how AI should be governed at the
				international level. This is the best moment to remind them of one simple thing:
				<strong
					>because of the extreme risks they pose to our societies, AI safety is a field to be taken
					seriously.</strong
				>
			</p>
			<p>
				In just a few clicks, you can send them a message asking them to support the call for an
				international treaty establishing a pause on the development of advanced general-purpose
				artificial intelligence models.
			</p>
		{:else}
			<p>
				Les 6 et 7 juillet 2026, l’Organisation des Nations Unies réunit à Genève des
				représentant·es des États membres pour la première rencontre au sommet d’une nouvelle
				instance internationale : le <strong
					>Dialogue mondial sur la gouvernance de l’intelligence artificielle</strong
				>.
			</p>
			<p>
				C’est un moment décisif. Alors que les systèmes d’IA les plus avancés progressent
				rapidement, aucun cadre international contraignant ne permet aujourd’hui de garantir que
				leur développement reste sous contrôle démocratique.
			</p>
			<blockquote>
				« La question n’est plus de savoir si l’IA va transformer notre monde, elle le fait déjà. La
				question est de savoir si nous allons gouverner cette transformation ensemble, ou la laisser
				nous gouverner. »
				<cite>António Guterres, Secrétaire général des Nations Unies</cite>
			</blockquote>
			<p>
				Pendant que la délégation française est réunie à Genève pour parler de gouvernance de l’IA,
				demandons-lui une mesure concrète : <strong
					>soutenir un traité international instaurant une pause dans l’entraînement des modèles
					d’IA les plus avancés, jusqu’à ce que les conditions de sécurité et de contrôle
					démocratique soient réunies.</strong
				>
			</p>

			<hr class="section-divider" />

			<h2>Écrivez à la délégation française</h2>
			<p>
				Les diplomates, ministres et autres responsables politiques présents à Genève sont
				précisément les personnes chargées de porter la position de leur pays dans les discussions
				internationales.
			</p>
			<p>
				Pendant deux jours, elles vont échanger avec leurs homologues sur la manière dont l’IA doit
				être encadrée au niveau international. C’est le meilleur moment pour leur rappeler une chose
				simple : <strong
					>en raison des risques extrêmes qu’ils font peser sur nos sociétés, la sécurité de l’IA
					est un domaine à prendre au sérieux.</strong
				>
			</p>
			<p>
				En quelques clics, vous pouvez leur envoyer un message pour leur demander de soutenir
				l’appel à un traité international instaurant une pause sur le développement des modèles
				avancés d’intelligence artificielle générale.
			</p>
		{/if}
	</section>

	<h2 class="embed-title">
		{isEn ? 'Write to the French delegation' : 'J’écris à la délégation française'}
	</h2>

	<section class="embed-section" id="agir">
		<div id="av-embed-container"></div>
	</section>

	<section class="prose closing">
		{#if isEn}
			<p>
				Every message counts. To amplify the impact of your action, we encourage you to share this
				campaign around you.
			</p>
		{:else}
			<p>
				Chaque message compte. Pour amplifier l’impact de votre action, nous vous encourageons à
				partager cette campagne autour de vous.
			</p>
		{/if}
	</section>
</article>

<style>
	/* Étiquette et titre du modèle, à la place du titre au filet dégradé. */
	.eyebrow {
		display: inline-block;
		margin: 0 0 1rem;
		padding: 0.3rem 0.7rem;
		border-radius: 3px;
		background: var(--brand);
		color: var(--on-brand);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	h1 {
		font-size: clamp(2.1rem, 6vw, 3.2rem);
		line-height: 1.06;
		letter-spacing: -0.025em;
		margin-bottom: 1.25rem;
	}

	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: left;
		margin-bottom: 2.5rem;
	}

	.lede {
		font-size: 1.2rem;
		line-height: 1.6;
		color: var(--text);
		margin-top: 1.5rem;
	}

	.prose {
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--text);
		margin-bottom: 2.5rem;
	}

	.prose h2 {
		font-size: 1.5rem;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
	}

	.prose p {
		margin-bottom: 1.2rem;
	}

	blockquote {
		margin: 2rem 0;
		padding: 1rem 1.5rem;
		border-left: 4px solid var(--brand);
		background: var(--bg-subtle, rgba(var(--brand-rgb), 0.06));
		border-radius: 0 10px 10px 0;
		font-style: italic;
		color: var(--text);
	}

	blockquote cite {
		display: block;
		margin-top: 0.75rem;
		font-style: normal;
		font-weight: 700;
		font-size: 0.92rem;
		color: var(--text-2);
	}

	.section-divider {
		border: 0;
		height: 4px;
		background: var(--brand);
		border-radius: 2px;
		margin: 3.5rem auto 1.5rem;
		width: 12rem;
	}

	.embed-title {
		margin: 0 0 1rem;
		font-size: 1.5rem;
	}

	.embed-section {
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
		padding: 2rem;
		border: 1px solid var(--border);
		box-shadow: var(--shadow-card);
		margin-bottom: 2.5rem;
		scroll-margin-top: 5rem;
	}

	.closing {
		color: var(--text-2);
		margin-bottom: 5rem;
	}

	#av-embed-container {
		min-height: 400px;
		width: 100%;
		max-width: 100%;
	}

	#av-embed-container :global(iframe) {
		width: 100% !important;
		max-width: 100% !important;
		min-height: 400px;
		border: 0;
		display: block;
	}

	@media (max-width: 600px) {
		.embed-section {
			padding: 1rem;
		}
	}
</style>
