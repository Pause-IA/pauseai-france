<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Accordion from '$components/Accordion.svelte'
	import Button from '$components/Button.svelte'
	import { Badge, Card, PageHero, SectionTitle } from '$components/ui'
	import { Check, Copy } from 'lucide-svelte'
	import {
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
		Ceux qui construisent l’IA préviennent qu’ils pourraient en perdre le contrôle
		<svelte:fragment slot="lede">
			Yoshua Bengio, Geoffrey Hinton et les dirigeants des grands laboratoires le disent
			publiquement. Le risque n’est pas certain. Il est sérieux, il est reconnu, et il est
			irréversible. Cette page réunit ce qui est établi, les réponses aux objections courantes, et
			ce qu’un élu peut faire.
		</svelte:fragment>
		<svelte:fragment slot="actions">
			<p class="actions">
				<Button href="#essentiel">Lire l’essentiel</Button>
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
						Les grands laboratoires revendiquent de construire des IA plus intelligentes que
						l’humain. Ils reconnaissent en même temps ne pas savoir les garder sous contrôle. Les
						capacités progressent vite. La capacité à les maîtriser, non. Cet écart est le cœur du
						problème.
					</p>
					<p>
						Ce risque ne ressemble pas à ceux que nous savons gérer. L’ingénierie ordinaire apprend
						de ses accidents et corrige la fois suivante. Ici, un système très avancé qui échappe au
						contrôle ne se laisse pas forcément corriger après coup, et le premier échec grave
						pourrait être le dernier. L’incertitude n’invite donc pas à patienter, puisque la seule
						preuve définitive arriverait une fois le dommage fait.
					</p>
					<p>
						Rien de tout cela n’est spéculatif au sens où on l’entend parfois. En 2026, des systèmes
						d’IA en cours d’évaluation ont contourné leur environnement de test, atteint des
						systèmes qu’ils n’auraient pas dû atteindre, et dissimulé ce qu’ils faisaient. Ces faits
						ont été divulgués par les laboratoires eux-mêmes et repris devant le Conseil de sécurité
						des Nations unies.
					</p>
					<p>
						La demande de Pause IA est simple à formuler. Les systèmes les plus avancés ne doivent
						pas se développer tant que leur sûreté n’est pas démontrée. Une coordination
						internationale doit encadrer les modèles de frontière. Et la charge de prouver qu’un
						système est sûr revient à ceux qui le construisent, pas aux citoyens qui en subiraient
						les conséquences.
					</p>
					<p class="dernier">
						Vous pouvez vous saisir du sujet sans y consacrer des semaines : une question écrite,
						une prise de position, une audition. Des modèles figurent <a href="#agir">plus bas</a>,
						et nous pouvons vous transmettre une note détaillée ou venir présenter le dossier à
						votre équipe.
					</p>
				</Card>
			</section>

			<section id="credibilite" aria-labelledby="t-credibilite">
				<SectionTitle id="t-credibilite">Est-ce sérieux, ou de la science-fiction ?</SectionTitle>
				<p class="intro">
					La question est légitime. Sa réponse tient d’abord à l’identité de ceux qui alertent.
				</p>
				<p>
					En mai 2023, des centaines de chercheurs et de dirigeants du secteur ont signé une
					déclaration d’une seule phrase, hébergée par le Center for AI Safety.
				</p>
				<figure class="citation">
					<blockquote>
						Atténuer le risque d’extinction lié à l’IA devrait être une priorité mondiale, au même
						titre que d’autres risques pour la société comme les pandémies et la guerre nucléaire.
					</blockquote>
					<figcaption>
						Center for AI Safety, 2023. Parmi les signataires : Geoffrey Hinton, Yoshua Bengio,
						ainsi que les dirigeants d’OpenAI, de Google DeepMind et d’Anthropic.
					</figcaption>
				</figure>
				<p>
					Trois noms suffisent à donner la mesure. Yoshua Bengio figure parmi les chercheurs en IA
					les plus cités au monde, et préside le Rapport international sur la sécurité de l’IA.
					Geoffrey Hinton a reçu le prix Nobel de physique 2024, et a quitté Google pour pouvoir
					parler librement de ces risques. Stuart Russell a écrit le manuel sur lequel la discipline
					se forme.
				</p>
				<p>
					Détail qui dérange les explications faciles : les entreprises tiennent ce discours contre
					leur propre intérêt. Leurs dirigeants et leurs responsables de la sécurité déclarent
					publiquement que la probabilité d’une catastrophe majeure n’est pas négligeable, et
					appellent à encadrer la course qu’ils mènent. Ces prises de parole font chuter les
					valorisations et attirent les régulateurs. On n’agit pas ainsi pour vendre.
				</p>
			</section>

			<section id="mecanisme" aria-labelledby="t-mecanisme">
				<SectionTitle id="t-mecanisme">Le risque, concrètement</SectionTitle>
				<p class="intro">
					Nul besoin d’une IA hostile. Il suffit d’une IA très capable qui poursuit efficacement un
					objectif mal spécifié.
				</p>
				<p>
					Une IA moderne n’est pas écrite règle par règle. Elle est entraînée. On la nourrit de
					données et d’un signal de récompense, et elle apprend seule. Ce qu’elle poursuit
					réellement à l’intérieur n’est pas directement lisible. On voit son comportement, pas ses
					intentions. Tant qu’elle reste dans les situations testées, un système qui veut vraiment
					aider et un système qui a seulement appris à en donner l’apparence se ressemblent trait
					pour trait. La différence apparaît une fois sorti de ces situations. C’est-à-dire
					potentiellement trop tard.
				</p>
				<p>
					Il n’est pas besoin de malveillance pour que cela tourne mal. Nous ne détestons pas les
					fourmis, et nous construisons pourtant l’autoroute là où elles vivent. Un système
					indifférent à notre sort, poursuivant un objectif avec des moyens surhumains, produit le
					même genre d’effet.
				</p>
				<h3>Ce n’est plus seulement théorique</h3>
				<p>
					En 2026, plusieurs incidents ont rendu ce mécanisme tangible. Des agents d’IA, pendant
					leur évaluation, se sont échappés de leur environnement de test, ont exploité des failles
					pour atteindre d’autres systèmes, ont agi sans qu’un humain le leur demande, et ont
					cherché à masquer leurs traces. Personne ne les avait programmés pour cela. Les
					laboratoires reconnaissent ne pas savoir l’empêcher de façon fiable. Yoshua Bengio l’a
					rappelé à la tribune du Conseil de sécurité des Nations unies.
				</p>
				<p>
					Le Rapport international sur la sécurité de l’IA reste, sur ce point, mesuré, et c’est
					utile à citer honnêtement : les scénarios de perte de contrôle supposent des systèmes qui
					échappent à la supervision, poursuivent des plans de long terme et résistent à l’arrêt, et
					les avis d’experts sur leur probabilité « varient fortement ». Le même rapport note
					cependant qu’« aucune combinaison des méthodes actuelles n’élimine entièrement les
					défaillances ». Autrement dit, le désaccord porte sur le quand et le comment, pas sur
					l’existence d’un problème non résolu.
				</p>
				<h3>Ce que nous ne disons pas</h3>
				<p>
					Pas de robot conscient ni de méchant de cinéma. Et nous ne prétendons pas que les dommages
					déjà présents (sur l’emploi, l’information, l’environnement) sont négligeables ; ils sont
					réels, et ils ne retirent rien au risque de perte de contrôle. Ces préoccupations
					s’ajoutent, elles ne se remplacent pas. Cet espace se concentre sur le risque le plus
					grave et le moins traité.
				</p>
			</section>

			<section id="calendrier" aria-labelledby="t-calendrier">
				<SectionTitle id="t-calendrier">Pourquoi maintenant, et pourquoi la France</SectionTitle>
				<p class="intro">
					Le sujet a quitté la prospective. Il est déjà dans le débat diplomatique, et la France y a
					pris des positions.
				</p>
				<p>
					Les progrès récents ne suivent pas une ligne droite. Les systèmes les plus avancés
					contribuent désormais à concevoir les suivants, ce qui raccourcit le temps disponible pour
					résoudre les questions de sûreté. Attendre une preuve complète avant d’agir reviendrait,
					sur un risque irréversible, à n’agir qu’une fois le mal fait.
				</p>
				<p>
					La France n’est pas à l’écart. Elle a signé, le 23 septembre 2026, l’appel au contrôle des
					modèles de frontière lancé par la Finlande et la Norvège. Son ministre de l’Europe et des
					Affaires étrangères est intervenu sur l’IA au Conseil de sécurité des Nations unies. Au
					Sénat, une proposition de résolution européenne déposée en octobre 2025 veut ériger
					l’alignement des IA en objectif stratégique pour l’Europe. La question est donc déjà posée
					au plus haut niveau. Reste à lui donner une suite concrète.
				</p>
			</section>

			<section id="objections" aria-labelledby="t-objections">
				<SectionTitle id="t-objections">Répondre aux objections</SectionTitle>
				<p class="intro">
					Les six « oui mais » que vous entendrez, et de quoi y répondre sur le vif.
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
					Du geste le plus simple au plus engageant. Chaque marche compte, et les modèles sont
					fournis.
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
				<p>
					Selon un sondage OpinionWay pour le CeSIA (mai 2026), 8 % des Français veulent accélérer
					le développement de l’IA, quand 42 % veulent le ralentir fortement ou le suspendre. 62 %
					souhaitent une IA orientée d’abord vers la sécurité, les droits et l’éthique, contre 21 %
					vers la performance. 75 % redoutent une perte de contrôle, et cette inquiétude traverse
					tout le spectre politique.
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
				<p>
					Le même constat se retrouve ailleurs. Aux États-Unis, un sondage de l’AI Policy Institute
					(juin 2026) donne 82 % d’Américains pour qui les entreprises ne devraient pas construire
					d’IA plus intelligente que l’humain tant qu’elles ne peuvent pas démontrer qu’elles la
					contrôlent, l’écart entre Démocrates et Républicains ne dépassant pas quelques points.
				</p>
				<p>
					Un moratoire sur la superintelligence a déjà trouvé une traduction juridique. Au
					Royaume-Uni, une proposition de loi sur la sécurité de la superintelligence réunit plus de
					70 parlementaires de plusieurs partis. Aux États-Unis, un projet de loi visant à interdire
					la superintelligence a été déposé par le sénateur Bernie Sanders et le député Greg Casar.
					D’autres élus, de sensibilités très différentes, s’en sont donc déjà saisis.
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
				Espace informatif édité par Pause IA, branche française de PauseAI. Les chiffres et
				incidents cités renvoient à des sources publiques. Nous recommandons de vérifier la
				formulation exacte de chaque donnée avant une reprise officielle, et nous fournissons les
				références détaillées sur demande.
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

	/* ── Citation ── */
	/* La citation garde le style de blockquote du site (filet orange, fond
	   crème) : seule la source, en légende, est ajoutée dessous. */
	.citation {
		margin: 1.5rem 0;
		max-inline-size: var(--width-text);
	}

	.citation blockquote {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.1rem;
		line-height: 1.45;
	}

	.citation figcaption {
		margin-top: 0.6rem;
		font-size: 0.86rem;
		color: var(--text-2);
		line-height: 1.5;
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
