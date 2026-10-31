<script lang="ts">
	import LeadershipCard from '$components/LeadershipCard.svelte'
	import ScientificCouncilCard from '$components/ScientificCouncilCard.svelte'
	import WhoCard from '$components/WhoCard.svelte'
	import Button from '$components/Button.svelte'
	import { LinkCard, LinkGrid, Page, SectionTitle } from '$components/ui'
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

	const fallbackMembers = [
		{
			name: 'Aurélia',
			image: '/membres/aurelia.jpg',
			job: "Professeur d'anglais en classe préparatoire"
		},
		{
			name: 'Éloïse',
			image: '/membres/eloise.jpg',
			job: "Chercheuse indépendante en sécurité de l'IA"
		},
		{
			name: 'Salim',
			image: '/membres/salim.jpg',
			job: 'Etudiant en mathématiques'
		},
		{
			name: 'Karine',
			image: '/membres/karine.jpg',
			job: 'Hypnothérapeute et coach bien-être'
		},
		{
			name: 'Muriel',
			image: '/membres/muriel.jpg',
			job: 'Traductrice'
		},
		{
			name: 'Stélian',
			image: '/membres/stelian.jpg',
			job: 'Psychologue-psychothérapeute'
		},
		{
			name: 'Sandra',
			image: '/membres/sandra.jfif',
			job: 'Enseignante de littérature et autrice'
		},
		{
			name: 'Sandrine',
			image: '/membres/sandrine.jpg',
			job: 'Psychopédagogue'
		},
		{
			name: 'Bahman',
			image: '/membres/bahman.jpeg',
			job: 'Psychologue cognitiviste'
		},
		{
			name: 'Mandelle',
			image: '/membres/Mandelle.jpg',
			job: 'Enseignante'
		},
		{
			name: 'Marilyn',
			image: '/membres/Marilyn.jpg',
			job: 'Cheffe de projet en communication digitale'
		},
		{
			name: 'Damien',
			image: '/membres/damien.jpg',
			job: 'Ingénieur du son chez studiobreton.fr'
		},
		{
			name: 'Emmanuel',
			image: '/membres/emmanuel.jpg',
			job: ''
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

	$: members = hasNotionData
		? teamMembers
				.filter((m) => m.category === 'Membre')
				.map((m) => ({ name: m.name, job: m.profession, image: m.image || null }))
		: fallbackMembers
</script>

<!-- Gabarit Hub : en-tête commun, puis « en bref » (demande, valeurs,
     financement, chacun sur sa page), puis l'équipe. Les valeurs et le
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
			l'intelligence artificielle, et les incite à agir pour s'y opposer. Nous représentons en
			France
			<a href="https://pauseai.info" target="_blank" rel="noopener noreferrer">PauseAI Global</a>.
		{/if}
	</svelte:fragment>
	<div class="contact-cta" slot="actions">
		<Button href="{prefix}/dons">{lang === 'en' ? 'Donate' : 'Faire un don'}</Button>
		<Button alt href="{prefix}/rejoindre">{lang === 'en' ? 'Join us' : 'Nous rejoindre'}</Button>
		<Button alt href="mailto:contact@pauseia.fr"
			>{lang === 'en' ? 'Contact us' : 'Nous contacter'}</Button
		>
	</div>

	<SectionTitle>{lang === 'en' ? 'In short' : 'En bref'}</SectionTitle>
	<LinkGrid>
		<LinkCard
			href="{prefix}/propositions"
			icon="⏸️"
			title={lang === 'en' ? 'What we ask for' : 'Notre demande'}
		>
			{lang === 'en'
				? 'A global pause on training frontier AI models, until safety and democratic control are guaranteed.'
				: 'Une pause mondiale de l’entraînement des IA de pointe, jusqu’à ce que la sécurité et le contrôle démocratique soient garantis.'}
		</LinkCard>
		<LinkCard
			href="{prefix}/charte-des-valeurs"
			icon="🧭"
			title={lang === 'en' ? 'Our values' : 'Nos valeurs'}
		>
			{lang === 'en'
				? 'Ten values ranked by priority, starting with non-violence and intellectual rigour.'
				: 'Dix valeurs classées par priorité, à commencer par la non-violence et la rigueur intellectuelle.'}
		</LinkCard>
		<LinkCard
			href="{prefix}/financements"
			icon="🤝"
			title={lang === 'en' ? 'Our funding' : 'Notre financement'}
		>
			{lang === 'en'
				? 'A non-profit founded in June 2024, fully independent of the AI and tech industry.'
				: 'Association à but non lucratif créée en juin 2024, totalement indépendante de l’industrie de l’IA et de la tech.'}
		</LinkCard>
	</LinkGrid>

	<SectionTitle>{lang === 'en' ? 'The team' : 'L’équipe'}</SectionTitle>
	<div class="team-section">
		<h2 class="section-title">{lang === 'en' ? 'Leadership' : 'Direction'}</h2>
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

	{#if members.length > 0}
		<div class="team-section">
			<h2 class="section-title">
				{lang === 'en' ? 'Members & Volunteers' : 'Membres et bénévoles'}
			</h2>
			<div class="cards-grid cards-centered">
				{#each members as member}
					<WhoCard name={member.name} image={member.image} job={member.job} />
				{/each}
			</div>
		</div>
	{/if}

	<p class="member-count">
		{lang === 'en'
			? '+ a hundred members and volunteers'
			: '+ une centaine de membres et bénévoles'}
	</p>

	<!-- Vue d'ensemble des équipes : le visiteur doit comprendre de quoi
	     l'association est faite et se dire « je pourrais être utile là ».
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
					<h3>{equipe.nom}</h3>
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

	.member-count {
		margin-top: 3rem;
		padding: 1.25rem 2rem;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--text);
		text-align: center;
		background: var(--bg-subtle);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
	}
</style>
