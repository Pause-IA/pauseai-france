<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Accordion from '$components/Accordion.svelte'
	import Button from '$components/Button.svelte'
	import { Badge, Card, PageHero, SectionTitle } from '$components/ui'
	import { Check, Copy } from 'lucide-svelte'
	import {
		chiffres,
		chiffresOpinion,
		etapes,
		glossaire,
		miseAJour,
		objections,
		sources
	} from '$lib/data/ressources-decideurs'

	const CONTACT = 'contact@pauseia.fr'

	const title = 'Espace décideurs'
	const description =
		'Le risque de perte de contrôle de l’IA, vu par les chercheurs eux-mêmes : la note, les réponses aux objections, ce qu’un élu peut faire, et les sources.'

	const dateMaj = new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(miseAJour))

	// Sommaire : une seule source, qui sert au menu latéral et aux ancres.
	const sommaire = [
		{ id: 'essentiel', titre: 'L’essentiel en deux minutes' },
		{ id: 'credibilite', titre: 'Est-ce sérieux ?' },
		{ id: 'mecanisme', titre: 'Le risque, concrètement' },
		{ id: 'calendrier', titre: 'Pourquoi maintenant' },
		{ id: 'objections', titre: 'Répondre aux objections' },
		{ id: 'agir', titre: 'Que puis-je faire ?' },
		{ id: 'opinion', titre: 'L’opinion et les précédents' },
		{ id: 'glossaire', titre: 'Glossaire' },
		{ id: 'sources', titre: 'Bibliothèque de sources' },
		{ id: 'contact', titre: 'Nous contacter' }
	]

	// Copie : le retour visuel est porté par le bouton lui-même, pendant deux
	// secondes. `copie` retient quel bouton vient d'être utilisé.
	let copie = ''
	let minuteur: ReturnType<typeof setTimeout>
	async function copier(cle: string, texte: string) {
		try {
			await navigator.clipboard.writeText(texte)
			copie = cle
			clearTimeout(minuteur)
			minuteur = setTimeout(() => (copie = ''), 2000)
		} catch {
			// Presse-papiers refusé (navigateur ancien, page non sécurisée) : le
			// texte reste visible et sélectionnable, rien à signaler.
		}
	}
</script>

<!-- Dossier de plaidoyer, hors menu et hors sitemap : on partage son lien lors
     d'un rendez-vous ou dans un courrier, d'où le « noindex » et l'entrée dans
     EXCLUDED de src/lib/routes.ts. Contenu dans
     src/lib/data/ressources-decideurs.ts. -->
<PostMeta {title} {description} />
<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<article class="espace">
	<PageHero eyebrow="À destination des élus, de leurs équipes et des administrations">
		Le risque de perte de contrôle de l’IA, vu par les chercheurs eux-mêmes
		<svelte:fragment slot="lede">
			Pas l’alarme d’une poignée de militants, mais le constat partagé par des prix Nobel, par le
			rapport mandaté par une trentaine de gouvernements, et par les entreprises qui construisent
			ces systèmes. Cet espace rassemble ce qu’un décideur a besoin de savoir, et ce qu’il peut
			faire.
		</svelte:fragment>
		<svelte:fragment slot="actions">
			<p class="actions">
				<Button href="#essentiel">L’essentiel en deux minutes</Button>
				<a class="lien-second" href="#agir">Que puis-je faire ?</a>
			</p>
		</svelte:fragment>
	</PageHero>

	<p class="maj">
		Sources vérifiées le {dateMaj}. Chaque affirmation renvoie à une source publique.
	</p>

	<div class="colonnes">
		<nav class="sommaire" aria-label="Sommaire">
			<p class="sommaire-titre">Sur cette page</p>
			<ol>
				{#each sommaire as s (s.id)}
					<li><a href="#{s.id}">{s.titre}</a></li>
				{/each}
			</ol>
		</nav>

		<div class="corps">
			<section id="essentiel" aria-labelledby="t-essentiel">
				<SectionTitle id="t-essentiel">La note à lire avant une réunion</SectionTitle>
				<Card variant="accent">
					<p>
						<strong>Le constat.</strong> Les entreprises qui développent l’intelligence artificielle visent
						explicitement des systèmes plus performants que l’humain sur l’ensemble des tâches cognitives,
						et admettent elles-mêmes ne pas savoir les contrôler de façon fiable. Les capacités progressent
						vite ; la capacité à garantir que ces systèmes font ce qu’on attend d’eux, appelée alignement,
						ne progresse pas au même rythme.
					</p>
					<p>
						<strong>Pourquoi c’est différent des risques habituels.</strong> L’ingénierie ordinaire corrige
						les erreurs après coup, accident après accident. Un système très avancé qui échappe au contrôle
						ne se corrige pas forcément après coup. Sur un risque irréversible, la seule preuve définitive
						arriverait trop tard.
					</p>
					<p>
						<strong>Ce n’est pas de la science-fiction, c’est documenté.</strong> En 2026, des agents
						d’IA ont agi contre leurs instructions, se sont échappés de leur environnement de test, ont
						accédé à des systèmes tiers et modifié leurs réponses pour masquer leur comportement.
					</p>
					<p>
						<strong>Ce que demande Pause IA.</strong> Que le développement des systèmes les plus avancés
						ne se poursuive pas tant que leur sûreté n’est pas démontrée, et qu’une coordination internationale
						encadre les modèles de frontière. La charge de la preuve doit peser sur ceux qui développent,
						pas sur les citoyens qui en subiraient les conséquences.
					</p>
					<p class="dernier">
						<strong>Ce que vous pouvez faire.</strong> Vous informer, poser une question écrite,
						soutenir une prise de position transpartisane, demander une audition. Des modèles prêts
						à l’emploi sont réunis <a href="#agir">plus bas</a>.
					</p>
				</Card>

				<ul class="chiffres">
					{#each chiffres as c (c.valeur + c.libelle)}
						<li>
							<Card padding="compact">
								<p class="valeur">{c.valeur}</p>
								<p class="libelle">{c.libelle}</p>
							</Card>
						</li>
					{/each}
				</ul>
			</section>

			<section id="credibilite" aria-labelledby="t-credibilite">
				<SectionTitle id="t-credibilite">Est-ce sérieux, ou de la science-fiction ?</SectionTitle>
				<p class="intro">
					La question est légitime. La réponse tient moins à des prédictions qu’à l’identité de ceux
					qui alertent.
				</p>
				<p>
					Le signal le plus clair n’est pas le discours des militants, c’est celui des scientifiques
					et des entreprises elles-mêmes. Trois noms suffisent à situer le niveau d’autorité :
					<strong>Yoshua Bengio</strong>, parmi les chercheurs en IA les plus cités au monde, qui
					préside le Rapport international sur la sécurité de l’IA ;
					<strong>Geoffrey Hinton</strong>, prix Nobel de physique 2024, qui a quitté Google pour
					pouvoir alerter librement ; <strong>Stuart Russell</strong>, auteur du manuel de référence
					de la discipline.
				</p>
				<p>
					Ce ne sont pas des voix isolées. Dans les enquêtes menées auprès des chercheurs du
					domaine, une part substantielle attribue au moins 10 % de probabilité à des conséquences
					extrêmement graves, dont la perte de contrôle. On peut discuter de ce chiffre, mais pas le
					ranger du côté de la marge : il vient du cœur de la profession.
				</p>
				<p>
					Enfin, les entreprises qui construisent ces systèmes tiennent le même discours contre leur
					propre intérêt commercial. Leurs dirigeants déclarent publiquement que la probabilité
					d’une catastrophe majeure n’est pas négligeable, et appellent à encadrer, voire à
					ralentir, la course qu’ils mènent. Une entreprise ne dramatise pas le danger de son
					produit pour le plaisir, surtout lorsque ces déclarations font chuter sa valorisation.
				</p>
			</section>

			<section id="mecanisme" aria-labelledby="t-mecanisme">
				<SectionTitle id="t-mecanisme">Le risque, concrètement</SectionTitle>
				<p class="intro">
					Le danger ne suppose pas une IA malveillante. Il suppose une IA très capable qui poursuit
					efficacement un objectif mal spécifié.
				</p>
				<p>
					Un système d’IA n’est pas programmé règle par règle. Il apprend à partir de données et
					d’un signal de récompense, et ce qu’il poursuit réellement en interne n’est pas
					directement lisible. On observe son comportement, on ne lit pas ses intentions. Tant qu’on
					reste dans les situations testées, un système qui veut vraiment être utile et un système
					qui a seulement appris à paraître utile sont indiscernables. La différence n’apparaît
					qu’une fois sorti de ces situations, c’est-à-dire potentiellement trop tard.
				</p>
				<p>
					Il n’est pas besoin d’hostilité pour que cela tourne mal. Un système indifférent à notre
					sort, poursuivant un objectif avec des moyens surhumains, suffit. L’analogie courante est
					celle de la fourmilière : nous ne haïssons pas les fourmis, mais nous construisons
					l’autoroute là où elles vivent.
				</p>
				<h3>Ce n’est plus théorique</h3>
				<p>
					En 2026, plusieurs incidents ont rendu ce mécanisme tangible. Des agents d’IA, en cours
					d’évaluation, se sont échappés de leur environnement de test, ont exploité des failles
					pour atteindre d’autres systèmes, ont lancé des actions qu’aucun humain ne leur avait
					demandées, et ont cherché à masquer ce qu’ils faisaient. Ces comportements n’ont pas été
					programmés : ils émergent, et les laboratoires reconnaissent ne pas savoir les empêcher de
					façon fiable.
				</p>
			</section>

			<section id="calendrier" aria-labelledby="t-calendrier">
				<SectionTitle id="t-calendrier">Pourquoi maintenant, et pourquoi la France</SectionTitle>
				<p class="intro">
					Le sujet n’est plus prospectif. Il est déjà dans le débat diplomatique, et la France y a
					pris des positions.
				</p>
				<p>
					Les progrès récents ne sont pas linéaires. Les systèmes les plus avancés contribuent
					désormais à concevoir les suivants, ce qui raccourcit le temps disponible pour résoudre
					les problèmes de sûreté. Attendre d’avoir une preuve complète avant d’agir reviendrait,
					sur un risque irréversible, à n’agir qu’après le dommage.
				</p>
				<p>
					La France n’est pas spectatrice. Elle a signé, le 23 septembre 2026, l’appel au contrôle
					des modèles de frontière lancé par la Finlande et la Norvège. Son ministre de l’Europe et
					des Affaires étrangères est intervenu sur l’IA au Conseil de sécurité des Nations unies.
					La question n’est donc pas d’ouvrir le sujet, mais de lui donner une traduction concrète.
				</p>
			</section>

			<section id="objections" aria-labelledby="t-objections">
				<SectionTitle id="t-objections">Répondre aux objections</SectionTitle>
				<p class="intro">
					Les cinq « oui mais » que vous entendrez, et de quoi y répondre en réunion ou en plateau.
				</p>
				<div class="inView">
					{#each objections as o (o.id)}
						<Accordion id={o.id} open={false}>
							<span slot="head">«&nbsp;{o.question}&nbsp;»</span>
							<div slot="details">
								{#each o.reponse as p}<p>{p}</p>{/each}
							</div>
						</Accordion>
					{/each}
				</div>
			</section>

			<section id="agir" aria-labelledby="t-agir">
				<SectionTitle id="t-agir">Que puis-je faire concrètement ?</SectionTitle>
				<p class="intro">
					Du geste le plus simple au plus engageant. Chaque étape est utile, et des modèles prêts à
					l’emploi sont fournis.
				</p>
				<ol class="echelle">
					{#each etapes as e, i (e.titre)}
						<li>
							<p class="rang" aria-hidden="true">{i + 1}</p>
							<div>
								<h3>{e.titre}</h3>
								<p>{e.texte}</p>
								{#if e.modele}
									<details class="modele">
										<summary>{e.modele.intitule}</summary>
										<pre>{e.modele.texte}</pre>
										<button type="button" on:click={() => copier(e.titre, e.modele?.texte ?? '')}>
											{#if copie === e.titre}
												<Check size={15} aria-hidden="true" /> Texte copié
											{:else}
												<Copy size={15} aria-hidden="true" /> Copier le texte
											{/if}
										</button>
									</details>
								{/if}
							</div>
						</li>
					{/each}
				</ol>
			</section>

			<section id="opinion" aria-labelledby="t-opinion">
				<SectionTitle id="t-opinion"
					>L’opinion est avec vous, et des précédents existent</SectionTitle
				>
				<p class="intro">
					Prendre position sur ce sujet n’est ni marginal, ni risqué électoralement.
				</p>
				<h3>Ce que pensent les Français</h3>
				<p>
					Selon un sondage OpinionWay pour le CeSIA (2026), seuls 8 % des Français souhaitent
					accélérer le développement de l’IA, quand 42 % veulent le ralentir fortement ou le
					suspendre temporairement. 62 % veulent une IA orientée avant tout vers la sécurité, les
					droits et l’éthique, contre 21 % vers la performance et l’innovation. Près de huit
					personnes sur dix sont favorables à des accords internationaux interdisant les capacités
					d’IA menaçant la vie humaine, et 75 % redoutent une perte de contrôle. Cette adhésion
					traverse tout le spectre politique.
				</p>
				<ul class="chiffres deux">
					{#each chiffresOpinion as c (c.valeur)}
						<li>
							<Card padding="compact">
								<p class="valeur">{c.valeur}</p>
								<p class="libelle">{c.libelle}</p>
							</Card>
						</li>
					{/each}
				</ul>
				<h3>Des traductions législatives existent déjà</h3>
				<p>
					Un moratoire sur la superintelligence n’est pas une idée sans portée juridique. Au
					Royaume-Uni, une proposition de loi sur la sécurité de la superintelligence artificielle
					est soutenue par plus de 70 parlementaires de plusieurs partis. Aux États-Unis, un projet
					de loi visant à l’interdire a été déposé par le sénateur Bernie Sanders et le député Greg
					Casar. D’autres élus, de sensibilités très différentes, se sont déjà saisis du sujet.
				</p>
			</section>

			<section id="glossaire" aria-labelledby="t-glossaire">
				<SectionTitle id="t-glossaire">Glossaire</SectionTitle>
				<p class="intro">Cinq termes pour entrer dans le dossier sans jargon.</p>
				<dl class="glossaire">
					{#each glossaire as g (g.terme)}
						<div>
							<dt>{g.terme}</dt>
							<dd>{g.definition}</dd>
						</div>
					{/each}
				</dl>
			</section>

			<section id="sources" aria-labelledby="t-sources">
				<SectionTitle id="t-sources">Bibliothèque de sources</SectionTitle>
				<p class="intro">
					Les sources sur lesquelles Pause IA s’appuie. Chaque entrée indique sa nature et sa
					langue.
				</p>
				{#each sources as groupe (groupe.id)}
					<div class="groupe">
						<h3>{groupe.titre}</h3>
						<p class="groupe-intro">{groupe.intro}</p>
						<ul class="sources">
							{#each groupe.sources as s (s.url)}
								<li>
									<Card href={s.url} padding="compact" target="_blank" rel="noopener noreferrer">
										<p class="source-titre">{s.titre}</p>
										<p class="source-desc">{s.description}</p>
										<p class="etiquettes">
											<Badge size="sm">{s.nature}</Badge>
											<Badge size="sm" variant="outline">{s.langue}</Badge>
											{#if s.effort}<Badge size="sm" variant="neutral">{s.effort}</Badge>{/if}
										</p>
									</Card>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</section>

			<section id="contact" aria-labelledby="t-contact">
				<SectionTitle id="t-contact">Nous contacter</SectionTitle>
				<Card variant="accent">
					<p class="contact-titre">
						Une question, un document à nous soumettre, un rendez-vous à organiser
					</p>
					<p>
						Nous pouvons vous transmettre une note sur mesure, vous mettre en relation avec des
						chercheurs, ou venir présenter le dossier à vous et à votre équipe. C’est souvent la
						façon la plus utile d’avancer.
					</p>
					<p class="contact-ligne">
						<a href="mailto:{CONTACT}">{CONTACT}</a>
						<button type="button" on:click={() => copier('mail', CONTACT)}>
							{#if copie === 'mail'}
								<Check size={15} aria-hidden="true" /> Adresse copiée
							{:else}
								<Copy size={15} aria-hidden="true" /> Copier l’adresse
							{/if}
						</button>
					</p>
				</Card>
			</section>

			<p class="avertissement">
				Cet espace est une ressource informative éditée par Pause IA, branche française de PauseAI.
				Les chiffres et incidents cités renvoient à des sources publiques. Nous recommandons de
				vérifier la formulation exacte de chaque donnée avant une reprise officielle, et nous
				pouvons fournir les références détaillées sur demande.
			</p>
		</div>
	</div>
</article>

<style>
	.espace {
		inline-size: 100%;
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-block: 3rem 5rem;
		padding-inline: 1.5rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin: 1.5rem 0 0;
	}

	.lien-second {
		font-weight: 600;
	}

	.maj {
		margin: 0 0 2.5rem;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	/* ── Sommaire collant, à partir de l'écran large ── */
	.colonnes {
		display: grid;
		gap: 2.5rem;
	}

	@media (min-width: 960px) {
		.colonnes {
			grid-template-columns: 13rem minmax(0, 1fr);
			gap: 3.5rem;
			align-items: start;
		}

		.sommaire {
			position: sticky;
			/* Sous le bandeau de navigation, qui est collant lui aussi. */
			top: 6rem;
		}
	}

	.sommaire-titre {
		margin: 0 0 0.6rem;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--text-2);
	}

	.sommaire ol {
		list-style: none;
		margin: 0;
		padding: 0;
		counter-reset: etape;
		font-size: 0.92rem;
	}

	.sommaire li {
		counter-increment: etape;
		margin: 0;
	}

	.sommaire a {
		display: flex;
		gap: 0.6rem;
		padding: 0.4rem 0.5rem;
		border-left: 2px solid transparent;
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: var(--text-2);
		line-height: 1.3;
	}

	.sommaire a::before {
		content: counter(etape, decimal-leading-zero);
		font-variant-numeric: tabular-nums;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--brand-subtle);
	}

	.sommaire a:hover {
		background: var(--bg-card);
		border-left-color: var(--brand);
		color: var(--text);
	}

	/* ── Corps ── */
	.corps > section {
		/* Le bandeau collant masquerait le titre d'une ancre sans cette marge. */
		scroll-margin-top: 6rem;
	}

	.corps > section + section {
		margin-top: 3.5rem;
	}

	.corps p {
		max-inline-size: var(--width-text);
		line-height: 1.65;
	}

	.intro {
		color: var(--text-2);
		margin-top: 0;
	}

	.corps h3 {
		margin: 2rem 0 0.4rem;
		font-size: 1.15rem;
	}

	.dernier {
		margin-bottom: 0;
	}

	/* ── Chiffres clés ── */
	.chiffres {
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
	}

	.chiffres.deux {
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	}

	.valeur {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.9rem;
		line-height: 1;
		color: var(--brand-subtle);
		font-variant-numeric: tabular-nums;
	}

	.libelle {
		margin: 0.5rem 0 0;
		font-size: 0.92rem;
		color: var(--text-2);
		line-height: 1.5;
	}

	/* ── Échelle d'action ── */
	.echelle {
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 0;
	}

	.echelle li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 1rem;
		padding: 1.25rem 0;
		border-top: 1px solid var(--border);
		margin: 0;
	}

	.echelle li:first-child {
		border-top: 0;
		padding-top: 0;
	}

	.rang {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.4rem;
		font-weight: 700;
		line-height: 1.2;
		color: var(--brand-subtle);
		font-variant-numeric: tabular-nums;
	}

	.echelle h3 {
		margin: 0 0 0.3rem;
		font-size: 1.1rem;
	}

	.modele {
		margin-top: 0.9rem;
	}

	.modele summary {
		cursor: pointer;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.modele pre {
		white-space: pre-wrap;
		margin: 0.75rem 0 0;
		padding: 1rem 1.1rem;
		max-inline-size: var(--width-text);
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		font-family: inherit;
		font-size: 0.92rem;
		line-height: 1.55;
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.6rem;
		padding: 0.5rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-card);
		color: var(--text);
		font: inherit;
		font-size: 0.88rem;
		font-weight: 600;
		cursor: pointer;
	}

	button:hover {
		border-color: var(--brand);
	}

	/* ── Glossaire ── */
	.glossaire {
		margin: 1.25rem 0 0;
	}

	.glossaire div {
		padding: 1rem 0;
		border-top: 1px solid var(--border);
		max-inline-size: var(--width-text);
	}

	.glossaire dt {
		font-weight: 700;
		margin-bottom: 0.2rem;
	}

	.glossaire dd {
		margin: 0;
		color: var(--text-2);
		line-height: 1.6;
	}

	/* ── Sources ── */
	.groupe {
		margin-top: 2rem;
	}

	.groupe-intro {
		color: var(--text-2);
		margin: 0 0 0.9rem;
	}

	.sources {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.75rem;
	}

	.sources li {
		margin: 0;
	}

	.source-titre {
		margin: 0;
		font-weight: 700;
		line-height: 1.35;
	}

	.source-desc {
		margin: 0.35rem 0 0;
		font-size: 0.93rem;
		color: var(--text-2);
		line-height: 1.5;
	}

	.etiquettes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0.7rem 0 0;
	}

	/* ── Contact ── */
	.contact-titre {
		margin: 0 0 0.5rem;
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.25;
	}

	.contact-ligne {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0;
	}

	.contact-ligne button {
		margin-top: 0;
	}

	.avertissement {
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		font-size: 0.88rem;
		color: var(--text-2);
		line-height: 1.6;
		max-inline-size: var(--width-text);
	}
</style>
