<script lang="ts">
	/**
	 * Modèle de page campagne.
	 *
	 * Ordre de lecture voulu : slogan → chapeau → l'essentiel en trois faits →
	 * modes d'action → contexte → événements. Les blocs « Chiffres clés » et
	 * « Chronologie » sont facultatifs : une campagne sans chiffres ni échéances
	 * les retire, ce n'est pas un gabarit rigide.
	 *
	 * Mode d'emploi : docs/module-campagne.md
	 */
	import Button from '$components/Button.svelte'
	import Callout from '$components/Callout.svelte'
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import {
		CampaignPage,
		CampaignHero,
		CampaignSection,
		CampaignFacts,
		CampaignStats,
		CampaignTimeline,
		CampaignActions,
		LumaCalendar
	} from '$components/campaign'
	import type {
		CampaignAction,
		CampaignFact,
		CampaignStat,
		TimelinePhase
	} from '$components/campaign'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	// Calendrier Luma de Pause IA : tous les événements des groupes locaux.
	const LUMA_CALENDAR_ID = 'cal-PLtig5in051g5mM'
	const LUMA_CALENDAR_URL = 'https://luma.com/pause-ia'

	$: title = isEn ? 'Campaign page template' : 'Page campagne · modèle'
	$: description = isEn
		? 'Reference page showing every building block of the campaign module: slogan, standfirst, key facts, ways to act, context, events.'
		: 'Page de référence présentant toutes les briques du module campagne : slogan, chapeau, faits marquants, modes d’action, contexte, événements.'

	// ── 1. L'essentiel ────────────────────────────────────────────────
	// Deux à quatre affirmations courtes, chacune reliée à ce qui la démontre.
	// Au moins une doit renvoyer vers un article d'analyse publié par nos soins.
	$: facts = (
		isEn
			? [
					{
						statement: 'AI systems now beat humans at offensive cybersecurity.',
						detail: 'Attack has become far cheaper than defence, and the gap is widening.',
						href: '/en/articles/2026-09-15-personne-ne-controle-lia',
						linkLabel: 'Read our analysis'
					},
					{
						statement: 'The labs themselves say they no longer fully control their models.',
						detail: 'Autonomous agents escape the surveillance of the people who trained them.',
						href: '/en/articles/2026-08-10-incident-openai-hugging-face',
						linkLabel: 'Read the incident report'
					},
					{
						statement: 'Racing and safety are no longer compatible.',
						href: '/en/articles/2026-09-17-course-et-securite-ne-sont-plus-compatibles',
						linkLabel: 'Read our analysis'
					}
				]
			: [
					{
						statement: 'L’IA dépasse désormais les humains en matière de sécurité informatique.',
						detail: 'L’attaque coûte bien moins cher que la défense, et l’écart se creuse.',
						href: '/fr/articles/2026-09-15-personne-ne-controle-lia',
						linkLabel: 'Lire notre analyse'
					},
					{
						statement: 'Les laboratoires eux-mêmes reconnaissent ne plus maîtriser leurs modèles.',
						detail: 'Des agents autonomes échappent à la surveillance de ceux qui les entraînent.',
						href: '/fr/articles/2026-08-10-incident-openai-hugging-face',
						linkLabel: 'Lire notre analyse de l’incident'
					},
					{
						statement: 'Course à la puissance et sécurité ne sont plus compatibles.',
						href: '/fr/articles/2026-09-17-course-et-securite-ne-sont-plus-compatibles',
						linkLabel: 'Lire notre analyse'
					}
				]
	) satisfies CampaignFact[]

	// ── 2. Modes d'action secondaires ─────────────────────────────────
	// Le module d'envoi de mails est intégré à la page (voir plus bas) ; ces
	// cartes couvrent les autres façons de participer.
	$: actions = (
		isEn
			? [
					{
						title: 'Join a local group',
						description: 'Meet the people organising the campaign near you.',
						cta: 'Find my group',
						href: '/en/groupes-locaux',
						featured: true
					},
					{
						title: 'Share the campaign',
						description: 'One post reaches more people than one letter.',
						cta: 'See the material',
						href: '/en/ressources'
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
						title: 'Rejoindre un groupe local',
						description: 'Rencontrez les personnes qui organisent la campagne près de chez vous.',
						cta: 'Trouver mon groupe',
						href: '/fr/groupes-locaux',
						featured: true
					},
					{
						title: 'Relayer la campagne',
						description: 'Une publication touche plus de monde qu’une lettre.',
						cta: 'Voir le matériel',
						href: '/fr/ressources'
					},
					{
						title: 'Nous soutenir',
						description: 'Nos campagnes reposent sur les dons de personnes comme vous.',
						cta: 'Faire un don',
						href: '/fr/dons'
					}
				]
	) satisfies CampaignAction[]

	// ── Blocs facultatifs ─────────────────────────────────────────────
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
</script>

<CampaignPage {title} {description}>
	<!-- 1. Slogan + chapeau. Le slogan est le titre de la campagne, repris à
	     l’identique dans le menu ; le chapeau l’éclaire et annonce le mode
	     d’action principal. -->
	<CampaignHero
		title={isEn
			? 'Take back control of AI'
			: 'Nous sommes au bord de la perte de contrôle : réagissons'}
		eyebrow={isEn ? 'Campaign under way' : 'Campagne en cours'}
		date={isEn ? 'Since September 2026' : 'Depuis septembre 2026'}
		lede={isEn
			? 'The people who build these systems no longer fully control them. We are asking Parliament for a moratorium, write to your MPs in two minutes.'
			: 'Ceux qui construisent ces systèmes ne les maîtrisent plus complètement. Nous demandons un moratoire au Parlement : écrivez à vos élus en deux minutes.'}
	>
		<Button href="#agir">{isEn ? 'Take action' : 'Passer à l’action'}</Button>
		<Button alt href="#essentiel">{isEn ? 'Why it matters' : 'Pourquoi c’est grave'}</Button>
	</CampaignHero>

	<!-- 2. L'essentiel : trois faits, trois liens. C’est ce que lira un
	     visiteur pressé ; chaque affirmation doit être démontrable. -->
	<CampaignSection
		id="essentiel"
		title={isEn ? 'The essentials' : 'L’essentiel en trois faits'}
		intro={isEn
			? 'Three verifiable statements, each linking to the analysis that backs it.'
			: 'Trois affirmations vérifiables, chacune reliée à l’analyse qui la démontre.'}
	>
		<CampaignFacts {facts} />
	</CampaignSection>

	<!-- 3. Les modes d’action. Le module d’envoi de mails est intégré ici :
	     l’action principale se fait sur la page, pas ailleurs. -->
	<CampaignSection
		id="agir"
		title={isEn ? 'Take action' : 'Passer à l’action'}
		intro={isEn
			? 'Two minutes for an email to your MPs. Everything is pre-written; you edit before sending.'
			: 'Deux minutes pour un mail à vos parlementaires. Tout est pré-rédigé, vous modifiez avant d’envoyer.'}
	>
		<EcrireOutil lang={data.lang} embedded requireName headingLevel="h3" />
	</CampaignSection>

	<CampaignSection
		id="autres-actions"
		title={isEn ? 'Other ways to help' : 'Les autres façons d’aider'}
		variant="accent"
	>
		<CampaignActions {actions} />
	</CampaignSection>

	<!-- 4. Le contexte : le développement, pour qui veut aller plus loin. -->
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

	<!-- 5. Les événements, quand la campagne en comporte. -->
	<CampaignSection
		id="evenements"
		title={isEn ? 'Upcoming events' : 'Les prochains événements'}
		intro={isEn
			? 'The Luma calendar, embedded in the page. It also lists events created by other organisers.'
			: 'Le calendrier Luma, intégré à la page. Il référence aussi les événements créés par d’autres organisateurs.'}
		variant="card"
	>
		<LumaCalendar
			calendarId={LUMA_CALENDAR_ID}
			title={isEn ? 'Pause AI events calendar' : 'Calendrier des événements Pause IA'}
			calendarUrl={LUMA_CALENDAR_URL}
			calendarLinkLabel={isEn ? 'See all events on Luma' : 'Voir tous les événements sur Luma'}
		/>
	</CampaignSection>

	<!-- ── Blocs facultatifs ───────────────────────────────────────────
	     À garder seulement s’ils disent quelque chose. Une campagne qui
	     démarre n’a pas de chiffres ; une action permanente n’a pas
	     d’échéances. -->
	<CampaignSection id="chiffres" title={isEn ? 'Key figures' : 'Chiffres clés'}>
		<CampaignStats {stats} />
	</CampaignSection>

	<CampaignSection id="chronologie" title={isEn ? 'Timeline' : 'Chronologie'}>
		<CampaignTimeline {phases} />
	</CampaignSection>

	<CampaignSection id="suite" title={isEn ? 'Keep reading' : 'Pour aller plus loin'}>
		<p>
			<a href="{prefix}/campagnes">{isEn ? 'All our campaigns' : 'Toutes nos campagnes'}</a>
		</p>
	</CampaignSection>
</CampaignPage>
