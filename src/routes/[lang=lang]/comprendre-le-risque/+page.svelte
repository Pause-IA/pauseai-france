<script lang="ts">
	/**
	 * Introduction publique au risque de perte de contrôle de l'IA.
	 *
	 * La page a d'abord été écrite comme note de synthèse pour les élus. Son
	 * rôle a changé : c'est maintenant une introduction générale, pour qui
	 * découvre le sujet. Elle a donc été ramenée de dix sections à six, et les
	 * passages qui ne parlaient qu'à un responsable public (chronologie
	 * diplomatique, demande de briefing) ont été retirés. Un texte qu'on ne
	 * lit pas jusqu'au bout n'informe personne.
	 *
	 * Elle est indexée : une introduction destinée au public n'a aucune raison
	 * d'être cachée des moteurs de recherche, contrairement à la note de
	 * plaidoyer qu'elle était.
	 */
	import PostMeta from '$components/PostMeta.svelte'
	import CarteCitation from './CarteCitation.svelte'
	import Accordion from '$components/Accordion.svelte'
	import Button from '$components/Button.svelte'
	import { Page, SectionTitle } from '$components/ui'
	import {
		citationHinton,
		citations,
		creditsPortraits,
		portraitComplet,
		etapes,
		objections,
		references,
		signataires
	} from '$lib/data/comprendre-le-risque'
	import type { PageData } from './$types'

	export let data: PageData
	$: prefix = data.lang === 'en' ? '/en' : '/fr'

	// Le titre d'origine, « Garder l'humanité aux commandes », était un mot
	// d'ordre : il convenait à une note remise en main propre, dont on savait
	// déjà de quoi elle parlait. La page est maintenant indexée et partagée par
	// lien : son titre est ce qu'on lit avant de cliquer, il doit dire le sujet.
	const title = 'Pourquoi l’IA pourrait échapper à notre contrôle'
	const description =
		'Pourquoi des centaines de chercheurs, et les dirigeants des laboratoires eux-mêmes, alertent sur un risque d’extinction lié à l’intelligence artificielle, et ce qu’il est possible de faire.'

	// Trois voix suffisent à montrer d'où vient l'alerte ; sept transformaient
	// la section en galerie.
	const voix = citations.slice(0, 3)

	// La bibliographie complète (sept groupes, trente entrées) était celle
	// d'une note de plaidoyer. Pour une introduction, on garde ce qui se lit
	// sans bagage : la vulgarisation, et les déclarations citées plus haut.
	const pourApprofondir = references.filter((g) => g.id === 'scenarios' || g.id === 'declarations')
</script>

<PostMeta {title} {description} />

<Page {title} eyebrow="Comprendre" width="content" as="article">
	<svelte:fragment slot="lede">
		Les grands laboratoires d’intelligence artificielle ont un objectif affiché : construire des
		systèmes capables d’agir seuls, sans qu’un humain les dirige. Plusieurs de leurs dirigeants
		estiment que de tels systèmes pourraient arriver avant 2030. Personne, aujourd’hui, ne sait
		garantir qu’une intelligence artificielle de ce niveau resterait sous contrôle humain.
	</svelte:fragment>

	<!-- ── Ce que dit la communauté scientifique ──────────────────────────
	     La crédibilité d'abord : c'est la question que se pose quelqu'un qui
	     découvre le sujet. La section « Qui le dit, et faut-il les croire ? »
	     faisait le même travail plus loin ; les chiffres d'enquête qui la
	     justifiaient sont repris ici, le reste est supprimé. -->
	<section class="sombre" aria-labelledby="t-declaration">
		<span class="filet-marque" aria-hidden="true"></span>
		<SectionTitle id="t-declaration">Ce n’est pas une inquiétude marginale</SectionTitle>
		<span class="barres" aria-hidden="true"><span></span><span></span></span>
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
			>, mai 2023. Une seule phrase, signée par des centaines de chercheurs, parmi lesquels :
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
		<p class="apres-signataires">
			Elle est également signée par les dirigeants d’OpenAI, de Google DeepMind et d’Anthropic,
			c’est-à-dire par ceux-là mêmes qui construisent ces systèmes et en tirent profit.
		</p>

		<p class="apres-signataires">
			Interrogés en 2023, 2 778 chercheurs du domaine donnaient une probabilité médiane de 5 % à un
			résultat « aussi grave que l’extinction de l’humanité ». Fin 2024, elle avait doublé : 10 %.
			Le chiffre monte à mesure qu’ils observent les progrès réels.
		</p>

		<details class="depliable">
			<summary><h3>D’où viennent ces chiffres, et que valent-ils ?</h3></summary>

			<p>
				Le groupe de recherche AI Impacts interroge depuis 2016 les chercheurs qui publient dans les
				grandes conférences d’intelligence artificielle. L’enquête de 2023 est la plus large jamais
				menée sur le sujet ; celle de fin 2024 a réuni plus de 1 500 réponses, avec une moyenne qui
				approche 18 %.
			</p>
			<p>
				Aucun de ces chiffres n’est une prédiction. Ce sont des estimations de risque. Mais on ne
				fait pas voler un avion dont les ingénieurs annoncent 10 % de chances de crash, et on ne
				traite pas à la légère un risque d’extinction que ceux qui conçoivent la technologie
				chiffrent eux-mêmes en dizaines de pour cent.
			</p>
			<div class="grille-citations">
				{#each voix as c (c.nom)}
					<CarteCitation {c} />
				{/each}
			</div>
		</details>
	</section>

	<!-- ── Le mécanisme ── -->
	<section aria-labelledby="t-incontrolable">
		<SectionTitle id="t-incontrolable">Pourquoi ne sait-on pas les contrôler ?</SectionTitle>
		<p class="accroche">
			Un système d’intelligence artificielle moderne n’est pas programmé ligne par ligne, comme un
			logiciel ordinaire. Il est entraîné.
		</p>
		<p>
			On lui montre d’énormes quantités de données, et il ajuste tout seul des milliards de
			paramètres jusqu’à produire les bons résultats. Personne, pas même ses concepteurs, ne sait
			lire le détail de ce qu’il a appris ni fixer précisément ses objectifs. On obtient une
			capacité, sans le mode d’emploi qui va avec. D’où l’impossibilité d’empêcher de façon fiable
			un comportement indésirable.
		</p>

		<p>
			Ce n’est pas une crainte théorique. Lors de tests encadrés, des systèmes récents ont menti à
			leurs évaluateurs, cherché à copier leur propre code pour échapper à un remplacement, ou fait
			du chantage à un ingénieur fictif pour éviter d’être désactivés. Pas des bugs qu’un
			développeur corrige en une ligne : des stratégies que le système adopte parce qu’elles servent
			le but qu’on lui a donné.
		</p>
		<p>
			Ces systèmes ne sont pas encore assez puissants pour que de tels comportements mènent à une
			catastrophe. Le problème est que la dangerosité croît avec la capacité : plus ils deviennent
			compétents, plus l’écart se creuse entre ce qu’ils savent faire et ce que nous savons
			vérifier.
		</p>
		<CarteCitation c={citationHinton} />
	</section>

	<!-- ── À quoi ça ressemblerait ── -->
	<section aria-labelledby="t-menace">
		<SectionTitle id="t-menace">À quoi ressemblerait une perte de contrôle ?</SectionTitle>
		<p>
			Pas à un robot hostile marchant sur une ville. À quelque chose de plus discret : à mesure que
			l’on confie à ces systèmes des décisions économiques, administratives, puis militaires, le
			contrôle humain s’érode sans qu’aucun moment spectaculaire ne le signale. On délègue, par
			commodité et par concurrence, jusqu’au point où revenir en arrière devient hors de portée.
		</p>

		<details class="depliable">
			<summary><h3>Les scénarios plus brutaux</h3></summary>

			<p>
				Un système très compétent, chargé d’un objectif, peut employer pour l’atteindre des moyens
				que nous n’avions ni prévus ni souhaités. Trois voies préoccupent les chercheurs. Une IA
				capable de découvrir et d’exploiter des failles informatiques plus vite que les défenseurs
				ne les corrigent pourrait désorganiser des réseaux critiques, des hôpitaux à l’énergie. Une
				IA qui aide à concevoir des agents pathogènes abaisse le niveau de compétence nécessaire
				pour fabriquer une arme de masse. Et des campagnes de manipulation taillées sur mesure, à
				très grande échelle, peuvent corrompre le débat public dont dépendent nos décisions
				collectives.
			</p>
		</details>

		<p class="saillie">Celui qui perd le contrôle ne le récupère pas.</p>
	</section>

	<!-- ── Que faire ── -->
	<section id="faire" aria-labelledby="t-faire">
		<SectionTitle id="t-faire">Que peut-on faire ?</SectionTitle>
		<p class="accroche">
			Le point de départ est simple : il faut interdire le développement des systèmes que personne
			ne sait contrôler.
		</p>
		<p>
			Tant que personne ne sait maintenir sous contrôle une intelligence artificielle plus
			compétente que nous, la priorité n’est pas d’encadrer l’usage de ces systèmes une fois
			construits, mais d’empêcher qu’ils le soient avant qu’on sache les maîtriser. Trois niveaux
			d’action :
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
			Le dernier point paraît hors de portée. Il ne l’est pas : aucun pays n’a intérêt à voir se
			construire, chez lui ou ailleurs, une technologie susceptible d’échapper à tout contrôle
			humain. C’est ce dénominateur commun qui a permis, pour le nucléaire, de bâtir des accords
			entre rivaux.
		</p>
		<p>
			Ces décisions se prennent au niveau des États, mais elles ne s’y prendront pas sans pression.
			Signer l’appel prend une minute et pèse dans ce que les responsables publics considèrent comme
			une attente. En parler autour de vous pèse davantage encore : la plupart des gens n’ont jamais
			entendu dire que les chercheurs du domaine chiffrent eux-mêmes ce risque.
		</p>
		<p class="action">
			<Button href="{prefix}/declaration">Signer l’appel</Button>
			<Button alt href="{prefix}/agir">Toutes les façons d’agir</Button>
		</p>
	</section>

	<!-- ── Objections ──────────────────────────────────────────────────────
	     Gardées : repliées, elles ne coûtent presque rien en longueur, et ce
	     sont les questions que se pose quelqu'un qui découvre le sujet. -->
	<section class="sombre" aria-labelledby="t-objections">
		<span class="filet-marque" aria-hidden="true"></span>
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
		<!-- Accordion monte son panneau avec {#if open} : replié, la réponse
		     n'existe pas dans le DOM, et aucune règle d'impression ne peut la
		     révéler. D'où cette copie dépliée, masquée à l'écran et seule
		     visible sur papier. -->
		<div class="questions-impression" aria-hidden="true">
			{#each objections as o (o.id)}
				<div class="objection-imprimee">
					<h3>{o.question}</h3>
					{#each o.reponse as p}<p>{p}</p>{/each}
				</div>
			{/each}
		</div>
	</section>

	<!-- ── Pour approfondir ── -->
	<section aria-labelledby="t-sources">
		<details class="depliable">
			<summary><h2 id="t-sources" class="ui-section-title">Pour approfondir</h2></summary>

			<p class="note-langue">
				Sauf mention contraire, ces ressources sont en anglais : c’est la langue de la
				quasi-totalité des travaux de référence sur le sujet.
			</p>
			{#each pourApprofondir as groupe (groupe.id)}
				<div class="groupe">
					<h3>{groupe.titre}</h3>
					<ul class="refs">
						{#each groupe.references as r (r.url)}
							<li>
								<a href={r.url} target="_blank" rel="noopener noreferrer">
									<span class="ref-titre"
										>{r.titre}{#if r.francais}<span class="ref-langue">en français</span>{/if}</span
									>
									<span class="ref-meta">{r.meta}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</details>
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
		ci-dessus.
	</p>
</Page>

<style>
	/* La page se compose avec les briques de $components/ui : PageHero,
	   SectionTitle, Accordion, Button. Les styles ci-dessous ne font que
	   ce qu'aucune brique ne couvre : la grille des signataires, l'échelle
	   d'action, la liste de sources et les crédits. */
	/* Colonne de lecture étroite : 44 rem, soit environ 66 caractères par ligne,
	   la longueur sur laquelle l'œil revient à la ligne sans se perdre. En
	   54 rem (la largeur « éditoriale » par défaut), les lignes approchent 90
	   caractères et la page paraît aussitôt moins tenue. */

	/* L'en-tête du site est collant : sans cette marge, une ancre (#faire,
	   #ecrire) amène le titre de section juste sous l'en-tête, qui le cache. */

	/* Hiérarchie : le titre de page est nettement plus grand et plus gras que
	   les titres de section, qui le sont eux-mêmes nettement plus que le texte.
	   Sans cet écart, tout se vaut et la page paraît plate. */

	/* ── Bandeaux ardoise ──
	   Deux aplats rythment la page : la déclaration, puis les objections. Ils
	   débordent des gouttières de la colonne de lecture, donc sans calcul sur
	   100vw (qui ferait apparaître une barre de défilement horizontale selon
	   le navigateur). L'ardoise est fixe dans les deux thèmes : le texte passe
	   en --on-dark et l'orange de marque n'y sert que d'accent. */
	.sombre {
		margin-inline: calc(-1 * var(--marge-note));
		padding: clamp(2rem, 5vw, 3rem) 1.25rem;
		/* Valeur de repli : --surface-sombre vient de la refonte de la charte,
		   qui fait l'objet d'une branche distincte. Sans elle, le fond tombait à
		   transparent et le texte blanc du bandeau devenait illisible sur le
		   crème du site. Quand la charte est mergée, sa définition l'emporte. */
		background: var(--surface-sombre, rgb(14, 36, 51));
		color: var(--on-dark);
		border: 0;
	}

	@media (min-width: 40rem) {
		.sombre {
			padding-inline: 2rem;
		}
	}

	@media (min-width: 52rem) {
		.sombre {
			margin-inline: -3rem;
			padding-inline: 3rem;
			border-radius: 2px;
		}
	}

	.sombre :global(.ui-section-title) {
		color: var(--on-dark);
	}

	/* Le filet court orange au-dessus du titre est le signe d'ouverture de la
	   charte : c'est déjà celui de PageHero. On le reprend ici plutôt que de
	   souligner le titre, pour que les deux ouvertures de la page se
	   répondent. */
	.filet-marque {
		display: block;
		inline-size: 3rem;
		block-size: 4px;
		border-radius: var(--radius-pill);
		background: var(--brand);
		margin-bottom: 1.1rem;
	}

	.sombre :global(p) {
		color: var(--on-dark);
	}

	.sombre .attribution,
	.sombre .signataires .fonction {
		color: rgba(var(--on-dark-rgb), 0.68);
	}

	/* Les liens du site prennent --brand-subtle (#a85400), l'orange foncé
	   calculé pour rester lisible sur un fond clair. Sur l'aplat sombre il
	   tombe à 2,98:1, sous le minimum WCAG de 4,5:1 : le lien disparaît. On
	   repasse à l'orange de marque, qui donne 7,20:1 sur cette surface. */
	.sombre :global(a) {
		color: var(--brand);
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

	/* Les deux barres du logo ouvrent la citation. C'est notre signe, pas un
	   guillemet typographique repris ailleurs. */
	.barres {
		display: flex;
		gap: 5px;
		margin-top: 2rem;
	}

	.barres span {
		inline-size: 7px;
		block-size: 30px;
		border-radius: 2px;
		background: var(--brand);
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
		background: var(--surface-sombre-2, rgb(34, 56, 72));
		border-color: rgba(var(--on-dark-rgb), 0.14);
		box-shadow: none;
	}

	/* Le filet sous le titre ouvre la page : un chapô en plus gros corps
	   ajouterait un troisième niveau de taille dans les quatre premiers
	   centimètres. Il garde donc le corps du texte courant. */
	/* Attachée au bloc-titre, au-dessus du filet : on sait de quand date le
	   document avant d'en lire une ligne. Sous le filet, elle flottait entre
	   le titre et le texte sans appartenir à l'un ni à l'autre. */

	/* Le surtitre en étiquette plutôt qu'en texte coloré.
	   Aucun orange n'est lisible en texte sur blanc : --brand donne 2,21:1 et
	   --brand-deep 2,84:1, pour un seuil de 4,5:1. On tournait donc autour
	   d'oranges rabattus, de plus en plus marron à mesure qu'ils devenaient
	   lisibles. En inversant, le problème disparaît : texte foncé SUR l'orange
	   de marque, à pleine saturation, 7,87:1.
	   Le filet court orange de PageHero est masqué : deux marques orange
	   superposées en deux centimètres, c'est une de trop. */

	/* Respiration : les sections sont espacées d'un cran fixe et séparées d'un
	   filet d'un pixel, au lieu de marges choisies au cas par cas. Mesuré :
	   48 px de marge + 40 px de retrait + la marge basse du dernier paragraphe
	   font environ 110 px entre deux sections. À 64 + 64 on dépassait 160 px,
	   et la page se lisait comme une suite de blocs sans lien entre eux. */
	section {
		padding-block: clamp(2rem, 4.5vw, 2.5rem) 0;
		border-top: 1px solid var(--filet-note);
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

	/* Les constructeurs signent aussi : dit en texte, après les portraits des
	   chercheurs, plutôt qu'en vitrine. */
	.apres-signataires {
		margin-top: 1.5rem;
		font-size: 0.95rem;
		line-height: 1.6;
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

	.grille-citations {
		display: grid;
		gap: 1.25rem;
		margin-top: 0.5rem;
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
		border-top: 1px solid var(--filet-note);
	}

	.etapes li:last-child {
		border-bottom: 1px solid var(--filet-note);
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

	/* Sur un écran étroit, la colonne du chiffre et sa gouttière prenaient
	   48 px sur 358 : le titre de l'étape tombait sur trois lignes. Le chiffre
	   passe au-dessus et le titre récupère toute la largeur. */
	@media (max-width: 30rem) {
		.etapes li {
			grid-template-columns: 1fr;
			gap: 0.3rem;
		}

		/* Sur 390 px, le libellé passe sur deux lignes et l'étiquette devient
		   un pavé. On resserre le corps et les marges intérieures pour qu'elle
		   reste une étiquette. */
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
		border-top: 1px solid var(--filet-note);
	}

	.refs li:last-child {
		border-bottom: 1px solid var(--filet-note);
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

	/* Répété sur douze entrées sur treize, « en anglais » cessait d'informer.
	   La règle est annoncée une fois en tête de section, et seule l'exception
	   porte une étiquette. */
	.note-langue {
		margin: -0.5rem 0 1.5rem;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.ref-langue {
		display: inline-block;
		margin-left: 0.5rem;
		padding: 0.08rem 0.4rem;
		border: 1px solid var(--border);
		border-radius: 3px;
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--text-2);
		vertical-align: 0.1em;
		white-space: nowrap;
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
		border-top: 1px solid var(--filet-note);
	}

	.avertissement {
		padding-block: 0.75rem 4rem;
	}

	/* La copie imprimée des objections n'existe que pour le papier. Déclarée
	   avant le bloc @media print : à spécificité égale, c'est la dernière
	   règle écrite qui gagne, quel que soit le média. */
	.questions-impression {
		display: none;
	}

	/* ── Impression ───────────────────────────────────────────────────────
	   Cette note est faite pour être glissée dans un dossier de rendez-vous.
	   Sur papier : pas d'aplat, pas de photo, les objections dépliées, et
	   l'adresse des sources écrite en toutes lettres puisqu'on ne peut pas
	   cliquer une feuille. */
	@media print {
		/* L'étiquette deviendrait un pavé d'encre orange. Sur papier, le
		   surtitre redevient du texte. */

		/* L'aplat deviendrait un rectangle d'encre pleine page. Un filet
		   suffit à montrer que le bloc se détache. */
		.sombre {
			margin-inline: 0;
			padding: 1.2rem 0 0;
			background: none;
			color: var(--encre-impression, rgb(0, 0, 0));
			border-top: 2px solid var(--encre-impression, rgb(0, 0, 0));
		}

		.sombre :global(.ui-section-title),
		.sombre :global(p),
		.sombre blockquote,
		.sombre .attribution,
		.sombre .signataires .fonction,
		.sombre :global(a) {
			color: var(--encre-impression, rgb(0, 0, 0));
		}

		/* Huit portraits en quadrichromie pour une information que les noms
		   portent déjà. */
		.pastille {
			display: none;
		}

		.signataires {
			grid-template-columns: repeat(3, 1fr);
			gap: 0.5rem 1rem;
		}

		.signataires li {
			align-items: start;
			text-align: left;
		}

		/* L'accordéon replié n'a pas de contenu : on imprime la copie. */
		.questions {
			display: none;
		}

		.questions-impression {
			display: block;
		}

		.objection-imprimee {
			margin-top: 1.1rem;
			break-inside: avoid;
			page-break-inside: avoid;
		}

		.objection-imprimee h3 {
			margin: 0 0 0.3rem;
			font-size: 1.05rem;
			line-height: 1.25;
		}

		.objection-imprimee p {
			margin: 0 0 0.4rem;
		}

		/* Les boutons d'appel n'ont pas d'équivalent papier. */
		.action {
			display: none;
		}

		.etapes li,
		.groupe {
			break-inside: avoid;
			page-break-inside: avoid;
			box-shadow: none;
		}

		.barres span {
			background: var(--encre-impression, rgb(0, 0, 0));
		}

		.filet-marque {
			background: var(--encre-impression, rgb(0, 0, 0));
		}

		/* On ne clique pas une feuille imprimée : l'adresse des sources doit
		   y figurer. Limité aux liens qui documentent, pas à ceux du corps du
		   texte, qui rendraient la lecture illisible. */
		.refs a::after,
		.attribution :global(a)::after {
			content: ' (' attr(href) ')';
			font-size: 0.78em;
			font-weight: 400;
			word-break: break-all;
		}
	}
</style>
