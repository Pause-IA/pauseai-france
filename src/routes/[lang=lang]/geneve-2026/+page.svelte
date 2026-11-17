<script lang="ts">
	import { onMount } from 'svelte'
	import { CampaignPage, CampaignHero, CampaignSection } from '$components/campaign'
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

<CampaignPage {title} {description} width="wide">
	<CampaignHero
		title={isEn ? 'Geneva 2026' : 'Genève 2026'}
		lede={isEn
			? 'Ask France to support an international treaty on AI.'
			: 'Demandez à la France de soutenir un traité international sur l’intelligence artificielle.'}
		eyebrow={isEn ? 'Campaign' : 'Campagne'}
		date={isEn ? '6–7 July 2026' : '6 et 7 juillet 2026'}
	/>

	<CampaignSection>
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
	</CampaignSection>

	<CampaignSection
		id="agir"
		title={isEn ? 'Write to the French delegation' : 'J’écris à la délégation française'}
		variant="card"
	>
		<div id="av-embed-container"></div>
	</CampaignSection>

	<CampaignSection>
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
	</CampaignSection>
</CampaignPage>

<style>
	/* Activoice injecte son iframe dans ce conteneur : sans largeur forcée, le
	   formulaire déborde de la colonne sur petit écran. */
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
</style>
