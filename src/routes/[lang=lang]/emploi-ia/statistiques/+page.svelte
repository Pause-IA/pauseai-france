<script lang="ts">
	import { page } from '$app/stores'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'
	import PieChart from '$lib/components/PieChart.svelte'
	import HorizontalBarChart from '$lib/components/HorizontalBarChart.svelte'
	import { surveyData } from '$lib/data/survey-stats'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import A from '$components/custom/a.svelte'

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
						data={surveyData.secteurs_fortement_impactes}
						title="Secteurs ayant le plus répondu « Fort impact : menace de perte d'emploi transformations difficiles » dont les effectifs sont supérieurs à 3"
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
