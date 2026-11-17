<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { LinkCard, LinkGrid, Page } from '$components/ui'
	import type { Lang } from '$lib/i18n'

	export let data: { lang: Lang }
</script>

<PostMeta
	title={'Remplacer l’humain, tel est l’objectif | PauseAI France'}
	description={'En quelques années, l’IA est devenue capable de remplacer les humains dans des tâches de plus en plus nombreuses, 16 % du travail déjà automatisable en France.'}
/>

<Page
	title="Remplacer l’humain, tel est l’objectif"
	eyebrow="Actualités"
	lede="Derrière l’aventure scientifique fascinante de l’intelligence artificielle, c’est bien la prise de contrôle de nos vies, à commencer par notre travail, qui est en jeu."
	width="text"
	variant="note"
	as="article"
>
	<svelte:fragment slot="meta">
		<a href="/{data.lang}/emploi-ia">Campagne Emploi &amp; IA</a> · Article 1/2 · 4 min de lecture
	</svelte:fragment>

	<p>
		En l’espace de quelques années, les modèles d’intelligence artificielle de pointe tels que GPT
		(développé par OpenAI, plus connu sous le nom de son agent conversationnel ChatGPT), Claude
		(Anthropic) ou encore Gemini (Google DeepMind) se sont imposés dans le quotidien de nombre
		d’entre nous.
	</p>

	<p>
		Pour rester dans le domaine du travail courant (c’est-à-dire sans parler de la recherche en
		mathématique ou en biochimie où ils font des prouesses, par exemple), ces IA savent déjà lire,
		analyser, synthétiser, traduire de longs documents, rédiger des textes clairs et structurés
		(emails, rapports, résumés et même contenus créatifs) en adaptant le ton au public visé.
		Certaines comprennent et traitent plusieurs formats : texte, images, audio ou vidéo. Elles
		peuvent aussi expliquer, corriger et écrire du code informatique, et aider ainsi à développer
		des logiciels plus vite. Enfin, elles servent de moteur à des « agents » capables d’enchaîner
		des actions de manière autonome.
	</p>

	<h2>16&nbsp;% et jusqu’à 25&nbsp;% du travail déjà automatisable en France</h2>

	<p>
		Une étude menée conjointement par l’Observatoire des Emplois émergents ou Menacés (OEM) et la
		Coface vient de montrer que, pour la France, 16&nbsp;% du contenu du travail serait déjà
		automatisable. Il s’agit d’une moyenne. Ce taux dépasserait 25&nbsp;% dans le management,
		l’administration, les métiers créatifs, le droit, la finance, l’ingénierie et l’informatique.
		D’où un impact très sensible dans les grands centres urbains où ces métiers sont concentrés.
	</p>

	<p>
		Précision importante : ces résultats valent pour la période actuelle, qui voit émerger les
		premiers agents autonomes. Les auteurs ont également examiné des scénarios prospectifs, dans
		lesquels l’IA acquiert de nouvelles capacités de planification et de coordination, qui
		amèneraient à des taux d’automatisation très supérieurs.
	</p>

	<p>
		Une telle rupture technologique est une hypothèse sérieuse. Les progrès de l’IA sont tellement
		incroyables qu’ils sont impossibles à suivre pour le commun des mortels. Les spécialistes, en
		revanche, suivent avec attention les performances des modèles sur de nombreux tests (appelés «
		benchmarks »). Le laboratoire de recherche à but non lucratif EPOCH AI propose un index qui
		permet d’établir une sorte de note moyenne. La croissance de cet index est extrêmement rapide :
		les modèles deviennent chaque mois plus performants.
	</p>

	<h2>Désinvestir dans le travail pour investir dans l’IA</h2>

	<p>
		Notre économie connaît déjà les prémisses d’une transformation radicale. Rien d’étonnant à cela
		puisque c’est le but principal que poursuivent les entreprises qui développent l’IA de pointe.
		Leur objectif est de les amener à un niveau de compétence cognitive qui les rend capables de
		remplacer voire de surpasser les humains dans un grand nombre de tâches. Elles continuent à
		réaliser pour cela des investissements colossaux, en puissance de calcul et en centres de
		données.
	</p>

	<p>
		Pour les rentabiliser, il faudra que les géants de la tech puissent vendre massivement
		l’utilisation de leurs modèles aux entreprises et aux administrations, si possible en les
		rendant dépendantes de ces outils. Et pour que les entreprises et les administrations les
		achètent, il faudra qu’elles y trouvent un intérêt : investir dans l’IA, mais désinvestir dans
		le travail, et se rendre ainsi plus rentables ou plus efficaces.
	</p>

	<h2>Premiers signes</h2>

	<p>
		Les premiers licenciements ont commencé. Aux États-Unis, l’organisation à but non lucratif The
		Alliance for secure AI a recensé près de 130&nbsp;000 annonces de suppressions d’emplois liées
		au moins partiellement à l’IA depuis le 1<sup>er</sup> janvier 2025. Certaines professions souvent
		exercées par des travailleurs indépendants – traducteurs, rédacteurs, développeurs web… – sont déjà
		en grandes difficultés, les métiers créatifs sont également en première ligne face à la vague de remplacement.
	</p>

	<p>
		Enfin, de nombreuses analyses convergent pour s’inquiéter des difficultés croissantes des jeunes
		diplômés à trouver leur premier emploi. C’est le cas, ironiquement, du patron de la startup
		Anthropic, Dario Amodei, qui déclarait en mai 2025 au média états-unien Axios :
	</p>

	<blockquote>
		<p>
			« L’IA pourrait effacer la moitié de tous les premiers emplois de cols blancs et faire grimper
			le chômage à 10-20&nbsp;% d’ici 1 à 5 ans. »
		</p>
		<footer>Dario Amodei, PDG d’Anthropic, mai 2025</footer>
	</blockquote>

	<LinkGrid>
		<LinkCard
			href="/{data.lang}/articles/pas-de-pilote"
			title="Pas de pilote dans l’avion France"
			featured
		>
			Article suivant : chômage massif, modèle social menacé, dépendance à la Silicon Valley.
		</LinkCard>
		<LinkCard href="/{data.lang}/emploi-ia" title="Campagne Emploi &amp; IA">
			Revenir à la campagne.
		</LinkCard>
	</LinkGrid>
</Page>
