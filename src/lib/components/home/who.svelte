<script lang="ts">
	import LeadershipCard from '$components/LeadershipCard.svelte'
	import ScientificCouncilCard from '$components/ScientificCouncilCard.svelte'
	import Button from '$components/Button.svelte'
	import { Bandeau, Page, SectionTitle } from '$components/ui'
	import { equipes } from '$lib/data/equipes'
	import type { TeamMember } from '$lib/notion'
	import type { Lang } from '$lib/i18n'

	export let teamMembers: TeamMember[] = []
	export let lang: Lang = 'fr'
	$: prefix = lang === 'en' ? '/en' : '/fr'

	// Fallback data when Notion is not configured
	const fallbackLeadership = [
		{
			name: 'Maxime Fournes',
			role: 'Co-fondateur et Président',
			image: '/membres/maxime.png'
		},
		{
			name: 'Gilles Bréda',
			role: 'Co-fondateur et Trésorier',
			image: '/membres/gilles.png'
		},
		{
			name: 'Clémence Peyrot',
			role: 'Directrice exécutive',
			image: '/membres/clemence.jpeg'
		},
		{
			name: 'Moïri',
			role: 'Secrétaire général',
			image: '/membres/moiri.jpeg'
		},
		{
			name: 'Pierre Lamotte',
			role: "Conseil d'administration et Responsable communication",
			image: '/membres/pierre.png'
		},
		{
			name: 'Romain',
			role: "Conseil d'administration et Responsable financement",
			image: null
		}
	]

	const fallbackScientificCouncil = [
		{
			name: 'Maxime Fournes',
			job: 'Ingénieur et chercheur en IA',
			image: '/membres/maxime.png'
		},
		{
			name: 'Jérémy Perret',
			job: "Chercheur en sécurité de l'IA, Suboptimal IA",
			image: '/membres/jeremy.png'
		}
	]

	// Derive display data from Notion or fallback
	$: hasNotionData = teamMembers.length > 0

	$: leadership = hasNotionData
		? teamMembers
				.filter((m) => m.category === 'Direction')
				.map((m) => ({ name: m.name, role: m.role, image: m.image || null }))
		: fallbackLeadership

	$: scientificCouncil = hasNotionData
		? teamMembers
				.filter((m) => m.category === 'Conseil scientifique')
				.map((m) => ({ name: m.name, job: m.profession, image: m.image || null }))
		: fallbackScientificCouncil
</script>

<!-- Gabarit Hub : en-tête commun, puis « en bref » (demande, valeurs,
     financement, chacun sur sa page), puis l’équipe. Les valeurs et le
     positionnement détaillés ne sont plus recopiés ici : ils vivent sur la
     charte des valeurs et « Que demandons-nous ? ». -->
<Page
	width="wide"
	eyebrow={lang === 'en' ? 'About' : 'À propos'}
	title={lang === 'en' ? 'Who are we?' : 'Qui sommes-nous ?'}
>
	<svelte:fragment slot="lede">
		{#if lang === 'en'}
			Pause AI France is an <a href="{prefix}/mentions-legales">association</a> that alerts French
			citizens and public authorities to the
			<a href="{prefix}/dangers/economic-and-material">serious dangers</a> of the artificial
			intelligence race, and encourages them to act against it. We represent
			<a href="https://pauseai.info" target="_blank" rel="noopener noreferrer">PauseAI Global</a> in France.
		{:else}
			Nous sommes une <a href="{prefix}/mentions-legales">association</a> qui alerte les citoyens et
			les pouvoirs publics français sur les
			<a href="{prefix}/dangers/economiques-et-materiels">graves dangers</a> de la course à
			l’intelligence artificielle, et les incite à agir pour s’y opposer. Nous représentons en
			France
			<a href="https://pauseai.info" target="_blank" rel="noopener noreferrer">PauseAI Global</a>.
		{/if}
	</svelte:fragment>
	<div class="contact-cta" slot="actions">
		<Button href="{prefix}/dons">{lang === 'en' ? 'Donate' : 'Faire un don'}</Button>
		<Button alt href="{prefix}/rejoindre"
			>{lang === 'en' ? 'Join Pause IA' : 'Rejoindre Pause IA'}</Button
		>
		<Button alt href="mailto:contact@pauseia.fr"
			>{lang === 'en' ? 'Contact us' : 'Nous contacter'}</Button
		>
	</div>

	<SectionTitle>{lang === 'en' ? 'In short' : 'En bref'}</SectionTitle>
	<!-- Trois repères, en bloc éditorial : filet orange, titre, phrase, lien
	     nommé. C’étaient des cartes à emoji, avec ombre et flèche nue en bas à
	     droite — le vocabulaire d’une page de startup, sur la page qui doit
	     justement établir le sérieux de l’association. -->
	<ul class="en-bref">
		<li>
			<h3>{lang === 'en' ? 'What we ask for' : 'Notre demande'}</h3>
			<p>
				{lang === 'en'
					? 'A global pause on training frontier AI models, until safety and democratic control are guaranteed.'
					: 'Une pause mondiale de l’entraînement des IA de pointe, jusqu’à ce que la sécurité et le contrôle démocratique soient garantis.'}
			</p>
			<a href="{prefix}/propositions">
				{lang === 'en' ? 'Our proposals' : 'Nos propositions'}
			</a>
		</li>
		<li>
			<h3>{lang === 'en' ? 'Our values' : 'Nos valeurs'}</h3>
			<p>
				{lang === 'en'
					? 'Ten values ranked by priority, starting with non-violence and intellectual rigour.'
					: 'Dix valeurs classées par priorité, à commencer par la non-violence et la rigueur intellectuelle.'}
			</p>
			<a href="{prefix}/charte-des-valeurs">
				{lang === 'en' ? 'Our charter of values' : 'La charte des valeurs'}
			</a>
		</li>
		<li>
			<h3>{lang === 'en' ? 'Our funding' : 'Notre financement'}</h3>
			<p>
				{lang === 'en'
					? 'A non-profit founded in June 2024, fully independent of the AI and tech industry.'
					: 'Association à but non lucratif créée en juin 2024, totalement indépendante de l’industrie de l’IA et de la tech.'}
			</p>
			<a href="{prefix}/financements">
				{lang === 'en' ? 'Where our money comes from' : 'D’où vient notre argent'}
			</a>
		</li>
	</ul>

	<SectionTitle>{lang === 'en' ? 'The team' : 'L’équipe'}</SectionTitle>
	<!-- Pas de sous-titre « Direction » : la section s’appelle déjà « L’équipe »
	     et les fonctions figurent sur chaque fiche. Le sous-titre ne faisait que
	     répéter, et ajoutait un niveau de titre pour rien. -->
	<div class="team-section">
		<div class="cards-grid cards-centered">
			{#each leadership as leader}
				<LeadershipCard name={leader.name} role={leader.role} image={leader.image} />
			{/each}
		</div>
	</div>

	{#if scientificCouncil.length > 0}
		<div class="team-section">
			<h2 class="section-title">
				{lang === 'en' ? 'Scientific Council' : 'Conseil scientifique'}
			</h2>
			<div class="cards-grid cards-centered">
				{#each scientificCouncil as scientist}
					<ScientificCouncilCard
						name={scientist.name}
						job={scientist.job}
						image={scientist.image}
					/>
				{/each}
			</div>
		</div>
	{/if}

	<!-- La galerie « Membres et bénévoles » affichait une quinzaine de visages
	     pris parmi plus de cent. Le choix n’était pas explicable, et la page
	     laissait croire à une équipe de quinze personnes au lieu d’un mouvement.
	     Une phrase dit mieux ce que la galerie disait mal. -->
	<!-- Qui est salarié et qui est bénévole se dit ici, en une phrase, plutôt
	     que par une étiquette sur chaque carte : coller un badge « payé » à
	     trois personnes au milieu de cent bénévoles alourdit les cartes et met
	     en avant la mauvaise information. Dit ainsi, le rapport entre deux
	     salariés et une centaine de bénévoles est à notre avantage.

	     Maxime Fournes est salarié de PauseAI Global et non de l’association :
	     « trois salariés » serait faux, d’où la mention séparée.

	     Les deux noms et le nombre sont écrits en dur : rien dans Notion ne
	     distingue un salarié d’un bénévole. À reprendre à la prochaine
	     embauche ou au prochain départ. Les fonctions ne sont pas répétées
	     ici, elles figurent sur les fiches juste au-dessus. -->
	<Bandeau>
		<p class="benevoles">
			{#if lang === 'en'}
				The association currently employs two people, Clémence Peyrot and Orlando H., with Maxime
				Fournes currently employed by PauseAI Global. Beyond this team, Pause AI France runs on
				<strong>more than a hundred volunteers</strong>: engineers, teachers, researchers, lawyers,
				psychologists, students, retirees. Most of the work shown on this site is theirs.
			{:else}
				L’association emploie actuellement deux personnes, Clémence Peyrot et Orlando H., Maxime
				Fournes étant actuellement salarié de PauseAI Global. Au-delà de cette équipe, Pause IA
				repose sur
				<strong>plus d’une centaine de bénévoles</strong>
				: ingénieurs, enseignants, chercheurs, juristes, psychologues, étudiants, retraités. L’essentiel
				du travail présenté sur ce site est le leur.
			{/if}
		</p>
	</Bandeau>

	<!-- Vue d'ensemble des équipes : le visiteur doit comprendre de quoi
	     l’association est faite et se dire « je pourrais être utile là ».
	     Contenu et parti pris : src/lib/data/equipes.ts. -->
	<div class="team-section" id="nos-equipes">
		<h2 class="section-title">{lang === 'en' ? 'Our teams' : 'Nos équipes'}</h2>
		<p class="equipes-intro">
			{lang === 'en'
				? 'Pause AI runs on seven teams. Whatever you know how to do, one of them needs it.'
				: 'Pause IA tient sur sept équipes. Quoi que vous sachiez faire, l’une d’elles en a besoin.'}
		</p>

		<ul class="equipes">
			{#each equipes as equipe}
				<li class="equipe">
					<h3>
						{equipe.nom}{#if equipe.referent}<span class="referent">{equipe.referent}</span>{/if}
					</h3>
					<p>{equipe.description}</p>
				</li>
			{/each}
		</ul>

		<p class="equipes-cta">
			<Button href="{prefix}/rejoindre">
				{lang === 'en' ? 'Join a team' : 'Rejoindre une équipe'}
			</Button>
		</p>
	</div>
</Page>

<style>
	/* « En bref » : trois repères côte à côte, sans boîte. Le filet orange tient
	   lieu de séparation, ce qui laisse la page respirer et reprend le langage
	   employé sur la note de synthèse pour les décideurs. */
	.en-bref {
		display: grid;
		gap: 2rem 2.5rem;
		margin: 1.5rem 0 3rem;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 48rem) {
		.en-bref {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Colonne : le lien est poussé en bas de chaque bloc, sinon il se cale
	   juste sous un texte de longueur différente et les trois liens partent
	   en escalier. */
	.en-bref li {
		display: flex;
		flex-direction: column;
		border-top: 2px solid var(--brand);
		padding-top: 0.9rem;
	}

	.en-bref li a {
		margin-top: auto;
	}

	.en-bref h3 {
		margin: 0 0 0.5rem;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		line-height: 1.3;
	}

	.en-bref p {
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--text-2);
	}

	/* Lien nommé plutôt qu'une flèche seule : on doit savoir où l'on va avant
	   de cliquer, et un libellé explicite sert aussi les lecteurs d'écran. */
	.en-bref a {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--brand-subtle);
		text-decoration: none;
	}

	.en-bref a::after {
		content: ' →';
	}

	.en-bref a:hover,
	.en-bref a:focus-visible {
		text-decoration: underline;
	}

	/* --- Nos équipes ------------------------------------------------------- */
	.equipes-intro {
		max-inline-size: var(--width-text);
		margin: 0 auto 2rem;
		color: var(--text-2);
		line-height: 1.7;
	}

	/* Deux colonnes fixes plutôt que des cartes qui s'étirent : sept entrées
	   d'une ligne lues côte à côte, c'est vingt secondes de lecture au lieu
	   d'un mur. Deux et non trois, sinon la dernière rangée laisse un orphelin. */
	.equipes {
		list-style: none;
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.1rem 2.5rem;
		margin: 0;
		padding: 0;
		text-align: start;
	}

	@media (min-width: 640px) {
		.equipes {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* Plus d'encadré : avec une seule ligne de texte, la carte pesait plus que
	   son contenu. Un filet en haut suffit à séparer les entrées. */
	.equipe {
		padding-block: 1rem;
		border-block-start: 1px solid var(--border);
	}

	.referent {
		margin-inline-start: 0.6rem;
		font-size: 0.85rem;
		font-weight: 400;
		color: var(--text-2);
	}

	.equipe h3 {
		margin: 0 0 0.3rem;
		font-size: 1.05rem;
		color: var(--text);
	}

	.equipe p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--text-2);
	}

	.equipes-cta {
		margin: 2rem 0 0;
	}

	.contact-cta {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1.75rem;
	}

	.team-section {
		margin-top: 2.5rem;
		padding: 2rem 2rem 2.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 1rem;
		box-shadow: var(--shadow-card);
	}

	.section-title {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
	}

	.cards-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.cards-centered {
		justify-content: center;
	}

	/* Du texte, et non l'encadré crème de l'ancien compteur : c'est une phrase
	   qui se lit, pas un chiffre à mettre en avant. */
	.benevoles {
		/* Ni largeur ni centrage : le paragraphe remplit le bandeau, qui porte
		   déjà sa propre gouttière. Centré, il se décalait du filet orange. */
		margin: 0;
		line-height: 1.7;
		/* Pas de couleur imposée : le paragraphe est posé dans un Bandeau, qui
		   donne --on-dark. Le gris secondaire l'emportait et retombait à
		   4,2:1 sur le bleu, sous le seuil. */
	}
</style>
