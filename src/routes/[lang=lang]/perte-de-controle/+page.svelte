<script lang="ts">
	import { CampaignPage, CampaignHero, CampaignSection, CampaignEmbed } from '$components/campaign'
	import ArticleCard from '$components/ArticleCard.svelte'
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import Button from '$components/Button.svelte'
	import { MoveUpRight } from 'lucide-svelte'
	import { pressePerteDeControle } from '$lib/data/presse-perte-de-controle'
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

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}
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
					That <strong>AI-related safety incidents be reported</strong> to authorities with policing
					powers, and made public.
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
			     Mêmes messages que la page « Écrire à mes élus » (actions par défaut) :
			     les textes propres à la semaine d'action (perte-de-controle,
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
		Retours presse de la campagne, par groupe local : liste dans
		src/lib/data/presse-perte-de-controle.ts.
	-->
	<CampaignSection
		id="presse"
		title={isEn ? 'The press is talking about it' : 'La presse en parle'}
	>
		<p>
			{isEn
				? 'During the September week of action, the press covered our local groups:'
				: 'Lors de la semaine d’action de septembre, la presse a relayé la mobilisation de nos groupes locaux :'}
		</p>
		{#each pressePerteDeControle as group (group.city)}
			<h3 class="press-city">
				{group.national ? (isEn ? 'National press' : 'Presse nationale') : group.city}
			</h3>
			<ul class="press-list">
				{#each group.articles as item (item.url)}
					<li>
						<a class="press-item" href={item.url} target="_blank" rel="noopener noreferrer">
							<span class="press-meta">
								<span class="press-source">{item.source}</span>
								{#if item.video}
									<span class="press-video">{isEn ? 'Video' : 'Vidéo'}</span>
								{/if}
								{#if item.date}
									<time datetime={item.date}>{formatDate(item.date)}</time>
								{/if}
								<MoveUpRight size="0.75rem" aria-hidden="true" />
							</span>
							<span class="press-title">{item.title}</span>
						</a>
					</li>
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

	.press-item {
		display: block;
		padding: 0.85rem 1rem;
		border: 2px solid rgb(255 148 22 / 45%); /* --brand, atténué */
		border-radius: var(--radius-sm);
		color: inherit;
		text-decoration: none;
		transition: border-color 0.2s ease;
	}

	.press-item:hover,
	.press-item:focus-visible {
		border-color: var(--brand);
	}

	.press-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.press-source {
		font-weight: 700;
		color: var(--brand-subtle);
	}

	.press-video {
		padding: 0 0.4rem;
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		font-size: 0.75rem;
	}

	.press-title {
		display: block;
		margin-top: 0.25rem;
		font-weight: 600;
		line-height: 1.4;
	}
</style>
