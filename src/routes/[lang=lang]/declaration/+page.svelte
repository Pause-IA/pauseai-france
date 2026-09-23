<script lang="ts">
	import { onMount, tick } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Card, PageHero, SectionTitle } from '$components/ui'
	import DeclarationNextSteps from '$components/DeclarationNextSteps.svelte'
	import SignatoryCard from '$components/declaration/SignatoryCard.svelte'
	import { counts, loadDeclaration, toEntries, type DeclarationData } from '$lib/declaration'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = `/${data.lang}`

	$: title = isEn ? 'The PauseAI statement' : 'La déclaration PauseAI'
	$: description = isEn
		? 'We call on the governments of the world to sign an international treaty implementing a pause on the training of the most powerful general AI systems. Sign the statement.'
		: 'Nous appelons les gouvernements du monde entier à signer un traité international instaurant une pause dans l’entraînement des systèmes d’IA généralistes les plus puissants. Signez la déclaration.'

	// ── Compteur et messages (non prérendus, via /api/declaration) ──
	let d: DeclarationData | null = null
	onMount(async () => {
		d = await loadDeclaration()
	})
	$: entries = d ? toEntries(d) : []
	$: ({ worldCount, franceCount } = d ? counts(d) : { worldCount: null, franceCount: 0 })

	// « Pourquoi ils signent » : quelques messages récents, ceux de France d'abord.
	const FEATURED = 6
	// Messages signés d'un nom avant les messages anonymes.
	$: featured = [
		...entries.filter((e) => e.comment && !e.anonymous && e.country === 'FR'),
		...entries.filter((e) => e.comment && !e.anonymous && e.country !== 'FR'),
		...entries.filter((e) => e.comment && e.anonymous)
	].slice(0, FEATURED)

	// Objectif affiché sous le compteur : le prochain palier.
	const MILESTONES = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000]
	$: goalBase = worldCount ?? franceCount
	$: nextGoal = MILESTONES.find((m) => m > goalBase) ?? goalBase
	$: prevGoal = [...MILESTONES].reverse().find((m) => m <= goalBase) ?? 0
	$: progress = nextGoal > prevGoal ? (goalBase - prevGoal) / (nextGoal - prevGoal) : 1

	const fmt = (n: number) => n.toLocaleString(isEn ? 'en-GB' : 'fr-FR')

	// ── Formulaire ──
	let firstName = ''
	let lastName = ''
	let email = ''
	let jobTitle = ''
	let comment = ''
	const COMMENT_MAX = 500
	let showName = false
	let newsletter = false
	let website = '' // champ piège anti-robots
	let submitting = false
	let error = ''
	/** pending : e-mail de confirmation envoyé ; already : déjà signataire confirmé. */
	let done: 'pending' | 'already' | null = null
	let sentTo = ''
	/** Aucun nouvel e-mail : un autre est parti il y a peu (minutes avant de pouvoir réessayer). */
	let retryIn = 0

	let signSection: HTMLElement | undefined

	// Le formulaire (long) est remplacé par un message court : sans cela, la page
	// garde sa position et l'on se retrouve sous le message. On ramène le haut de
	// l'encadré à l'écran et on y place le focus (lecteurs d'écran, clavier).
	async function revealSignSection() {
		await tick()
		if (!signSection) return
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		signSection.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
		signSection.querySelector<HTMLElement>('[data-focus]')?.focus({ preventScroll: true })
	}

	function restart() {
		done = null
		error = ''
		void revealSignSection()
	}

	async function sign() {
		error = ''
		if (!firstName.trim() || !lastName.trim()) {
			error = isEn
				? 'Please enter your first and last name.'
				: 'Merci d’indiquer votre prénom et votre nom.'
			return
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			error = isEn
				? 'Please enter a valid email address.'
				: 'Merci d’indiquer une adresse e-mail valide.'
			return
		}
		submitting = true
		try {
			const res = await fetch('/api/declaration', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					title: jobTitle,
					comment,
					showName,
					newsletter,
					website,
					lang: data.lang
				})
			})
			const result = (await res.json()) as {
				success?: boolean
				pending?: boolean
				alreadySigned?: boolean
				resent?: boolean
				retryInMinutes?: number
				error?: string
			}
			if (res.ok && result.success) {
				// Rien n'est compté avant le clic dans l'e-mail de confirmation.
				done = result.pending ? 'pending' : 'already'
				sentTo = email.trim()
				retryIn = result.resent === false ? (result.retryInMinutes ?? 10) : 0
				void revealSignSection()
			} else {
				error =
					result.error ||
					(isEn
						? 'Something went wrong, please try again.'
						: 'Une erreur est survenue, merci de réessayer.')
			}
		} catch {
			error = isEn
				? 'Connection error, please try again.'
				: 'Erreur de connexion, merci de réessayer.'
		} finally {
			submitting = false
		}
	}
</script>

<PostMeta {title} {description} />

<article>
	<PageHero>
		{title}
		<svelte:fragment slot="lede">
			{#if isEn}
				This statement summarises the position of the volunteers and supporters of the PauseAI
				association, and in particular of its French branch, Pause IA. Sign it to add your voice to
				ours and help us build our collective strength.
			{:else}
				Cette déclaration résume la position des bénévoles, sympathisants et sympathisantes de
				l’association PauseAI et notamment de sa branche française, Pause IA. Signez-la pour ajouter
				votre voix à la nôtre et nous aider à construire notre force collective.
			{/if}
		</svelte:fragment>
		<div slot="actions" class="hero-actions">
			<Button href="#signer">{isEn ? 'Sign the statement' : 'Signer la déclaration'}</Button>
		</div>
	</PageHero>

	<blockquote class="statement">
		{#if isEn}
			We call on the governments of the world to sign an international treaty implementing a pause
			on the training of the most powerful general AI systems, until we know how to build them
			safely and keep them under democratic control.
		{:else}
			Nous appelons les gouvernements du monde entier à signer un traité international instaurant
			une pause dans l’entraînement des systèmes d’IA généralistes les plus puissants, jusqu’à ce
			que nous sachions les construire de manière sûre et les maintenir sous contrôle démocratique.
		{/if}
	</blockquote>

	<p class="source">
		{#if isEn}
			This is the statement of the international PauseAI movement.
			<a href="https://pauseai.info/statement" target="_blank" rel="noopener"
				>See it on the PauseAI Global website ↗</a
			>
		{:else}
			Traduction de la déclaration du mouvement international PauseAI.
			<a href="https://pauseai.info/statement" target="_blank" rel="noopener"
				>Voir la version originale (en anglais) sur le site de PauseAI Global ↗</a
			>
		{/if}
	</p>

	<!-- Hauteur réservée avant le chargement : la page ne saute pas quand les chiffres arrivent. -->
	<div class="kpis" aria-live="polite" aria-busy={!d}>
		{#if !d}
			<div class="counter" aria-hidden="true">
				<div class="stat">
					<span class="num placeholder"></span><span class="label">&nbsp;</span>
				</div>
				<div class="stat">
					<span class="num placeholder"></span><span class="label">&nbsp;</span>
				</div>
			</div>
		{:else if worldCount != null || franceCount > 0}
			<div class="counter">
				{#if worldCount != null}
					<div class="stat">
						<span class="num">{fmt(worldCount)}</span>
						<span class="label">{isEn ? 'signatures worldwide' : 'signatures dans le monde'}</span>
					</div>
				{/if}
				{#if franceCount > 0}
					<div class="stat">
						<span class="num">{fmt(franceCount)}</span>
						<span class="label">{isEn ? 'in France' : 'en France'}</span>
					</div>
				{/if}
			</div>
			<div class="goal">
				<div
					class="bar"
					role="progressbar"
					aria-label={isEn
						? 'Progress towards the next goal'
						: 'Progression vers le prochain objectif'}
					aria-valuemin={prevGoal}
					aria-valuemax={nextGoal}
					aria-valuenow={goalBase}
				>
					<span style="width: {Math.round(progress * 100)}%"></span>
				</div>
				<p>
					{#if isEn}
						Next goal: <strong>{fmt(nextGoal)}</strong> signatures
						{worldCount != null ? 'worldwide' : 'in France'}. Help us get there!
					{:else}
						Prochain objectif : <strong>{fmt(nextGoal)}</strong> signatures
						{worldCount != null ? 'dans le monde' : 'en France'}. Aidez-nous à l’atteindre !
					{/if}
				</p>
			</div>
		{/if}
	</div>

	<section class="sign" id="signer" bind:this={signSection}>
		<Card>
			<SectionTitle>{isEn ? 'Sign the statement' : 'Signer la déclaration'}</SectionTitle>

			{#if done === 'pending'}
				<p class="success" role="status" tabindex="-1" data-focus>
					{isEn ? 'Check your inbox!' : 'Vérifiez votre boîte mail !'}
				</p>
				{#if retryIn}
					<p>
						{#if isEn}
							A confirmation email was already sent to <strong>{sentTo}</strong> a few minutes ago:
							please use the link it contains. Check your spam folder if you cannot find it. You can
							request a new one in {retryIn} min.
						{:else}
							Un e-mail de confirmation a déjà été envoyé à <strong>{sentTo}</strong> il y a
							quelques minutes : utilisez le lien qu’il contient. Pensez à vérifier vos courriers
							indésirables. Vous pourrez en demander un nouveau dans {retryIn} min.
						{/if}
					</p>
				{:else}
					<p>
						{#if isEn}
							We have sent a confirmation email to <strong>{sentTo}</strong>. Your signature will be
							counted as soon as you click the link it contains.
						{:else}
							Nous venons d’envoyer un e-mail de confirmation à <strong>{sentTo}</strong>. Votre
							signature sera comptabilisée dès que vous aurez cliqué sur le lien qu’il contient.
						{/if}
					</p>
				{/if}
				<p class="notice">
					{#if isEn}
						Nothing received after a few minutes? Check your spam folder, or
						<button type="button" class="link" on:click={restart}>correct your email address</button
						>.
					{:else}
						Rien reçu après quelques minutes ? Vérifiez vos courriers indésirables, ou
						<button type="button" class="link" on:click={restart}>corrigez votre adresse</button>.
					{/if}
				</p>
				<DeclarationNextSteps lang={data.lang} />
			{:else if done === 'already'}
				<p class="success" role="status" tabindex="-1" data-focus>
					{isEn
						? 'You had already signed the statement: thank you for your support!'
						: 'Vous aviez déjà signé la déclaration : merci pour votre soutien !'}
				</p>
				<DeclarationNextSteps lang={data.lang} />
			{:else}
				<form on:submit|preventDefault={sign} novalidate>
					<div class="row">
						<label>
							<span>{isEn ? 'First name' : 'Prénom'} *</span>
							<input
								bind:value={firstName}
								data-focus
								autocomplete="given-name"
								maxlength="64"
								required
							/>
						</label>
						<label>
							<span>{isEn ? 'Last name' : 'Nom'} *</span>
							<input bind:value={lastName} autocomplete="family-name" maxlength="64" required />
						</label>
					</div>
					<label>
						<span>{isEn ? 'Email' : 'E-mail'} *</span>
						<input type="email" bind:value={email} autocomplete="email" maxlength="254" required />
					</label>
					<label>
						<span
							>{isEn ? 'Title or occupation (optional)' : 'Titre ou profession (facultatif)'}</span
						>
						<input
							bind:value={jobTitle}
							autocomplete="organization-title"
							maxlength="120"
							placeholder={isEn
								? 'e.g. AI researcher, city councillor…'
								: 'ex. : chercheuse en IA, conseiller municipal…'}
						/>
					</label>
					<label>
						<span>
							{isEn
								? 'Tell the world who you are and why you think it is important to tackle AI risks (optional)'
								: 'Expliquez au monde qui vous êtes et pourquoi vous pensez qu’il est important de s’attaquer aux risques liés à l’IA (facultatif)'}
						</span>
						<textarea bind:value={comment} maxlength={COMMENT_MAX} rows="4"></textarea>
						<small class="hint">
							{#if isEn}
								Shown with your name if you accept to appear publicly. {comment.length}/{COMMENT_MAX}
							{:else}
								Affiché avec votre nom si vous acceptez d’apparaître publiquement. {comment.length}/{COMMENT_MAX}
							{/if}
						</small>
					</label>
					<!-- Champ piège : invisible pour les humains, rempli par les robots. -->
					<label class="hp" aria-hidden="true">
						Website <input bind:value={website} tabindex="-1" autocomplete="off" />
					</label>
					<label class="check">
						<input type="checkbox" bind:checked={showName} />
						<span>
							{isEn
								? 'Show my name, title and message in the public list of signatories'
								: 'Afficher mon nom, mon titre et mon message dans la liste publique des signataires'}
						</span>
					</label>
					<label class="check">
						<input type="checkbox" bind:checked={newsletter} />
						<span>
							{isEn ? 'Receive the Pause IA newsletter' : 'Recevoir la newsletter de Pause IA'}
						</span>
					</label>

					{#if error}<p class="error" role="alert">{error}</p>{/if}

					<Button type="submit" disabled={submitting}>
						{#if submitting}
							{isEn ? 'Signing…' : 'Signature…'}
						{:else}
							{isEn ? 'I sign' : 'Je signe'}
						{/if}
					</Button>
					<p class="legal">
						{#if isEn}
							Your email is never published. Your data is kept by Pause IA and is not shared.
							<a href="{prefix}/politique-de-confidentialite">Privacy policy</a>.
						{:else}
							Votre e-mail n’est jamais publié. Vos données sont conservées par Pause IA et ne sont
							pas partagées.
							<a href="{prefix}/politique-de-confidentialite">Politique de confidentialité</a>.
						{/if}
					</p>
				</form>
			{/if}
		</Card>
	</section>

	<section class="why" data-pagefind-ignore>
		<SectionTitle>{isEn ? 'Why they sign' : 'Pourquoi ils signent'}</SectionTitle>
		{#if featured.length}
			<ul class="grid">
				{#each featured as s (s)}
					<SignatoryCard signatory={s} lang={data.lang} />
				{/each}
			</ul>
		{/if}
		<!-- Lien toujours présent (pas seulement après chargement) : le prérendu le suit. -->
		<Button alt href="{prefix}/declaration/signataires">
			{#if worldCount != null}
				{isEn
					? `See all ${fmt(worldCount)} signatories`
					: `Voir les ${fmt(worldCount)} signataires`}
			{:else}
				{isEn ? 'See all signatories' : 'Voir tous les signataires'}
			{/if}
		</Button>
	</section>
</article>

<style>
	article {
		max-inline-size: var(--width-content);
		margin-inline: auto;
		margin-top: 3rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	.hero-actions {
		margin-top: 1.5rem;
	}

	/* Citation de la charte : fond --bg-subtle, barre gauche --brand. */
	.statement {
		margin: 0 0 1rem;
		padding: 1.25rem 1.75rem;
		border-left: 4px solid var(--brand);
		background: var(--bg-card);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		font-weight: 500;
		font-size: 1.15rem;
		line-height: 1.7;
		color: var(--text);
	}

	@media (min-width: 640px) {
		.statement {
			font-size: 1.4rem;
		}
	}

	.source,
	.legal,
	.notice {
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.kpis {
		min-block-size: 9.5rem;
		margin: 2.5rem 0;
	}

	.placeholder {
		display: block;
		inline-size: 6rem;
		block-size: 2.75rem;
		border-radius: var(--radius-sm);
		background: var(--border);
		animation: pulse 1.4s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.5;
		}
	}

	.counter {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin: 0 0 1rem;
		text-align: center;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}

	.num {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--brand-subtle);
		line-height: 1.1;
	}

	.label {
		color: var(--text-2);
	}

	.goal {
		max-inline-size: 28rem;
		margin: 0 auto;
		text-align: center;
		color: var(--text-2);
		font-size: 0.95rem;
	}

	.bar {
		block-size: 8px;
		border-radius: var(--radius-pill);
		background: var(--border);
		overflow: hidden;
	}

	.bar span {
		display: block;
		block-size: 100%;
		background: var(--brand);
		border-radius: inherit;
	}

	.goal p {
		margin: 0.5rem 0 0;
	}

	.sign {
		margin-bottom: 3.5rem;
		scroll-margin-top: 5rem;
	}

	form {
		display: grid;
		gap: 1rem;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.95rem;
	}

	input:not([type='checkbox']),
	textarea {
		font: inherit;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg);
		color: var(--text);
	}

	textarea {
		resize: vertical;
	}

	.hint {
		color: var(--text-2);
		font-size: 0.8rem;
	}

	label.check {
		flex-direction: row;
		align-items: flex-start;
		gap: 0.6rem;
	}

	label.check input {
		margin-top: 0.25rem;
		accent-color: var(--brand);
	}

	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.link {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--brand-subtle);
		text-decoration: underline;
		cursor: pointer;
	}

	.error {
		color: var(--error);
		margin: 0;
	}

	/* Focus posé par le script après l'envoi : pas de contour sur du texte. */
	.success:focus {
		outline: none;
	}

	.success {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--success);
	}

	.why {
		margin-bottom: 2rem;
	}

	/* Colonnes « maçonnerie » : les cartes de hauteurs différentes s'emboîtent. */
	.grid {
		columns: 17rem;
		column-gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0 0 1rem;
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
		.row {
			grid-template-columns: 1fr;
		}
		.counter {
			gap: 1.5rem;
		}
	}
</style>
