<script lang="ts">
	import {
		CampaignPage,
		CampaignHero,
		CampaignSection,
		CampaignEmbed,
		LumaCalendar
	} from '$components/campaign'
	import ArticleCard from '$components/ArticleCard.svelte'
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import Button from '$components/Button.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	// Recentre la vue sur la section presse quand l'outil intégré change d'étape
	// (choix d'un journal / retour), au lieu de remonter en haut de la page.
	let pressSection: HTMLElement
	function scrollToPress() {
		pressSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	const VIDEO_ID = 'WhQViEjkg7s'
	// Calendrier Luma des actions militantes (agrège aussi les événements créés
	// par d'autres organisateurs).
	const LUMA_CALENDAR_ID = 'cal-PLtig5in051g5mM'
	const LUMA_CALENDAR_URL = 'https://luma.com/pause-ia'

	// Les trois cartes du hero de fresquedesrisquesdelia.org, en éventail.
	// Visuels issus du dépôt de la fresque (Pause IA, CC BY-SA 4.0) :
	// github.com/Romain-Deleglise/Fresque-des-risques-de-IA
	const FRESQUE_CARTES = [
		{ src: '/campaigns/fresque/14.webp', fr: 'Carte « Deepfake »', en: '“Deepfake” card' },
		{
			src: '/campaigns/fresque/08.webp',
			fr: 'Carte « Génération d’images »',
			en: '“Image generation” card'
		},
		{
			src: '/campaigns/fresque/28.webp',
			fr: 'Carte « Systèmes d’armes létales autonomes »',
			en: '“Lethal autonomous weapons” card'
		}
	]

	// Dates du temps fort militant (des actions isolées démarrent la veille :
	// le calendrier peut donc afficher une date antérieure au 21).
	const MOBILISATION_DATES_FR = 'Du 21 au 28 septembre'
	const MOBILISATION_DATES_EN = '21 to 28 September'

	$: title = isEn
		? 'We are on the brink of losing control: let’s react'
		: 'Nous sommes au bord de la perte de contrôle : réagissons'
	$: description = isEn
		? 'AI now outperforms humans at computer security, and the researchers who train these systems no longer control them. Join our call for a global moratorium on frontier AI development.'
		: 'L’IA dépasse désormais les humains en sécurité informatique, et les chercheurs qui les entraînent ne les maîtrisent plus. Relayez notre appel à un moratoire mondial sur le développement des IA de pointe.'

	$: mobilisationTitle = isEn
		? `${MOBILISATION_DATES_EN}: a week of action and a Fresk`
		: `${MOBILISATION_DATES_FR} : une semaine d’action et une fresque`
</script>

<CampaignPage {title} {description}>
	<CampaignHero
		title={isEn
			? 'We are on the brink of losing control: let’s react!'
			: 'Nous sommes au bord de la perte de contrôle : réagissons !'}
		eyebrow={isEn ? 'Campaign under way' : 'Campagne en cours'}
		lede={isEn
			? 'We are asking for the race to superintelligence to stop, for as long as nobody knows how to build these systems safely.'
			: 'Nous demandons l’arrêt de la course à la superintelligence, tant que personne ne sait construire ces systèmes sans danger.'}
	>
		<!-- Un visiteur déjà convaincu doit pouvoir agir sans traverser la page. -->
		<Button href="#ecrire">
			{isEn ? 'Write to my representatives' : 'Écrire à mes élus'}
		</Button>
	</CampaignHero>

	<!-- ── Le constat ───────────────────────────────────────── -->
	<CampaignSection>
		{#if isEn}
			<p>
				AI now outperforms humans at computer security. Given that security and hacking are two
				sides of the same expertise, and that attack is incomparably easier than defence,
				<strong>AI has become a weapon of mass cybercrime</strong>.
			</p>
			<p>
				On top of that, recent incidents have shown that the researchers who train these AIs no
				longer control them well enough. They are building
				<strong
					>highly intelligent autonomous agents that escape their oversight and their control.</strong
				>
			</p>
			<p>
				In a world entirely dependent on digital technology, we are therefore at the mercy of a
				series of <strong>deliberate but also accidental disasters.</strong>
			</p>
			<p>
				The warnings keep coming. The latest: researcher Jacob Coxon has just resigned from
				Anthropic, stating that
				<strong
					>“The people building AI sincerely believe it could kill us all by the end of the decade.
					This is not a marketing stunt”.</strong
				>
			</p>
			<p>
				In response, the American labs promise to agree among themselves to devote a little more
				time and resources to safety.
				<strong>A derisory promise, an astounding situation: we must react.</strong>
			</p>
		{:else}
			<p>
				L’IA dépasse désormais les humains en matière de sécurité informatique. Sachant que sécurité
				et piratage sont deux facettes d’une même expertise et que l’attaque est incomparablement
				plus facile que la défense,
				<strong>l’IA est devenue une arme de cybercriminalité massive</strong>.
			</p>
			<p>
				En outre, de récents incidents ont montré que les chercheurs qui entraînent les IA ne les
				maîtrisent plus suffisamment. Ils créent des
				<strong
					>agents autonomes très intelligents qui échappent à leur surveillance et à leur contrôle.</strong
				>
			</p>
			<p>
				Dans un monde entièrement dépendant des technologies numériques, nous sommes donc à la merci
				d’une série de <strong>catastrophes intentionnelles mais aussi accidentelles.</strong>
			</p>
			<p>
				Les alertes se multiplient. Dernière en date, le chercheur Jacob Coxon vient de démissionner
				d’Anthropic en affirmant
				<strong
					>« Les gens qui construisent l’IA croient sincèrement qu’elle pourrait tous nous tuer
					d’ici à la fin de la décennie. Ce n’est pas un coup marketing ».</strong
				>
			</p>
			<p>
				En réaction, les laboratoires américains promettent de s’entendre pour dédier un peu plus de
				temps et de moyens à la sécurité.
				<strong>Une promesse dérisoire, une situation hallucinante : nous devons réagir.</strong>
			</p>
		{/if}
	</CampaignSection>

	<!-- ── Nos analyses ─────────────────────────────────────── -->
	<!--
		Deux médias différents, donc deux composants du site plutôt qu'une grille
		de cartes maison : l'embed du module pour la vidéo (la vidéo a besoin de
		toute la largeur), et ArticleCard, la carte d'article utilisée sur
		l'accueil, pour le renvoi vers l'analyse.
	-->
	<CampaignSection id="analyses" title={isEn ? 'Our analyses' : 'Nos analyses'}>
		<CampaignEmbed
			src="https://www.youtube-nocookie.com/embed/{VIDEO_ID}"
			title={isEn ? '“It will soon be too late”' : '« Il sera bientôt trop tard »'}
			height={380}
			mobileHeight={220}
			caption={isEn
				? '“It will soon be too late”. Maxime Fournes, president of PauseAI global and of PauseIA France.'
				: '« Il sera bientôt trop tard ». Maxime Fournes, président de PauseAI global et de PauseIA France.'}
		/>

		<div class="analysis-card">
			<ArticleCard
				title={isEn
					? 'Nobody controls AI, the danger is imminent'
					: 'Personne ne contrôle l’IA, le danger est imminent'}
				blurb={isEn
					? 'When AI masters computing better than the world’s best experts, we humans enter a zone of great danger.'
					: 'Quand l’IA maîtrise l’informatique mieux que les meilleurs experts du monde, nous, humains, entrons dans une zone de grand danger.'}
				category={isEn ? 'Analysis' : 'Analyse'}
				url="{prefix}/personne-ne-controle-lia"
				linkText={isEn ? 'Read the article' : 'Lire l’article'}
			/>
		</div>

		<div class="analysis-card">
			<ArticleCard
				title={isEn
					? 'No, racing and safety are no longer compatible'
					: 'Non, course et sécurité ne sont plus compatibles'}
				blurb={isEn
					? 'The danger is finally being acknowledged. But the labs cannot regulate themselves: only an international moratorium can protect us.'
					: 'Le danger est enfin reconnu. Mais les laboratoires ne peuvent pas s’auto-réguler : seul un moratoire international peut nous protéger.'}
				category={isEn ? 'Analysis' : 'Analyse'}
				url="{prefix}/course-et-securite-ne-sont-plus-compatibles"
				linkText={isEn ? 'Read the article' : 'Lire l’article'}
			/>
		</div>
	</CampaignSection>

	<!-- ── Participez à notre campagne ──────────────────────── -->
	<CampaignSection
		id="campagne"
		title={isEn ? 'Take part in our campaign' : 'Participez à notre campagne'}
	>
		{#if isEn}
			<p>
				Relay the call for a <strong>real pause</strong>: the race to superintelligence must be
				stopped by putting in place a
				<strong>global moratorium on the development of frontier AI</strong>. Framed by an
				<strong>international treaty</strong>, this moratorium must last for as long as the
				feasibility of safe AI has not been
				<strong>scientifically demonstrated.</strong>
			</p>
			<p>
				Time is short, but we can act. Citizen and political will can speed up the moratorium and
				win <strong>two immediate safeguards</strong>:
			</p>
		{:else}
			<p>
				Relayez l’appel à une <strong>véritable pause</strong> : il faut arrêter la course à la
				super-intelligence en instaurant un
				<strong>moratoire mondial sur le développement des IA de pointe</strong>. Encadré par un
				<strong>traité international</strong>, ce moratoire devra durer tant que la faisabilité
				d’une IA sécurisée ne sera pas <strong>scientifiquement démontrée.</strong>
			</p>
			<p>
				Le temps presse mais nous pouvons agir. La volonté citoyenne et politique peut accélérer
				l’instauration de la pause et obtenir
				<strong>deux mesures de sauvegarde immédiates</strong> :
			</p>
		{/if}
		<ol class="measures">
			<li>
				{#if isEn}
					That the labs developing these frontier systems be subject to
					<strong>independent safety evaluations.</strong>
				{:else}
					Que les laboratoires qui développent ces systèmes de pointe soient soumis à des
					<strong>évaluations de sécurité indépendantes.</strong>
				{/if}
			</li>
			<li>
				{#if isEn}
					That <strong>AI-related safety incidents be reported</strong> to authorities with policing
					powers, and made public.
				{:else}
					Que les <strong>incidents de sécurité liés à l’IA soient déclarés</strong> aux autorités ayant
					pouvoir de police et rendus publics.
				{/if}
			</li>
		</ol>
	</CampaignSection>

	<!-- ── Action 1 · Semaine d'action et fresque ─────────────── -->
	<!--
		Un seul bloc pour les deux lancements : le calendrier des actions et la
		fresque. Le passage sur la fresque reste volontairement très court.
	-->
	<CampaignSection id="evenements" variant="card" title={mobilisationTitle}>
		<p>
			{isEn
				? 'Local groups hold street actions, talks and stands. Several will also run our new educational workshop, the AI Risks Fresk.'
				: 'Les groupes locaux organisent des actions de rue, des conférences et des stands. Plusieurs animeront aussi notre nouvel atelier pédagogique, la fresque des risques de l’IA.'}
		</p>
		<div id="fresque">
			<div class="fresque">
				<div class="pile" aria-hidden="false">
					{#each FRESQUE_CARTES as carte, i}
						<img
							class="carte carte-{i}"
							src={carte.src}
							alt={isEn ? carte.en : carte.fr}
							loading="lazy"
						/>
					{/each}
				</div>
				<div class="fresque-text">
					<p>
						{isEn
							? 'A collaborative workshop built around a deck of cards. Participants discuss the cards and connect them to one another. Everyone leaves with an overview of AI, its risks and the solutions.'
							: 'Un atelier collaboratif construit autour d’un jeu de cartes. Les participants en discutent et les relient entre elles. Chacun repart avec une vue d’ensemble de l’IA, de ses risques et des solutions.'}
					</p>
					<p>
						{isEn
							? 'Carried by our volunteers all summer, free and open-licensed. The website lets you schedule a workshop, sign up for one, and even run it remotely.'
							: 'Porté par nos bénévoles tout l’été, gratuit et en licence libre. Le site permet de programmer un atelier, de s’y inscrire, et même de l’animer à distance.'}
					</p>
					<Button
						href="https://fresquedesrisquesdelia.org/"
						alt
						target="_blank"
						rel="noopener noreferrer"
					>
						{isEn ? 'The AI Risks Fresk' : 'La fresque des risques de l’IA'}
					</Button>
				</div>
			</div>
		</div>

		<!-- Déplié par défaut : pendant la semaine d'action, les dates sont
		     l'information principale de la section. Le résumé reste cliquable
		     pour replier le calendrier. -->
		<LumaCalendar
			calendarId={LUMA_CALENDAR_ID}
			title={isEn ? 'Upcoming Pause IA events' : 'Prochains événements Pause IA'}
			collapsible
			open
			summary={isEn
				? 'See the week of action dates near you'
				: 'Voir les dates de la semaine d’action près de chez vous'}
			height={520}
			mobileHeight={560}
			calendarUrl={LUMA_CALENDAR_URL}
			calendarLinkLabel={isEn ? 'See all events on Luma' : 'Voir tous les événements sur Luma'}
		/>
		<p class="cta-row">
			<Button href="{prefix}/groupes-locaux" alt>
				{isEn ? 'Find my local group' : 'Trouver mon groupe local'}
			</Button>
		</p>
	</CampaignSection>

	<!-- ── Action 2 · Écrire à ses élus et à la presse ───────── -->
	<!--
		Une seule section : l'outil gère lui-même le basculement entre « élus » et
		« presse » via ses onglets. Le sortir en deux blocs faisait doublon.
	-->
	<div bind:this={pressSection}>
		<CampaignSection
			id="ecrire"
			title={isEn
				? 'Write to your representatives and the press'
				: 'Écrivez à vos élus et à la presse'}
		>
			<!-- headingLevel=h3 : l'outil s'imbrique sous le h2 de la section.
			     Les deux outils utilisent les textes propres à la campagne : la page
			     « Écrire à mes élus » garde, elle, son message générique. -->
			<EcrireOutil
				lang={data.lang}
				embedded
				requireName
				headingLevel="h3"
				elusActionId="perte-de-controle"
				presseActionId="presse-perte-de-controle"
				on:navigate={scrollToPress}
			/>
		</CampaignSection>
	</div>
</CampaignPage>

<style>
	.analysis-card {
		margin-top: 1.5rem;
	}

	.measures {
		margin: 0.5rem 0 0;
		padding-inline-start: 1.4rem;
		display: grid;
		gap: 0.85rem;
	}

	.measures li {
		line-height: 1.75;
	}

	/* La section est déjà une carte : pas de carte dans la carte, un simple
	   filet de séparation suffit. */
	#fresque {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.fresque {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(0, 0.55fr);
		gap: 2rem;
		align-items: start;
	}

	.fresque .pile {
		order: 2;
	}

	.fresque-text p {
		margin: 0 0 1rem;
	}

	/* Éventail repris du hero de fresquedesrisquesdelia.org. */
	/* La hauteur suit la largeur : les cartes sont positionnées en % de leur
	   propre boîte, une hauteur fixe les laissait dépasser du bloc (et donc
	   recouvrir le texte suivant) dès que la colonne se resserrait. */
	.pile {
		position: relative;
		aspect-ratio: 1.35 / 1;
		margin-top: 0.25rem;
	}

	.carte {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 72%;
		aspect-ratio: 1.41 / 1;
		object-fit: cover;
		border-radius: var(--radius-sm);
		box-shadow:
			0 2px 5px rgb(27 26 23 / 16%),
			0 14px 28px -10px rgb(27 26 23 / 35%);
	}

	.carte-0 {
		transform: translate(-50%, -50%) rotate(-8deg) translate(-28%, 9%);
		z-index: 1;
	}

	.carte-1 {
		transform: translate(-50%, -50%) translateY(-8%);
		z-index: 3;
	}

	.carte-2 {
		transform: translate(-50%, -50%) rotate(8deg) translate(28%, 9%);
		z-index: 2;
	}

	@media (max-width: 820px) {
		.fresque {
			grid-template-columns: 1fr;
		}

		.fresque .pile {
			order: 0;
			aspect-ratio: 1.78 / 1;
		}

		.carte {
			width: 54%;
		}
	}

	.cta-row {
		margin-top: 1rem;
	}
</style>
