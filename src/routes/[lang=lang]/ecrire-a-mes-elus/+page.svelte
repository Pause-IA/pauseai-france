<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { onMount } from 'svelte'
	import { lookupElus, isSampleData, type Elu, type LookupResult } from '$lib/data/elus'
	import { getEluAction, type FixedTarget } from '$lib/data/elu-actions'
	import type { PageData } from './$types'

	export let data: PageData
	$: lang = data.lang
	$: isEn = lang === 'en'

	const BCC = 'campagne@pauseia.fr'

	// ── Action courante (moteur de campagnes) : sélectionnée par ?action=<id> ──
	// La page est prérendue : on ne peut pas lire le query string au build (il
	// servirait l'action « default »). On lit donc ?action côté client au montage,
	// puis l'action ciblée remplace l'action par défaut. Une action « fixed »
	// cible des destinataires précis, sinon ce sont les élus de l'utilisateur.
	let actionId: string | null = null
	$: action = getEluAction(actionId)

	// Indices tirés au hasard une fois par action (objet + accroche tournants).
	let hookIndex = 0
	let subjectIndex = 0
	let angle = ''
	let seededFor = ''
	$: if (action.id !== seededFor) {
		seededFor = action.id
		hookIndex = Math.floor(Math.random() * action.hooks.length)
		subjectIndex = Math.floor(Math.random() * action.subjects.length)
		angle = action.angles[0].id
	}

	type Version = 'short' | 'long'
	let version: Version = 'short'
	$: if (!action.hasDetailed && version !== 'short') version = 'short'

	$: subject = (() => {
		const s = action.subjects[subjectIndex] ?? action.subjects[0]
		return isEn ? s.en : s.fr
	})()

	// ── Vocabulaire selon la cible (élus vs destinataires) ──
	$: targetNoun = isEn
		? action.targeting === 'fixed'
			? 'recipients'
			: 'representatives'
		: action.targeting === 'fixed'
			? 'destinataires'
			: 'élus'

	// ── Étape du parcours : 1 = choisir le destinataire, 2 = rédiger le mail ──
	let step: 1 | 2 = 1
	let selectedRecipient: Recipient | null = null

	// ── Destinataire normalisé (élu OU cible fixe) ──
	type RecipientRole = 'depute' | 'senateur' | 'ministre' | 'autre'
	interface Recipient {
		id: string
		nom: string
		civ?: 'M' | 'Mme' | null
		role: RecipientRole
		email: string | null
		contactUrl: string | null
		photo: string | null
		subtitle: string
		introKind: 'depute' | 'senateur' | 'generic'
		signatureLocality: string
		salutationOverride?: string
		emailConfidence: 'high' | 'medium' | 'low' | 'none'
	}

	function eluLocalite(elu: Elu): string {
		return elu.role === 'depute'
			? (elu.nomCirco ?? `${isEn ? 'department' : 'département'} ${elu.departement}`)
			: (elu.nomDept ?? `${isEn ? 'department' : 'département'} ${elu.departement}`)
	}

	function eluSubtitle(elu: Elu): string {
		const base =
			elu.role === 'depute'
				? (elu.nomCirco ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
				: (elu.nomDept ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
		return elu.groupe && elu.groupe !== '—' ? `${base} · ${elu.groupe}` : base
	}

	function fromElu(elu: Elu): Recipient {
		return {
			id: elu.id,
			nom: elu.nom,
			civ: elu.civ ?? null,
			role: elu.role,
			email: elu.email,
			contactUrl: elu.contactUrl ?? null,
			photo: elu.photo ?? null,
			subtitle: eluSubtitle(elu),
			introKind: elu.role === 'depute' ? 'depute' : 'senateur',
			signatureLocality: eluLocalite(elu),
			emailConfidence: elu.emailConfidence
		}
	}

	function fromFixed(ft: FixedTarget): Recipient {
		return {
			id: ft.id,
			nom: ft.nom,
			civ: ft.civ ?? null,
			role: ft.role,
			email: ft.email,
			contactUrl: ft.contactUrl ?? null,
			photo: ft.photo ?? null,
			subtitle: ft.fonction ? (isEn ? ft.fonction.en : ft.fonction.fr) : '',
			introKind: 'generic',
			signatureLocality: 'France',
			salutationOverride: ft.salutation ? (isEn ? ft.salutation.en : ft.salutation.fr) : undefined,
			emailConfidence: ft.email ? 'high' : 'none'
		}
	}

	// ── Recherche des élus par code postal (mode 'representatives') ──
	let codePostal = ''
	let result: LookupResult | null = null
	let searched = false
	let searchError: 'format' | 'notfound' | null = null

	function search() {
		searched = true
		const clean = codePostal.replace(/\s/g, '')
		if (!/^\d{5}$/.test(clean)) {
			result = null
			searchError = 'format'
			return
		}
		result = lookupElus(clean)
		searchError = result ? null : 'notfound'
	}

	// ── Groupes de destinataires affichés (commun aux deux modes) ──
	$: deputeTitle = !result?.exactDeputes
		? isEn
			? 'The MPs of your department'
			: 'Les députés de votre département'
		: (result?.deputes.length ?? 0) > 1
			? isEn
				? 'Your MPs (your city)'
				: 'Vos députés (votre ville)'
			: isEn
				? 'Your MP'
				: 'Votre député'

	$: recipientGroups =
		action.targeting === 'fixed'
			? action.fixedTargets && action.fixedTargets.length
				? [
						{
							title: action.targetsHeading
								? isEn
									? action.targetsHeading.en
									: action.targetsHeading.fr
								: isEn
									? 'Recipients'
									: 'Destinataires',
							list: action.fixedTargets.map(fromFixed)
						}
					]
				: []
			: result
				? [
						{
							title: isEn ? 'Your senators' : 'Vos sénateurs',
							list: result.senateurs.map(fromElu)
						},
						{ title: deputeTitle, list: result.deputes.map(fromElu) }
					]
				: []

	$: allRecipients = recipientGroups.flatMap((g) => g.list)
	$: sentCount = allRecipients.filter((r) => sent.has(r.id)).length

	function choose(r: Recipient) {
		selectedRecipient = r
		step = 2
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
	}

	function back() {
		step = 1
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
	}

	// Formule d'appel (civilité + titre selon le rôle, ou formule sur mesure).
	function salutation(r: Recipient): string {
		if (r.salutationOverride) return r.salutationOverride
		if (isEn) return `Dear ${r.nom},`
		if (r.role === 'depute') {
			if (r.civ === 'Mme') return 'Madame la Députée,'
			if (r.civ === 'M') return 'Monsieur le Député,'
			return 'Madame, Monsieur le Député,'
		}
		if (r.role === 'senateur') {
			if (r.civ === 'Mme') return 'Madame la Sénatrice,'
			if (r.civ === 'M') return 'Monsieur le Sénateur,'
			return 'Madame, Monsieur le Sénateur,'
		}
		if (r.role === 'ministre') {
			if (r.civ === 'Mme') return 'Madame la Ministre,'
			if (r.civ === 'M') return 'Monsieur le Ministre,'
			return 'Madame, Monsieur le Ministre,'
		}
		return 'Madame, Monsieur,'
	}

	// 1re phrase : ouverture naturelle qui signale le lien avec le destinataire.
	// `name` est passé explicitement pour que Svelte recalcule l'aperçu à la frappe.
	function introLine(r: Recipient, name: string): string {
		const nom = name.trim() || (isEn ? '[your name]' : '[votre nom]')
		if (r.introKind === 'generic') {
			return isEn
				? `My name is ${nom}, and I am writing to you as a concerned French citizen.`
				: `Je m'appelle ${nom} et je vous écris en tant que citoyen préoccupé.`
		}
		if (isEn) {
			return r.introKind === 'depute'
				? `My name is ${nom}, and I am writing to you as one of your constituents.`
				: `My name is ${nom}, and I am writing to you as a resident of your department.`
		}
		return r.introKind === 'depute'
			? `Je m'appelle ${nom} et je vous écris en tant qu'habitant de votre circonscription.`
			: `Je m'appelle ${nom} et je vous écris en tant qu'habitant de votre département.`
	}

	// Compose les paragraphes du corps selon l'angle, la longueur et la phrase perso.
	function buildParagraphs(angleId: string, v: Version, personal: string): string[] {
		const L = isEn ? 'en' : 'fr'
		const ang = action.angles.find((a) => a.id === angleId) ?? action.angles[0]
		const hook = action.hooks[hookIndex] ?? action.hooks[0]
		const paras = [hook[L], ang.focus[L]]
		if (v === 'long') {
			if (ang.complementLong) paras.push(ang.complementLong[L])
			if (action.poll) paras.push(action.poll[L])
		}
		if (personal.trim()) paras.push(personal.trim())
		paras.push(action.balance[L])
		paras.push(action.ask[L])
		return paras
	}

	// L'aperçu (#email-body) est déjà personnalisé : on en prend le texte brut.
	function buildBody(): string {
		const el = document.getElementById('email-body')
		return el ? el.innerText : ''
	}

	function mailtoHref(r: Recipient): string {
		const params = new URLSearchParams({ subject, bcc: BCC, body: buildBody() })
		// URLSearchParams encode les espaces en "+", à reconvertir en %20 pour mailto.
		return `mailto:${r.email ?? ''}?${params.toString().replace(/\+/g, '%20')}`
	}

	// ── Infos utilisateur. Nom, ville et phrase ne quittent jamais l'appareil
	// (mémorisés localement). L'email n'est transmis QUE si l'utilisateur coche
	// explicitement l'inscription à la newsletter (voir subscribeNewsletter). ──
	let userName = ''
	let userVille = ''
	let userEmail = ''
	let personalSentence = ''
	function saveUser() {
		try {
			localStorage.setItem(
				'elus-user',
				JSON.stringify({ userName, userVille, userEmail, personalSentence })
			)
		} catch {
			/* localStorage indisponible */
		}
	}

	// ── Opt-in newsletter : capture (avec consentement) des personnes qui agissent.
	let wantsNewsletter = false
	let newsletterStatus: 'idle' | 'sending' | 'done' | 'error' = 'idle'
	function emailValid(v: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
	}
	async function subscribeNewsletter() {
		if (!emailValid(userEmail)) {
			newsletterStatus = 'error'
			return
		}
		newsletterStatus = 'sending'
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: userEmail.trim(),
					subscribeNewsletter: true,
					subscribeSubstack: false,
					firstName: userName.trim() || undefined,
					source: `ecrire-a-mes-elus${action.id === 'default' ? '' : `:${action.id}`}`
				})
			})
			newsletterStatus = res.ok ? 'done' : 'error'
		} catch {
			newsletterStatus = 'error'
		}
	}

	// ── Suivi de progression (mémorisé localement, par action) ──
	$: sentKey = action.id === 'default' ? 'elus-contactes' : `elus-contactes:${action.id}`
	let sent = new Set<string>()
	let mounted = false
	onMount(() => {
		actionId = new URLSearchParams(window.location.search).get('action')
		try {
			const u = JSON.parse(localStorage.getItem('elus-user') ?? '{}')
			userName = u.userName ?? ''
			userVille = u.userVille ?? ''
			userEmail = u.userEmail ?? ''
			personalSentence = u.personalSentence ?? ''
		} catch {
			/* localStorage indisponible */
		}
		mounted = true
	})
	function loadSent(key: string) {
		try {
			sent = new Set(JSON.parse(localStorage.getItem(key) ?? '[]'))
		} catch {
			sent = new Set()
		}
	}
	// Recharge la progression quand l'action (donc la clé) change.
	$: if (mounted) loadSent(sentKey)

	function markSent(id: string) {
		sent = new Set(sent).add(id)
		try {
			localStorage.setItem(sentKey, JSON.stringify([...sent]))
		} catch {
			/* localStorage indisponible : on ignore */
		}
	}

	// Remet à zéro la progression (les coches « Écrit ✓ »). Garde le nom / la ville.
	function resetProgress() {
		sent = new Set()
		try {
			localStorage.removeItem(sentKey)
		} catch {
			/* localStorage indisponible : on ignore */
		}
	}

	// Journalise l'intention d'envoi côté serveur, sans donnée personnelle.
	// `sendBeacon` survit à la navigation immédiate vers le client mail. Ce n'est
	// pas une preuve d'envoi (c'est le clic) : le compteur fiable reste le BCC.
	function logIntent(r: Recipient) {
		if (typeof navigator === 'undefined' || !navigator.sendBeacon) return
		try {
			const payload = JSON.stringify({
				action: action.id,
				eluId: r.id,
				eluNom: r.nom,
				role: r.role,
				angle,
				version
			})
			navigator.sendBeacon('/api/log-intent', new Blob([payload], { type: 'application/json' }))
		} catch {
			/* journalisation best-effort : on ignore toute erreur */
		}
	}

	function openMail() {
		if (!selectedRecipient) return
		markSent(selectedRecipient.id)
		logIntent(selectedRecipient)
		window.location.href = mailtoHref(selectedRecipient)
	}

	function confidenceNote(r: Recipient): string | null {
		if (r.emailConfidence === 'high' || r.emailConfidence === 'medium') return null
		if (!r.email) return null // cas « pas d'email » traité par une note dédiée
		if (isEn) return 'Please double-check this address before sending.'
		return "Vérifiez l'adresse avant l'envoi."
	}

	// Masque une photo qui ne charge pas (404) → les initiales restent visibles.
	function hideImg(e: Event) {
		;(e.currentTarget as HTMLImageElement).style.display = 'none'
	}

	function initials(r: Recipient): string {
		const parts = r.nom.trim().split(/\s+/)
		const first = parts[0]?.[0] ?? ''
		const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
		return (first + last).toUpperCase()
	}

	$: joinHref = isEn ? '/en/rejoindre' : '/fr/rejoindre'

	let copied = false
	function copyEmail() {
		const el = document.getElementById('email-body')
		if (!el) return
		void navigator.clipboard.writeText(el.innerText).then(() => {
			copied = true
			setTimeout(() => {
				copied = false
			}, 2500)
		})
	}
</script>

<PostMeta
	title={isEn ? action.meta.title.en : action.meta.title.fr}
	description={isEn ? action.meta.description.en : action.meta.description.fr}
/>

<article>
	{#if step === 1}
		<!-- ════════ Étape 1 : choisir le destinataire ════════ -->
		<header class="hero-band">
			<div class="hero-inner">
				<h1>{isEn ? action.hero.title.en : action.hero.title.fr}</h1>
				<p class="hero-sub">{isEn ? action.hero.subtitle.en : action.hero.subtitle.fr}</p>
			</div>
		</header>

		<section class="card">
			<h2>
				<span class="step-num">1</span>{#if action.targeting === 'fixed'}{isEn
						? 'Your recipients'
						: 'Vos destinataires'}{:else}{isEn
						? 'Find your representatives'
						: 'Trouvez vos élus'}{/if}
			</h2>

			{#if action.targeting !== 'fixed'}
				<form class="cp-form" on:submit|preventDefault={search}>
					<input
						class="cp-input"
						type="text"
						inputmode="numeric"
						maxlength="5"
						placeholder={isEn ? 'Your postal code (e.g. 75011)' : 'Votre code postal (ex. 75011)'}
						bind:value={codePostal}
						aria-label={isEn ? 'Postal code' : 'Code postal'}
					/>
					<Button type="submit">{isEn ? 'Find' : 'Rechercher'}</Button>
				</form>
			{/if}

			<!-- Vos infos : saisies une seule fois, elles remplissent chaque mail
			     (jamais envoyées à un serveur, mémorisées sur votre appareil). -->
			<div class="user-fields">
				<input
					class="user-input"
					type="text"
					placeholder={isEn ? 'Your full name' : 'Votre nom complet'}
					autocomplete="name"
					bind:value={userName}
					on:input={saveUser}
				/>
				<input
					class="user-input"
					type="text"
					placeholder={isEn ? 'Your town' : 'Votre ville'}
					bind:value={userVille}
					on:input={saveUser}
				/>
			</div>

			{#if isSampleData && action.targeting !== 'fixed'}
				<p class="notice notice--warn">
					{isEn
						? 'Demo data. Run the generation script to load real representatives and emails.'
						: "Données d'exemple. Lancez le script de génération pour charger les vrais élus et emails."}
				</p>
			{/if}

			{#if action.targeting !== 'fixed'}
				{#if searchError === 'format'}
					<p class="notice notice--error">
						{isEn
							? 'A French postal code has 5 digits (e.g. 75011). Please check what you typed.'
							: 'Un code postal français comporte 5 chiffres (ex. 75011). Vérifiez votre saisie.'}
					</p>
				{:else if searchError === 'notfound'}
					<p class="notice notice--error">
						{isEn
							? 'No representative found for this postal code. Double-check it, or use the official directories below.'
							: 'Aucun élu trouvé pour ce code postal. Vérifiez-le, ou utilisez les annuaires officiels ci-dessous.'}
					</p>
				{/if}
			{/if}

			{#if recipientGroups.length}
				<p class="results-hint" class:done-all={sentCount > 0 && sentCount >= allRecipients.length}>
					{#if sentCount >= allRecipients.length && allRecipients.length > 0}
						🎉 {isEn
							? `Done! You've written to all ${allRecipients.length} ${targetNoun}. Thank you, this really helps.`
							: `Bravo ! Vous avez écrit à vos ${allRecipients.length} ${targetNoun}. Merci, votre geste compte vraiment.`}
					{:else if sentCount > 0}
						<strong>{sentCount}/{allRecipients.length}</strong>
						{isEn ? 'contacted.' : 'contactés.'}
						{isEn
							? 'Keep going with the others, each message counts.'
							: 'Continuez avec les autres, chaque message compte.'}
					{:else}
						{isEn
							? `Write to each of your ${targetNoun}: one personal email each.`
							: `Écrivez à chacun de vos ${targetNoun} : un email personnel pour chaque.`}
					{/if}
				</p>
				{#if sentCount >= allRecipients.length && allRecipients.length > 0}
					<a class="join-link join-link--block" href={joinHref}>
						{isEn
							? 'Want to do more? Join Pause AI ↗'
							: 'Envie d’aller plus loin ? Rejoignez Pause IA ↗'}
					</a>
				{/if}
				{#each recipientGroups as group}
					{#if group.list.length}
						<div class="elu-group">
							<h3>{group.title}</h3>
							<ul class="elu-list">
								{#each group.list as r (r.id)}
									<li class="elu-card" class:done={sent.has(r.id)}>
										<div class="elu-left">
											<span class="avatar">
												{initials(r)}
												{#if r.photo}
													<img src={r.photo} alt="" loading="lazy" on:error={hideImg} />
												{/if}
											</span>
											<div class="elu-info">
												<strong>
													{#if sent.has(r.id)}<span class="done-check">✓</span>{/if}{r.nom}
												</strong>
												{#if r.subtitle}<small>{r.subtitle}</small>{/if}
											</div>
										</div>
										<Button alt={sent.has(r.id)} on:click={() => choose(r)}>
											{#if sent.has(r.id)}
												{isEn ? 'Written ✓' : 'Écrit ✓'}
											{:else}
												{isEn ? 'Write' : 'Écrire'}
											{/if}
										</Button>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
				{#if sentCount > 0}
					<button class="reset-link" on:click={resetProgress}>
						{isEn ? 'Reset my progress' : 'Réinitialiser ma progression'}
					</button>
				{/if}
			{/if}

			{#if action.targeting !== 'fixed' && searched && !result}
				<details class="manual-fallback" open>
					<summary>
						{isEn ? 'Official directories' : 'Annuaires officiels'}
					</summary>
					<div class="find-links">
						<a
							class="find-btn"
							href="https://www.assemblee-nationale.fr/dyn/vos-deputes/carte-departements"
							target="_blank"
							rel="noopener noreferrer"
						>
							🏛️ {isEn ? 'Find my MP' : 'Trouver mon député'} · assemblee-nationale.fr
						</a>
						<a
							class="find-btn"
							href="https://www.senat.fr/vos-senateurs.html"
							target="_blank"
							rel="noopener noreferrer"
						>
							🏛️ {isEn ? 'Find my senator(s)' : 'Trouver mon/mes sénateurs'} · senat.fr
						</a>
					</div>
				</details>
			{/if}
		</section>

		<!-- Pourquoi c'est important -->
		<section class="card prose">
			<h2>{isEn ? 'Why it matters' : "Pourquoi c'est important"}</h2>
			{#if isEn}
				<p>
					MPs and senators take their constituents' messages into account. A personal email (even a
					short, sincere one) lands in a human inbox, gets read, and signals that a voter cares
					about this issue. Unlike a petition or a social media post, it carries real weight. A
					handful of emails from real citizens is often enough to put a topic on a committee's
					agenda.
				</p>
			{:else}
				<p>
					Les députés et sénateurs prennent en compte les messages de leurs électeurs. Un email
					personnel (même court et sincère) arrive dans une boite mail humaine, il est lu, et il
					signale qu'un électeur se préoccupe du sujet. Contrairement à une pétition ou à un post
					sur les réseaux, il a un vrai poids. Une poignée d'emails de vrais citoyens suffit souvent
					à inscrire un sujet à l'ordre du jour d'une commission.
				</p>
			{/if}
		</section>

		<!-- FAQ -->
		<section class="card faq">
			<h2>{isEn ? 'FAQ' : 'Questions fréquentes'}</h2>
			<Accordion id="faq-difference" noHash>
				<span slot="head">
					{isEn
						? 'Does contacting a representative really make a difference?'
						: 'Est-ce que contacter un élu change vraiment quelque chose ?'}
				</span>
				<p slot="details">
					{isEn
						? 'Yes! Representatives track how many constituents raise an issue, and it shapes what they prioritise. A few sincere emails can be enough to get a topic onto a committee’s agenda.'
						: "Oui ! Les élus comptabilisent le nombre d'électeurs qui soulèvent un sujet, et cela oriente leurs priorités. Quelques emails sincères peuvent suffire à inscrire un sujet à l'ordre du jour d'une commission."}
				</p>
			</Accordion>
			<Accordion id="faq-duree" noHash>
				<span slot="head">{isEn ? 'How long does it take?' : 'Combien de temps ça prend ?'}</span>
				<p slot="details">
					{isEn
						? 'About two minutes. Enter your name, pick a recipient, and send.'
						: 'Environ deux minutes. Indiquez votre nom, choisissez un destinataire, puis envoyez.'}
				</p>
			</Accordion>
			<Accordion id="faq-donnees" noHash>
				<span slot="head">
					{isEn ? 'What about my data?' : 'Et mes données ?'}
				</span>
				<p slot="details">
					{isEn
						? 'Your name and town stay on your device and are never sent to a server: they only fill the draft. The email leaves from your own mailbox. A blind copy (BCC) reaches us at campagne@pauseia.fr to count the campaign; you can remove it before sending if you prefer. Your email address is only sent to us if you tick the newsletter box yourself, to subscribe you.'
						: "Votre nom et votre ville restent sur votre appareil et ne sont jamais envoyés à un serveur : ils servent seulement à remplir le brouillon. L'email part de votre propre messagerie. Une copie cachée (CCI) nous parvient à campagne@pauseia.fr pour mesurer la campagne ; vous pouvez la retirer avant l'envoi si vous le préférez. Votre adresse email ne nous est transmise que si vous cochez vous-même l'inscription à la newsletter, pour vous y abonner."}
				</p>
			</Accordion>
			<Accordion id="faq-relance" noHash>
				<span slot="head">
					{isEn ? "What if I don't get a reply?" : "Et si je n'ai pas de réponse ?"}
				</span>
				<p slot="details">
					{isEn
						? "That's common, and not a reason to give up. Follow up politely after about three weeks: a reminder shows the topic matters to you and often prompts a reply. You can also ask for a short meeting at their local office."
						: "C'est fréquent, et ce n'est pas une raison d'abandonner. Relancez poliment après environ trois semaines : une relance montre que le sujet vous tient à cœur et débloque souvent une réponse. Vous pouvez aussi demander un rendez-vous à leur permanence."}
				</p>
			</Accordion>
		</section>
	{:else if selectedRecipient}
		<!-- ════════ Étape 2 : rédiger le mail ════════ -->
		<button class="back-link" on:click={back}>
			← {isEn ? `Back to my ${targetNoun}` : `Retour à mes ${targetNoun}`}
		</button>

		<section class="card">
			<h2>
				<span class="step-num">2</span>{isEn ? 'Your message' : 'Votre message'}
			</h2>

			<div class="recipient">
				<span class="avatar avatar--lg">
					{initials(selectedRecipient)}
					{#if selectedRecipient.photo}
						<img src={selectedRecipient.photo} alt="" on:error={hideImg} />
					{/if}
				</span>
				<div>
					<span class="recipient-label">{isEn ? 'To:' : 'À :'}</span>
					<strong>{selectedRecipient.nom}</strong>
					{#if selectedRecipient.subtitle}<small>{selectedRecipient.subtitle}</small>{/if}
					{#if selectedRecipient.contactUrl}
						<a
							class="profile-link"
							href={selectedRecipient.contactUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{isEn ? 'View official profile ↗' : 'Voir sa fiche officielle ↗'}
						</a>
					{/if}
				</div>
			</div>

			{#if !userName.trim()}
				<p class="card-intro">
					{#if isEn}
						Tip: add your name and town in step 1 and the email writes itself in full.
					{:else}
						Astuce : indiquez votre nom et votre ville à l'étape 1 et l'email se rédige entièrement.
					{/if}
				</p>
			{/if}

			<!-- Réglages compacts : sujet et longueur sur une même ligne -->
			<div class="msg-controls">
				<div class="control">
					<span class="control-label">{isEn ? 'Focus' : 'Sujet principal'}</span>
					<div class="theme-chips" role="group" aria-label={isEn ? 'Focus' : 'Sujet principal'}>
						{#each action.angles as a}
							<button
								class="chip"
								class:active={angle === a.id}
								aria-pressed={angle === a.id}
								on:click={() => (angle = a.id)}
							>
								{isEn ? a.label.en : a.label.fr}
							</button>
						{/each}
					</div>
				</div>
				{#if action.hasDetailed}
					<div class="control">
						<span class="control-label">{isEn ? 'Length' : 'Longueur'}</span>
						<div class="segmented" role="group" aria-label={isEn ? 'Length' : 'Longueur'}>
							<button
								class:active={version === 'short'}
								aria-pressed={version === 'short'}
								on:click={() => (version = 'short')}
							>
								{isEn ? 'Short' : 'Courte'}
							</button>
							<button
								class:active={version === 'long'}
								aria-pressed={version === 'long'}
								on:click={() => (version = 'long')}
							>
								{isEn ? 'Detailed' : 'Détaillée'}
							</button>
						</div>
					</div>
				{/if}
			</div>

			<label class="perso-field">
				<span class="perso-label">
					{isEn ? 'Add a personal sentence' : 'Ajoutez une phrase personnelle'}
					<em>{isEn ? 'recommended' : 'recommandé'}</em>
				</span>
				<textarea
					class="perso-input"
					rows="2"
					placeholder={isEn
						? 'Why this matters to you. An authentic line carries far more weight.'
						: 'Pourquoi cela vous touche. Une phrase sincère pèse bien plus lourd.'}
					bind:value={personalSentence}
					on:input={saveUser}
				></textarea>
			</label>

			<!-- Aperçu de l'email -->
			<div class="email-preview">
				<div class="email-subject-line">
					<span class="subject-label">{isEn ? 'Subject:' : 'Objet :'}</span>
					<span>{subject}</span>
				</div>
				<div class="email-body" id="email-body">
					<p>{salutation(selectedRecipient)}</p>
					<p>{introLine(selectedRecipient, userName)}</p>
					{#each buildParagraphs(angle, version, personalSentence) as para}
						<p>{para}</p>
					{/each}
					<p>
						{isEn ? 'Yours sincerely,' : 'Cordialement,'}<br />
						{userName.trim() || (isEn ? '[Your full name]' : '[Votre nom complet]')}<br />
						{userVille.trim() || selectedRecipient.signatureLocality}
					</p>
				</div>
			</div>

			{#if confidenceNote(selectedRecipient)}
				<p class="notice notice--warn">{confidenceNote(selectedRecipient)}</p>
			{/if}

			{#if !selectedRecipient.email}
				<p class="notice notice--info">
					{#if selectedRecipient.contactUrl}
						{isEn
							? 'This recipient does not publish an email address. Copy the text above, open their contact form, and paste it there.'
							: "Ce destinataire ne publie pas d'adresse email. Copiez le texte ci-dessus, ouvrez son formulaire de contact, puis collez-le."}
					{:else}
						{isEn
							? 'No public email or contact form was found for this recipient. Copy the text above and reach them via their official profile.'
							: "Aucun email ni formulaire public n'a été trouvé pour ce destinataire. Copiez le texte ci-dessus et contactez-le via sa fiche officielle."}
					{/if}
				</p>
			{/if}

			<div class="send-row">
				{#if selectedRecipient.email}
					<Button on:click={openMail}>{isEn ? 'Open my email' : 'Ouvrir mon email'}</Button>
				{:else if selectedRecipient.contactUrl}
					<Button href={selectedRecipient.contactUrl} target="_blank" rel="noopener noreferrer">
						{isEn ? 'Open contact form' : 'Ouvrir le formulaire'}
					</Button>
				{/if}
				<Button alt on:click={copyEmail}>
					{#if copied}
						{isEn ? '✓ Copied' : '✓ Copié'}
					{:else}
						{isEn ? 'Copy text' : 'Copier le texte'}
					{/if}
				</Button>
			</div>

			{#if selectedRecipient.email}
				<p class="deliverability">
					{isEn
						? 'Send from your personal mailbox: an email from a real constituent carries far more weight than a form. Check the recipient before sending.'
						: 'Envoyez depuis votre messagerie personnelle : un email d’un vrai électeur a bien plus de poids qu’un formulaire. Vérifiez le destinataire avant l’envoi.'}
				</p>

				<p class="bcc-hint">
					{isEn ? 'BCC' : 'CCI'} <code>{BCC}</code>
					{isEn ? '(helps us count letters sent)' : '(pour compter les emails envoyés)'}
				</p>
			{/if}

			<!-- Opt-in newsletter (consentement explicite) -->
			{#if newsletterStatus === 'done'}
				<p class="newsletter-done">
					{isEn
						? '✓ Thank you! You will receive our next actions.'
						: '✓ Merci ! Vous recevrez nos prochaines actions.'}
				</p>
			{:else}
				<div class="newsletter-optin">
					<label class="newsletter-check">
						<input type="checkbox" bind:checked={wantsNewsletter} />
						<span>
							{isEn
								? 'Keep me posted about the next actions (Pause AI newsletter).'
								: 'Tenez-moi informé des prochaines actions (newsletter Pause IA).'}
						</span>
					</label>
					{#if wantsNewsletter}
						<div class="newsletter-row">
							<input
								class="newsletter-input"
								type="email"
								placeholder={isEn ? 'your@email.com' : 'votre@email.com'}
								autocomplete="email"
								bind:value={userEmail}
								on:input={saveUser}
							/>
							<Button on:click={subscribeNewsletter}>
								{newsletterStatus === 'sending'
									? isEn
										? 'Sending…'
										: 'Envoi…'
									: isEn
										? 'Subscribe'
										: "S'inscrire"}
							</Button>
						</div>
						{#if newsletterStatus === 'error'}
							<p class="newsletter-error">
								{isEn
									? 'Please enter a valid email address.'
									: 'Veuillez entrer une adresse email valide.'}
							</p>
						{/if}
					{/if}
				</div>
			{/if}

			{#if sent.has(selectedRecipient.id)}
				<div class="after-send">
					<p>
						{isEn
							? `Message ready! Go back to write to your other ${targetNoun}.`
							: `Message prêt ! Revenez en arrière pour écrire à vos autres ${targetNoun}.`}
					</p>
					<a class="join-link" href={joinHref}>
						{isEn
							? 'Want to do more? Join Pause AI ↗'
							: 'Envie d’aller plus loin ? Rejoignez Pause IA ↗'}
					</a>
				</div>
			{/if}
		</section>
	{/if}
</article>

<style>
	article {
		max-inline-size: 50rem;
		margin-inline: auto;
		margin-top: 2.5rem;
		padding: 0 1.25rem 5rem;
	}

	/* Hero coloré pleine largeur (full-bleed : déborde de la largeur de l'article) */
	.hero-band {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-top: -2.5rem; /* annule le margin-top de l'article */
		margin-bottom: 2.75rem;
		padding: 3.5rem 1.25rem 3.25rem;
		background: var(--brand);
		text-align: center;
	}

	.hero-inner {
		max-inline-size: 44rem;
		margin-inline: auto;
	}

	.hero-band h1 {
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 800;
		line-height: 1.05;
		margin: 0 0 1rem;
		color: #1a1a1a;
	}

	.hero-sub {
		font-size: clamp(1rem, 2.2vw, 1.2rem);
		line-height: 1.5;
		margin: 0 auto;
		max-inline-size: 36rem;
		color: #3a2600;
		font-weight: 500;
	}

	/* Cards */
	.card {
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 1.75rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.card h2 {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 1rem;
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 1.7rem;
		block-size: 1.7rem;
		border-radius: 50%;
		background: var(--brand);
		color: #1a1a1a;
		font-size: 0.95rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.card-intro {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-2);
		margin-bottom: 1.25rem;
	}

	/* Champs nom / commune */
	.user-fields {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.75rem;
	}

	.user-input {
		flex: 1;
		min-inline-size: 180px;
		padding: 0.7rem 0.9rem;
		border: 2px solid var(--border);
		border-radius: 9px;
		font-size: 0.95rem;
		background: var(--bg);
		color: var(--text);
	}

	.user-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	/* Recherche code postal */
	.cp-form {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.cp-input {
		flex: 1;
		min-inline-size: 200px;
		padding: 0.85rem 1rem;
		border: 2px solid var(--border);
		border-radius: 10px;
		font-size: 1.05rem;
		background: var(--bg);
		color: var(--text);
	}

	.cp-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	/* Notices */
	.notice {
		font-size: 0.9rem;
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
		margin-top: 0.85rem;
	}

	.notice--warn {
		color: var(--brand-subtle);
		background: var(--brand-light);
		border: 1px solid var(--brand);
	}

	.notice--error {
		color: #c0392b;
		background: #fdecee;
		border: 1px solid #f6c6cc;
	}

	.notice--info {
		color: var(--text-2);
		background: var(--bg-card);
		border: 1px solid var(--border);
	}

	/* Lien discret « Réinitialiser ma progression » */
	.reset-link {
		display: inline-block;
		margin-top: 1.25rem;
		padding: 0;
		background: none;
		border: none;
		font-size: 0.82rem;
		color: var(--text-secondary);
		text-decoration: underline;
		cursor: pointer;
	}

	.reset-link:hover {
		color: var(--brand-subtle);
	}

	.results-hint {
		margin-top: 1.25rem;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.results-hint.done-all {
		font-size: 1rem;
		font-weight: 600;
		color: var(--brand-subtle);
		background: var(--brand-light);
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
	}

	/* Élus */
	.elu-group {
		margin-top: 1rem;
	}

	.elu-group h3 {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
		margin: 0 0 0.5rem;
	}

	.elu-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.elu-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 1rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--bg-card);
		transition: opacity 0.15s;
	}

	.elu-card.done {
		opacity: 0.7;
		background: var(--brand-light);
		border-color: var(--brand);
	}

	.done-check {
		color: #2a9d5c;
		font-weight: 700;
		margin-right: 0.35rem;
	}

	/* Avatar (photo ou initiales) */
	.elu-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-inline-size: 0;
	}

	.avatar {
		position: relative;
		flex-shrink: 0;
		inline-size: 2.6rem;
		block-size: 2.6rem;
		border-radius: 50%;
		background: var(--brand-light);
		color: var(--brand-subtle);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		font-weight: 700;
		overflow: hidden;
	}

	.avatar img {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}

	.avatar--lg {
		inline-size: 3.4rem;
		block-size: 3.4rem;
		font-size: 1.05rem;
	}

	.elu-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.elu-info strong {
		font-size: 1rem;
	}

	.elu-info small {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	/* Repli annuaires */
	.manual-fallback {
		margin-top: 1.5rem;
		font-size: 0.9rem;
	}

	.manual-fallback summary {
		cursor: pointer;
		color: var(--text-2);
	}

	.find-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.85rem;
	}

	.find-btn {
		display: block;
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		text-decoration: none;
		color: var(--text);
		background: var(--bg-card);
		font-size: 0.88rem;
	}

	.find-btn:hover {
		border-color: var(--brand);
	}

	/* Retour */
	.back-link {
		background: none;
		border: none;
		color: var(--brand-subtle);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		margin-bottom: 1rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	/* Destinataire */
	.recipient {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		background: var(--brand-light);
		border-radius: 10px;
		margin-bottom: 1.25rem;
	}

	.recipient-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-subtle);
	}

	.recipient > div {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
	}

	.recipient small {
		font-size: 0.8rem;
		color: var(--text-2);
	}

	.profile-link {
		font-size: 0.78rem;
		color: var(--brand-subtle);
		margin-top: 0.15rem;
		width: fit-content;
	}

	/* Toolbar message */
	.msg-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1.1rem 2rem;
		align-items: flex-start;
		margin-bottom: 1.25rem;
	}

	.control {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.control-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
	}

	.segmented {
		display: inline-flex;
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
	}

	.segmented button {
		padding: 0.45rem 1rem;
		border: none;
		background: var(--bg);
		font-size: 0.88rem;
		cursor: pointer;
		color: var(--text-2);
	}

	.segmented button.active {
		background: var(--brand);
		color: #1a1a1a;
		font-weight: 600;
	}

	.theme-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chip {
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--bg);
		font-size: 0.8rem;
		cursor: pointer;
		color: var(--text-2);
		transition: all 0.15s;
	}

	.chip.active {
		border-color: var(--brand);
		background: var(--brand);
		color: #1a1a1a;
	}

	.perso-field {
		display: block;
		margin-bottom: 1rem;
	}

	.perso-label {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-2);
		margin-bottom: 0.4rem;
	}

	.perso-label em {
		font-style: normal;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--brand-subtle);
		margin-left: 0.4rem;
	}

	.perso-input {
		width: 100%;
		padding: 0.6rem 0.8rem;
		border: 2px solid var(--border);
		border-radius: 9px;
		font-size: 0.9rem;
		font-family: inherit;
		line-height: 1.5;
		background: var(--bg);
		color: var(--text);
		resize: vertical;
	}

	.perso-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	/* Aperçu email */
	.email-preview {
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}

	.email-subject-line {
		background: var(--bg-card);
		padding: 0.65rem 1.1rem;
		font-size: 0.85rem;
		border-bottom: 1px solid var(--border);
	}

	.subject-label {
		font-weight: 700;
		margin-right: 0.4rem;
		color: var(--text-2);
	}

	.email-body {
		padding: 1.4rem 1.6rem;
		font-size: 0.9rem;
		line-height: 1.7;
		background: var(--bg);
		max-block-size: 22rem;
		overflow-y: auto;
	}

	.email-body :global(p) {
		margin-bottom: 1em;
	}

	.send-row {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 1.25rem;
	}

	.deliverability {
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--text-2);
		margin-top: 1rem;
	}

	.bcc-hint {
		font-size: 0.78rem;
		color: var(--text-secondary);
		margin-top: 0.85rem;
	}

	/* Opt-in newsletter */
	.newsletter-optin {
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.newsletter-check {
		display: flex;
		gap: 0.55rem;
		align-items: flex-start;
		font-size: 0.9rem;
		color: var(--text-2);
		cursor: pointer;
		line-height: 1.45;
	}

	.newsletter-check input {
		margin-top: 0.2rem;
		flex-shrink: 0;
	}

	.newsletter-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.75rem;
	}

	.newsletter-input {
		flex: 1;
		min-inline-size: 200px;
		padding: 0.6rem 0.85rem;
		border: 2px solid var(--border);
		border-radius: 9px;
		font-size: 0.95rem;
		background: var(--bg);
		color: var(--text);
	}

	.newsletter-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	.newsletter-error {
		margin-top: 0.5rem;
		font-size: 0.82rem;
		color: #c0392b;
	}

	.newsletter-done {
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--brand-subtle);
	}

	/* Suite après envoi */
	.after-send {
		margin-top: 1.5rem;
		padding: 1.1rem 1.25rem;
		border: 1px solid var(--brand);
		background: var(--brand-light);
		border-radius: 12px;
	}

	.after-send p {
		font-size: 0.9rem;
		margin: 0 0 0.5rem;
	}

	.join-link {
		display: inline-block;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--brand-subtle);
	}

	.join-link--block {
		margin-top: 1rem;
	}

	.bcc-hint code {
		background: var(--bg-card);
		padding: 0.05em 0.35em;
		border-radius: 4px;
		color: var(--brand-subtle);
		font-weight: 600;
	}

	/* Prose + FAQ (en boxes blanches comme les cartes d'étape) */
	.prose h2,
	.faq h2 {
		font-size: 1.3rem;
		font-weight: 700;
		margin: 0 0 1rem;
	}

	.prose p {
		line-height: 1.7;
		color: var(--text-2);
		margin: 0;
	}

	/* L'accordéon partagé gère son propre titre : on neutralise la marge h3 */
	.faq :global(.accordion .title) {
		font-size: 1.05rem;
	}

	.faq :global(.accordion .header) {
		padding: 1.1rem 0;
	}

	@media (max-width: 600px) {
		.card {
			padding: 1.25rem;
		}

		.elu-card {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
