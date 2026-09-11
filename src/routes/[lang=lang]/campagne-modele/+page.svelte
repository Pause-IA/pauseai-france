<script lang="ts">
	import Button from '$components/Button.svelte'
	import Callout from '$components/Callout.svelte'
	import {
		CampaignPage,
		CampaignHero,
		CampaignSection,
		CampaignStats,
		CampaignTimeline,
		CampaignActions,
		LumaCalendar
	} from '$components/campaign'
	import type { CampaignAction, CampaignStat, TimelinePhase } from '$components/campaign'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'

	// Calendrier Luma de test partagé par l'équipe.
	const LUMA_CALENDAR_ID = 'cal-5ZNtr1GO7aUSyiY'

	$: title = isEn ? 'Campaign page template' : 'Page campagne — modèle'
	$: description = isEn
		? 'Reference page showing every building block of the campaign module: hero, key figures, timeline, actions, Luma event calendar.'
		: 'Page de référence présentant toutes les briques du module campagne : hero, chiffres clés, chronologie, actions, calendrier d’événements Luma.'

	$: stats = (
		isEn
			? [
					{ value: '+1 000', label: 'Emails sent to decision-makers' },
					{ value: '43', label: 'Candidates who signed the charter' },
					{ value: '12', label: 'Local groups mobilised' }
				]
			: [
					{ value: '+1 000', label: 'Mails envoyés aux décideurs' },
					{ value: '43', label: 'Candidat·es signataires de la charte' },
					{ value: '12', label: 'Groupes locaux mobilisés' }
				]
	) satisfies CampaignStat[]

	$: phases = (
		isEn
			? [
					{
						tag: 'Step 1',
						label: 'Launch',
						period: 'January',
						events: [
							{ date: '10 January', text: 'Campaign launch and press release.' },
							{ date: '18 January', text: 'First public meeting with local groups.' }
						]
					},
					{
						tag: 'Step 2',
						label: 'Mobilisation',
						period: 'February to March',
						accent: true,
						events: [
							{ date: 'February', text: 'Letters sent to elected representatives.' },
							{ date: '15 March', text: 'Deadline: election day.' }
						]
					}
				]
			: [
					{
						tag: 'Étape 1',
						label: 'Lancement',
						period: 'janvier',
						events: [
							{ date: '10 janvier', text: 'Lancement de la campagne et communiqué de presse.' },
							{ date: '18 janvier', text: 'Première réunion publique avec les groupes locaux.' }
						]
					},
					{
						tag: 'Étape 2',
						label: 'Mobilisation',
						period: 'février à mars',
						accent: true,
						events: [
							{ date: 'Février', text: 'Envoi des courriers aux élus.' },
							{ date: '15 mars', text: 'Échéance : jour du scrutin.' }
						]
					}
				]
	) satisfies TimelinePhase[]

	$: actions = (
		isEn
			? [
					{
						title: 'Write to your MP',
						description: 'Two minutes, a pre-written email you can edit before sending.',
						cta: 'Write now',
						href: '/en/ecrire-a-mes-elus',
						featured: true
					},
					{
						title: 'Join a local group',
						description: 'Meet the people organising the campaign near you.',
						cta: 'Find my group',
						href: '/en/groupes-locaux'
					},
					{
						title: 'Support us',
						description: 'Our campaigns run on donations from people like you.',
						cta: 'Donate',
						href: '/en/dons'
					}
				]
			: [
					{
						title: 'Écrire à mon député',
						description: 'Deux minutes, avec un courrier pré-rédigé que vous pouvez modifier.',
						cta: 'J’écris maintenant',
						href: '/fr/ecrire-a-mes-elus',
						featured: true
					},
					{
						title: 'Rejoindre un groupe local',
						description: 'Rencontrez les personnes qui organisent la campagne près de chez vous.',
						cta: 'Trouver mon groupe',
						href: '/fr/groupes-locaux'
					},
					{
						title: 'Nous soutenir',
						description: 'Nos campagnes reposent sur les dons de personnes comme vous.',
						cta: 'Faire un don',
						href: '/fr/dons'
					}
				]
	) satisfies CampaignAction[]
</script>

<CampaignPage {title} {description}>
	<CampaignHero
		title={isEn ? 'Campaign page template' : 'Un modèle unique pour toutes nos pages campagne'}
		eyebrow={isEn ? 'Template' : 'Modèle'}
		date={isEn ? 'Internal reference' : 'Page de référence interne'}
		lede={isEn
			? 'This page assembles every block of the campaign module. Copy it, replace the content, ship a campaign page in an hour.'
			: 'Cette page assemble toutes les briques du module campagne. On la copie, on remplace le contenu, et une page campagne est en ligne en une heure.'}
	>
		<Button href="#evenements">{isEn ? 'See the events' : 'Voir les événements'}</Button>
		<Button alt href="/fr/campagnes">{isEn ? 'All campaigns' : 'Toutes les campagnes'}</Button>
	</CampaignHero>

	<CampaignSection
		id="contexte"
		title={isEn ? 'The context' : 'Le contexte'}
		intro={isEn
			? 'One or two paragraphs explaining the problem and what we are asking for.'
			: 'Un ou deux paragraphes qui expliquent le problème et ce que nous demandons.'}
	>
		<p>
			{isEn
				? 'Prose blocks inherit the site typography: left-aligned, comfortable line-height, brand-coloured links. Nothing to restyle per campaign.'
				: 'Les blocs de texte héritent de la typographie du site : alignement à gauche, interlignage confortable, liens à la couleur de la marque. Rien à re-styler pour chaque campagne.'}
		</p>
		<Callout title={isEn ? 'Our demand' : 'Notre demande'}>
			{isEn
				? 'Mandatory, independent safety evaluations before any frontier model is deployed.'
				: 'Des évaluations de sécurité indépendantes et obligatoires avant tout déploiement d’un modèle de pointe.'}
		</Callout>
	</CampaignSection>

	<CampaignSection id="chiffres" title={isEn ? 'Key figures' : 'Chiffres clés'}>
		<CampaignStats {stats} />
	</CampaignSection>

	<CampaignSection id="chronologie" title={isEn ? 'Timeline' : 'Chronologie'}>
		<CampaignTimeline {phases} />
	</CampaignSection>

	<CampaignSection
		id="evenements"
		title={isEn ? 'Upcoming events' : 'Les prochains événements'}
		intro={isEn
			? 'The Luma calendar, embedded in the page. It also lists events created by other organisers we reference.'
			: 'Le calendrier Luma, intégré à la page. Il référence aussi les événements créés par d’autres organisateurs.'}
		variant="card"
	>
		<LumaCalendar
			calendarId={LUMA_CALENDAR_ID}
			title={isEn ? 'Pause AI events calendar' : 'Calendrier des événements Pause IA'}
			calendarUrl={`https://luma.com/${LUMA_CALENDAR_ID}`}
			calendarLinkLabel={isEn ? 'See all events on Luma' : 'Voir tous les événements sur Luma'}
		/>
	</CampaignSection>

	<CampaignSection id="agir" title={isEn ? 'Take action' : 'Passer à l’action'} variant="accent">
		<CampaignActions {actions} />
	</CampaignSection>
</CampaignPage>
