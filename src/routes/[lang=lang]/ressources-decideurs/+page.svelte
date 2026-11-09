<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Accordion from '$components/Accordion.svelte'
	import Button from '$components/Button.svelte'
	import { PageHero, SectionTitle } from '$components/ui'
	import { Check, Copy } from 'lucide-svelte'
	import {
		citationHinton,
		citations,
		creditsPortraits,
		portraitComplet,
		etapes,
		miseAJour,
		objections,
		references,
		signataires
	} from '$lib/data/ressources-decideurs'
	import type { Citation } from '$lib/data/ressources-decideurs'

	const CONTACT = 'contact@pauseia.fr'

	const title = 'Garder l’humanité aux commandes de l’intelligence artificielle'
	const description =
		'Note de synthèse sur le risque de perte de contrôle de l’IA, à destination des élus et de leurs équipes : ce qui est établi, les objections courantes, et ce qu’un responsable public peut faire.'

	const dateMaj = new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(miseAJour))

	let copie = false
	let minuteur: ReturnType<typeof setTimeout>
	async function copierLAdresse() {
		try {
			await navigator.clipboard.writeText(CONTACT)
			copie = true
			clearTimeout(minuteur)
			minuteur = setTimeout(() => (copie = false), 2000)
		} catch {
			// Presse-papiers refusé : l'adresse reste visible et sélectionnable.
		}
	}
</script>

<!-- Note de synthèse de plaidoyer, hors menu et hors sitemap : on partage son
     lien lors d'un rendez-vous ou dans un courrier, d'où le « noindex » et
     l'entrée dans EXCLUDED de src/lib/routes.ts. Contenu dans
     src/lib/data/ressources-decideurs.ts.

     Pas d'aplat sombre : le rythme vient des fonds alternés de la charte
     (--bg et --bg-subtle, via la classe « ordinaire ») et des filets de
     séparation, pas d'une couleur hors palette. Le fond blanc de la page est
     imposé dans src/routes/+layout.svelte (bgWhite), parce qu'une carte
     blanche sur le crème du site n'a que 1,05:1 de contraste. -->
<PostMeta {title} {description} />
<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<article class="note">
	<!-- ── Ouverture ── -->
	<PageHero eyebrow="Perte de contrôle de l’IA · note de synthèse">
		{title}
		<svelte:fragment slot="lede">
			Les grands laboratoires d’intelligence artificielle ont un objectif affiché : construire des
			systèmes capables d’agir seuls, sans qu’un humain les dirige. Poussé à son terme, cet objectif
			donne des machines plus compétentes que nous dans la plupart des tâches, et qu’il deviendrait
			très difficile d’arrêter une fois lancées.
		</svelte:fragment>
	</PageHero>

	<hr class="filet" />

	<div class="chapo">
		<p>
			Au rythme actuel, plusieurs dirigeants de ces laboratoires estiment que de tels systèmes
			pourraient arriver avant 2030.
			<strong
				>Personne, aujourd’hui, ne sait garantir qu’une intelligence artificielle de ce niveau
				resterait sous contrôle humain.</strong
			>
		</p>
		<p>
			Ce n’est pas une inquiétude marginale. Des centaines de chercheurs parmi les plus cités,
			plusieurs lauréats du prix Nobel, et jusqu’aux dirigeants des entreprises qui construisent ces
			systèmes, ont signé des textes alertant sur un risque d’extinction de l’humanité.
		</p>
	</div>

	<!-- ── La déclaration ── -->
	<section class="sombre" aria-labelledby="t-declaration">
		<SectionTitle id="t-declaration">Ce que disent ceux qui construisent l’IA</SectionTitle>
		<span class="guillemet" aria-hidden="true">“</span>
		<blockquote>
			Atténuer le risque d’extinction lié à l’intelligence artificielle devrait être une priorité
			mondiale, au même titre que d’autres risques pour la société comme les pandémies et la guerre
			nucléaire.
		</blockquote>
		<p class="attribution">
			Déclaration du <a
				href="https://www.safe.ai/work/statement-on-ai-risk"
				target="_blank"
				rel="noopener noreferrer">Center for AI Safety</a
			>, mai 2023. Une seule phrase, signée par des centaines de chercheurs et de dirigeants du
			domaine, parmi lesquels :
		</p>
		<ul class="signataires">
			{#each signataires as s (s.initiales + s.nom)}
				<li>
					{#if portraitComplet(s.portrait)}
						<img class="pastille" src={s.portrait?.fichier} alt="" loading="lazy" />
					{:else}
						<span class="pastille" aria-hidden="true">{s.initiales}</span>
					{/if}
					<span class="nom">{s.nom}</span>
					<span class="fonction">{s.titre}</span>
				</li>
			{/each}
		</ul>
	</section>

	<!-- ── Pourquoi on ne sait pas les contrôler ── -->
	<section aria-labelledby="t-incontrolable">
		<SectionTitle id="t-incontrolable">Pourquoi ne sait-on pas les contrôler ?</SectionTitle>
		<p class="accroche">
			Un système d’intelligence artificielle moderne n’est pas programmé ligne par ligne, comme un
			logiciel ordinaire. Il est entraîné.
		</p>
		<p>
			On lui montre d’énormes quantités de données, et il ajuste tout seul des milliards de
			paramètres internes jusqu’à produire les bons résultats. Personne, pas même ses concepteurs,
			ne sait lire le détail de ce qu’il a appris ni fixer précisément ses objectifs. On obtient une
			capacité, sans disposer du mode d’emploi qui va avec.
		</p>
		<p>
			Cela a une conséquence inconfortable : on ne sait pas empêcher de façon fiable un comportement
			indésirable. Lors de tests encadrés, des systèmes récents ont déjà menti à leurs évaluateurs,
			cherché à copier leur propre code pour échapper à un remplacement, ou fait du chantage à un
			ingénieur fictif pour éviter d’être désactivés. Ce ne sont pas des bugs qu’un développeur
			corrige en une ligne, mais des stratégies que le système adopte parce qu’elles servent le but
			qu’on lui a donné.
		</p>
		<p>
			Aujourd’hui, ces systèmes ne sont encore ni assez puissants ni assez autonomes pour que ces
			comportements causent une catastrophe. Le problème est que la dangerosité croît avec la
			capacité : plus ils deviennent compétents, plus l’écart se creuse entre ce qu’ils savent faire
			et ce que nous savons vérifier.
		</p>

		{@render carte(citationHinton)}
	</section>

	<!-- ── À quoi ressemblerait une perte de contrôle ── -->
	<section aria-labelledby="t-menace">
		<SectionTitle id="t-menace">À quoi ressemblerait une perte de contrôle ?</SectionTitle>
		<p>
			Le risque n’a pas la forme d’un robot hostile marchant sur une ville. Il tient à une idée plus
			simple et plus inquiétante : un système très compétent, chargé d’un objectif, peut employer
			pour l’atteindre des moyens que nous n’avions ni prévus ni souhaités, et que nous ne saurions
			pas contrer à temps.
		</p>
		<p class="appuye">
			Plusieurs voies concrètes préoccupent les chercheurs, et chacune relève directement de la
			sécurité nationale.
		</p>
		<p>
			La première est informatique. Un système capable de découvrir et d’exploiter des failles plus
			vite que les défenseurs ne les corrigent pourrait désorganiser des réseaux critiques, des
			hôpitaux à l’énergie. La deuxième est biologique : une IA qui aide à concevoir des agents
			pathogènes abaisse le seuil de compétence nécessaire pour fabriquer une arme de masse. La
			troisième touche à l’information : des campagnes de manipulation taillées sur mesure, à très
			grande échelle, peuvent corrompre l’espace de débat dont dépend précisément la décision
			publique.
		</p>
		<p>
			La forme la plus probable est pourtant la plus discrète. À mesure que l’on confie à ces
			systèmes des décisions économiques, administratives, puis militaires, le contrôle humain
			s’érode sans qu’aucun moment spectaculaire ne le signale. On délègue, par commodité et par
			compétition, jusqu’au point où revenir en arrière devient hors de portée. C’est ce que les
			chercheurs appellent le désempouvoirment progressif.
		</p>
		<p class="saillie">
			Le point commun de ces scénarios : celui qui perd le contrôle ne le récupère pas, et la
			capacité se concentre aujourd’hui hors de France.
		</p>
	</section>

	<!-- ── Combien de temps ── -->
	<section aria-labelledby="t-fenetre">
		<SectionTitle id="t-fenetre">Combien de temps reste-t-il ?</SectionTitle>
		<p>
			Avant la sortie de ChatGPT fin 2022, la plupart des chercheurs voyaient une intelligence
			artificielle hors de contrôle comme un problème lointain, pour les générations futures. Le
			calendrier qu’ils annoncent s’est depuis nettement raccourci.
		</p>
		<p>
			Deux mécanismes expliquent cette accélération. D’une part, les capacités progressent par
			paliers rapides à mesure que l’on augmente la puissance de calcul et la taille des modèles.
			D’autre part, ces systèmes commencent à aider à concevoir la génération suivante : si une IA
			accélère la recherche en IA, le progrès peut s’emballer, chaque version aidant à bâtir une
			version plus performante.
		</p>
		<p>
			Il existe un écart frappant entre ce que les spécialistes perçoivent et ce que le public et
			les responsables publics en savent. Le sujet a été peu débattu sur la place publique, et la
			plupart des décideurs ne s’y préparent pas encore.
		</p>
	</section>

	<!-- ── Qui le dit ── -->
	<section aria-labelledby="t-qui">
		<SectionTitle id="t-qui">Qui le dit, et faut-il les croire ?</SectionTitle>
		<p>
			L’alerte ne vient pas d’observateurs extérieurs au domaine, mais de celles et ceux qui
			construisent ces systèmes et de la communauté scientifique qui les étudie. C’est ce qui la
			distingue d’une peur de science-fiction.
		</p>
		<p>
			Depuis 2016, le groupe de recherche AI Impacts interroge régulièrement des chercheurs ayant
			publié dans les grandes conférences d’intelligence artificielle. Son enquête de 2023, la plus
			large jamais menée sur le sujet avec 2 778 répondants, donne une probabilité médiane de 5 %
			pour un résultat « aussi grave que l’extinction de l’humanité ». Entre un tiers et la moitié
			des chercheurs, selon la formulation de la question, placent ce risque à 10 % ou davantage.
		</p>
		<p>
			Surtout, le chiffre monte d’une vague à l’autre. Dans l’enquête suivante, menée fin 2024
			auprès de plus de 1 500 chercheurs, la probabilité médiane a doublé pour atteindre 10 %, et la
			moyenne approche 18 %. Autrement dit, à mesure qu’ils observent les progrès réels, les
			spécialistes revoient le risque à la hausse, pas à la baisse.
		</p>
		<p>
			Aucun de ces chiffres n’est une prédiction. Ce sont des estimations de risque. Mais on ne fait
			pas voler un avion dont les ingénieurs annoncent 10 % de chances de crash, et on ne traite pas
			à la légère un risque d’extinction que ceux qui conçoivent la technologie chiffrent eux-mêmes
			en dizaines de pour cent.
		</p>

		<div class="grille-citations">
			{#each citations as c (c.nom)}
				{@render carte(c)}
			{/each}
		</div>
	</section>

	<!-- ── Que peut-on faire ── -->
	<section id="faire" aria-labelledby="t-faire">
		<SectionTitle id="t-faire">Que peut-on faire ?</SectionTitle>
		<p class="accroche">
			Le point de départ est simple : il faut interdire le développement des systèmes que personne
			ne sait contrôler.
		</p>
		<p>
			Aucune entreprise, aucun État, aucune personne ne sait aujourd’hui maintenir sous contrôle une
			intelligence artificielle plus compétente que nous sur l’ensemble des tâches. Tant que c’est
			le cas, la priorité n’est pas d’encadrer l’usage de ces systèmes une fois construits, mais
			d’empêcher qu’ils soient construits avant qu’on sache les maîtriser. Cela passe par trois
			niveaux d’action, du plus urgent au plus structurel.
		</p>
		<ol class="etapes">
			{#each etapes as e, i (e.titre)}
				<li>
					<span class="numero" aria-hidden="true">{i + 1}</span>
					<div>
						<h3>{e.titre}</h3>
						<p>{e.texte}</p>
					</div>
				</li>
			{/each}
		</ol>
		<p>
			Ce dernier point est souvent perçu comme hors de portée. Il ne l’est pas forcément : aucun
			pays n’a intérêt à voir se construire, chez lui ou ailleurs, une technologie susceptible
			d’échapper à tout contrôle humain. C’est précisément ce dénominateur commun qui a permis, pour
			le nucléaire, de bâtir des accords entre rivaux.
		</p>
		<p>
			En Europe, le règlement sur l’intelligence artificielle (AI Act) encadre déjà certains usages
			selon leur niveau de risque. Mais il n’a pas été pensé pour le cas qui nous occupe ici, celui
			d’un système plus compétent que l’humain qui échapperait à ses concepteurs. C’est un angle
			mort qu’un responsable public peut contribuer à combler, en portant la question là où elle se
			décide, au Parlement comme au gouvernement.
		</p>
		<p class="action">
			<Button href="#ecrire">Demander un briefing à Pause IA</Button>
		</p>
	</section>

	<!-- ── Objections ── -->
	<section class="sombre" aria-labelledby="t-objections">
		<SectionTitle id="t-objections">Objections courantes</SectionTitle>
		<div class="inView questions">
			{#each objections as o (o.id)}
				<Accordion id={o.id} open={false}>
					<span slot="head">{o.question}</span>
					<div slot="details">
						{#each o.reponse as p}<p>{p}</p>{/each}
					</div>
				</Accordion>
			{/each}
		</div>
	</section>

	<!-- ── Où en est la réponse publique ── -->
	<section aria-labelledby="t-reponse">
		<SectionTitle id="t-reponse">Où en est la réponse publique ?</SectionTitle>
		<p>
			Le sujet commence à sortir du cercle des spécialistes, mais les engagements concrets restent
			en retard sur le niveau d’alerte.
		</p>
		<p>
			En 2023, la déclaration du Center for AI Safety a réuni, sur une seule phrase plaçant le
			risque d’extinction au rang des pandémies et de la guerre nucléaire, des centaines de
			signatures de chercheurs et de dirigeants du domaine. La même année, le sommet de Bletchley
			Park au Royaume-Uni a débouché sur une déclaration commune d’une trentaine de pays, dont la
			France, les États-Unis et la Chine, reconnaissant les risques des systèmes les plus avancés.
			En 2025, un premier Rapport international sur la sécurité de l’IA, présidé par Yoshua Bengio,
			a réuni des experts désignés par une trentaine de pays pour dresser un état des lieux partagé.
		</p>
		<p>
			En octobre 2025, une déclaration appelant à interdire le développement de la
			superintelligence, tant qu’il n’existe pas de consensus scientifique sur sa sûreté et un large
			soutien du public, a recueilli des dizaines de milliers de signatures. On y trouve côte à côte
			Geoffrey Hinton et Yoshua Bengio, d’autres lauréats du prix Nobel, et des personnalités de
			tous bords politiques.
		</p>
		<p>
			Plus récemment, le 22 septembre 2026, l’Union européenne et une vingtaine de pays ont signé un
			appel international, porté notamment par la Finlande et la Norvège, demandant des garde-fous
			sur les systèmes les plus avancés. La France y est partie en tant qu’État membre de l’Union.
			Ces textes marquent une prise de conscience ; aucun n’a encore force contraignante sur la
			question de la perte de contrôle.
		</p>
	</section>

	<!-- ── Agir ── -->
	<section id="ecrire" aria-labelledby="t-ecrire">
		<SectionTitle id="t-ecrire">Agir, de votre place</SectionTitle>
		<p>
			Si vous exercez un mandat ou travaillez auprès d’un élu, trois gestes ont un effet réel : vous
			informer en profondeur, porter la question dans le débat public (une prise de parole, une
			question écrite au gouvernement), et demander que la France soutienne un encadrement
			international contraignant des systèmes les plus avancés.
		</p>
		<p>
			Pause IA est l’antenne française de PauseAI, un mouvement international qui alerte sur le
			risque de perte de contrôle. Nous proposons aux élus et à leurs équipes un point
			d’information, sans jargon et sans engagement, adapté au temps dont vous disposez.
		</p>
		<div class="contact">
			<h3>Demander un briefing ou un complément</h3>
			<p>Écrivez-nous ; nous revenons vers vous rapidement pour convenir d’un format.</p>
			<p class="adresse">
				<a href="mailto:{CONTACT}">{CONTACT}</a>
				<button type="button" on:click={copierLAdresse}>
					{#if copie}
						<Check size={15} aria-hidden="true" /> Adresse copiée
					{:else}
						<Copy size={15} aria-hidden="true" /> Copier l’adresse
					{/if}
				</button>
			</p>
		</div>
	</section>

	<!-- ── Pour approfondir ── -->
	<section aria-labelledby="t-sources">
		<SectionTitle id="t-sources">Pour approfondir</SectionTitle>
		{#each references as groupe (groupe.id)}
			<div class="groupe">
				<h3>{groupe.titre}</h3>
				<ul class="refs">
					{#each groupe.references as r (r.url)}
						<li>
							<a href={r.url} target="_blank" rel="noopener noreferrer">
								<span class="ref-titre">{r.titre}</span>
								<span class="ref-meta">{r.meta}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</section>

	{#if creditsPortraits.length}
		<p class="credits">
			Portraits recadrés, issus de Wikimedia Commons. {#each creditsPortraits as c, i (c.nom)}{i > 0
					? ' · '
					: ''}<a href={c.portrait.page} target="_blank" rel="noopener noreferrer">{c.nom}</a
				>{#if c.portrait.auteur}, {c.portrait.auteur}{/if}{#if c.portrait.licence},
					<a href={c.portrait.licenceUrl} target="_blank" rel="noopener noreferrer"
						>{c.portrait.licence}</a
					>{/if}{/each}. Les images sous CC BY-SA sont repartagées sous la même licence.
		</p>
	{/if}

	<p class="avertissement">
		Les probabilités, déclarations et dates citées renvoient à leurs sources d’origine, accessibles
		ci-dessus. Document d’information, sans valeur d’engagement. Mise à jour : {dateMaj}.
	</p>
</article>

{#snippet carte(c: Citation)}
	<figure class="citation">
		<div class="qui">
			{#if portraitComplet(c.portrait)}
				<img class="pastille" src={c.portrait?.fichier} alt="" loading="lazy" />
			{:else}
				<span class="pastille" aria-hidden="true">{c.initiales}</span>
			{/if}
			<span>
				<span class="nom">{c.nom}</span>
				<span class="fonction">{c.titre}</span>
			</span>
		</div>
		<blockquote>{c.propos}</blockquote>
		<figcaption>
			{c.source}
			{#if c.url}
				<a href={c.url} target="_blank" rel="noopener noreferrer">{c.lienTexte ?? 'Source'}</a>
			{/if}
		</figcaption>
	</figure>
{/snippet}

<style>
	/* La page se compose avec les briques de $components/ui : PageHero,
	   SectionTitle, Accordion, Button. Les styles ci-dessous ne font que
	   ce qu'aucune brique ne couvre : la grille des signataires, l'échelle
	   d'action, la liste de sources et les crédits. */
	/* Colonne de lecture étroite : 44 rem, soit environ 66 caractères par ligne,
	   la longueur sur laquelle l'œil revient à la ligne sans se perdre. En
	   54 rem (la largeur « éditoriale » par défaut), les lignes approchent 90
	   caractères et la page paraît aussitôt moins tenue. */
	.note {
		inline-size: 100%;
		max-inline-size: var(--width-text);
		margin-inline: auto;
		padding-inline: 1.5rem;
		padding-block: 3rem 0;
		line-height: 1.62;
	}

	/* Hiérarchie : le titre de page est nettement plus grand et plus gras que
	   les titres de section, qui le sont eux-mêmes nettement plus que le texte.
	   Sans cet écart, tout se vaut et la page paraît plate. */
	.note :global(h1) {
		font-size: clamp(2.1rem, 6vw, 3.2rem);
		line-height: 1.06;
		letter-spacing: -0.025em;
		font-weight: 700;
	}

	.note :global(h2) {
		font-size: clamp(1.5rem, 3.4vw, 2.05rem);
		line-height: 1.12;
		letter-spacing: -0.02em;
		font-weight: 700;
	}

	.filet {
		border: 0;
		border-top: 1px solid var(--text);
		margin: 1.75rem 0 1.5rem;
	}

	/* ── Bandeaux ardoise ──
	   Deux aplats rythment la page : la déclaration, puis les objections. Ils
	   débordent des gouttières de la colonne de lecture, donc sans calcul sur
	   100vw (qui ferait apparaître une barre de défilement horizontale selon
	   le navigateur). L'ardoise est fixe dans les deux thèmes : le texte passe
	   en --on-dark et l'orange de marque n'y sert que d'accent. */
	.sombre {
		margin-inline: calc(-1 * var(--gutter));
		padding: clamp(2rem, 5vw, 3rem) var(--gutter);
		background: var(--slate);
		color: var(--on-dark);
		border: 0;
	}

	@media (min-width: 52rem) {
		.sombre {
			margin-inline: -3rem;
			padding-inline: 3rem;
			border-radius: 2px;
		}
	}

	.sombre :global(.ui-section-title) {
		display: inline-flex;
		color: var(--on-dark);
		padding-bottom: 0.55rem;
		border-bottom: 2px solid var(--brand);
	}

	.sombre :global(p) {
		color: var(--on-dark);
	}

	.sombre .attribution,
	.sombre .signataires .fonction {
		color: rgba(var(--on-dark-rgb), 0.68);
	}

	.sombre blockquote {
		margin: 0.5rem 0 1.25rem;
		padding: 0;
		background: none;
		border: 0;
		font-size: clamp(1.25rem, 2.8vw, 1.55rem);
		line-height: 1.34;
		font-style: italic;
		font-weight: 400;
		color: var(--on-dark);
	}

	.guillemet {
		display: block;
		font-size: 4rem;
		line-height: 0.5;
		color: var(--brand);
		margin-top: 2rem;
		font-weight: 700;
	}

	.sombre .pastille {
		background: rgba(var(--on-dark-rgb), 0.08);
		color: var(--on-dark);
	}

	/* L'accordéon est dessiné pour un fond clair : on rhabille ses filets, son
	   texte et son panneau dépliant pour l'ardoise. */
	.sombre :global(div.inView:not(:last-child) > .accordion) {
		border-bottom-color: rgba(var(--on-dark-rgb), 0.18);
		border-bottom-width: 1px;
	}

	.sombre :global(.accordion h3),
	.sombre :global(.accordion .chevron) {
		color: var(--on-dark);
	}

	.sombre :global(.accordion .details) {
		background: var(--slate-2);
		border-color: rgba(var(--on-dark-rgb), 0.14);
		box-shadow: none;
	}

	.chapo p {
		font-size: clamp(1.05rem, 2vw, 1.18rem);
	}

	/* Respiration : les sections sont espacées d'un cran fixe et séparées d'un
	   filet d'un pixel, au lieu de marges choisies au cas par cas. Mesuré :
	   48 px de marge + 40 px de retrait + la marge basse du dernier paragraphe
	   font environ 110 px entre deux sections. À 64 + 64 on dépassait 160 px,
	   et la page se lisait comme une suite de blocs sans lien entre eux. */
	section {
		padding-block: clamp(2rem, 4.5vw, 2.5rem) 0;
		border-top: 1px solid var(--border);
		margin-top: clamp(2rem, 4.5vw, 3rem);
	}

	section > :last-child {
		margin-bottom: 0;
	}

	/* app.css pose « section:not(:last-child) { margin-bottom: 10rem } » au
	   delà d'une certaine largeur : 160 px entre chaque section, sur tout le
	   site. C'est beaucoup trop, et c'est une des raisons pour lesquelles nos
	   pages se lisent comme une suite de blocs sans lien. On la neutralise
	   ici ; à reprendre globalement lors de la refonte. */
	section:not(:last-child) {
		margin-bottom: 0;
	}

	.note :global(p) {
		line-height: 1.62;
		/* La césure automatique de app.css coupe les mots en plein milieu
		   d'une ligne qui n'est pas justifiée : elle n'a rien à rattraper
		   ici, et elle hache la lecture. */
		hyphens: manual;
	}

	.attribution {
		color: var(--text-2);
	}

	.accroche {
		font-weight: 700;
	}

	h3 {
		margin: 2rem 0 0.4rem;
	}

	/* Les citations ne sont pas des encadrés : pas d'aplat, pas d'ombre, pas de
	   coin arrondi. Un filet d'un pixel à gauche suffit à les détacher, et le
	   poids vient de la taille du texte. Un aplat crème derrière un bloc de
	   texte, sur une page déjà claire, ajoute du bruit sans ajouter de
	   hiérarchie. */
	blockquote {
		margin: 1.75rem 0 1rem;
		padding: 0 0 0 1.5rem;
		background: none;
		border-radius: 0;
		border-left: 1px solid var(--brand);
		font-size: clamp(1.3rem, 2.6vw, 1.6rem);
		line-height: 1.32;
		letter-spacing: -0.015em;
		font-weight: 500;
	}

	/* Phrase de chute d'une section. Elle était encadrée de deux filets, qui
	   venaient buter sur le filet de séparation de la section suivante : trois
	   traits en quinze lignes. Le poids du texte suffit à la détacher. */
	.saillie {
		margin: 2.25rem 0 0;
		font-size: clamp(1.1rem, 2.2vw, 1.25rem);
		line-height: 1.4;
		letter-spacing: -0.01em;
		font-weight: 700;
	}

	.appuye {
		font-weight: 600;
	}

	/* ── Signataires ── */
	.signataires {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
		gap: 1.5rem 1rem;
		margin: 1.75rem 0 0;
		padding: 0;
		list-style: none;
	}

	.signataires li {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin: 0;
	}

	/* Médaillon rond cerclé de marque : c'est l'anneau qui tient les visages
	   ensemble sur le fond sombre, et c'est le seul endroit où l'orange sert
	   de contour. */
	.pastille {
		display: grid;
		place-items: center;
		inline-size: 3.6rem;
		block-size: 3.6rem;
		border-radius: 50%;
		margin-bottom: 0.65rem;
		background: var(--bg-subtle);
		border: 2px solid var(--brand);
		color: var(--brand-subtle);
		font-size: 0.9rem;
		font-weight: 700;
		object-fit: cover;
	}

	.signataires .nom {
		font-size: 0.85rem;
		font-weight: 700;
		line-height: 1.25;
	}

	.signataires .fonction {
		font-size: 0.72rem;
		line-height: 1.3;
		margin-top: 0.2rem;
		color: var(--text-2);
	}

	/* ── Citations ── */
	/* Carte blanche, filet d'un pixel, ombre presque invisible : elle se
	   détache du fond sans peser. Le relief vient du filet, pas de l'ombre. */
	.citation {
		margin: 1.25rem 0 0;
		padding: 1.5rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		box-shadow: 0 1px 2px rgba(var(--ink-rgb), 0.04);
	}

	.qui {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		margin-bottom: 0.9rem;
	}

	.citation .pastille {
		margin: 0;
		inline-size: 3rem;
		block-size: 3rem;
		font-size: 0.95rem;
		flex-shrink: 0;
	}

	.citation .nom {
		display: block;
		font-weight: 700;
		line-height: 1.25;
	}

	.citation .fonction {
		display: block;
		font-size: 0.82rem;
		color: var(--text-2);
		line-height: 1.3;
		margin-top: 0.1rem;
	}

	.citation blockquote {
		margin: 0 0 1rem;
		padding: 0;
		background: none;
		border: 0;
		border-radius: 0;
		font-size: 1rem;
		line-height: 1.55;
		letter-spacing: 0;
		font-weight: 400;
		font-style: italic;
		color: var(--text-2);
	}

	.citation figcaption :global(a) {
		text-decoration: underline;
	}

	.citation figcaption {
		font-size: 0.85rem;
		color: var(--text-2);
		line-height: 1.5;
	}

	.grille-citations {
		display: grid;
		gap: 1.25rem;
		margin-top: 0.5rem;
		align-items: start;
	}

	@media (min-width: 48rem) {
		.grille-citations {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* ── Les trois niveaux d'action ── */
	.etapes {
		list-style: none;
		margin: 1.5rem 0;
		padding: 0;
	}

	.etapes li {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr);
		gap: 1rem;
		padding: 1.4rem 0;
		margin: 0;
		border-top: 1px solid var(--border);
	}

	.etapes li:last-child {
		border-bottom: 1px solid var(--border);
	}

	.numero {
		font-size: 1.5rem;
		line-height: 1.1;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--brand-subtle);
		letter-spacing: -0.02em;
	}

	.etapes h3 {
		margin: 0 0 0.3rem;
	}

	.etapes p {
		margin: 0;
		color: var(--text-2);
	}

	.action {
		margin-top: 2rem;
	}

	/* ── Contact ── */
	/* Le seul bloc encadré de la page, parce que c'est le seul endroit où l'on
	   demande une action. Un filet d'un pixel et un trait de marque de deux
	   pixels en tête, pas une carte posée en relief. */
	.contact {
		margin-top: 2rem;
		padding: 1.75rem;
		border: 1px solid var(--border);
		border-top: 2px solid var(--brand);
	}

	.contact h3 {
		margin: 0 0 0.4rem;
		font-size: 1.15rem;
		line-height: 1.25;
		letter-spacing: -0.01em;
	}

	.contact :global(p) {
		margin: 0 0 1rem;
		color: var(--text-2);
	}

	.adresse {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0;
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.85rem;
		border: 1px solid var(--border);
		border-radius: 3px;
		background: var(--bg);
		color: var(--text);
		font: inherit;
		font-size: 0.88rem;
		font-weight: 600;
		cursor: pointer;
	}

	button:hover {
		border-color: var(--brand);
	}

	/* ── Pour approfondir ── */
	.groupe {
		margin-top: 1.75rem;
	}

	.groupe h3 {
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	.refs {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.refs li {
		margin: 0;
		border-top: 1px solid var(--border);
	}

	.refs li:last-child {
		border-bottom: 1px solid var(--border);
	}

	/* Le soulignement du lien se propage à tous ses descendants en ligne :
	   sans cette remise à zéro, la ligne de contexte est soulignée elle aussi
	   et la liste devient un pavé de traits. On ne souligne que le titre. */
	.refs a {
		display: block;
		padding: 0.7rem 0;
		text-decoration: none;
		color: var(--text);
	}

	.ref-titre {
		display: block;
		font-weight: 600;
		line-height: 1.35;
	}

	.refs a:hover .ref-titre,
	.refs a:focus-visible .ref-titre {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.ref-meta {
		display: block;
		font-size: 0.85rem;
		color: var(--text-2);
		line-height: 1.45;
		margin-top: 0.1rem;
		text-decoration: none;
	}

	.credits,
	.avertissement {
		font-size: 0.85rem;
		color: var(--text-2);
		line-height: 1.6;
	}

	.credits {
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
	}

	.avertissement {
		padding-block: 0.75rem 4rem;
	}
</style>
