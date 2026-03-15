<script lang="ts">
	import Button from '$lib/components/Button.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'
	import toast from 'svelte-french-toast'

	$: lang = ($page.params.lang as Lang) || 'fr'
	$: t = getT(lang)
	$: frT = getT('fr')

	const sectors = [
		'juridique',
		'agriculture',
		'architecture',
		'artisanat',
		'automobile',
		'btp',
		'commerce',
		'communication',
		'culture',
		'edition',
		'energie',
		'finance',
		'rh',
		'hotellerie',
		'immobilier',
		'alimentaire',
		'industrie_bois',
		'informatique',
		'maintenance',
		'recherche',
		'sante',
		'service_personne',
		'service_public',
		'social',
		'sport',
		'tourisme',
		'autres'
	]

	$: translatedSectors = sectors.map((key) => ({
		key,
		label: (t.emploi_questionnaire.options.secteurs as any)[key],
		value: (frT.emploi_questionnaire.options.secteurs as any)[key]
	}))

	let formData = {
		// Section 1: Informations personnelles
		sexe: '',
		age: '',
		statutProfessionnel: '',
		autreStatutProfessionnel: '',
		niveauEtudes: '',
		secteurActivite: '',
		autreSecteurActivite: '',
		profession: '',

		// Section 2: Impact de l'IA
		frequenceInformation: '',
		impactIA: '',
		rapportIA: '',
		autreRapport: '',

		// Section 3: Réflexions et témoignage
		interesseCellule: '',
		objectifsCellule: [] as string[],
		autreObjectif: '',
		temoignage: '',
		consentementPartage: false,
		prenom: '',
		email: '',
		veutPlusQuestions: '',

		// Section 4: Utilisation de l'IA (conditionnelle)
		utilisationIA: '',
		typeTaches: [] as string[],
		autreTache: '',
		raisonsUtilisation: [] as string[],
		autreRaison: '',
		satisfactionUtilisation: ''
	}

	let currentStep = 1
	let showSection4 = false
	let isSubmitting = false

	function validateStep(step: number): boolean {
		if (step === 1) {
			if (
				!formData.sexe ||
				!formData.age ||
				!formData.statutProfessionnel ||
				!formData.secteurActivite
			) {
				toast.error(t.emploi_questionnaire.toasts.required_fields)
				return false
			}
		} else if (step === 3) {
			if (!formData.email) {
				toast.error(t.emploi_questionnaire.toasts.email_required)
				return false
			}
			if (!formData.veutPlusQuestions) {
				toast.error(t.emploi_questionnaire.toasts.more_required)
				return false
			}
			if (formData.consentementPartage && !formData.prenom) {
				toast.error(t.emploi_questionnaire.toasts.consent_name)
				return false
			}
		}
		return true
	}

	async function nextStep() {
		if (validateStep(currentStep)) {
			if (currentStep === 3) {
				if (formData.veutPlusQuestions === 'Oui') {
					showSection4 = true
					currentStep = 4
				} else {
					await submitForm()
				}
			} else if (currentStep === 4) {
				await submitForm()
			} else {
				currentStep++
			}
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--
		}
	}

	async function submitForm() {
		if (currentStep === 4 && !validateStep(4)) {
			return
		}

		isSubmitting = true

		try {
			const response = await fetch('/api/emploi-ia/form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})

			if (response.ok) {
				toast.success(t.emploi_questionnaire.toasts.success)
				const lang = $page.data.lang || 'fr'
				await goto(`/${lang}/emploi-ia/merci`)
			} else {
				toast.error(t.emploi_questionnaire.toasts.error)
			}
		} catch (error) {
			toast.error(t.emploi_questionnaire.toasts.error)
		} finally {
			isSubmitting = false
		}
	}
</script>

<svelte:head>
	<title>{t.emploi_questionnaire.meta_title}</title>
	<meta name="description" content={t.emploi_questionnaire.meta_desc} />
</svelte:head>

<article class="questionnaire-container">
	<h1>{t.emploi_questionnaire.title}</h1>

	<p class="intro">
		{t.emploi_questionnaire.intro}
	</p>

	<div class="progress-bar">
		<div class="progress-step" class:active={currentStep >= 1}>
			<div class="step-number">1</div>
			<div class="step-label">{t.emploi_questionnaire.steps.info}</div>
		</div>
		<div class="progress-step" class:active={currentStep >= 2}>
			<div class="step-number">2</div>
			<div class="step-label">{t.emploi_questionnaire.steps.impact}</div>
		</div>
		<div class="progress-step" class:active={currentStep >= 3}>
			<div class="step-number">3</div>
			<div class="step-label">{t.emploi_questionnaire.steps.witness}</div>
		</div>
		{#if showSection4}
			<div class="progress-step" class:active={currentStep >= 4}>
				<div class="step-number">4</div>
				<div class="step-label">{t.emploi_questionnaire.steps.usage}</div>
			</div>
		{/if}
	</div>

	<form on:submit|preventDefault={nextStep}>
		<!-- Section 1: Informations personnelles -->
		{#if currentStep === 1}
			<section class="form-section">
				<h2>{t.emploi_questionnaire.section1.title}</h2>

				<div class="form-group">
					<label for="sexe">
						{t.emploi_questionnaire.section1.label_sexe}
						<span class="required">{t.emploi_questionnaire.section1.required}</span>
					</label>
					<select id="sexe" bind:value={formData.sexe} required>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						<option value="Femme">{t.emploi_questionnaire.options.sexe.femme}</option>
						<option value="Homme">{t.emploi_questionnaire.options.sexe.homme}</option>
						<option value="Autre">{t.emploi_questionnaire.options.sexe.autre}</option>
					</select>
				</div>

				<div class="form-group">
					<label for="age">
						{t.emploi_questionnaire.section1.label_age}
						<span class="required">{t.emploi_questionnaire.section1.required}</span>
					</label>
					<input
						type="number"
						id="age"
						bind:value={formData.age}
						min="1"
						max="120"
						required
						placeholder={t.emploi_questionnaire.section1.age_placeholder}
					/>
				</div>

				<div class="form-group">
					<label for="statutProfessionnel">
						{t.emploi_questionnaire.section1.label_statut}
						<span class="required">{t.emploi_questionnaire.section1.required}</span>
					</label>
					<select id="statutProfessionnel" bind:value={formData.statutProfessionnel} required>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						<option value="Actif fonctionnaire"
							>{t.emploi_questionnaire.options.statut.fonctionnaire}</option
						>
						<option value="Actif salarié">{t.emploi_questionnaire.options.statut.salarie}</option>
						<option value="Actif indépendant"
							>{t.emploi_questionnaire.options.statut.independant}</option
						>
						<option value="Actif bénévole">{t.emploi_questionnaire.options.statut.benevole}</option>
						<option value="Actif intérimaire / intermittent"
							>{t.emploi_questionnaire.options.statut.interimaire}</option
						>
						<option value="Actif sans emploi / au chômage"
							>{t.emploi_questionnaire.options.statut.chomage}</option
						>
						<option value="Diplômé à la recherche d'un premier emploi"
							>{t.emploi_questionnaire.options.statut.diplome}</option
						>
						<option value="Élève / étudiant / apprenti"
							>{t.emploi_questionnaire.options.statut.etudiant}</option
						>
						<option value="Retraité">{t.emploi_questionnaire.options.statut.retraite}</option>
						<option value="Autre">{t.emploi_questionnaire.options.statut.autre}</option>
					</select>
				</div>

				{#if formData.statutProfessionnel === 'Autre'}
					<div class="form-group">
						<label for="autreStatutProfessionnel"
							>{t.emploi_questionnaire.section1.label_autre_statut}</label
						>
						<input
							type="text"
							id="autreStatutProfessionnel"
							bind:value={formData.autreStatutProfessionnel}
						/>
					</div>
				{/if}

				<div class="form-group">
					<label for="niveauEtudes">{t.emploi_questionnaire.section1.label_etudes}</label>
					<select id="niveauEtudes" bind:value={formData.niveauEtudes}>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						<option value="Ne souhaite pas répondre"
							>{t.emploi_questionnaire.options.etudes.no_answer}</option
						>
						<option value="Aucun diplôme / Brevet des collèges"
							>{t.emploi_questionnaire.options.etudes.aucun_brevet}</option
						>
						<option value="CAP ou bac professionnel"
							>{t.emploi_questionnaire.options.etudes.cap_bac_pro}</option
						>
						<option value="Bac général">{t.emploi_questionnaire.options.etudes.bac_gen}</option>
						<option value="Bac +2 ou bac +3">{t.emploi_questionnaire.options.etudes.bac_2_3}</option
						>
						<option value="Bac +5">{t.emploi_questionnaire.options.etudes.bac_5}</option>
						<option value="> Bac +5">{t.emploi_questionnaire.options.etudes.plus_bac_5}</option>
					</select>
				</div>

				<div class="form-group">
					<label for="secteurActivite">
						{t.emploi_questionnaire.section1.label_secteur}
						<span class="required">{t.emploi_questionnaire.section1.required}</span>
					</label>
					<select id="secteurActivite" bind:value={formData.secteurActivite} required>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						{#each translatedSectors as sector}
							<option value={sector.value}>{sector.label}</option>
						{/each}
					</select>
				</div>

				{#if formData.secteurActivite === 'Autres'}
					<div class="form-group">
						<label for="autreSecteurActivite"
							>{t.emploi_questionnaire.section1.label_autre_secteur}</label
						>
						<input
							type="text"
							id="autreSecteurActivite"
							bind:value={formData.autreSecteurActivite}
						/>
					</div>
				{/if}
				<div class="form-group">
					<label for="profession">{t.emploi_questionnaire.section1.label_profession}</label>
					<input type="text" id="profession" bind:value={formData.profession} />
				</div>
			</section>
		{/if}

		<!-- Section 2: Impact de l'IA -->
		{#if currentStep === 2}
			<section class="form-section">
				<h2>{t.emploi_questionnaire.section2.title}</h2>

				<div class="form-group">
					<label for="frequenceInformation">
						{t.emploi_questionnaire.section2.q21}
					</label>
					<select id="frequenceInformation" bind:value={formData.frequenceInformation}>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						<option value="Ne souhaite pas répondre"
							>{t.emploi_questionnaire.options.frequence_info.no_answer}</option
						>
						<option value="Jamais">{t.emploi_questionnaire.options.frequence_info.jamais}</option>
						<option value="Moins d'une fois par mois, ponctuellement"
							>{t.emploi_questionnaire.options.frequence_info.ponctuel}</option
						>
						<option value="Mensuelle et de façon active"
							>{t.emploi_questionnaire.options.frequence_info.mensuel}</option
						>
						<option value="Hebdomadaire ou équivalent"
							>{t.emploi_questionnaire.options.frequence_info.hebdo}</option
						>
						<option value="Quotidienne ou quasi-quotidienne"
							>{t.emploi_questionnaire.options.frequence_info.quotidien}</option
						>
					</select>
				</div>

				<div class="form-group">
					<label for="impactIA">
						{t.emploi_questionnaire.section2.q22}
					</label>
					<select id="impactIA" bind:value={formData.impactIA}>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						<option value="Ne souhaite pas répondre"
							>{t.emploi_questionnaire.options.impact.no_answer}</option
						>
						<option value="Jamais">{t.emploi_questionnaire.options.impact.jamais}</option>
						<option value="Peu d'impact / Pas tout de suite"
							>{t.emploi_questionnaire.options.impact.peu}</option
						>
						<option
							value="Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
						>
							{t.emploi_questionnaire.options.impact.moyen}
						</option>
						<option value="Fort impact : menace de perte d'emploi transformations difficiles">
							{t.emploi_questionnaire.options.impact.fort}
						</option>
						<option value="Très fort impact : emploi perdu métier disparu compétences inutiles...">
							{t.emploi_questionnaire.options.impact.tres_fort}
						</option>
					</select>
				</div>

				<fieldset class="form-group">
					<legend id="rapportIA-legend">{t.emploi_questionnaire.section2.q23}</legend>
					<div class="radio-group" role="radiogroup" aria-labelledby="rapportIA-legend">
						<label class="radio-label">
							<input
								type="radio"
								bind:group={formData.rapportIA}
								value="Ne souhaite pas répondre"
							/>
							{t.emploi_questionnaire.options.rapport.no_answer}
						</label>
						<label class="radio-label">
							<input
								type="radio"
								bind:group={formData.rapportIA}
								value="L'excitation à l'idée de l'utiliser davantage"
							/>
							{t.emploi_questionnaire.options.rapport.excitation}
						</label>
						<label class="radio-label">
							<input
								type="radio"
								bind:group={formData.rapportIA}
								value="La confiance dans ces nouveaux outils"
							/>
							{t.emploi_questionnaire.options.rapport.confiance}
						</label>
						<label class="radio-label">
							<input
								type="radio"
								bind:group={formData.rapportIA}
								value="Pas de rapport particulier"
							/>
							{t.emploi_questionnaire.options.rapport.aucun}
						</label>
						<label class="radio-label">
							<input
								type="radio"
								bind:group={formData.rapportIA}
								value="L'observation et la prudence"
							/>
							{t.emploi_questionnaire.options.rapport.prudence}
						</label>
						<label class="radio-label">
							<input
								type="radio"
								bind:group={formData.rapportIA}
								value="Le malaise voire l'anxiété"
							/>
							{t.emploi_questionnaire.options.rapport.malaise}
						</label>
						<label class="radio-label">
							<input type="radio" bind:group={formData.rapportIA} value="Un autre rapport" />
							{t.emploi_questionnaire.options.rapport.autre}
						</label>
					</div>
				</fieldset>

				{#if formData.rapportIA === 'Un autre rapport'}
					<div class="form-group">
						<label for="autreRapport">{t.emploi_questionnaire.section2.label_autre_rapport}</label>
						<input type="text" id="autreRapport" bind:value={formData.autreRapport} />
					</div>
				{/if}
			</section>
		{/if}

		<!-- Section 3: Réflexions et témoignage -->
		{#if currentStep === 3}
			<section class="form-section">
				<h2>{t.emploi_questionnaire.section3.title}</h2>

				<div class="form-group">
					<label for="interesseCellule">
						{t.emploi_questionnaire.section3.q31}
					</label>
					<select id="interesseCellule" bind:value={formData.interesseCellule}>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						<option value="Ne souhaite pas répondre"
							>{t.emploi_questionnaire.options.interesse.no_answer}</option
						>
						<option value="Oui">{t.emploi_questionnaire.options.interesse.oui}</option>
						<option value="Non">{t.emploi_questionnaire.options.interesse.non}</option>
						<option value="Ne sais pas">{t.emploi_questionnaire.options.interesse.sais_pas}</option>
					</select>
				</div>
				{#if formData.interesseCellule === 'Oui'}
					<fieldset class="form-group">
						<legend id="objectifsCellule-legend">{t.emploi_questionnaire.section3.q32}</legend>
						<div class="checkbox-group">
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:group={formData.objectifsCellule}
									value="Partager mon expérience / témoigner"
								/>
								{t.emploi_questionnaire.options.objectifs.partager}
							</label>
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:group={formData.objectifsCellule}
									value="Du conseil pour une reconversion / un choix avisé de formation"
								/>
								{t.emploi_questionnaire.options.objectifs.reconversion}
							</label>
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:group={formData.objectifsCellule}
									value="Du soutien psychologique"
								/>
								{t.emploi_questionnaire.options.objectifs.soutien}
							</label>
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:group={formData.objectifsCellule}
									value="De l'information sur mes droits de travailleur"
								/>
								{t.emploi_questionnaire.options.objectifs.droits}
							</label>
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:group={formData.objectifsCellule}
									value="De l'information / échanges sur les avancées de l'IA dans mon métier / secteur / mes compétences"
								/>
								{t.emploi_questionnaire.options.objectifs.avances}
							</label>
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:group={formData.objectifsCellule}
									value="Des moyens d'agir sur ma situation personnelle au travail"
								/>
								{t.emploi_questionnaire.options.objectifs.agir_perso}
							</label>
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:group={formData.objectifsCellule}
									value="Des moyens d'agir sur la société et le monde du travail"
								/>
								{t.emploi_questionnaire.options.objectifs.agir_societe}
							</label>
							<label class="checkbox-label">
								<input type="checkbox" bind:group={formData.objectifsCellule} value="Autre" />
								{t.emploi_questionnaire.options.objectifs.autre}
							</label>
						</div>
					</fieldset>
				{/if}

				{#if formData.objectifsCellule.includes('Autre')}
					<div class="form-group">
						<label for="autreObjectif">{t.emploi_questionnaire.section3.label_autre_objectif}</label
						>
						<input type="text" id="autreObjectif" bind:value={formData.autreObjectif} />
					</div>
				{/if}

				<div class="form-group">
					<label for="temoignage">
						{t.emploi_questionnaire.section3.q33}
					</label>
					<textarea
						id="temoignage"
						bind:value={formData.temoignage}
						rows="6"
						placeholder={t.emploi_questionnaire.section3.placeholder_temoignage}
					></textarea>
				</div>

				{#if formData.temoignage}
					<div class="form-group">
						<label class="checkbox-label consent-checkbox">
							<input type="checkbox" bind:checked={formData.consentementPartage} />
							{t.emploi_questionnaire.section3.consent_label}
						</label>
					</div>

					{#if formData.consentementPartage}
						<div class="form-group">
							<label for="prenom"> {t.emploi_questionnaire.section3.label_prenom} </label>
							<input
								type="text"
								id="prenom"
								bind:value={formData.prenom}
								placeholder={t.emploi_questionnaire.section3.prenom_placeholder}
							/>
							<p class="field-description">
								{t.emploi_questionnaire.section3.prenom_desc}
							</p>
						</div>
					{/if}
				{/if}

				<div class="form-group">
					<label for="email">
						{t.emploi_questionnaire.section3.label_email}
						<span class="required">{t.emploi_questionnaire.section1.required}</span>
					</label>
					<input
						type="email"
						id="email"
						bind:value={formData.email}
						required
						placeholder={t.emploi_questionnaire.section3.email_placeholder}
					/>
					<p class="field-description">
						{t.emploi_questionnaire.section3.email_desc}
					</p>
				</div>

				<div class="form-group">
					<label for="veutPlusQuestions">
						{t.emploi_questionnaire.section3.label_more}
						<span class="required">{t.emploi_questionnaire.section1.required}</span>
					</label>
					<select id="veutPlusQuestions" bind:value={formData.veutPlusQuestions} required>
						<option value="Oui">{t.emploi_questionnaire.options.bool_yes_no.oui}</option>
						<option value="Non">{t.emploi_questionnaire.options.bool_yes_no.non}</option>
					</select>
				</div>
			</section>
		{/if}

		<!-- Section 4: Utilisation de l'IA (conditionnelle) -->
		{#if currentStep === 4 && showSection4}
			<section class="form-section">
				<h2>{t.emploi_questionnaire.section4.title}</h2>

				<div class="form-group">
					<label for="utilisationIA">
						{t.emploi_questionnaire.section4.q41}
					</label>
					<select id="utilisationIA" bind:value={formData.utilisationIA}>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						<option value="Ne souhaite pas répondre"
							>{t.emploi_questionnaire.options.utilisation.no_answer}</option
						>
						<option value="Jamais">{t.emploi_questionnaire.options.utilisation.jamais}</option>
						<option value="Très ponctuellement"
							>{t.emploi_questionnaire.options.utilisation.ponctuel}</option
						>
						<option value="Toutes les semaines"
							>{t.emploi_questionnaire.options.utilisation.hebdo}</option
						>
						<option value="Tous les jours"
							>{t.emploi_questionnaire.options.utilisation.quotidien}</option
						>
						<option value="Toutes mes tâches ou presque"
							>{t.emploi_questionnaire.options.utilisation.toutes_taches}</option
						>
						<option value="Je ne sais pas"
							>{t.emploi_questionnaire.options.utilisation.sais_pas}</option
						>
					</select>
				</div>

				<fieldset class="form-group">
					<legend>{t.emploi_questionnaire.section4.q42}</legend>
					<div class="checkbox-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="Génération d'images, de sons, de vidéos"
							/>
							{t.emploi_questionnaire.options.taches.generation}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="Analyse / Résumé de document (texte, vidéo...)"
							/>
							{t.emploi_questionnaire.options.taches.analyse}
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="Traduction" />
							{t.emploi_questionnaire.options.taches.traduction}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="Correction et rédaction de texte"
							/>
							{t.emploi_questionnaire.options.taches.redaction}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="Automatisation de tâches répétitives"
							/>
							{t.emploi_questionnaire.options.taches.automatisation}
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="Codage" />
							{t.emploi_questionnaire.options.taches.codage}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="Gestion de planning / projet"
							/>
							{t.emploi_questionnaire.options.taches.planning}
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="Analyse de données" />
							{t.emploi_questionnaire.options.taches.donnees}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="Gestion relationnelle (chatbot, mail..)"
							/>
							{t.emploi_questionnaire.options.taches.relationnel}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="Pilotage/contrôle de dispositifs connectés"
							/>
							{t.emploi_questionnaire.options.taches.pilotage}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="Prise de décision / aide à la décision"
							/>
							{t.emploi_questionnaire.options.taches.decision}
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="Autre" />
							{t.emploi_questionnaire.options.taches.autre}
						</label>
					</div>
				</fieldset>

				{#if formData.typeTaches.includes('Autre')}
					<div class="form-group">
						<label for="autreTache">{t.emploi_questionnaire.section4.label_autre_tache}</label>
						<input type="text" id="autreTache" bind:value={formData.autreTache} />
					</div>
				{/if}

				<fieldset class="form-group">
					<legend>{t.emploi_questionnaire.section4.q43}</legend>
					<div class="checkbox-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="Par pure curiosité"
							/>
							{t.emploi_questionnaire.options.raisons.curiosite}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="Suite à une formation / demande de ma direction"
							/>
							{t.emploi_questionnaire.options.raisons.formation}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="Suite aux conseils de mes collègues"
							/>
							{t.emploi_questionnaire.options.raisons.collegues}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="Suite à la pression concurrentielle"
							/>
							{t.emploi_questionnaire.options.raisons.pression}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="Pour pouvoir réaliser toutes mes tâches"
							/>
							{t.emploi_questionnaire.options.raisons.toutes_taches}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="Par manque de compétences"
							/>
							{t.emploi_questionnaire.options.raisons.competences}
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="Pour gagner du temps, être plus efficace"
							/>
							{t.emploi_questionnaire.options.raisons.temps}
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.raisonsUtilisation} value="Autre" />
							{t.emploi_questionnaire.options.raisons.autre}
						</label>
					</div>
				</fieldset>

				{#if formData.raisonsUtilisation.includes('Autre')}
					<div class="form-group">
						<label for="autreRaison">{t.emploi_questionnaire.section4.label_autre_raison}</label>
						<input type="text" id="autreRaison" bind:value={formData.autreRaison} />
					</div>
				{/if}

				<div class="form-group">
					<label for="satisfactionUtilisation">
						{t.emploi_questionnaire.section4.q44}
					</label>
					<select id="satisfactionUtilisation" bind:value={formData.satisfactionUtilisation}>
						<option value="" disabled selected
							>{t.emploi_questionnaire.section1.select_default}</option
						>
						<option value="Ne souhaite pas répondre"
							>{t.emploi_questionnaire.options.satisfaction.no_answer}</option
						>
						<option value="Non je ne sais pas bien l'utiliser"
							>{t.emploi_questionnaire.options.satisfaction.non_utilisation}</option
						>
						<option value="Non les résultats obtenus ne sont pas satisfaisants"
							>{t.emploi_questionnaire.options.satisfaction.non_resultats}</option
						>
						<option value="Oui et non cela dépend des tâches"
							>{t.emploi_questionnaire.options.satisfaction.oui_non}</option
						>
						<option value="Oui c'est un outil de travail précieux"
							>{t.emploi_questionnaire.options.satisfaction.oui_precieux}</option
						>
						<option value="Oui cela décuple mes capacités"
							>{t.emploi_questionnaire.options.satisfaction.oui_capacites}</option
						>
					</select>
				</div>
			</section>
		{/if}

		<!-- Navigation buttons -->
		<div class="form-navigation">
			{#if currentStep > 1}
				<Button type="button" alt on:click={prevStep}>{t.emploi_questionnaire.nav.prev}</Button>
			{/if}
			{#if currentStep < 3 || (currentStep === 3 && formData.veutPlusQuestions === 'Oui') || currentStep === 4}
				<Button type="submit" disabled={isSubmitting}>
					{#if currentStep === 4 || (currentStep === 3 && formData.veutPlusQuestions === 'Non')}
						{isSubmitting
							? t.emploi_ia.feedback_form_submitting
							: t.emploi_questionnaire.nav.submit}
					{:else}
						{t.emploi_questionnaire.nav.next}
					{/if}
				</Button>
			{:else if currentStep === 3 && formData.veutPlusQuestions === 'Non'}
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? t.emploi_ia.feedback_form_submitting : t.emploi_questionnaire.nav.submit}
				</Button>
			{/if}
		</div>
	</form>
</article>

<style>
	.questionnaire-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.intro {
		font-size: 1.1rem;
		margin-bottom: 2rem;
		color: var(--text-secondary);
	}

	.progress-bar {
		display: flex;
		justify-content: space-between;
		margin-bottom: 3rem;
		position: relative;
	}

	.progress-bar::before {
		content: '';
		position: absolute;
		top: 1.25rem;
		left: 0;
		right: 0;
		height: 2px;
		background-color: var(--border);
		z-index: 0;
	}

	.progress-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		position: relative;
		z-index: 1;
		flex: 1;
	}

	.step-number {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: var(--bg);
		border: 2px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.progress-step.active .step-number {
		background-color: var(--brand);
		border-color: var(--brand);
		color: white;
	}

	.step-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
		text-align: center;
	}

	.progress-step.active .step-label {
		color: var(--brand);
		font-weight: 500;
	}

	.form-section {
		background-color: var(--bg);
		padding: 2rem;
		border-radius: 0.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--text);
	}

	.required {
		color: #dc2626;
	}

	input[type='text'],
	input[type='email'],
	input[type='number'],
	select,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.3125rem;
		font-family: var(--font-body);
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	input[type='text']:focus,
	input[type='email']:focus,
	input[type='number']:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(255, 148, 22, 0.1);
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.radio-group,
	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.radio-label,
	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-weight: 400;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s ease;
	}

	.radio-label:hover,
	.checkbox-label:hover {
		background-color: var(--bg-subtle);
	}

	input[type='radio'],
	input[type='checkbox'] {
		margin-top: 0.25rem;
		cursor: pointer;
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.consent-checkbox {
		background-color: var(--brand-light);
		padding: 1rem;
		border-radius: 0.5rem;
		border: 2px solid var(--brand);
	}

	.field-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-top: 0.5rem;
		margin-bottom: 0;
	}

	.form-navigation {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 2rem;
	}

	@media (max-width: 640px) {
		.form-section {
			padding: 1.5rem;
		}

		.step-label {
			font-size: 0.75rem;
		}

		.step-number {
			width: 2rem;
			height: 2rem;
			font-size: 0.875rem;
		}

		.form-navigation {
			flex-direction: column-reverse;
		}

		.form-navigation :global(button),
		.form-navigation :global(a) {
			width: 100%;
		}
	}
</style>
