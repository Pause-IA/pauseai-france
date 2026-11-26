<script lang="ts">
	import { CampaignPage, CampaignHero, CampaignSection, CampaignEmbed } from '$components/campaign'
	import ArticleCard from '$components/ArticleCard.svelte'
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import Button from '$components/Button.svelte'
	import { presseMarche14Novembre, pressePerteDeControle } from '$lib/data/presse-perte-de-controle'
	import PressItem from './PressItem.svelte'
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
	$: title = isEn
		? 'We are on the brink of losing control: let’s react'
		: 'Nous sommes au bord de la perte de contrôle : réagissons'
	$: description = isEn
		? 'AI now outperforms humans at computer security, and the researchers who train these systems no longer control them. Join our call for a global moratorium on frontier AI development.'
		: 'L’IA dépasse désormais les humains en sécurité informatique, et les chercheurs qui les entraînent ne les maîtrisent plus. Relayez notre appel à un moratoire mondial sur le développement des IA de pointe.'

	/* Photos de la marche du 14 novembre (Drive de Jeanne), compressées en WebP. */
	const PM = '/campaigns/marche-14-novembre'
	const PHOTOS_MARCHE = [
		{
			src: `${PM}/cortege-banderole.webp`,
			fr: 'Le cortège derrière la banderole Pause IA, dans une avenue de Paris.',
			en: 'The march behind the Pause IA banner, on a Paris avenue.'
		},
		{
			src: `${PM}/trocadero-megaphone.webp`,
			fr: 'Prise de parole au mégaphone au Trocadéro, la tour Eiffel en arrière-plan.',
			en: 'Speaking through a megaphone at the Trocadéro, the Eiffel Tower behind.'
		},
		{
			src: `${PM}/pancarte-tour-eiffel.webp`,
			fr: 'Une pancarte « Nous sommes au bord de la perte de contrôle » devant la tour Eiffel.',
			en: 'A sign reading “We are on the brink of losing control” in front of the Eiffel Tower.'
		},
		{
			src: `${PM}/pancartes.webp`,
			fr: 'Pancartes « Test de sécurité échoué » et « Les entreprises d’IA jouent avec nos vies ».',
			en: 'Signs reading “Safety test failed” and “AI companies are gambling with our lives”.'
		},
		{
			src: `${PM}/pancarte-perte-de-controle.webp`,
			fr: 'Une manifestante tient la pancarte « Nous sommes au bord de la perte de contrôle ».',
			en: 'A marcher holding the sign “We are on the brink of losing control”.'
		},
		{
			src: `${PM}/pancarte-papa.webp`,
			fr: 'Un manifestant tient une pancarte « Just a dad worried for his daughter’s future ».',
			en: 'A marcher holding a sign: “Just a dad worried for his daughter’s future”.'
		}
	]
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
		Deux médias différents, donc deux composants du site plutôt qu’une grille
		de cartes maison : l’embed du module pour la vidéo (la vidéo a besoin de
		toute la largeur), et ArticleCard, la carte d’article utilisée sur
		l’accueil, pour le renvoi vers l’analyse.
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
				url="{prefix}/articles/2026-09-15-personne-ne-controle-lia"
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
				url="{prefix}/articles/2026-09-17-course-et-securite-ne-sont-plus-compatibles"
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
					That <strong>AI-related safety incidents be reported</strong> to authorities with policing powers,
					and made public.
				{:else}
					Que les <strong>incidents de sécurité liés à l’IA soient déclarés</strong> aux autorités ayant
					pouvoir de police et rendus publics.
				{/if}
			</li>
		</ol>
	</CampaignSection>

	<!-- ── Rejoindre un groupe local ────────────────────────── -->
	<CampaignSection
		id="groupes-locaux"
		variant="accent"
		title={isEn
			? 'Our local groups are mobilising: join them'
			: 'Nos groupes locaux se mobilisent : rejoignez-les'}
	>
		<p>
			{isEn
				? 'All over France, our local groups hold street actions, talks and stands to carry this call. No need to be an expert: join the group near you and act with us.'
				: 'Partout en France, nos groupes locaux organisent des actions de rue, des conférences et des stands pour porter cet appel. Pas besoin d’être expert : rejoignez le groupe près de chez vous et agissez avec nous.'}
		</p>
		<p class="cta-row">
			<Button href="{prefix}/groupes-locaux">
				{isEn ? 'Join a local group' : 'Rejoindre un groupe local'}
			</Button>
		</p>
	</CampaignSection>

	<!-- ── Marche du 14 novembre : retour ───────────────────── -->
	<!--
		La marche est passée : l'annonce (horaires, inscription Luma) laisse la
		place au bilan, entre « Rejoindre un groupe local » et « Écrivez à vos élus »
		(demande de Clémence, 26/11/2026). Texte français repris tel quel de la newsletter (todo
		Notion de Jeanne, 25/11/2026) ; photos dans static/campaigns/marche-14-novembre.
	-->
	<CampaignSection
		id="marche"
		variant="card"
		title={isEn
			? 'March for an AI treaty, Paris, 14 November'
			: 'Marche pour un traité sur l’IA, Paris, 14 novembre'}
	>
		{#if isEn}
			<p>
				On Saturday 14 November, around a hundred people marched through Paris to call for an
				international treaty on AI. A first in France, organised with Stop The AI Race and its
				French branch, Stop IA. The same day, rallies took place in some twenty cities around the
				world.
			</p>
			<p>
				At the Trocadéro, the co-organisers were joined at the microphone by CeSIA, Le Projet
				Méduses, Tournesol, the gilets jaunes and Anti-Tech Résistance. Very different backgrounds,
				brought together by the same cause: proof that the question of AI risks reaches far beyond
				our movement.
			</p>
			<p>
				For a first, it was a success. Thank you to everyone who came! And this is only the
				beginning. To hear about our next actions and take part, join us on Discord.
			</p>
		{:else}
			<p>
				Le samedi 14 novembre, une centaine de personnes ont marché dans Paris pour demander un
				traité international sur l’IA. Une première en France, organisée avec Stop The AI Race et sa
				branche française, Stop IA. Le même jour, des rassemblements avaient lieu dans une vingtaine
				de villes à travers le monde.
			</p>
			<p>
				Au Trocadéro, les co-organisateurs ont été rejoints au micro par le CeSIA, Le Projet
				Méduses, Tournesol, les gilets jaunes et Anti-Tech Résistance. Des horizons très différents,
				réunis pour la même cause. Preuve que la question des risques de l’IA rassemble bien au-delà
				de notre mouvement.
			</p>
			<p>
				Pour une première, c’est une réussite. Merci à toutes celles et ceux qui sont venu·es ! Et
				ce n’est qu’un début. Pour être au courant des prochaines actions et y participer,
				rejoignez-nous sur Discord.
			</p>
		{/if}
		{#if PHOTOS_MARCHE.length}
			<div class="marche-photos">
				{#each PHOTOS_MARCHE as photo (photo.src)}
					<img src={photo.src} alt={isEn ? photo.en : photo.fr} loading="lazy" />
				{/each}
			</div>
		{/if}
		<p class="cta-row">
			<Button href="https://discord.gg/vyXGd7AeGc">
				{isEn ? 'Join us on Discord' : 'Nous rejoindre sur Discord'}
			</Button>
		</p>
	</CampaignSection>

	<!-- ── Action 2 · Écrire à ses élus et à la presse ───────── -->
	<!--
		Une seule section : l’outil gère lui-même le basculement entre « élus » et
		« presse » via ses onglets. Le sortir en deux blocs faisait doublon.
	-->
	<div bind:this={pressSection}>
		<CampaignSection
			id="ecrire"
			title={isEn ? 'Write to your representatives' : 'Écrivez à vos élus'}
		>
			<!-- headingLevel=h3 : l’outil s’imbrique sous le h2 de la section.
			     Mêmes messages que la page « Écrire à mes élus » (actions par défaut) :
			     les textes propres à la semaine d’action (perte-de-controle,
			     presse-perte-de-controle) étaient datés. -->
			<EcrireOutil
				lang={data.lang}
				embedded
				requireName
				headingLevel="h3"
				on:navigate={scrollToPress}
			/>
		</CampaignSection>
	</div>

	<!-- ── La presse en parle ─────────────────────────────── -->
	<!--
		Retours presse de la campagne (marche, puis semaine d'action par groupe
		local) : listes dans src/lib/data/presse-perte-de-controle.ts.
	-->
	<CampaignSection
		id="presse"
		title={isEn ? 'The press is talking about it' : 'La presse en parle'}
	>
		<!-- Un seul encadré presse pour toute la campagne (demande de Clémence,
		     26/11/2026) : la marche d'abord, puis la semaine d'action. -->
		<h3 class="press-event">
			{isEn ? 'March of 14 November, Paris' : 'Marche du 14 novembre, Paris'}
		</h3>
		<ul class="press-list">
			{#each presseMarche14Novembre.flatMap((g) => g.articles) as item (item.url)}
				<li><PressItem {item} {isEn} /></li>
			{/each}
		</ul>

		<h3 class="press-event">
			{isEn ? 'Week of action, September' : 'Semaine d’action de septembre'}
		</h3>
		{#each pressePerteDeControle as group (group.city)}
			<h4 class="press-city">
				{group.national ? (isEn ? 'National press' : 'Presse nationale') : group.city}
			</h4>
			<ul class="press-list">
				{#each group.articles as item (item.url)}
					<li><PressItem {item} {isEn} /></li>
				{/each}
			</ul>
		{/each}
	</CampaignSection>
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

	.cta-row {
		margin-top: 1rem;
	}

	.press-city {
		margin: 1.5rem 0 0.6rem;
		font-size: 1.05rem;
		font-weight: 700;
	}

	.press-list {
		list-style: none;
		margin: 0 0 1rem;
		padding: 0;
		display: grid;
		gap: 0.75rem;
	}

	.press-event {
		margin: 2rem 0 0.5rem;
		font-size: 1.25rem;
		font-weight: 700;
	}

	/* Six photos : la première (le cortège) en grand sur deux colonnes et deux
	   lignes, les cinq autres autour, ce qui remplit exactement une grille de
	   3 x 3. Cadrage calé vers le haut, là où sont les visages et les pancartes. */
	.marche-photos {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 4px;
		margin-top: 1.5rem;
	}

	.marche-photos img {
		inline-size: 100%;
		block-size: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: center 30%;
		display: block;
		border-radius: var(--radius-sm);
	}

	.marche-photos img:first-child {
		grid-column: span 2;
		grid-row: span 2;
	}

	@media (max-width: 600px) {
		.marche-photos {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.marche-photos img:first-child {
			grid-row: auto;
		}

		/* Six photos sur deux colonnes : la grande prend une ligne, il en
		   resterait une seule en bas. */
		.marche-photos img:last-child {
			display: none;
		}
	}
</style>
