<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { ArrowLeft, Send } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: lang = data.lang
	$: isEn = lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	const APPLY_HREF =
		'mailto:contact@pauseia.fr?subject=Candidature%20-%20Responsable%20communication'

	$: metaTitle = isEn
		? 'Communications Officer (fixed-term, 60%) | Pause IA'
		: 'Responsable communication (CDD, 60 %) | Pause IA'
	$: metaDesc = isEn
		? 'Pause IA is hiring a Communications Officer (12-month fixed-term contract, 60%) to structure its communications, grow its media presence and lead a team of engaged volunteers.'
		: 'Pause IA recrute un·e chargé·e de communication en CDD 12 mois (60 %) pour structurer sa communication, développer sa présence médiatique et animer une équipe de bénévoles engagés.'

	// Faits clés (essentiels uniquement) affichés dans la barre latérale.
	$: facts = isEn
		? [
				{ label: 'Contract', value: '12-month · 60%' },
				{ label: 'Salary', value: '€25,000 gross/year' },
				{ label: 'Location', value: 'Remote (France)' },
				{ label: 'Deadline', value: '6 September' }
			]
		: [
				{ label: 'Contrat', value: 'CDD 12 mois · 60 %' },
				{ label: 'Rémunération', value: '25 000 € brut/an' },
				{ label: 'Lieu', value: 'Télétravail (France)' },
				{ label: 'Date limite', value: '6 septembre' }
			]
</script>

<PostMeta title={metaTitle} description={metaDesc} />

<article>
	<!-- ── Hero ─────────────────────────────────────────────── -->
	<header class="hero">
		<a class="breadcrumb" href="{prefix}/rejoindre">
			<ArrowLeft size="1em" aria-hidden="true" />
			{isEn ? 'Join Pause IA' : 'Rejoindre Pause IA'}
		</a>
		<h1>
			{isEn ? 'Communications Officer' : 'Responsable communication'}
		</h1>
		<p class="meta-line">
			{isEn
				? 'Remote (France) · Part-time 60% · 12-month contract'
				: 'Télétravail (France) · Temps partiel 60 % · CDD 12 mois'}
		</p>
		<p class="lede">
			{isEn
				? 'Pause IA is hiring a Communications Officer to structure and amplify its communications, grow its media presence and build up a team of engaged volunteers.'
				: 'Pause IA recrute un·e chargé·e de communication pour structurer et amplifier sa communication, développer sa présence médiatique et faire grandir une équipe de bénévoles engagés sur ces missions.'}
		</p>
		<a class="apply-btn hero-apply" href={APPLY_HREF}>
			{isEn ? 'Apply' : 'Postuler'}
			<Send size="1em" aria-hidden="true" />
		</a>
	</header>

	<!-- ── Corps + barre latérale ───────────────────────────── -->
	<div class="layout">
		<main class="content">
			{#if isEn}
				<p>
					This is a French-speaking role based in France. The summary below covers the essentials;
					the full job description is available in French.
				</p>

				<h2>The role</h2>
				<p>
					You will coordinate Pause IA's communications, public outreach and press relations. A core
					part of the role is to structure and run our team of communications volunteers: your goal
					is not to produce everything yourself, but to make the most of that volunteer energy so
					that our messages can quickly become accessible, consistent and widely shared campaigns
					and content.
				</p>
				<p>You will work across four areas:</p>
				<ul>
					<li>
						<strong>Team building.</strong> Welcome, coordinate and support volunteers, assign and track
						tasks, and set up simple, reusable processes and resources.
					</li>
					<li>
						<strong>Press relations.</strong> Build and maintain relationships with journalists, spot
						media opportunities, and write and distribute press releases and op-eds.
					</li>
					<li>
						<strong>Social media & audience growth.</strong> Define our editorial strategy, run an editorial
						calendar, experiment with formats and grow our reach and engagement.
					</li>
					<li>
						<strong>Campaign communications.</strong> Help shape our campaigns and produce the materials
						our local groups need to act.
					</li>
				</ul>

				<h2>Who we're looking for</h2>
				<p>
					A strong ability to mobilise, coordinate and support volunteers; a taste for organisation;
					excellent writing skills in French; a good understanding of media and press relations; a
					strong interest in AI issues; and a good level of English. Experience in volunteer or team
					coordination, non-profit communications, journalism, press relations or science
					communication is a plus.
				</p>
				<p>
					Not sure you tick every box? Apply anyway, we would rather discover your application than
					have you rule yourself out.
				</p>

				<h2>How to apply</h2>
				<p>
					Send your CV and a few paragraphs on why you want to join Pause IA to
					<a href={APPLY_HREF}>contact@pauseia.fr</a>, ideally with an example of a project you
					coordinated and one or two samples of content you produced. Applications are open until
					<strong>6 September</strong>.
				</p>
			{:else}
				<h2>À propos de Pause IA</h2>
				<p>
					Pause IA est un mouvement citoyen qui alerte les citoyen·nes et les pouvoirs publics
					français sur les graves dangers de la course à l'intelligence artificielle et les incite à
					agir pour s'y opposer.
				</p>
				<p>
					Pause IA est la représentation en France de Pause AI Global, qui demande un moratoire sur
					l'entraînement des systèmes d'IA générale (IAG) jusqu'à ce que toutes les conditions de
					sécurité et de contrôle démocratique soient réunies.
				</p>
				<p>
					Pour y parvenir, nous sensibilisons le grand public aux risques liés à l'IA, intervenons
					dans le débat médiatique, rencontrons des responsables politiques et développons un réseau
					de bénévoles et de groupes locaux partout en France. Ces derniers mois, Pause IA a
					notamment organisé une conférence au Sénat, porté plusieurs campagnes nationales, publié
					des tribunes dans la presse nationale et développé sa communauté.
				</p>

				<h2>Le poste</h2>
				<p>
					Ce poste est centré sur la coordination de la communication de Pause IA, la
					sensibilisation du public et les relations presse. Vous travaillerez en lien étroit avec
					la direction et les bénévoles pour faire de Pause IA une voix identifiable, réactive et
					crédible dans le débat français sur l'intelligence artificielle.
				</p>
				<p>
					Une part essentielle de votre rôle consistera à <strong
						>structurer et faire fonctionner notre équipe de bénévoles en communication</strong
					>. Pause IA dispose déjà de personnes capables de contribuer à la rédaction, aux réseaux
					sociaux ou aux relations presse :
					<strong>votre objectif ne sera pas de tout produire vous-même</strong>, mais de permettre
					à cette énergie bénévole d'être utilisée au mieux.
				</p>
				<p>
					La priorité sera de faire en sorte que les messages de Pause IA et les actualités
					importantes liées à l'IA puissent être rapidement transformés en campagnes et contenus
					accessibles, cohérents et largement diffusés, <strong
						>sans que toute la communication de l'association repose sur une seule personne</strong
					>.
				</p>

				<h3>Animation et structuration de l'équipe communication</h3>
				<p>Vous serez notamment amené·e à :</p>
				<ul>
					<li>accueillir, mobiliser et accompagner les bénévoles souhaitant contribuer ;</li>
					<li>
						identifier leurs compétences, leurs envies et les missions sur lesquelles ils peuvent
						être utiles ;
					</li>
					<li>définir des tâches claires, les répartir et en assurer le suivi ;</li>
					<li>
						donner du contexte et des retours permettant aux bénévoles de progresser et de gagner en
						autonomie ;
					</li>
					<li>organiser le travail collectif et faciliter la circulation de l'information ;</li>
					<li>
						mettre en place des méthodes et processus simples pour éviter que chaque projet reparte
						de zéro ;
					</li>
					<li>
						créer des modèles, guides, calendriers éditoriaux, formats et autres ressources
						réutilisables ;
					</li>
					<li>organiser les espaces de travail de l'équipe, notamment sur Notion et Discord ;</li>
					<li>
						identifier progressivement des bénévoles capables de prendre davantage de
						responsabilités.
					</li>
				</ul>

				<h3>Relations presse</h3>
				<p>Avec l'appui de bénévoles, vous serez notamment amené·e à :</p>
				<ul>
					<li>
						développer et entretenir les relations avec les journalistes qui suivent l'intelligence
						artificielle, la technologie, la politique et les enjeux de société ;
					</li>
					<li>identifier rapidement les opportunités médiatiques liées à l'actualité ;</li>
					<li>
						rédiger et diffuser communiqués, propositions de tribunes, dossiers et éléments de
						langage ;
					</li>
					<li>proposer des angles et sujets aux rédactions ;</li>
					<li>préparer les porte-paroles de Pause IA aux interviews ;</li>
					<li>assurer le suivi des sollicitations et des retombées presse ;</li>
					<li>construire progressivement une base de contacts médias solide.</li>
				</ul>

				<h3>Réseaux sociaux et développement de notre audience</h3>
				<p>Vous serez notamment amené·e à :</p>
				<ul>
					<li>
						contribuer à définir notre stratégie éditoriale et nos priorités selon les plateformes ;
					</li>
					<li>mettre en place et piloter un calendrier éditorial ;</li>
					<li>
						identifier les formats et les angles susceptibles de fonctionner auprès de nos
						différents publics ;
					</li>
					<li>expérimenter de nouveaux formats et de nouvelles approches ;</li>
					<li>analyser les performances de nos contenus et en tirer des enseignements ;</li>
					<li>
						chercher à faire progresser notre audience, l'engagement et la diffusion de nos messages
						;
					</li>
					<li>adapter un même sujet aux codes des différentes plateformes ;</li>
					<li>organiser et coordonner la contribution des bénévoles à la création de contenus ;</li>
					<li>
						piloter ou contribuer à la production de publications, visuels, vidéos, newsletters et
						contenus pour notre site.
					</li>
				</ul>

				<h3>Communication de campagne</h3>
				<p>Aux côtés de la direction et des bénévoles impliqués, vous serez amené·e à :</p>
				<ul>
					<li>
						contribuer à définir les objectifs, les publics prioritaires et les angles des campagnes
						;
					</li>
					<li>participer à la formulation des messages et à leur adaptation selon les publics ;</li>
					<li>identifier les opportunités offertes par l'actualité pour lancer une campagne ;</li>
					<li>
						concevoir les supports nécessaires : argumentaires, visuels, kits de communication,
						publications, communiqués, modèles de messages ;
					</li>
					<li>
						produire du matériel directement utilisable par les groupes locaux pour leurs actions de
						terrain ;
					</li>
					<li>aider à décliner une campagne nationale pour d'autres chapitres de Pause AI.</li>
				</ul>
				<p>
					L'actualité de l'IA évoluant rapidement, une partie du poste demandera de savoir réagir
					lorsqu'un événement crée une fenêtre médiatique : annonce d'un laboratoire, incident de
					sécurité, nouvelle étude, décision politique ou débat public.
				</p>

				<h2>Profil recherché</h2>
				<p>Vous pourriez particulièrement bien correspondre au poste si vous avez :</p>
				<ul>
					<li>
						une <strong>forte capacité à mobiliser et accompagner des bénévoles</strong>, à répartir
						les responsabilités et à créer un cadre de travail efficace ;
					</li>
					<li>
						le <strong>goût de l'organisation</strong> : méthodes, processus simples, formats réutilisables
						et suivi des projets ;
					</li>
					<li>
						une capacité à <strong>développer notre présence sur les réseaux sociaux</strong> : identifier
						les formats qui fonctionnent, expérimenter, analyser et faire progresser notre audience ;
					</li>
					<li>de <strong>très bonnes capacités rédactionnelles en français</strong> ;</li>
					<li>une bonne compréhension du fonctionnement des médias et des relations presse ;</li>
					<li>la capacité à faire avancer plusieurs projets avec autonomie ;</li>
					<li>
						un <strong>fort intérêt pour les enjeux liés à l'intelligence artificielle</strong> ;
					</li>
					<li>un bon niveau d'anglais pour suivre l'actualité internationale sur l'IA ;</li>
					<li>
						une aisance avec les outils numériques collaboratifs, notamment Notion et Discord.
					</li>
				</ul>
				<p>
					Une expérience en coordination de bénévoles ou d'équipes, communication associative,
					journalisme, relations presse ou vulgarisation scientifique sera particulièrement
					appréciée. Une connaissance approfondie des risques liés aux IA avancées est un plus, mais
					n'est pas indispensable : nous accordons beaucoup d'importance à la curiosité et à la
					capacité à apprendre rapidement.
				</p>

				<div class="callout">
					<h3>Vous hésitez à candidater ?</h3>
					<p>
						Vous avez l'impression de ne pas correspondre parfaitement au profil ? <strong
							>Candidatez quand même.</strong
						> Les parcours en communication sont très variés, et nous ne cherchons pas une personne qui
						coche toutes les cases. Si vous vous reconnaissez dans la mission de Pause IA et que les
						responsabilités décrites vous donnent envie, nous préférons découvrir votre candidature plutôt
						que vous voir vous auto-éliminer.
					</p>
				</div>

				<h2>Ce que nous proposons</h2>
				<ul>
					<li>
						<strong>Un poste directement lié à notre impact.</strong> Notre capacité à faire émerger
						ces enjeux dans le débat public est au cœur de notre stratégie. Vous verrez directement les
						effets de votre travail : articles de presse, interviews, campagnes, diffusion massive d'un
						contenu.
					</li>
					<li>
						<strong>L'occasion de construire.</strong> Une partie de votre mission sera de construire
						les méthodes, les formats et l'organisation de la communication de Pause IA.
					</li>
					<li>
						<strong>Une grande autonomie.</strong> Les circuits de décision sont courts : nous cherchons
						quelqu'un capable de prendre des initiatives et de proposer des solutions.
					</li>
					<li>
						<strong>Un temps partiel souple.</strong> 60 %, soit 21 heures par semaine, dont l'organisation
						pourra être discutée avec la personne recrutée.
					</li>
				</ul>

				<h2>Candidater</h2>
				<p>
					Envoyez-nous à <a href={APPLY_HREF}>contact@pauseia.fr</a> :
				</p>
				<ul>
					<li>votre CV ;</li>
					<li>
						quelques paragraphes expliquant pourquoi vous souhaitez rejoindre Pause IA et ce que
						vous pensez pouvoir apporter ;
					</li>
					<li>
						si possible, un exemple concret d'une situation où vous avez coordonné ou mobilisé
						plusieurs personnes autour d'un projet : votre rôle, votre organisation et le résultat ;
					</li>
					<li>
						si possible, un ou deux exemples de contenus que vous avez réalisés (article,
						communiqué, campagne, vidéo, publication, newsletter).
					</li>
				</ul>
				<p>
					Les expériences bénévoles, associatives, professionnelles ou militantes sont toutes
					pertinentes : ce qui nous intéresse est de comprendre comment vous travaillez avec
					d'autres et comment vous les aidez à contribuer efficacement à un projet commun.
				</p>

				<h2>Calendrier du recrutement</h2>
				<ol class="timeline">
					<li>
						<span class="timeline-step">1</span>
						<div>
							<h3>Candidature (jusqu'au 6 septembre)</h3>
							<p>
								Nous examinerons l'ensemble des candidatures et contacterons les personnes retenues
								pour la deuxième étape.
							</p>
						</div>
					</li>
					<li>
						<span class="timeline-step">2</span>
						<div>
							<h3>Mise en situation (du 7 au 14 septembre)</h3>
							<p>
								Quelques questions et exercices directement liés au poste : structurer une action de
								campagne, rédiger un communiqué, préparer une publication ou réfléchir à la
								communication autour d'une actualité liée à l'IA.
							</p>
						</div>
					</li>
					<li>
						<span class="timeline-step">3</span>
						<div>
							<h3>Entretien (du 15 au 30 septembre)</h3>
							<p>
								Un entretien en visioconférence avec des membres du conseil d'administration de
								Pause IA. À l'issue des entretiens, nous communiquerons notre décision finale à
								chaque personne.
							</p>
						</div>
					</li>
				</ol>
			{/if}

			<div class="apply-footer">
				<a class="apply-btn" href={APPLY_HREF}>
					{isEn ? 'Apply' : 'Postuler'}
					<Send size="1em" aria-hidden="true" />
				</a>
				<span class="deadline-note">
					{isEn
						? 'Applications open until 6 September.'
						: "Candidatures ouvertes jusqu'au 6 septembre."}
				</span>
			</div>
		</main>

		<!-- ── Barre latérale sticky ────────────────────────────── -->
		<aside class="sidebar">
			<div class="sidebar-card">
				<a class="apply-btn sidebar-apply" href={APPLY_HREF}>
					{isEn ? 'Apply' : 'Postuler'}
					<Send size="1em" aria-hidden="true" />
				</a>
				<dl class="facts">
					{#each facts as fact}
						<div class="fact">
							<dt>{fact.label}</dt>
							<dd>{fact.value}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</aside>
	</div>
</article>

<style>
	article {
		max-inline-size: 72rem;
		margin-inline: auto;
		margin-top: 2rem;
		padding: 0 1.5rem 4rem;
	}

	/* ── Hero ──────────────────────────────────────────────── */
	.hero {
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		padding: 2.75rem 2.5rem 3rem;
		margin-bottom: 2.5rem;
		background: var(--brand);
		color: #1a1a1a;
	}

	/* Fine barre d'accent à gauche, motif récurrent du site. */
	.hero::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 6px;
		background: #1a1a1a;
		opacity: 0.85;
	}

	.breadcrumb {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		font-size: 0.9rem;
		font-weight: 600;
		color: #1a1a1a;
		text-decoration: none;
		opacity: 0.85;
		margin-bottom: 1.25rem;
	}

	.breadcrumb:hover {
		opacity: 1;
		text-decoration: underline;
	}

	.hero h1 {
		margin: 0;
		font-size: clamp(2rem, 5.5vw, 3.1rem);
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: #1a1a1a;
	}

	.meta-line {
		margin: 0.9rem 0 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #1a1a1a;
		opacity: 0.9;
	}

	.lede {
		margin: 1.35rem 0 0;
		font-size: clamp(1.05rem, 2.2vw, 1.25rem);
		line-height: 1.55;
		font-weight: 500;
		max-inline-size: 42rem;
	}

	.hero-apply {
		margin-top: 1.75rem;
	}

	/* ── Bouton Postuler ───────────────────────────────────── */
	.apply-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		background: #1a1a1a;
		color: #fff;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.98rem;
		padding: 0.75rem 1.6rem;
		border-radius: 999px;
		transition:
			transform 0.15s ease,
			background 0.15s ease;
	}

	.apply-btn:hover,
	.apply-btn:focus-visible {
		transform: translateY(-1px);
		background: #000;
	}

	/* ── Mise en page corps + sidebar ──────────────────────── */
	.layout {
		display: grid;
		gap: 2.5rem;
		align-items: start;
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: minmax(0, 1fr) 20rem;
		}
	}

	/* ── Contenu ───────────────────────────────────────────── */
	.content {
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--text);
		min-inline-size: 0;
	}

	.content :global(h2) {
		font-size: clamp(1.4rem, 3vw, 1.7rem);
		line-height: 1.2;
		margin: 2.5rem 0 1rem;
		padding-bottom: 0.4rem;
		border-bottom: 2px solid var(--brand);
	}

	.content :global(h2:first-child) {
		margin-top: 0;
	}

	.content :global(h3) {
		font-size: 1.2rem;
		margin: 2rem 0 0.6rem;
		color: var(--text);
	}

	.content :global(p) {
		margin: 0 0 1.1rem;
		text-align: left;
		hyphens: none;
	}

	.content :global(ul) {
		margin: 0 0 1.3rem;
		padding-left: 1.3rem;
	}

	.content :global(li) {
		margin-bottom: 0.55rem;
	}

	.content :global(a) {
		color: var(--brand-subtle);
		font-weight: 600;
	}

	/* ── Encart « vous hésitez » ───────────────────────────── */
	.callout {
		margin: 2rem 0;
		padding: 1.5rem 1.75rem;
		border-radius: 14px;
		background: var(--bg-subtle);
		border-left: 4px solid var(--brand);
	}

	.callout h3 {
		margin: 0 0 0.5rem;
	}

	.callout :global(p) {
		margin: 0;
	}

	/* ── Frise calendrier ──────────────────────────────────── */
	.timeline {
		list-style: none;
		margin: 0 0 1.5rem;
		padding: 0;
	}

	.timeline li {
		display: grid;
		grid-template-columns: 2.25rem 1fr;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.timeline-step {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 50%;
		background: var(--brand);
		color: #1a1a1a;
		font-weight: 800;
	}

	.timeline h3 {
		margin: 0.1rem 0 0.3rem;
		font-size: 1.1rem;
	}

	.timeline p {
		margin: 0;
		color: var(--text-2);
	}

	/* ── Pied : rappel Postuler ────────────────────────────── */
	.apply-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin-top: 2.5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.deadline-note {
		font-size: 0.9rem;
		color: var(--text-2);
	}

	/* ── Sidebar ───────────────────────────────────────────── */
	.sidebar-card {
		border: 1px solid var(--border);
		border-radius: 16px;
		background: var(--bg-card);
		padding: 1.5rem;
	}

	@media (min-width: 900px) {
		.sidebar {
			position: sticky;
			top: 5.5rem;
		}
	}

	.sidebar-apply {
		width: 100%;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.facts {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.fact {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.9rem;
		border-bottom: 1px solid var(--border);
	}

	.fact:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}

	.facts dt {
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.facts dd {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text);
		text-align: right;
	}

	@media (max-width: 480px) {
		article {
			padding: 0 1rem 3rem;
		}

		.hero {
			padding: 2rem 1.35rem 2.25rem;
		}
	}
</style>
