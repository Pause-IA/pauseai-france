<script lang="ts">
	import LeadershipCard from '$components/LeadershipCard.svelte'
	import ScientificCouncilCard from '$components/ScientificCouncilCard.svelte'
	import WhoCard from '$components/WhoCard.svelte'
	import Button from '$components/Button.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Accordion from '$components/Accordion.svelte'
	import Callout from '$components/Callout.svelte'
	import FAQEn from '$posts/en/qui-sommes-nous.md'
	import type { TeamMember } from '$lib/notion'
	import type { Lang } from '$lib/i18n'

	export let teamMembers: TeamMember[] = []
	export let lang: Lang = 'fr'

	const label_id = 'who-title'

	// Charte des valeurs : numérotées par ordre de priorité.
	const values = [
		{
			n: 1,
			name: 'Non-violence',
			text: "Nous n'utiliserons, n'encouragerons ni ne tolérerons jamais la violence, y compris les dommages matériels, les menaces ou les plaisanteries sur la violence. Notre mouvement est strictement pacifique et légal. Une seule infraction, où qu'elle ait lieu, nuit à l'ensemble du groupe, partout."
		},
		{
			n: 2,
			name: 'Bénéfique ou pas du tout',
			text: "L'IA doit être développée de manière à bénéficier à l'humanité, ou ne pas être développée du tout. C'est notre raison d'être."
		},
		{
			n: 3,
			name: 'Rigueur intellectuelle',
			text: "Nous représentons l'état des connaissances aussi fidèlement que possible. Nous reconnaissons l'incertitude et n'exagérons pas nos affirmations pour gagner un débat. Nous sommes ouverts à la critique et à la possibilité de nous tromper sur la meilleure façon d'atteindre nos objectifs. Notre crédibilité en dépend."
		},
		{
			n: 4,
			name: 'Honnêteté',
			text: "Nous n'avons aucun intérêt caché ni conflit d'intérêts, nous sommes donc libres de dire ce que nous croyons. Nous n'édulcorons pas notre message pour le rendre plus acceptable."
		},
		{
			n: 5,
			name: "Diversité des risques, unité dans l'action",
			text: "Que vous soyez préoccupé(e) par le risque existentiel, la cybersécurité, la perte d'emplois ou les menaces pour la démocratie, nous sommes unis dans notre volonté de mettre en pause le développement de l'IA de pointe (frontier AI). Nous mettons nos différences de côté pour faire avancer notre objectif commun."
		},
		{
			n: 6,
			name: 'Pas de politique partisane',
			text: "La sécurité de l'IA n'est pas encore un sujet clivant entre la gauche et la droite, et nous entendons préserver cela. Nous ne laissons pas d'autres opinions politiques nous détourner de notre mission."
		},
		{
			n: 7,
			name: 'Transparence par défaut',
			text: "Nous agissons et discutons publiquement et ouvertement, sauf s'il existe une bonne raison de ne pas le faire. Notre site web est en open source, nos espaces communautaires sont ouverts à tous et nos raisonnements sont publiés. Être accessibles réduit les freins à l'engagement."
		},
		{
			n: 8,
			name: "Priorité à l'action",
			text: "Nous n'attendons pas la perfection pour agir. Nous encourageons l'initiative et concrétisons les projets, même sans financements importants. Le mieux est l'ennemi du bien."
		},
		{
			n: 9,
			name: 'Communauté et inclusivité',
			text: 'Un mouvement repose sur les relations humaines. Nous sommes portés par des bénévoles et chacun peut contribuer. Nous créons des espaces accueillants pour se rencontrer, créer des liens et se sentir chez soi. Toute personne, quel que soit son parcours, a sa place ici.'
		},
		{
			n: 10,
			name: "L'utilisation de l'IA est acceptable",
			text: "Même si nous souhaitons stopper le développement de l'IA de pointe, nous sommes tout à fait à l'aise avec l'utilisation des IA existantes pour nous aider à atteindre nos objectifs. Nous ne cédons pas à la surenchère de pureté."
		}
	]

	const valuesEn = [
		{
			n: 1,
			name: 'Non-violence',
			text: 'We will never use, encourage or tolerate violence, including property damage, threats or jokes about violence. Our movement is strictly peaceful and lawful. A single breach, wherever it happens, harms the whole group, everywhere.'
		},
		{
			n: 2,
			name: 'Beneficial or not at all',
			text: 'AI must be developed in a way that benefits humanity, or not developed at all. This is our reason for being.'
		},
		{
			n: 3,
			name: 'Intellectual rigour',
			text: 'We represent the state of knowledge as faithfully as possible. We acknowledge uncertainty and do not overstate our claims to win a debate. We are open to criticism and to the possibility that we are wrong about the best way to achieve our goals. Our credibility depends on it.'
		},
		{
			n: 4,
			name: 'Honesty',
			text: 'We have no hidden agenda and no conflicts of interest, so we are free to say what we believe. We do not water down our message to make it more palatable.'
		},
		{
			n: 5,
			name: 'Diversity of risks, unity in action',
			text: 'Whether you are concerned about existential risk, cybersecurity, job losses or threats to democracy, we are united in our determination to pause the development of frontier AI. We set our differences aside to advance our common goal.'
		},
		{
			n: 6,
			name: 'No partisan politics',
			text: 'AI safety is not yet a left-versus-right dividing line, and we intend to keep it that way. We do not let other political opinions distract us from our mission.'
		},
		{
			n: 7,
			name: 'Transparency by default',
			text: 'We act and discuss publicly and openly, unless there is a good reason not to. Our website is open source, our community spaces are open to all, and our reasoning is published. Being accessible lowers the barriers to getting involved.'
		},
		{
			n: 8,
			name: 'Bias for action',
			text: 'We do not wait for perfection before acting. We encourage initiative and get projects done, even without significant funding. The perfect is the enemy of the good.'
		},
		{
			n: 9,
			name: 'Community and inclusiveness',
			text: 'A movement rests on human relationships. We are driven by volunteers and everyone can contribute. We create welcoming spaces to meet, build connections and feel at home. Everyone, whatever their background, has a place here.'
		},
		{
			n: 10,
			name: 'Using AI is acceptable',
			text: 'Even though we want to stop the development of frontier AI, we are entirely comfortable using existing AI to help us achieve our goals. We do not give in to purity spirals.'
		}
	]

	// Fallback data when Notion is not configured
	const fallbackLeadership = [
		{
			name: 'Maxime Fournes',
			role: 'Co-fondateur et Président',
			image: 'membres/maxime.png'
		},
		{
			name: 'Gilles Bréda',
			role: 'Co-fondateur et Trésorier',
			image: 'membres/gilles.png'
		},
		{
			name: 'Clémence Peyrot',
			role: 'Directrice exécutive',
			image: 'membres/clemence.jpeg'
		},
		{
			name: 'Moïri',
			role: 'Secrétaire général',
			image: 'membres/moiri.jpeg'
		},
		{
			name: 'Pierre Lamotte',
			role: "Conseil d'administration et Responsable communication",
			image: 'membres/pierre.png'
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
			image: 'membres/maxime.png'
		},
		{
			name: 'Jérémy Perret',
			job: "Chercheur en sécurité de l'IA, Suboptimal IA",
			image: 'membres/jeremy.png'
		}
	]

	const fallbackMembers = [
		{
			name: 'Aurélia',
			image: 'membres/aurelia.jpg',
			job: "Professeur d'anglais en classe préparatoire"
		},
		{
			name: 'Éloïse',
			image: 'membres/eloise.jpg',
			job: "Chercheuse indépendante en sécurité de l'IA"
		},
		{
			name: 'Salim',
			image: 'membres/salim.jpg',
			job: 'Etudiant en mathématiques'
		},
		{
			name: 'Karine',
			image: 'membres/karine.jpg',
			job: 'Hypnothérapeute et coach bien-être'
		},
		{
			name: 'Muriel',
			image: 'membres/muriel.jpg',
			job: 'Traductrice'
		},
		{
			name: 'Stélian',
			image: 'membres/stelian.jpg',
			job: 'Psychologue-psychothérapeute'
		},
		{
			name: 'Sandra',
			image: 'membres/sandra.jfif',
			job: 'Enseignante de littérature et autrice'
		},
		{
			name: 'Sandrine',
			image: 'membres/sandrine.jpg',
			job: 'Psychopédagogue'
		},
		{
			name: 'Bahman',
			image: 'membres/bahman.jpeg',
			job: 'Psychologue cognitiviste'
		},
		{
			name: 'Mandelle',
			image: 'membres/Mandelle.jpg',
			job: 'Enseignante'
		},
		{
			name: 'Marilyn',
			image: 'membres/Marilyn.jpg',
			job: 'Cheffe de projet en communication digitale'
		},
		{
			name: 'Damien',
			image: 'membres/damien.jpg',
			job: 'Ingénieur du son chez studiobreton.fr'
		},
		{
			name: 'Emmanuel',
			image: 'membres/emmanuel.jpg',
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

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}
		>{lang === 'en' ? 'Who are we?' : 'Qui sommes-nous ?'}</UnderlinedTitle
	>

	<div class="intro">
		{#if lang === 'en'}
			<FAQEn />
		{:else}
			<p class="lead">
				Nous sommes une <a href="/mentions-legales">association</a> qui alerte les citoyens et les
				pouvoirs publics français sur les
				<a href="/dangers/economiques-et-materiels">graves dangers</a> de la course à l'intelligence
				artificielle, et les incite à agir pour s'y opposer. Nous représentons en France
				<a href="https://pauseai.info">PauseAI Global</a>.
			</p>
		{/if}
		<div class="contact-cta">
			{#if lang === 'en'}
				<Button alt href="mailto:contact@pauseia.fr">Contact us</Button>
			{:else}
				<Button href="/dons">Faire un don</Button>
				<Button alt href="/rejoindre">Nous rejoindre</Button>
				<Button alt href="mailto:contact@pauseia.fr">Nous contacter</Button>
			{/if}
		</div>
	</div>

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

	{#if lang !== 'en'}
		<div class="team-section">
			<h2 class="section-title">Notre positionnement</h2>
			<p class="section-description">
				Nous demandons un <a href="/propositions"
					>moratoire sur l'entraînement des systèmes d'IA généralistes</a
				> jusqu'à ce que toutes les conditions de sécurité et de contrôle démocratique soient réunies.
			</p>

			<div class="accordion-stack">
				<Accordion id="quelle-ia" noHash>
					<svelte:fragment slot="head">Quelle IA&nbsp;?</svelte:fragment>
					<svelte:fragment slot="details">
						<ul class="bullet-list">
							<li>Nous ne sommes pas contre toute forme d'IA.</li>
							<li>
								Nous sommes contre <strong
									>le développement sans contrôle et sans limite de l'intelligence artificielle
									généraliste</strong
								> car il expose notre civilisation à des risques catastrophiques.
							</li>
						</ul>
					</svelte:fragment>
				</Accordion>

				<Accordion id="pourquoi" noHash>
					<svelte:fragment slot="head">Pourquoi&nbsp;?</svelte:fragment>
					<svelte:fragment slot="details">
						<ul class="bullet-list">
							<li>
								Les modèles d'IA généralistes (aujourd'hui tels que GPT, Claude, Gemini) deviennent
								chaque jour plus puissants, ils sont faciles à utiliser et se déploient à grande
								vitesse dans la société, sans réelles <a
									href="https://www.gov.uk/government/publications/international-ai-safety-report-2025"
									target="_blank"
									rel="noopener noreferrer">normes de sécurité</a
								> et hors de tout contrôle institutionnel.
							</li>
							<li>
								Ils présentent déjà des risques majeurs pour la sécurité de nos <a
									href="/dangers/economiques-et-materiels">infrastructures</a
								>, pour <a href="/dangers/pour-la-societe">nos institutions</a>, pour
								<a href="/dangers/pour-les-individus">notre modèle social</a>.
							</li>
							<li>
								Ces modèles d'IA commencent à <a
									href="https://www.anthropic.com/research/alignment-faking"
									target="_blank"
									rel="noopener noreferrer">échapper à leurs créateurs</a
								>. Certains le reconnaissent publiquement.
							</li>
							<li>
								Dans un scénario catastrophe que l'on ne peut exclure, ils pourraient donner
								naissance à une <a
									href="https://www.safe.ai/work/statement-on-ai-risk"
									target="_blank"
									rel="noopener noreferrer">super-intelligence incontrôlable</a
								>.
							</li>
						</ul>
					</svelte:fragment>
				</Accordion>

				<Accordion id="que-faire" noHash>
					<svelte:fragment slot="head">Que faire&nbsp;?</svelte:fragment>
					<svelte:fragment slot="details">
						<ul class="bullet-list">
							<li>
								Les discours «&nbsp;<a href="/faq">rassuristes</a>&nbsp;» nous font perdre du temps.
								<em
									>L'IA ne serait pas vraiment intelligente, les géants de la tech exagéreraient les
									performances de leurs modèles, on serait à la veille de l'explosion d'une bulle
									spéculative…</em
								> Rien de tout cela ne nous protège du danger, bien au contraire.
							</li>
							<li>
								La violence, que nous condamnons par principe, est également contre-productive. Elle
								renforce des antagonismes stériles au moment où l'avenir de l'humanité est en jeu.
							</li>
							<li>
								La seule réponse au danger est la mise en place d'une <a href="/propositions"
									>gouvernance mondiale</a
								> qui ait les moyens institutionnels, techniques et financiers de contrôler l'IA.
							</li>
						</ul>
					</svelte:fragment>
				</Accordion>
			</div>

			<p class="independence">
				Association à but non lucratif créée en juin 2024, nous sommes <strong
					>totalement indépendants de l'industrie de l'IA et de la tech</strong
				>&nbsp;: nous fonctionnons grâce aux <a href="/dons">dons</a> de nos soutiens, qui financent
				nos campagnes, nos événements et le fonctionnement de l'association.
			</p>
		</div>

		<div class="team-section" id="nos-valeurs">
			<h2 class="section-title">Nos valeurs</h2>
			<Callout>
				Nos valeurs sont numérotées par ordre de priorité. Lorsque deux valeurs s'opposent, la plus
				haut placée l'emporte. Nous attendons de chaque personne au sein du mouvement qu'elle les
				respecte en tout temps et qu'elle soit capable de les invoquer par leur numéro pour résoudre
				un désaccord.
			</Callout>

			<div class="accordion-stack">
				{#each values as v}
					<Accordion id={`valeur-${v.n}`} noHash>
						<svelte:fragment slot="head">{v.n}. {v.name}</svelte:fragment>
						<svelte:fragment slot="details">
							<p class="value-text">{v.text}</p>
						</svelte:fragment>
					</Accordion>
				{/each}
			</div>

			<p class="section-description charte-link">
				Ces valeurs constituent notre <a href="/charte-des-valeurs">charte des valeurs</a>.
			</p>
		</div>
	{/if}

	{#if lang === 'en'}
		<div class="team-section" id="our-values">
			<h2 class="section-title">Our values</h2>
			<Callout>
				Our values are numbered in order of priority. When two values conflict, the one ranked
				higher prevails. We expect everyone within the movement to uphold them at all times and to
				be able to invoke them by their number to resolve a disagreement.
			</Callout>

			<div class="accordion-stack">
				{#each valuesEn as v}
					<Accordion id={`value-${v.n}`} noHash>
						<svelte:fragment slot="head">{v.n}. {v.name}</svelte:fragment>
						<svelte:fragment slot="details">
							<p class="value-text">{v.text}</p>
						</svelte:fragment>
					</Accordion>
				{/each}
			</div>

			<p class="section-description charte-link">
				These values make up our <a href="/en/charte-des-valeurs">values charter</a>.
			</p>
		</div>
	{/if}
</section>

<style>
	section {
		max-width: 960px;
		margin: 0 auto;
		padding-top: 2.5rem;
	}

	.intro {
		margin-bottom: 2rem;
		text-align: center;
	}

	.intro :global(p) {
		text-align: center;
	}

	.lead {
		max-width: 720px;
		margin: 1rem auto 1.5rem;
		font-size: 1.1rem;
		line-height: 1.7;
		color: var(--text, #1f2937);
	}

	.bullet-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.bullet-list li {
		position: relative;
		padding: 0.25rem 0 0.25rem 1.5rem;
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	.bullet-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.85rem;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--text-secondary, #4b5563);
	}

	.bullet-list li:last-child {
		margin-bottom: 0;
	}

	.accordion-stack {
		display: flex;
		flex-direction: column;
		text-align: left;
		margin-top: 1.5rem;
	}

	.accordion-stack :global(.accordion .title) {
		font-size: 1.1rem;
		font-weight: 700;
	}

	.accordion-stack :global(.accordion .header) {
		padding: 1rem 0;
		transition: opacity 0.2s ease;
	}

	.accordion-stack :global(.accordion .header:hover) {
		opacity: 0.75;
	}

	.accordion-stack :global(.accordion .details) {
		background-color: transparent;
		border: none;
		box-shadow: none;
		margin: 0 0 0.5rem;
		padding: 0 0 1rem;
	}

	.value-text {
		margin: 0;
		line-height: 1.6;
	}

	.charte-link {
		margin-top: 1.5rem;
		margin-bottom: 0;
	}

	.independence {
		margin: 1.75rem 0 0;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border, #e5e7eb);
		font-size: 0.95rem;
		color: var(--text-secondary, #4b5563);
		line-height: 1.6;
		text-align: center;
	}

	.contact-cta {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 1.5rem;
	}

	.team-section {
		margin-top: 2.5rem;
		padding: 2rem 2rem 2.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 1rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.section-title {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
	}

	.section-description {
		margin-bottom: 2rem;
		color: var(--text-secondary, #676e7a);
		font-size: 1rem;
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
		color: var(--text, #333);
		text-align: center;
		background: var(--bg-subtle, #fff5e8);
		border-radius: 0.5rem;
		border: 1px solid var(--border, #e5e7eb);
	}
</style>
