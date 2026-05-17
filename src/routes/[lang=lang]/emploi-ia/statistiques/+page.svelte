<script lang="ts">
	import { page } from '$app/stores'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'
	import PieChart from '$lib/components/PieChart.svelte'
	import HorizontalBarChart from '$lib/components/HorizontalBarChart.svelte'
	import { surveyData } from '$lib/data/survey-stats'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import A from '$components/custom/a.svelte'

	const profileDimensions = [
		{ key: 'secteur', label: "secteur d'activité", plural: "Secteurs d'activité" },
		{ key: 'etudes', label: "niveau d'études", plural: "Niveaux d'études" },
		{ key: 'age', label: "l'âge", plural: 'Âges' },
		{ key: 'genre', label: 'le genre', plural: 'Genres' },
		{ key: 'statut', label: 'le statut professionnel', plural: 'Statuts professionnels' }
	]

	const rapportTargets = [
		{ key: 'malaise', label: "Le malaise voire l'anxiété" },
		{ key: 'observation_prudence', label: "L'observation et la prudence" },
		{ key: 'confiance', label: 'La confiance dans ces nouveaux outils' },
		{ key: 'excitation', label: "L'excitation à l'idée de l'utiliser davantage" }
	]

	const groupedStatsSections = [
		{
			key: 'frequence_utilisation',
			title: "Fréquence d'utilisation de l'IA",
			overviewTitle: "Fréquence d'utilisation de l'IA par les répondants",
			groups: [
				{
					title: "Groupes qui utilisent le moins l'IA",
					targets: [
						{ key: 'toutes_les_semaines', label: 'Toutes les semaines' },
						{ key: 'tres_ponctuellement', label: 'Très ponctuellement' },
						{ key: 'jamais', label: 'Jamais' }
					]
				},
				{
					title: "Groupes qui utilisent le plus l'IA",
					targets: [
						{ key: 'tous_les_jours', label: 'Tous les jours' },
						{ key: 'toutes_mes_taches', label: 'Toutes mes tâches ou presque' }
					]
				}
			]
		},
		{
			key: 'raisons_utilisation',
			title: "Raisons d'utilisation de l'IA",
			overviewTitle: "Raisons d'utilisation de l'IA par les répondants",
			groups: [
				{
					title: "Raisons d'utilisation",
					targets: [
						{ key: 'par_pure_curiosite', label: 'Par pure curiosité' },
						{
							key: 'suite_a_une_formation_demande_de_ma_direction',
							label: 'Suite à une formation / demande de ma direction'
						},
						{
							key: 'suite_aux_conseils_de_mes_collegues',
							label: 'Suite aux conseils de mes collègues'
						},
						{
							key: 'suite_a_la_pression_concurrentielle',
							label: 'Suite à la pression concurrentielle'
						},
						{
							key: 'pour_pouvoir_realiser_toutes_mes_taches',
							label: 'Pour pouvoir réaliser toutes mes tâches'
						},
						{ key: 'par_manque_de_competences', label: 'Par manque de compétences' },
						{
							key: 'pour_gagner_du_temps_etre_plus_efficace',
							label: 'Pour gagner du temps, être plus efficace'
						},
						{ key: 'autre', label: 'Autre' }
					]
				}
			]
		},
		{
			key: 'taches',
			title: "Tâches réalisées avec l'IA",
			overviewTitle: "Tâches réalisées avec l'IA par les répondants",
			groups: [
				{
					title: 'Tâches',
					targets: [
						{
							key: 'generation_d_images_de_sons_de_videos',
							label: "Génération d'images, de sons, de vidéos"
						},
						{
							key: 'analyse_resume_de_document_texte_video',
							label: 'Analyse / Résumé de document (texte, vidéo...)'
						},
						{ key: 'traduction', label: 'Traduction' },
						{ key: 'correction_et_redaction_de_texte', label: 'Correction et rédaction de texte' },
						{
							key: 'automatisation_de_taches_repetitives',
							label: 'Automatisation de tâches répétitives'
						},
						{ key: 'codage', label: 'Codage' },
						{ key: 'gestion_de_planning_projet', label: 'Gestion de planning / projet' },
						{ key: 'analyse_de_donnees', label: 'Analyse de données' },
						{
							key: 'gestion_relationnelle_chatbot_mail',
							label: 'Gestion relationnelle (chatbot, mail..)'
						},
						{
							key: 'pilotage_controle_de_dispositifs_connectes',
							label: 'Pilotage/contrôle de dispositifs connectés'
						},
						{
							key: 'prise_de_decision_aide_a_la_decision',
							label: 'Prise de décision / aide à la décision'
						},
						{ key: 'autre', label: 'Autre' }
					]
				}
			]
		},
		{
			key: 'satisfaction',
			title: "Satisfaction vis-à-vis de l'IA",
			overviewTitle: "Satisfaction vis-à-vis de l'IA par les répondants",
			groups: [
				{
					title: "Personnes contentes de l'IA",
					targets: [
						{ key: 'oui_capacites', label: 'Oui cela décuple mes capacités' },
						{ key: 'oui_precieux', label: "Oui c'est un outil de travail précieux" },
						{ key: 'oui_non', label: 'Oui et non cela dépend des tâches' }
					]
				},
				{
					title: "Personnes non satisfaites de l'IA",
					targets: [
						{ key: 'non_resultats', label: 'Non les résultats obtenus ne sont pas satisfaisants' },
						{ key: 'non_utilisation', label: "Non je ne sais pas bien l'utiliser" }
					]
				}
			]
		},
		{
			key: 'frequence_info',
			title: "Fréquence d'information sur l'IA",
			overviewTitle: "Fréquence d'information sur l'IA par les répondants",
			groups: [
				{
					title: "Groupes qui s'informent souvent",
					targets: [
						{ key: 'quotidienne', label: 'Quotidienne ou quasi-quotidienne' },
						{ key: 'hebdomadaire', label: 'Hebdomadaire ou équivalent' }
					]
				},
				{
					title: "Groupes qui ne s'informent pas souvent",
					targets: [
						{ key: 'mensuelle', label: 'Mensuelle et de façon active' },
						{ key: 'moins_mensuelle', label: "Moins d'une fois par mois, ponctuellement" },
						{ key: 'jamais', label: 'Jamais' }
					]
				}
			]
		}
	]

	const getSurveyData = (key: string) => (surveyData as any)[key] ?? []
	const getAnalysisData = (
		metric: string,
		dimension: string,
		target: string,
		kind: 'pie' | 'bars'
	) => (surveyData as any).analyses?.[metric]?.[dimension]?.[target]?.[kind] ?? []

	$: lang = ($page.params.lang as Lang) || 'fr'
	$: t = getT(lang)
</script>

<svelte:head>
	<title>{t.emploi_ia.stats_section_title} | Pause IA</title>
</svelte:head>

<div class="stats-page">
	<div class="container">
		<a href="/{lang}/emploi-ia" class="back-link">
			← {t.nav.emploi_ia}
		</a>

		<UnderlinedTitle>
			<h1>{t.emploi_ia.stats_section_title}</h1>
		</UnderlinedTitle>

		<div class="intro">
			<p>
				Cette micro-étude a été réalisée à partir des résultats d’un questionnaire lancé en juillet
				2025 par l’association Pause IA <a href="https://pauseia.fr/fr/emploi-ia/questionnaire"
					>que vous pouvez trouver ici</a
				>
			</p>
			<p>
				Ce questionnaire a pour objectif de recueillir l’avis de différentes personnes sur
				l’intelligence artificielle et son impact sur leur vie quotidienne et professionnelle, afin
				de pouvoir éventuellement mieux les accompagner et mieux comprendre comment nous pourrions
				les aider, aussi bien personnellement que professionnellement.
			</p>
		</div>

		<section class="stats-section">
			<h2 id="limites">Limite de cette micro-étude et biais statistiques</h2>
			<p>
				Avant de commencer cette micro-étude, il est important de souligner plusieurs biais
				statistiques importants.
			</p>
			<p>
				Pour commencer, le nombre de personnes ayant répondu à ce questionnaire au moment de la
				rédaction de cette micro-étude ({new Date(surveyData.update_date).toLocaleDateString(lang)})
				est de {surveyData.nombre_reponses}. Ce nombre reste relativement faible et ne permet donc
				pas de généraliser les résultats à l’ensemble de la population française.
			</p>
			<p>
				De surcroit, il est probable que l’échantillon présente un biais. En effet, compte tenu de
				l’objet de notre association, les personnes ayant répondu à ce questionnaire font
				potentiellement davantage partie d’une population déjà impactée par l’IA et susceptible
				d’avoir une perception plus défavorable de celle-ci que l’ensemble de la population.
			</p>
			<p>
				Un autre biais statistique particulièrement visible concerne le niveau d’études des
				répondants. En effet, la majorité des participants possèdent un niveau d’études largement
				supérieur à la moyenne nationale. Par exemple, {(surveyData.etudes.find(
					(item) => item.label === 'Bac +5'
				)?.value || 0) + (surveyData.etudes.find((item) => item.label === '> Bac +5')?.value || 0)} %
				des répondants déclarent avoir un niveau d’études supérieur ou égal à Bac +5, alors que dans
				la population française générale,
				<a
					target="_blank"
					href="https://www.insee.fr/fr/statistiques/2011101?geo=FRANCE-1#titre-tableau-FOR_T3"
					>la proportion de personnes ayant un diplôme de niveau Bac +5 ou plus est d’environ 12 %,
					selon l’INSEE en 2023</a
				>
			</p>
			<PieChart title="Niveau d'études des répondants" data={surveyData.etudes} withMargin={true} />
			<p>
				Les diplômés du supérieur long sont donc environ {(
					((surveyData.etudes.find((item) => item.label === 'Bac +5')?.value || 0) +
						(surveyData.etudes.find((item) => item.label === '> Bac +5')?.value || 0)) /
					12
				).toFixed(1)}
				fois plus représentés dans ce questionnaire que dans la population générale. À l’inverse, les
				personnes ayant un niveau d’études inférieur ou égal au Bac général sont très peu représentées
				dans les résultats de cette étude.
			</p>
			<p>
				En plus de ce biais lié au niveau d’études, plusieurs autres déséquilibres apparaissent dans
				l’échantillon.
			</p>
			<p>
				Les indépendants sont davantage représentés que dans la population générale. Ils
				représentent {surveyData.statut?.find((item) => item.label === 'Actif indépendant')
					?.value || 0} % des répondants,
				<a target="_blank" href="https://www.insee.fr/fr/statistiques/8376828?sommaire=8376908"
					>alors qu’ils représentent environ 13.3 % des travailleurs en France selon l’INSEE.</a
				>
			</p>
			<PieChart
				title="Statut professionnel des répondants"
				data={surveyData.statut}
				withMargin={true}
			/>
			<p>
				Les travailleurs indépendants sont donc environ {(
					(surveyData.statut?.find((item) => item.label === 'Actif indépendant')?.value || 0) / 13.3
				).toFixed(1)}
				fois plus représentés dans cette étude que dans la population active française.
			</p>
			<p>
				Les personnes travaillant dans les secteurs de l’informatique et des télécommunications sont
				également fortement surreprésentées. Ce secteur représente {surveyData.secteur?.find(
					(item) => item.label === 'Informatique et télécommunication'
				)?.value || 0} % des répondants,
				<a
					target="_blank"
					href="https://www.insee.fr/fr/statistiques/7456871?sommaire=7456956#titre-tableau-figure3"
					>alors qu’il représente environ 3,4 % des emplois en France selon l’INSEE.</a
				>
			</p>
			<PieChart
				title="Répartition des répondants par secteur d'activité"
				data={surveyData.secteur}
				withMargin={true}
			/>
			<p>
				Les métiers du numérique sont donc environ {(
					(surveyData.secteur?.find((item) => item.label === 'Informatique et télécommunication')
						?.value || 0) / 3.4
				).toFixed(1)}
				fois plus représentés dans le questionnaire que dans la population générale.
			</p>
			<p>L’échantillon présente également un léger déséquilibre de genre :</p>
			<ul>
				<li>
					{surveyData.genre?.find((item) => item.label === 'Homme')?.value || 0} % des répondants sont
					des hommes
				</li>
				<li>
					{surveyData.genre?.find((item) => item.label === 'Femme')?.value || 0} % sont des femmes
				</li>
				<li>
					{surveyData.genre?.find((item) => item.label === 'Autre')?.value || 0} % déclarent un autre
					genre
				</li>
			</ul>
			<p>
				À titre de comparaison, <a
					target="_blank"
					href="https://www.insee.fr/fr/statistiques/2381474"
					>la population française est composée d’environ 51,5 % de femmes selon l’INSEE.
				</a>
			</p>
			<PieChart
				title="Répartition par genre des répondants"
				data={surveyData.genre}
				withMargin={true}
			/>
			<p>
				Enfin, les personnes âgées de 30 à 50 ans sont particulièrement représentées dans les
				réponses :
			</p>
			<ul>
				<li>
					{surveyData.age.find((item) => item.label === '30-39 ans')?.value || 0} % des répondants ont
					entre 30 et 40 ans
				</li>
				<li>
					{surveyData.age.find((item) => item.label === '40-49 ans')?.value || 0} % ont entre 40 et 50
					ans
				</li>
			</ul>
			<p>À l’inverse :</p>
			<ul>
				<li>
					{surveyData.age.find((item) => item.label === '10-19 ans')?.value || 0} % ont entre 10 et 20
					ans
				</li>
				<li>
					{surveyData.age.find((item) => item.label === '60-69 ans')?.value || 0} % ont entre 60 et 70
					ans
				</li>
			</ul>
			<p>
				Les personnes âgées de 30 à 50 ans représentent donc plus de {(
					(surveyData.age.find((item) => item.label === '30-39 ans')?.value || 0) +
					(surveyData.age.find((item) => item.label === '40-49 ans')?.value || 0)
				).toFixed(1)} % de l’échantillon total.
				<a
					target="_blank"
					href="https://www.insee.fr/fr/statistiques/8612506?sommaire=8612596#titre-graphique-figure2"
					>Ce qui ne correspond pas à la pyramide des âges en France.</a
				>
			</p>
			<PieChart
				title="Répartition par âge des répondants"
				data={surveyData.age}
				withMargin={true}
			/>
			<p>
				Ces différents biais peuvent influencer fortement les résultats de l’étude. Nous le verrons
				plus loin, mais ces biais peuvent s'expliquer par le fait que c'est ce profil de la
				population qui semble le plus touché par les transformations liées à l'IA.
			</p>
		</section>

		<section class="stats-section">
			<h2>L'impact de l'IA sur le travail</h2>
			<p>
				Globalement, la majorité des répondants considèrent que l’IA représente déjà une
				transformation importante de leur environnement professionnel. Les réponses les plus
				fréquentes correspondent à un « Impact moyen : transformations auxquelles je m'adapte sans
				grandes difficultés » ({surveyData.impact?.find(
					(item) =>
						item.label ===
						"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
				)?.value || 0}%) ou un « Fort impact : menace de perte d'emploi transformations difficiles »
				({surveyData.impact?.find(
					(item) =>
						item.label === "Fort impact : menace de perte d'emploi transformations difficiles"
				)?.value || 0}%). tandis que les réponses indiquant « peu d’impact » ({surveyData.impact?.find(
					(item) => item.label === "Peu d'impact / Pas tout de suite"
				)?.value || 0}%) restent minoritaires. Les personnes indiquant un « Très fort impact :
				emploi perdu métier disparu compétences inutiles... » sont aussi minoritaires, avec {surveyData.impact?.find(
					(item) =>
						item.label === 'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				)?.value || 0}% des réponses.
			</p>
			<p>
				L’étude met également en évidence que certains groupes apparaissent plus touchés que
				d’autres. Les secteurs les plus exposés sont notamment:
			</p>
			<ul style="margin-bottom: 1.5rem; ">
				<li>l’informatique et télécommunication</li>
				<li>la communication et le marketing</li>
				<li>la traduction</li>
				<li>le conseil</li>
				<li>l’immobilier</li>
				<li>la création</li>
				<li>l’édition</li>
				<li>la recherche</li>
			</ul>
			<p>
				De la même manière, les femmes, les jeunes, les élèves / étudiants / apprentis et les actifs
				indépendants ressortent comme davantage impactés dans les réponses recueillies. Cette
				perception plus forte peut s’expliquer par leur exposition à des métiers, des tâches ou des
				trajectoires professionnelles particulièrement sensibles aux évolutions rapides de l’IA.
			</p>

			<p>
				À l’inverse, certains profils semblent globalement moins touchés dans cette enquête.
				Certains secteurs comme:
			</p>
			<ul style="margin-bottom: 1.5rem; ">
				<li>la santé</li>
				<li>le service public</li>
				<li>le sport / animation</li>
				<li>certains métiers artisanaux</li>
			</ul>
			<p>
				apparaissent comme relativement plus préservés. De même, les hommes, les fonctionnaires, les
				retraités et, dans certains cas, les personnes au chômage déclarent plus souvent un impact
				modéré ou limité de l’IA sur leur situation. Ces résultats suggèrent donc que l’impact de
				l’IA n’est pas uniforme : il varie selon le secteur d’activité, le statut professionnel,
				l’âge et le genre des répondants.
			</p>
			<PieChart
				title="Impact jugé de l'IA sur le travail par les répondants"
				data={surveyData.impact}
				withMargin={true}
			/>

			<div class="deep-analysis">
				<h3>Impact de l'IA selon les secteurs professionnels</h3>

				<p>
					C’est l’un des résultats les plus parlants de cette étude. Certains secteurs ressortent
					comme nettement plus exposés aux transformations liées à l’intelligence artificielle,
					tandis que d’autres semblent pour le moment relativement préservés.
				</p>

				<h4>Secteurs qui ressortent comme plus exposés</h4>

				<ul>
					<li>Informatique et télécommunication</li>
					<li>Communication et marketing</li>
					<li>Traduction</li>
					<li>Conseil</li>
					<li>Immobilier</li>
					<li>Artiste / création / édition</li>
					<li>Recherche pour certains profils</li>
				</ul>

				<h4>Secteurs qui semblent moins exposés</h4>

				<ul>
					<li>Santé</li>
					<li>Service public</li>
					<li>Sport / animation</li>
					<li>Artisanat pour certains profils</li>
					<li>Inactif</li>
				</ul>

				<h4 class="interpretation">Interprétation</h4>

				<p>
					Les métiers qui reposent fortement sur la production de contenu, l’analyse, les tâches
					cognitives répétitives, la rédaction, la traduction ou certaines fonctions de support
					apparaissent comme plus vulnérables aux transformations liées à l’IA.
				</p>

				<p>
					À l’inverse, les secteurs où le travail est davantage humain, relationnel, manuel ou très
					contextuel semblent actuellement mieux protégés dans la perception des répondants.
				</p>

				<p>
					À noter que certains métiers comme dans le secteur de l'Informatique et télécommunication
					sont sur-représentés dans les résultats de cette étude ce qui peut mener à des biais
					statistiques.
				</p>

				<a href="#limites">Voir les limites de l'étude</a>

				<h4 class="center-aligned">Secteurs ayant le plus de répondants impactés par l'IA</h4>
				<div class="charts-grid">
					<PieChart
						title="Secteurs ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... »"
						data={surveyData.repartition_secteurs_tres_fort_impact}
					/>
					<PieChart
						title="Secteurs ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles »"
						data={surveyData.repartition_secteurs_fort_impact}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Secteurs dont la proportion des répondants est la plus impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.secteurs_tres_fortement_impactes}
						title="Secteurs ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.secteurs_l_observation_et_la_prudence}
						title="Secteurs ayant le plus répondu « L'observation et la prudence » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
				<h4 class="center-aligned">Secteurs ayant le moins de répondants impactés par l'IA</h4>
				<div class="charts-grid">
					<PieChart
						title="Secteurs ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés »"
						data={surveyData.repartition_secteurs_moyen_impact}
					/>
					<PieChart
						title="Secteurs ayant le plus répondu « Peu d'impact / Pas tout de suite »"
						data={surveyData.repartition_secteurs_peu_impact}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Secteurs dont la proportion des répondants est la moins impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.secteurs_moyen_impactes}
						title="Secteurs ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.secteurs_peu_impactes}
						title="Secteurs ayant le plus répondu « Peu d'impact / Pas tout de suite » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
					<HorizontalBarChart
						data={surveyData.secteurs_pas_impactes}
						title="Secteurs ayant le plus répondu « Jamais » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
			</div>

			<div class="deep-analysis">
				<h3>Impact de l'IA selon le niveau d'études</h3>
				<p>
					Le niveau d’étude ne semble pas être un facteur explicatif clair et univoque du ressenti
					face à l’impact de l’IA dans cet échantillon. Les perceptions sont réparties dans
					pratiquement tous les niveaux d’études, avec des résultats parfois contradictoires selon
					qu’on observe les volumes bruts ou les proportions internes.
				</p>
				<p>
					En effet, les personnes disposant d’un niveau d’études élevé (notamment Bac +5 et au-delà)
					sont très représentées dans le questionnaire. Cela peut créer un biais important dans les
					résultats bruts : ces catégories apparaissent davantage dans presque toutes les réponses
					simplement parce qu’elles sont numériquement plus nombreuses dans l’échantillon.
				</p>
				<p>
					À l’inverse, les professions dont les répondants disposent d’un niveau d’études plus
					faible comptent très peu de participants dans cette étude. Les proportions observées dans
					ces groupes peuvent donc fortement varier avec seulement une ou deux réponses
					supplémentaires, ce qui limite fortement la portée statistique des résultats.
				</p>

				<a href="#limites">Voir limite de l'étude et biais statistiques</a>
				<h4 class="center-aligned">Niveau d'études et impact de l'IA</h4>
				<div class="charts-grid">
					<PieChart
						title="Niveau d'études ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... »"
						data={surveyData.repartition_studies_tres_fort_impact}
					/>
					<PieChart
						title="Niveau d'études ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles »"
						data={surveyData.repartition_studies_fort_impact}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Niveau d'études dont la proportion des répondants est la plus impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.studies_tres_fortement_impactes}
						title="Niveau d'études ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.studies_fortement_impactes}
						title="Niveau d'études ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
				<h4 class="center-aligned">
					Niveau d'études ayant le moins de répondants impactés par l'IA
				</h4>
				<div class="charts-grid">
					<PieChart
						title="Niveau d'études ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés »"
						data={surveyData.repartition_studies_moyen_impact}
					/>
					<PieChart
						title="Niveau d'études ayant le plus répondu « Peu d'impact / Pas tout de suite »"
						data={surveyData.repartition_studies_peu_impact}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Niveau d'études dont la proportion des répondants est la moins impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.studies_moyen_impactes}
						title="Niveau d'études ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.studies_peu_impactes}
						title="Niveau d'études ayant le plus répondu « Peu d'impact / Pas tout de suite » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
					<HorizontalBarChart
						data={surveyData.studies_pas_impactes}
						title="Niveau d'études ayant le plus répondu « Jamais » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
			</div>
			<div class="deep-analysis">
				<h3>Impact de l'IA selon l'âge</h3>

				<p>
					Cette étude met également en évidence des différences importantes selon l’âge des
					répondants. Les jeunes adultes et les personnes en milieu de carrière semblent être celles
					qui déclarent le plus fortement ressentir les transformations liées à l’intelligence
					artificielle dans leur vie professionnelle.
				</p>

				<h4>Tranches d'âge qui ressortent comme plus exposées</h4>

				<ul>
					<li>20-29 ans</li>
					<li>30-39 ans</li>
					<li>40-49 ans</li>
					<li>10-19 ans pour certains profils</li>
					<li>50-59 ans dans certains cas</li>
				</ul>

				<p>
					Les répondants âgés de 20 à 49 ans représentent une grande partie des personnes déclarant
					un « fort impact » ou un « très fort impact » de l’IA sur leur travail.
				</p>

				<p>
					En proportion, les très jeunes répondants apparaissent également fortement touchés. Par
					exemple, la tranche 10-19 ans est celle qui possède la plus forte proportion de personnes
					déclarant un « très fort impact » de l’IA.
				</p>

				<h4>Tranches d'âge qui semblent moins exposées</h4>

				<ul>
					<li>60-69 ans</li>
					<li>70-79 ans</li>
				</ul>

				<p>
					Les répondants les plus âgés déclarent davantage un « impact moyen », un « peu d’impact »
					ou parfois même aucun impact de l’IA sur leur activité.
				</p>

				<h4 class="interpretation">Interprétation</h4>

				<p>
					Les jeunes adultes et les personnes en milieu de carrière semblent davantage exposés aux
					transformations liées à l’IA, principalement parce que se sont cette catégorie de
					population qui sont le plus en age d'avoir encore une activitée professionnelle et donc de
					ressentir l'impact de de l'IA sur leur travail.
				</p>

				<p>
					Les très jeunes répondants apparaissent eux aussi particulièrement concernés. Cela peut
					s’expliquer par le fait qu’ils entrent actuellement sur le marché du travail dans un
					contexte où l’IA transforme déjà profondément certains métiers, certaines études et
					certaines compétences considérées comme importantes. <a
						href="https://www.blogdumoderateur.com/jeunes-ia-impacts-concrets-marche-travail/"
						target="_blank"
						>De plus, pour l'instant l'IA a plutot tendance a etre utiliser pour effectuer certaine
						tache qui était auparavant attribuer à des juniors ce qui peut décourager certaines
						entreprises à recruter des profils de ce type.</a
					>
				</p>

				<p>
					Cependant, ces résultats doivent être interprétés avec prudence. Les personnes âgées de 30
					à 50 ans sont fortement surreprésentées dans l’échantillon de cette étude : elles
					représentent à elles seules plus de {(
						(surveyData.age.find((item) => item.label === '30-39 ans')?.value || 0) +
						(surveyData.age.find((item) => item.label === '40-49 ans')?.value || 0)
					).toFixed(1)} % des répondants. Cette surreprésentation peut créer un biais statistique important
					et accentuer artificiellement leur poids dans les résultats.
				</p>

				<p>
					À l’inverse, les personnes très jeunes et les personnes plus âgées sont relativement peu
					représentées dans le questionnaire. Par exemple, seulement {surveyData.age.find(
						(item) => item.label === '10-19 ans'
					)?.value || 0} % des répondants ont entre 10 et 20 ans, et seulement {(
						(surveyData.age.find((item) => item.label === '60-69 ans')?.value || 0) +
						(surveyData.age.find((item) => item.label === '70-79 ans')?.value || 0)
					).toFixed(1)} % ont plus de 60 ans. Les résultats concernant ces catégories sont donc moins
					représentatifs et doivent être interprétés avec précaution, car le faible nombre de participants
					peut lui aussi produire des biais statistiques importants.
				</p>
				<a href="#limites">Voir limite de l'étude et biais statistiques</a>
				<h4 class="center-aligned">Âge et impact de l'IA</h4>
				<div class="charts-grid">
					<PieChart
						title="Âge ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... »"
						data={surveyData.repartition_age_tres_fort_impact}
					/>
					<PieChart
						title="Âge ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles »"
						data={surveyData.repartition_age_fort_impact}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Âge dont la proportion des répondants est la plus impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.age_tres_fortement_impactes}
						title="Âge ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.age_fortement_impactes}
						title="Âge ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
				<h4 class="center-aligned">Âge ayant le moins de répondants impactés par l'IA</h4>
				<div class="charts-grid">
					<PieChart
						title="Âge ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés »"
						data={surveyData.repartition_age_moyen_impact}
					/>
					<PieChart
						title="Âge ayant le plus répondu « Peu d'impact / Pas tout de suite »"
						data={surveyData.repartition_age_peu_impact}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Âge dont la proportion des répondants est la moins impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.age_moyen_impactes}
						title="Âge ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.age_peu_impactes}
						title="Âge ayant le plus répondu « Peu d'impact / Pas tout de suite » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
					<HorizontalBarChart
						data={surveyData.age_jamais_impactes}
						title="Âge ayant le plus répondu « Jamais » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
			</div>

			<div class="deep-analysis">
				<h3>Impact de l'IA selon le genre</h3>
				<p>
					Les résultats semblent montrer un ressenti d’impact plus fort de l’IA chez les femmes que
					chez les hommes. Cette tendance apparaît particulièrement lorsqu’on observe les
					proportions internes aux groupes plutôt que les volumes bruts. En effet, bien que les
					femmes soient moins nombreuses dans l’échantillon, elles déclarent proportionnellement
					davantage un « fort » ou un « très fort » impact de l’IA sur leur emploi, leurs
					compétences ou leur avenir professionnel.
				</p>
				<p>
					Cette différence est visible dans plusieurs catégories. La part de femmes déclarant un «
					très fort impact » est notamment plus élevée que celle des hommes, ce qui peut suggérer un
					sentiment plus marqué de vulnérabilité face aux transformations technologiques en cours.
					Les hommes, à l’inverse, apparaissent davantage dans les catégories décrivant un impact
					modéré ou une adaptation plus facile aux changements induits par l’IA.
				</p>
				<h4 class="interpretation">Interprétation</h4>
				<p>
					Plusieurs facteurs peuvent potentiellement expliquer cette tendance. <a
						href="https://www.ilo.org/fr/resource/actualites/ia-generative-les-femmes-plus-exposees-que-les-hommes"
						target="_blank"
						>Certains métiers fortement féminisés, notamment dans les domaines administratifs, du
						support, de la communication ou de certains services, sont aujourd’hui particulièrement
						concernés par l’automatisation et les outils d’IA générative
					</a>. À cela peut s’ajouter un contexte plus large d’incertitude professionnelle ou de
					<a href="https://www.insee.fr/fr/statistiques/8381248">précarité</a>, qui peut renforcer
					la perception d’un risque lié à l’intelligence artificielle.
				</p>
				<p>
					Ces observations doivent toutefois être interprétées avec prudence. L’échantillon reste
					relativement limité et ne peut pas être considéré comme pleinement représentatif de
					l’ensemble de la population active. Les résultats traduisent avant tout un ressenti
					subjectif des répondants face à l’impact de l’IA, et non une mesure objective des
					transformations réellement vécues.
				</p>
				<h4 class="center-aligned">Genre et impact de l'IA</h4>
				<div class="charts-grid">
					<PieChart
						title="Genre ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... »"
						data={surveyData.repartition_genre_tres_fort_impact}
					/>
					<PieChart
						title="Genre ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles »"
						data={surveyData.repartition_genre_fort_impact}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Genre dont la proportion des répondants est la plus impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.genre_tres_fortement_impactes}
						title="Genre ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.genre_fortement_impactes}
						title="Genre ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
				<h4 class="center-aligned">Genre ayant le moins de répondants impactés par l'IA</h4>
				<div class="charts-grid">
					<PieChart
						title="Genre ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés »"
						data={surveyData.repartition_genre_moyen_impact}
					/>
					<PieChart
						title="Genre ayant le plus répondu « Peu d'impact / Pas tout de suite »"
						data={surveyData.repartition_genre_peu_impact}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Genre dont la proportion des répondants est la moins impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.genre_moyen_impactes}
						title="Genre ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.genre_peu_impactes}
						title="Genre ayant le plus répondu « Peu d'impact / Pas tout de suite » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
					<HorizontalBarChart
						data={surveyData.genre_jamais_impactes}
						title="Genre ayant le plus répondu « Jamais » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
			</div>

			<div class="deep-analysis">
				<h3>Impact de l'IA selon le statut professionnel</h3>
				<p>
					Les résultats montrent que les actifs indépendants ainsi que les élèves / étudiants /
					apprentis figurent parmi les catégories déclarant le plus fortement ressentir l’impact de
					l’IA. Cette tendance apparaît surtout lorsqu’on observe les proportions internes à chaque
					groupe professionnel plutôt que les volumes bruts de répondants.
				</p>

				<p>
					Les actifs indépendants présentent notamment des proportions élevées de réponses indiquant
					un « fort impact » ou un « très fort impact » de l’IA. Les élèves, étudiants et apprentis
					apparaissent également fortement concernés et représentent même la catégorie ayant la plus
					forte proportion de réponses « très fort impact » dans l’échantillon.
				</p>

				<p>
					Les salariés présentent une situation plus contrastée. Une partie importante d’entre eux
					déclare ressentir un impact fort de l’IA, mais ils sont également nombreux à considérer
					ces transformations comme des évolutions auxquelles ils s’adaptent sans grandes
					difficultés.
				</p>

				<p>
					À l’inverse, les fonctionnaires, les retraités et les personnes au chômage apparaissent
					davantage dans les catégories décrivant un impact modéré ou limité de l’IA. Les personnes
					sans emploi sont notamment majoritairement représentées dans les réponses associées à un
					impact moyen ou faible.
				</p>
				<h4 class="interpretation">Interprétation</h4>
				<p>
					Ces résultats suggèrent que les actifs indépendants peuvent se sentir particulièrement
					exposés aux transformations liées à l’IA, probablement en raison de leur exposition
					directe au marché et aux évolutions technologiques rapides.
				</p>

				<p>
					Le fort niveau d’inquiétude observé chez les élèves, étudiants et apprentis peut refléter
					des interrogations concernant l’avenir professionnel, la stabilité future des métiers ou
					encore l’évolution de la valeur des compétences acquises pendant les études, dans un
					contexte ou l'intelligence artifficielle évolue rapidement.
					<a
						href="https://www.ilo.org/fr/resource/actualites/ia-generative-les-femmes-plus-exposees-que-les-hommes"
						target="_blank"
					>
						De plus, comme dis plus haut, les entreprise ont plus tendance a automatiser des taches
						qui était auparavant attribuer au jeune.
					</a>
				</p>
				<p>
					La perception d’un impact plus limité chez les fonctionnaires peut être liée à une
					impression de stabilité de l’emploi public face aux transformations technologiques. Les
					retraités sont quant à eux logiquement moins concernés directement par les évolutions du
					marché du travail.
				</p>

				<p>
					Ces observations doivent néanmoins être interprétées avec prudence. Certaines catégories
					reposent sur des effectifs réduits, ce qui limite la portée statistique des comparaisons.
					Les actifs indépendants semblent également surreprésentés dans l’échantillon par rapport à
					leur poids réel dans la population française, ce qui peut influencer les tendances
					observées.
				</p>
				<a href="#limites">Voir limite de l'étude et biais statistiques</a>
			</div>
			<h4 class="center-aligned">Statut professionnel et impact de l'IA</h4>
			<div class="charts-grid">
				<PieChart
					title="Statut professionnel ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... »"
					data={surveyData.repartition_statut_tres_fort_impact}
				/>
				<PieChart
					title="Statut professionnel ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles »"
					data={surveyData.repartition_statut_fort_impact}
				/>
			</div>

			<div class="bar-chart-section">
				<h4 class="center-aligned">
					Statut professionnel dont la proportion des répondants est la plus impactée par l'IA
				</h4>
				<HorizontalBarChart
					data={surveyData.statut_tres_fortement_impactes}
					title="Statut professionnel ayant le plus répondu « Très fort impact : emploi perdu métier disparu compétences inutiles... » dont les effectifs sont supérieurs à 3"
					withMargin={true}
				/>

				<HorizontalBarChart
					data={surveyData.statut_fortement_impactes}
					title="Statut professionnel ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles » dont les effectifs sont supérieurs à 3"
					withMargin={true}
				/>
			</div>
			<h4 class="center-aligned">
				Statut professionnel ayant le moins de répondants impactés par l'IA
			</h4>
			<div class="charts-grid">
				<PieChart
					title="Statut professionnel ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés »"
					data={surveyData.repartition_statut_moyen_impact}
				/>
				<PieChart
					title="Statut professionnel ayant le plus répondu « Peu d'impact / Pas tout de suite »"
					data={surveyData.repartition_statut_peu_impact}
				/>
			</div>

			<div class="bar-chart-section">
				<h4 class="center-aligned">
					Statut professionnel dont la proportion des répondants est la moins impactée par l'IA
				</h4>
				<HorizontalBarChart
					data={surveyData.statut_moyen_impactes}
					title="Statut professionnel ayant le plus répondu « Moyen impact : transformations auxquelles je m'adapte sans grandes difficultés » dont les effectifs sont supérieurs à 3"
					withMargin={true}
				/>

				<HorizontalBarChart
					data={surveyData.statut_peu_impactes}
					title="Statut professionnel ayant le plus répondu « Peu d'impact / Pas tout de suite » dont les effectifs sont supérieurs à 3"
					withMargin={true}
				/>
				<HorizontalBarChart
					data={surveyData.statut_jamais_impactes}
					title="Statut professionnel ayant le plus répondu « Jamais » dont les effectifs sont supérieurs à 3"
					withMargin={true}
				/>
			</div>
		</section>
		<section class="stats-section">
			<h2>Rapport à l'IA des répondants</h2>
			<p>
				Globalement, les répondants entretiennent majoritairement un rapport prudent ou négatif
				vis-à-vis de l’IA. La posture la plus fréquente correspond à « L’observation et la prudence
				» ({surveyData.rapport?.find((r) => r.label === "L'observation et la prudence")?.value ||
					0.0}%), ce qui suggère qu’une grande partie des personnes interrogées préfèrent adopter
				une attitude attentive et mesurée face au développement de ces technologies. Le « malaise
				voire l’anxiété » représente également une part importante des réponses ({surveyData.rapport?.find(
					(r) => r.label === "Le malaise voire l'anxiété"
				)?.value || 0.0}%), montrant qu’une proportion non négligeable des répondants associe l’IA à
				des inquiétudes ou à une forme d’incertitude.
			</p>
			<p>
				À l’inverse, les perceptions plus positives restent minoritaires. Les personnes exprimant
				une « excitation à l’idée de l’utiliser davantage » représentent {surveyData.rapport?.find(
					(r) => r.label === "L'excitation à l'idée de l'utiliser davantage"
				)?.value || 0.0}% des réponses, tandis que celles déclarant avoir « confiance dans ces
				nouveaux outils » ne représentent que {surveyData.rapport?.find(
					(r) => r.label === 'La confiance dans ces nouveaux outils'
				)?.value || 0.0}% des repondants. Les réponses indiquant « pas de rapport particulier »
				restent également très minoritaires ({surveyData.rapport?.find(
					(r) => r.label === 'Pas de rapport particulier'
				)?.value || 0.0}%), ce qui montre que l’IA suscite aujourd’hui une réaction ou un
				positionnement chez la plupart des participants.
			</p>
			<p>
				L’étude met également en évidence que certains groupes apparaissent plus touchés que
				d’autres. Les secteurs les plus exposés sont notamment:
			</p>
			<ul style="margin-bottom: 1.5rem; ">
				<li>l’informatique et télécommunication</li>
				<li>la communication et le marketing</li>
				<li>la traduction</li>
				<li>le conseil</li>
				<li>l’immobilier</li>
				<li>la création</li>
				<li>l’édition</li>
				<li>la recherche</li>
			</ul>
			<p>
				De la même manière, les femmes, les jeunes, les élèves / étudiants / apprentis et les actifs
				indépendants ressortent comme davantage impactés dans les réponses recueillies. Cette
				perception plus forte peut s’expliquer par leur exposition à des métiers, des tâches ou des
				trajectoires professionnelles particulièrement sensibles aux évolutions rapides de l’IA.
			</p>

			<p>
				À l’inverse, certains profils semblent globalement moins touchés dans cette enquête.
				Certains secteurs comme:
			</p>
			<ul style="margin-bottom: 1.5rem; ">
				<li>la santé</li>
				<li>le service public</li>
				<li>le sport / animation</li>
				<li>certains métiers artisanaux</li>
			</ul>
			<p>
				apparaissent comme relativement plus préservés. De même, les hommes, les fonctionnaires, les
				retraités et, dans certains cas, les personnes au chômage déclarent plus souvent un impact
				modéré ou limité de l’IA sur leur situation. Ces résultats suggèrent donc que l’impact de
				l’IA n’est pas uniforme : il varie selon le secteur d’activité, le statut professionnel,
				l’âge et le genre des répondants.
			</p>
			<PieChart
				title="Rapport qu'on les répondants vis-à-vis de l'IA"
				data={surveyData.rapport}
				withMargin={true}
			/>

			<div class="deep-analysis">
				<h3>Rapport à l'IA selon les secteurs professionnels</h3>
				<p>
					Globalement, les résultats montrent que les secteurs n’entretiennent pas tous le même
					rapport à l’intelligence artificielle. Certains domaines apparaissent davantage associés à
					des réponses relevant du « malaise voire de l’anxiété », tandis que d’autres sont plus
					fréquemment liés à des réponses de « confiance » ou « d’excitation à l’idée d’utiliser
					davantage » ces outils.
				</p>

				<p>
					Le secteur de l’informatique et des télécommunications occupe une position particulière
					dans les résultats. Il représente à la fois le plus grand nombre de répondants exprimant
					un « malaise voire une anxiété » face à l’IA, mais également celui comptant le plus de
					répondants déclarant de la « confiance dans ces nouveaux outils » ou de « l’excitation à
					l’idée de les utiliser davantage ». Le secteur apparaît ainsi comme l’un des plus
					polarisés de l’échantillon. Il est important de noter que c’est le secteur qui compte le
					plus de répondants, ce qui explique le fait qu'il soit representé autant dans toutes les
					catégories.
				</p>

				<p>
					Les secteurs de la santé ainsi que du service public, de la défense et de la sécurité
					présentent une proportion relativement importante de répondants déclarant un « malaise
					voire une anxiété » face à l’IA. À l’inverse, le secteur de la recherche se distingue
					davantage par des réponses associées à « l’observation et la prudence », avec une
					proportion plus limitée de réponses relevant du malaise.
				</p>

				<p>
					Les secteurs de la communication et du marketing, de la culture et du patrimoine ou encore
					des activités juridiques et comptables apparaissent également relativement associés à des
					réponses de prudence vis-à-vis de l’IA.
				</p>

				<h3 class="interpretation">Interprétation</h3>

				<p>
					Ces résultats peuvent s’expliquer par le degré d’exposition variable des secteurs aux
					transformations liées à l’intelligence artificielle. Les professionnels de l’informatique
					et des télécommunications sont probablement parmi les plus directement confrontés à ces
					outils, ce qui pourrait expliquer la coexistence de réactions très positives et de formes
					d’inquiétude plus marquées.
				</p>

				<p>
					Dans les secteurs de la santé, du service public, de la défense ou des activités
					juridiques, la place importante accordée aux responsabilités humaines, aux enjeux éthiques
					ou à la sécurité peut contribuer à renforcer certaines inquiétudes face à l’automatisation
					ou à l’utilisation d’outils d’aide à la décision.
				</p>

				<p>
					Concernant le secteur de la recherche, la prédominance de réponses liées à « l’observation
					et la prudence » pourrait refléter une approche plus analytique et critique de ces
					technologies, liée à une meilleure connaissance de leurs capacités et de leurs limites
					actuelles.
				</p>

				<p>
					Il convient néanmoins de nuancer ces résultats en raison des effectifs parfois réduits
					dans certains secteurs. Plusieurs catégories professionnelles comptent peu de répondants,
					ce qui peut amplifier artificiellement certaines proportions. Les tendances observées
					permettent donc principalement d’identifier des dynamiques générales au sein de
					l’échantillon, plutôt que d’établir des conclusions définitives ou généralisables à
					l’ensemble de la population active.
				</p>
				<a href="#limites">Voir les limites de l'étude</a>

				<h4 class="center-aligned">
					Secteurs ayant le plus de répondants ayant un mauvais rapport à l'IA
				</h4>
				<div class="charts-grid">
					<PieChart
						title="Secteurs ayant le plus répondu « Le malaise voire l'anxiété »"
						data={surveyData.repartition_rapport_secteurs_le_malaise_voire_l_anxiété}
					/>
					<PieChart
						title="Secteurs ayant le plus répondu « L'observation et la prudence »"
						data={surveyData.repartition_rapport_secteurs_l_observation_et_la_prudence}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Secteurs dont la proportion des répondants ont un mauvais rapport à l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.secteurs_malaise_voire_l_anxiété}
						title="Secteurs dont la proportion des répondants ont répondu « Le malaise voire l'anxiété » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.secteurs_l_observation_et_la_prudence}
						title="Secteurs dont la proportion des répondants ont répondu « L'observation et la prudence » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
				<h4 class="center-aligned">
					Secteurs ayant le plus de répondants ayant un bon rapport à l'IA
				</h4>
				<div class="charts-grid">
					<PieChart
						title="Secteurs ayant le plus répondu « La confiance dans ces nouveaux outils »"
						data={surveyData.repartition_rapport_secteurs_La_confiance_dans_ces_nouveaux_outils}
					/>
					<PieChart
						title="Secteurs ayant le plus répondu « L'excitation à l'idée de l'utiliser davantage »"
						data={surveyData.repartition_rapport_secteurs_L_excitation_à_l_idee_de_l_utiliser_davantage}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Secteurs dont la proportion des répondants est la moins impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.secteurs_la_confiance_dans_ces_nouveaux_outils}
						title="Secteurs dont la proportion des répondants ont répondu « La confiance dans ces nouveaux outils » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.secteurs_l_excitation_à_l_idee_de_l_utiliser_davantage}
						title="Secteurs dont la proportion des répondants ont répondu « L'excitation à l'idée de l'utiliser davantage » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
			</div>

			<div class="deep-analysis">
				<h3>Rapport à l'IA selon le niveau d'études</h3>
				<p>
					Le niveau d’étude ne semble pas être un facteur explicatif clair et univoque du ressenti
					face à l’impact de l’IA dans cet échantillon. Les perceptions sont réparties dans
					pratiquement tous les niveaux d’études, avec des résultats parfois contradictoires selon
					qu’on observe les volumes bruts ou les proportions internes.
				</p>
				<p>
					En effet, les personnes disposant d’un niveau d’études élevé (notamment Bac +5 et au-delà)
					sont très représentées dans le questionnaire. Cela peut créer un biais important dans les
					résultats bruts : ces catégories apparaissent davantage dans presque toutes les réponses
					simplement parce qu’elles sont numériquement plus nombreuses dans l’échantillon.
				</p>
				<p>
					À l’inverse, les professions dont les répondants disposent d’un niveau d’études plus
					faible comptent très peu de participants dans cette étude. Les proportions observées dans
					ces groupes peuvent donc fortement varier avec seulement une ou deux réponses
					supplémentaires, ce qui limite fortement la portée statistique des résultats.
				</p>

				<a href="#limites">Voir limite de l'étude et biais statistiques</a>
				<h4 class="center-aligned">Niveau d'études et rapport à l'IA</h4>
				<div class="charts-grid">
					<PieChart
						title="Niveau d'études ayant le plus répondu « Le malaise voire l'anxiété »"
						data={surveyData.repartition_rapport_niveau_etudes_le_malaise_voire_l_anxiété}
					/>
					<PieChart
						title="Niveau d'études ayant le plus répondu « L'observation et la prudence »"
						data={surveyData.repartition_rapport_niveau_etudes_l_observation_et_la_prudence}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Niveau d'études dont la proportion des répondants ont un mauvais rapport à l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.etudes_malaise_voire_l_anxiété}
						title="Niveau d'études dont la proportion des répondants ont répondu « Le malaise voire l'anxiété » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.etudes_l_observation_et_la_prudence}
						title="Niveau d'études dont la proportion des répondants ont répondu « L'observation et la prudence » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
				<h4 class="center-aligned">
					Niveau d'études ayant le plus de répondants ayant un bon rapport à l'IA
				</h4>
				<div class="charts-grid">
					<PieChart
						title="Niveau d'études ayant le plus répondu « La confiance dans ces nouveaux outils »"
						data={surveyData.repartition_rapport_niveau_etudes_La_confiance_dans_ces_nouveaux_outils}
					/>
					<PieChart
						title="Niveau d'études ayant le plus répondu « L'excitation à l'idée de l'utiliser davantage »"
						data={surveyData.repartition_rapport_niveau_etudes_L_excitation_à_l_idee_de_l_utiliser_davantage}
					/>
				</div>

				<div class="bar-chart-section">
					<h4 class="center-aligned">
						Niveau d'études dont la proportion des répondants est la moins impactée par l'IA
					</h4>
					<HorizontalBarChart
						data={surveyData.etudes_la_confiance_dans_ces_nouveaux_outils}
						title="Niveau d'études dont la proportion des répondants ont répondu « La confiance dans ces nouveaux outils » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>

					<HorizontalBarChart
						data={surveyData.etudes_l_excitation_à_l_idee_de_l_utiliser_davantage}
						title="Niveau d'études dont la proportion des répondants ont répondu « L'excitation à l'idée de l'utiliser davantage » dont les effectifs sont supérieurs à 3"
						withMargin={true}
					/>
				</div>
			</div>
			{#each profileDimensions.slice(2) as dimension}
				<div class="deep-analysis">
					<h3>Rapport à l'IA selon {dimension.label}</h3>
					<h4 class="center-aligned">{dimension.plural} et rapport à l'IA</h4>
					<div class="charts-grid">
						{#each rapportTargets as target}
							<PieChart
								title="{dimension.plural} ayant le plus répondu « {target.label} »"
								data={getAnalysisData('rapport', dimension.key, target.key, 'pie')}
							/>
						{/each}
					</div>

					<div class="bar-chart-section">
						<h4 class="center-aligned">
							{dimension.plural} dont la proportion des répondants correspond le plus à chaque rapport
							à l'IA
						</h4>
						{#each rapportTargets as target}
							<HorizontalBarChart
								data={getAnalysisData('rapport', dimension.key, target.key, 'bars')}
								title="{dimension.plural} dont la proportion des répondants ont répondu « {target.label} » dont les effectifs sont supérieurs à 3"
								withMargin={true}
							/>
						{/each}
					</div>
				</div>
			{/each}
		</section>

		{#each groupedStatsSections as section}
			<section class="stats-section">
				<h2>{section.title}</h2>
				<PieChart
					title={section.overviewTitle}
					data={getSurveyData(section.key)}
					withMargin={true}
				/>

				{#each profileDimensions as dimension}
					<div class="deep-analysis">
						<h3>{section.title} selon {dimension.label}</h3>
						{#each section.groups as group}
							<h4 class="center-aligned">{group.title} par {dimension.label}</h4>
							<div class="charts-grid">
								{#each group.targets as target}
									<PieChart
										title="{dimension.plural} ayant le plus répondu « {target.label} »"
										data={getAnalysisData(section.key, dimension.key, target.key, 'pie')}
									/>
								{/each}
							</div>

							<div class="bar-chart-section">
								{#each group.targets as target}
									<HorizontalBarChart
										data={getAnalysisData(section.key, dimension.key, target.key, 'bars')}
										title="{dimension.plural} dont la proportion des répondants ont répondu « {target.label} » dont les effectifs sont supérieurs à 3"
										withMargin={true}
									/>
								{/each}
							</div>
						{/each}
					</div>
				{/each}
			</section>
		{/each}
	</div>
</div>

<style>
	.stats-page {
		padding: 4rem 0;
		background: var(--bg);
		min-height: 100vh;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 2rem;
		color: var(--brand-subtle);
		text-decoration: none;
		font-weight: 500;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.intro {
		font-size: 1.2rem;
		color: var(--text-2);
		margin-bottom: 4rem;
		line-height: 1.6;
	}

	.stats-section {
		margin-bottom: 6rem;
	}

	h2 {
		font-size: 1.8rem;
		margin-bottom: 3rem;
		border-left: 4px solid var(--brand);
		padding-left: 1rem;
	}

	.charts-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
	}

	.cta-box {
		background: var(--brand-light);
		padding: 3rem;
		border-radius: 16px;
		text-align: center;
		margin-top: 4rem;
	}

	.interpretation {
		position: relative;
		display: block;
		text-align: center;
		margin-top: 3rem;
		margin-bottom: 3rem;
	}

	.interpretation::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 0;
		width: 150px;
		height: 4px;
		background: var(--brand-subtle);
		border-radius: 2px;
		left: 50%;
		transform: translateX(-50%);
	}

	h3 {
		font-size: 1.5rem;
		margin-top: 3rem;
		margin-bottom: 3rem;
		color: var(--brand);
		font-family: 'IBM Plex Sans', sans-serif;
		font-weight: 700;
		position: relative;
		display: inline-block;
	}

	h3::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 0;
		width: 50%;
		height: 4px;
		background: var(--brand-subtle);
		border-radius: 2px;
	}

	.center-aligned {
		text-align: center;
	}

	h4 {
		font-size: 1.2rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
		color: black;
		font-weight: 600;
		display: block;
	}
	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.deep-analysis {
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.1));
	}

	.bar-chart-section {
		margin-top: 4rem;
	}

	.cta-box h3 {
		margin-top: 0;
		font-size: 1.5rem;
		color: var(--brand-subtle);
		display: block;
	}

	.cta-box h3::after {
		display: none;
	}

	.btn {
		display: inline-block;
		background: var(--brand);
		color: white;
		padding: 1rem 2rem;
		border-radius: 9999px;
		text-decoration: none;
		font-weight: 600;
		margin-top: 1.5rem;
		transition: transform 0.2s ease;
	}

	.btn:hover {
		transform: scale(1.05);
		color: white;
	}
</style>
