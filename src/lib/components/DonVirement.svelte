<script lang="ts">
	import { onMount } from 'svelte'

	export let show = false

	const IBAN = 'BE22 9674 2966 9647'
	const BIC = 'TRWIBEB1XXX'
	const TITULAIRE = 'Pause IA'

	const PRESETS = [20, 50, 100, 200]

	let step: 1 | 2 | 3 = 1
	let prenom = ''
	let nom = ''
	let email = ''
	let montant = 50
	let selectedPreset: number | null = 50
	let isLoading = false
	let errorMessage = ''

	let copiedField: string | null = null

	let dialogEl: HTMLElement
	let firstFocusEl: HTMLElement | undefined

	/* Remise à zéro à l'ouverture.
	   Ce bloc ne doit dépendre QUE de `show`. Il a dépendu de `firstFocusEl`,
	   lié par `bind:this` au champ Prénom : chaque frappe relançait le cycle de
	   mise à jour, le bloc repassait et vidait les champs, on ne pouvait rien
	   saisir. Le corps est donc un appel de fonction, dont Svelte ne tire
	   aucune dépendance supplémentaire. */
	function reinitialiser() {
		step = 1
		prenom = ''
		nom = ''
		email = ''
		montant = 50
		selectedPreset = 50
		errorMessage = ''
		copiedField = null
	}

	$: if (show) reinitialiser()

	$: if (typeof document !== 'undefined') {
		if (show) {
			const scrollY = window.scrollY
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'
			document.body.dataset.scrollY = String(scrollY)
		} else {
			const scrollY = parseInt(document.body.dataset.scrollY ?? '0')
			document.body.style.position = ''
			document.body.style.top = ''
			document.body.style.width = ''
			if (scrollY) window.scrollTo(0, scrollY)
		}
	}

	$: if (show) {
		setTimeout(() => {
			firstFocusEl?.focus()
		}, 50)
	}

	function close() {
		show = false
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) close()
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close()
	}

	function selectPreset(value: number) {
		selectedPreset = value
		montant = value
	}

	function handleCustomInput(event: Event) {
		const target = event.target as HTMLInputElement
		const value = parseFloat(target.value)
		if (isNaN(value) || value < 1) {
			montant = 1
			target.value = '1'
		} else {
			montant = value
		}
		selectedPreset = null
	}

	async function handleSubmit() {
		errorMessage = ''

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!prenom.trim()) {
			errorMessage = 'Le prénom est requis.'
			return
		}
		if (!nom.trim()) {
			errorMessage = 'Le nom est requis.'
			return
		}
		if (!email || !emailRegex.test(email)) {
			errorMessage = "L'adresse e-mail n'est pas valide."
			return
		}
		if (!montant || montant < 1) {
			errorMessage = 'Le montant minimum est de 1€.'
			return
		}

		isLoading = true

		try {
			const res = await fetch('/api/don-virement', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prenom: prenom.trim(), nom: nom.trim(), email, montant })
			})
			const data = (await res.json()) as { success: boolean; error?: string }
			if (data.success) {
				step = 2
			} else {
				errorMessage = data.error ?? 'Une erreur est survenue.'
			}
		} catch {
			errorMessage = 'Impossible de contacter le serveur. Veuillez réessayer.'
		} finally {
			isLoading = false
		}
	}

	async function copyToClipboard(text: string, field: string) {
		try {
			await navigator.clipboard.writeText(text)
			copiedField = field
			setTimeout(() => (copiedField = null), 2000)
		} catch {
			// Clipboard not available, silently fail
		}
	}

	onMount(() => {
		// nothing needed
	})
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div class="overlay" on:click={handleOverlayClick} aria-hidden="true"></div>
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		bind:this={dialogEl}
	>
		<button class="close-btn" on:click={close} aria-label="Fermer">✕</button>

		{#if step === 1}
			<h2 id="modal-title" class="modal-title">Don par virement bancaire</h2>

			<form on:submit|preventDefault={handleSubmit} novalidate>
				<div class="field-row">
					<div class="field">
						<label for="dv-prenom">Prénom <span aria-hidden="true">*</span></label>
						<input
							id="dv-prenom"
							type="text"
							bind:value={prenom}
							autocomplete="given-name"
							required
							bind:this={firstFocusEl}
						/>
					</div>
					<div class="field">
						<label for="dv-nom">Nom <span aria-hidden="true">*</span></label>
						<input id="dv-nom" type="text" bind:value={nom} autocomplete="family-name" required />
					</div>
				</div>

				<div class="field">
					<label for="dv-email">Email <span aria-hidden="true">*</span></label>
					<input id="dv-email" type="email" bind:value={email} autocomplete="email" required />
					<small class="field-hint"
						>Nous utiliserons cette adresse pour vous envoyer votre reçu fiscal.</small
					>
				</div>

				<fieldset class="amount-fieldset">
					<legend>Montant du don</legend>
					<div class="main-amount">
						<label for="dv-montant" class="sr-only">Montant en euros</label>
						<div class="main-amount-wrap">
							<input
								id="dv-montant"
								type="number"
								min="1"
								step="1"
								value={montant}
								on:input={handleCustomInput}
								on:focus={() => (selectedPreset = null)}
							/>
							<span class="main-euro">€</span>
						</div>
					</div>
					<p class="presets-label">Montants suggérés :</p>
					<div class="presets">
						{#each PRESETS as preset}
							<button
								type="button"
								class="preset-btn"
								class:selected={selectedPreset === preset}
								on:click={() => {
									selectPreset(preset)
								}}
							>
								{preset}€
							</button>
						{/each}
					</div>
				</fieldset>

				{#if errorMessage}
					<div class="error-banner" role="alert" aria-live="assertive">
						{errorMessage}
					</div>
				{/if}

				<button type="submit" class="submit-btn" disabled={isLoading}>
					{isLoading ? 'Chargement...' : 'Continuer'}
				</button>
			</form>
		{:else if step === 2}
			<div class="confirmation" aria-live="polite">
				<div class="success-icon" aria-hidden="true">✅</div>
				<h2 id="modal-title" class="modal-title">Merci, {prenom}&nbsp;!</h2>
				<p class="confirm-text">
					Pour finaliser votre don de <strong>{montant}&nbsp;€</strong>, effectuez un virement
					bancaire avec les coordonnées ci-dessous.
				</p>

				<div class="rib-card">
					<div class="rib-row">
						<span class="rib-label">Titulaire</span>
						<span class="rib-value">{TITULAIRE}</span>
						<button
							type="button"
							class="copy-inline"
							on:click={() => copyToClipboard(TITULAIRE, 'titulaire')}
							aria-label="Copier le titulaire"
						>
							{copiedField === 'titulaire' ? '✓' : '📋'}
						</button>
					</div>
					<div class="rib-row">
						<span class="rib-label">IBAN</span>
						<span class="rib-value mono">{IBAN}</span>
						<button
							type="button"
							class="copy-inline"
							on:click={() => copyToClipboard(IBAN.replace(/\s/g, ''), 'iban')}
							aria-label="Copier l’IBAN"
						>
							{copiedField === 'iban' ? '✓' : '📋'}
						</button>
					</div>
					<div class="rib-row">
						<span class="rib-label">BIC</span>
						<span class="rib-value mono">{BIC}</span>
						<button
							type="button"
							class="copy-inline"
							on:click={() => copyToClipboard(BIC, 'bic')}
							aria-label="Copier le BIC"
						>
							{copiedField === 'bic' ? '✓' : '📋'}
						</button>
					</div>
				</div>

				<button type="button" class="done-btn" on:click={() => (step = 3)}>
					C’est fait, j’ai viré {montant}&nbsp;€
				</button>
				<button type="button" class="close-link" on:click={close}>Fermer</button>
			</div>
		{:else}
			<div class="confirmation" aria-live="polite">
				<div class="success-icon" aria-hidden="true">🙏</div>
				<h2 id="modal-title" class="modal-title">Merci infiniment, {prenom}&nbsp;!</h2>
				<p class="confirm-text">
					Votre don de <strong>{montant}&nbsp;€</strong> compte énormément pour nous. Il finance directement
					notre travail de plaidoyer pour une IA sous contrôle.
				</p>
				<p class="confirm-text">
					Dès que votre virement nous parviendra (comptez quelques jours ouvrés), nous vous
					enverrons votre <strong>reçu fiscal</strong> à l’adresse <strong>{email}</strong>. Il vous
					permettra de déduire <strong>66&nbsp;%</strong> de votre don de vos impôts.
				</p>
				<p class="confirm-note">
					Vous ne recevez rien sous une dizaine de jours&nbsp;? Écrivez-nous à
					<a href="mailto:dons@pauseia.fr">dons@pauseia.fr</a>.
				</p>
				<button type="button" class="done-btn" on:click={close}>Fermer</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(var(--ink-rgb), 0.5);
		z-index: 1000;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1001;
		background: var(--bg);
		border-radius: var(--radius-md);
		padding: 2rem;
		width: min(540px, calc(100vw - 2rem));
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		box-shadow: 0 8px 32px rgba(var(--ink-rgb), 0.2);
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 1.2rem;
		cursor: pointer;
		color: var(--text-secondary);
		line-height: 1;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.close-btn:hover {
		background: var(--brand-light);
		color: var(--text);
	}

	.modal-title {
		margin: 0 0 1.5rem;
		font-size: 1.4rem;
		padding-right: 2rem;
	}

	/* Form fields */
	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	label {
		font-weight: 600;
		font-size: 0.95rem;
	}

	input[type='text'],
	input[type='email'],
	input[type='number'] {
		padding: 0.6rem 0.9rem;
		border: 2px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: 1rem;
		font-family: inherit;
		background: var(--bg);
		color: var(--text);
		transition: border-color 0.2s;
		width: 100%;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(255, 148, 23, 0.12);
	}

	/* Amount fieldset */
	.amount-fieldset {
		border: none;
		padding: 0;
		margin: 0 0 1.25rem;
	}

	.amount-fieldset legend {
		font-weight: 600;
		font-size: 0.95rem;
		margin-bottom: 0.75rem;
	}

	/* Big free amount input */
	.main-amount {
		margin-bottom: 1rem;
	}

	.main-amount-wrap {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.main-amount-wrap input {
		width: 9rem;
		font-size: 2rem;
		font-weight: 700;
		padding: 0.5rem 0.75rem;
		text-align: right;
	}

	.main-euro {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text);
	}

	.presets-label {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin: 0 0 0.5rem;
	}

	.presets {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 0.75rem;
	}

	.preset-btn {
		padding: 0.4rem 0.9rem;
		border-radius: var(--radius-pill);
		border: 2px solid var(--brand);
		background: transparent;
		color: var(--text);
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.preset-btn:hover,
	.preset-btn.selected {
		background: var(--brand);
		color: var(--on-brand);
	}

	/* Field hint */
	.field-hint {
		font-size: 0.82rem;
		color: var(--text-secondary);
		margin-top: 0.2rem;
	}

	/* Screen-reader only */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Error */
	.error-banner {
		background: var(--error-bg);
		border: 1px solid var(--error-border);
		border-radius: var(--radius-sm);
		padding: 0.7rem 1rem;
		color: var(--error);
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	/* Submit button */
	.submit-btn {
		width: 100%;
		padding: 0.85rem;
		background: var(--brand);
		color: var(--on-brand);
		border: none;
		border-radius: var(--radius-sm);
		font-size: 1.05rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.15s,
			transform 0.15s;
	}

	.submit-btn:hover:not(:disabled) {
		background: var(--btn-hover-bg);
		transform: translateY(-1px);
	}

	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	/* Confirmation step */
	.confirmation {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1rem;
	}

	.success-icon {
		font-size: 3rem;
		margin-bottom: 0.25rem;
	}

	.confirm-text {
		color: var(--text-secondary);
		margin: 0;
	}

	/* RIB card */
	.rib-card {
		width: 100%;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1.25rem 1.5rem;
		text-align: left;
	}

	.rib-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border);
	}

	.rib-row:last-child {
		border-bottom: none;
	}

	.rib-label {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-secondary);
		min-width: 80px;
	}

	.rib-value {
		font-size: 0.95rem;
		color: var(--text);
	}

	.rib-value.mono {
		/* Pile monospace du système, comme sur /une-ia-sest-echappee. L'ancienne
		   valeur demandait IBM Plex Mono, qui n'a jamais été chargée : l'IBAN
		   sortait donc en Courier New. */
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		letter-spacing: 0.04em;
	}

	.confirm-note {
		margin: 1.25rem 0 1.5rem;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	/* Inline copy buttons */
	.copy-inline {
		background: none;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-size: 1rem;
		padding: 0.25rem 0.5rem;
		line-height: 1;
		color: var(--text-secondary);
		transition:
			background 0.15s,
			border-color 0.15s;
		flex-shrink: 0;
	}

	.copy-inline:hover {
		background: var(--brand-light);
		border-color: var(--brand);
	}

	.done-btn {
		width: 100%;
		padding: 0.85rem;
		background: var(--brand);
		color: var(--on-brand);
		border: none;
		border-radius: var(--radius-sm);
		font-size: 1.05rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.15s,
			transform 0.15s;
	}

	.done-btn:hover {
		background: var(--btn-hover-bg);
		transform: translateY(-1px);
	}

	.close-link {
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 0.95rem;
		cursor: pointer;
		text-decoration: underline;
		padding: 0;
	}

	.close-link:hover {
		color: var(--text);
	}

	@media (max-width: 480px) {
		.field-row {
			grid-template-columns: 1fr;
		}

		.modal {
			padding: 1.25rem 1rem;
			top: auto;
			bottom: 0;
			left: 0;
			right: 0;
			transform: none;
			width: 100%;
			max-height: 92dvh;
			border-radius: 16px 16px 0 0;
		}

		/* Form step */
		.field {
			margin-bottom: 0.6rem;
		}

		.amount-fieldset {
			margin-bottom: 0.75rem;
		}

		.amount-fieldset legend {
			margin-bottom: 0.5rem;
		}

		.main-amount {
			margin-bottom: 0.5rem;
		}

		.main-amount-wrap input {
			font-size: 1.5rem;
			width: 7rem;
		}

		.main-euro {
			font-size: 1.5rem;
		}

		.presets-label {
			margin-bottom: 0.35rem;
		}

		.confirmation {
			gap: 0.5rem;
		}

		.success-icon {
			display: none;
		}

		.modal-title {
			margin-bottom: 0.25rem;
			font-size: 1.15rem;
		}

		.confirm-text {
			font-size: 0.9rem;
		}

		.rib-card {
			padding: 0.7rem 0.9rem;
		}

		.rib-row {
			padding: 0.35rem 0;
		}

		.rib-value.mono {
			font-size: 0.82rem;
		}

		.close-link {
			display: none;
		}
	}
</style>
