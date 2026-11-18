<script lang="ts">
	import { onMount } from 'svelte'
	import { CampaignPage, CampaignHero, CampaignSection } from '$components/campaign'

	const CAMPAIGN_ID = 'interpellez-les-dirigeants-du-g7-en-vue-du-sommet-devian'
	const CAMPAIGN_ID_G7 = 'call-on-g7-leaders-ahead-of-the-evian-summit'

	const title = 'G7 2026 : sécuriser plutôt qu’accélérer l’IA'
	const description =
		'En 2026, la France accueille le G7. Pause IA demande que la sécurité de l’IA soit remise au cœur de l’agenda international.'

	onMount(() => {
		const SCRIPT_SRC = 'https://app.activoice.org/embed/v1/loader.js'

		function initEmbeds() {
			const w = window as Window & {
				Activoice?: { init: (opts: Record<string, unknown>) => void }
			}
			if (!w.Activoice) return
			w.Activoice.init({
				container: '#av-embed-container',
				campaignId: CAMPAIGN_ID,
				embedOptions: { spinnerColor: '#005DCA' }
			})
			w.Activoice.init({
				container: '#av-embed-container-g7',
				campaignId: CAMPAIGN_ID_G7,
				embedOptions: { spinnerColor: '#005DCA' }
			})
		}

		const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
		if (existing) {
			if ((window as Window & { Activoice?: unknown }).Activoice) {
				initEmbeds()
			} else {
				existing.addEventListener('load', initEmbeds, { once: true })
			}
			return
		}

		const script = document.createElement('script')
		script.src = SCRIPT_SRC
		script.async = true
		script.addEventListener('load', initEmbeds, { once: true })
		document.head.appendChild(script)
	})
</script>

<CampaignPage {title} {description} width="wide">
	<CampaignHero
		title="Le rôle du G7 ne devrait pas être d’accélérer mais de sécuriser l’IA"
		lede="En 2026, la France accueille le G7. Alors que les systèmes d’IA deviennent plus puissants et plus difficiles à contrôler, Pause IA demande que la sécurité soit mise au cœur de l’agenda."
		eyebrow="Campagne"
	/>

	<CampaignSection>
		<p>
			En 2023, sous présidence japonaise, le G7 avait lancé le
			<strong>Processus d’Hiroshima sur l’IA</strong>, avec pour objectif de promouvoir un code de
			conduite international pour les organisations développant des systèmes d’IA avancés. Le Japon
			avait alors utilisé sa présidence pour mettre concrètement la sécurité de l’IA à l’agenda
			international et souligner la nécessité de standards communs.
		</p>
		<p>
			Mais depuis, le ton a changé. En 2025, au Canada, la déclaration des dirigeants du G7 sur l’IA
			s’intitulait <strong>« L’IA pour la prospérité »</strong>. Le cœur du message n’était plus la
			prudence face à des systèmes de plus en plus puissants, mais l’accélération de leur adoption
			dans l’économie et les services publics.
		</p>

		<h2>Accélérer ou sécuriser : je choisis la sécurité</h2>
		<p>
			Pour le sommet de 2026, la présidence française a identifié 4 enjeux :
			<strong>garantir une IA sûre au service du bien commun</strong>,
			<strong>accélérer la diffusion et l’innovation de l’IA dans l’économie</strong>,
			<strong>concilier résilience et durabilité dans le secteur numérique</strong>, et
			<strong>protéger les mineurs en ligne</strong>.
		</p>
		<p>
			La sécurité est inscrite dans une logique d’accélération : développer, diffuser, intégrer l’IA
			partout, puis tenter d’en limiter les risques par des engagements volontaires.
		</p>
		<p>
			Pause IA dénonce cette approche : on ne peut pas, en même temps, accélérer le déploiement de
			systèmes d’IA toujours plus puissants et prétendre garantir leur sécurité avec de simples
			codes de conduite non contraignants. La sécurité doit devenir une condition préalable au
			développement et au déploiement des systèmes d’IA avancés.
		</p>
		<p>
			Nous sommes très nombreux à le penser. Publiée en mai 2026, une <a
				href="https://cesia.org/fr/publications/sondage-ia-2026/"
				target="_blank"
				rel="noopener noreferrer">enquête d’opinion</a
			> conduite par OpinionWay pour le Centre pour la Sécurité de l’IA révèle que seuls 8 % des Français
			souhaitent accélérer le développement de l’IA. À l’inverse, une très large majorité d’entre eux,
			tous bords politiques confondus, se déclarent favorables à ce que cette technologie soit davantage
			encadrée et à ce que son développement soit prioritairement orienté vers la « sécurité, les droits
			et l’éthique ».
		</p>
	</CampaignSection>

	<CampaignSection
		id="agir"
		title="J’agis pour la sécurité de l’IA"
		intro="Demandez aux dirigeants du G7 de traiter la sécurité de l’IA à la hauteur des vrais enjeux."
	>
		<p>
			Pause IA a préparé pour vous un outil pratique et rapide pour leur envoyer un e-mail ou les
			interpeller via les réseaux sociaux, en français et en anglais.
		</p>

		<h3>1) En français</h3>
		<p>
			Interpellez le président de la République Emmanuel Macron et la ministre chargée du numérique
			Anne Le Hénanff.
		</p>
	</CampaignSection>

	<CampaignSection variant="card">
		<div id="av-embed-container"></div>
	</CampaignSection>

	<CampaignSection>
		<h3>2) En anglais</h3>
		<p>Interpellez tous les chefs d’État et les ministres du numérique des pays du G7.</p>
	</CampaignSection>

	<CampaignSection variant="card">
		<div id="av-embed-container-g7"></div>
	</CampaignSection>
</CampaignPage>

<style>
	/* Activoice injecte son iframe dans ces conteneurs : sans largeur forcée,
	   le formulaire déborde de la colonne sur petit écran. */
	#av-embed-container,
	#av-embed-container-g7 {
		min-height: 400px;
		width: 100%;
		max-width: 100%;
	}

	#av-embed-container :global(iframe),
	#av-embed-container-g7 :global(iframe) {
		width: 100% !important;
		max-width: 100% !important;
		min-height: 400px;
		border: 0;
		display: block;
	}
</style>
