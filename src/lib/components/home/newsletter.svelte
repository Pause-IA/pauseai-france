<script lang="ts">
	import Button from '$components/Button.svelte'
	import Fly from '$components/Fly.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'

	const label_id = 'newsletter-title'

	let email = ''
	let subscribeNewsletter = false
	let subscribeSubstack = false
	let isSubmitting = false
	let message = ''
	let isError = false

	interface ApiResponse {
		success?: boolean
		message?: string
		error?: string
		details?: string
		contact_id?: number
	}

	async function handleSubmit() {
		// Reset previous messages
		message = ''
		isError = false

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			message = 'Veuillez saisir une adresse e-mail valide'
			isError = true
			return
		}

		// Check at least one subscription is selected
		if (!subscribeNewsletter && !subscribeSubstack) {
			message = "Veuillez sélectionner au moins une option d'inscription"
			isError = true
			return
		}

		isSubmitting = true

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					subscribeNewsletter,
					subscribeSubstack,
					source: 'homepage'
				})
			})

			const result = (await response.json()) as ApiResponse

			if (response.ok) {
				message = result.message ?? 'Inscription réussie !'
				isError = false
				// Reset form
				email = ''
				subscribeNewsletter = false
				subscribeSubstack = false
			} else {
				message = result.error ?? 'Une erreur est survenue'
				isError = true
			}
		} catch (error) {
			message = 'Erreur de connexion. Veuillez réessayer.'
			isError = true
			console.error('Newsletter subscription error:', error)
		} finally {
			isSubmitting = false
		}
	}
</script>

<section id="newsletter" class="newsletter" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id} underlineColor="white">Restez informé·e</UnderlinedTitle>
	</Fly>
	<Fly>
		<div class="content">
			<p>
				Veille critique par Pause IA : décryptages, enjeux de gouvernance, politiques publiques :
				inscrivez-vous pour recevoir l’essentiel.
			</p>

			<form on:submit|preventDefault={handleSubmit} class="signup-form">
				<div class="form-card">
					<div class="inputs-grid">
						<div class="form-group">
							<label for="newsletter-email">Adresse e-mail</label>
							<input
								id="newsletter-email"
								type="email"
								bind:value={email}
								placeholder="votre@email.com"
								required
								disabled={isSubmitting}
							/>
						</div>
					</div>

					<fieldset class="subscriptions">
						<legend>Inscriptions</legend>
						<div class="checkbox-group">
							<label class="checkbox-label">
								<input type="checkbox" bind:checked={subscribeNewsletter} disabled={isSubmitting} />
								<span class="checkmark"></span>
								<div class="checkbox-content">
									<span class="checkbox-title">Newsletter Pause IA</span>
									<small>Actualités et actions importantes</small>
								</div>
							</label>

							<label class="checkbox-label">
								<input type="checkbox" bind:checked={subscribeSubstack} disabled={isSubmitting} />
								<span class="checkmark"></span>
								<div class="checkbox-content">
									<span class="checkbox-title">Blog Substack</span>
									<small>Analyses approfondies et réflexions</small>
								</div>
							</label>
						</div>
					</fieldset>
					{#if message}
						<div
							class="message"
							aria-live="polite"
							role="status"
							class:error={isError}
							class:success={!isError}
						>
							{message}
						</div>
					{/if}
				</div>

				<div class="submit-button">
					<Button alt type="submit" disabled={isSubmitting}>
						{#if isSubmitting}Inscription...{:else}S’inscrire{/if}
					</Button>
				</div>
			</form>
		</div>
	</Fly>
</section>

<style>
	.newsletter {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-right: calc(50% - 50vw);
		background: var(--brand);
		color: var(--on-brand);
		padding: 2.5rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		isolation: isolate;
		overflow: hidden;
	}

	.content {
		width: 100%;
		max-width: var(--width-content);
		margin: 0 auto;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.content p {
		margin-left: auto;
		margin-right: auto;
		max-width: 46rem;
	}

	/* Ensure headings are visible on brand background */
	.newsletter :global(h1),
	.newsletter :global(h2) {
		color: var(--black);
		text-align: center;
	}

	.signup-form {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		text-align: left;
	}

	.form-card {
		background-color: var(--white);
		border: 1px solid var(--border);
		box-shadow: 0 8px 24px rgba(var(--ink-rgb), 0.08);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		display: grid;
		gap: 1.25rem;
	}

	.inputs-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
		color: var(--text);
	}

	input[type='email'] {
		padding: 0.75rem;
		border: 2px solid color-mix(in srgb, var(--black) 25%, transparent);
		border-radius: var(--radius-sm);
		font-family: var(--font-body);
		font-size: 1rem;
		background-color: var(--bg);
		color: var(--text);
		transition: border-color 0.2s ease;
	}

	input[type='email']:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(var(--brand-rgb), 0.1);
	}

	input[type='email']:disabled {
		background-color: var(--bg-subtle);
		cursor: not-allowed;
		opacity: 0.7;
	}

	fieldset {
		border: 1px solid var(--border);
		border-radius: 0.3125rem;
		padding: 1rem;
		margin: 0;
	}

	legend {
		font-weight: 600;
		padding: 0;
		color: var(--text);
	}

	.subscriptions {
		border: 0;
		padding: 0;
	}

	.subscriptions legend {
		margin-bottom: 0.5rem;
	}

	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.checkbox-label {
		display: grid;
		grid-template-columns: 1.25rem auto;
		align-items: start;
		gap: 0.75rem;
		cursor: pointer;
		position: relative;
		font-weight: normal;
	}

	.checkbox-title {
		font-weight: 600;
	}

	.checkbox-label:hover .checkmark {
		border-color: var(--brand);
	}

	input[type='checkbox'] {
		opacity: 0;
		position: absolute;
		width: 0;
		height: 0;
	}

	.checkmark {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid color-mix(in srgb, var(--black) 25%, transparent);
		border-radius: 0.25rem;
		background-color: var(--bg);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		flex-shrink: 0;
		margin-top: 0.25rem; /* aligns with first text baseline */
		box-sizing: border-box;
	}

	input[type='checkbox']:checked + .checkmark {
		background-color: var(--brand);
		border-color: var(--brand);
	}

	input[type='checkbox']:checked + .checkmark::after {
		content: '✓';
		color: var(--on-dark);
		font-weight: bold;
		font-size: 0.875rem;
	}

	input[type='checkbox']:focus + .checkmark {
		box-shadow: 0 0 0 2px rgba(var(--brand-rgb), 0.2);
	}

	.checkbox-content {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.checkbox-label small {
		display: block;
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	.message {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-sm);
		text-align: center;
		font-weight: 600;
		background-color: rgba(var(--on-dark-rgb), 0.8);
		border: 1px solid rgba(var(--ink-rgb), 0.08);
		color: var(--text);
	}

	.message.success {
		background-color: var(--success-bg);
		border: 1px solid var(--success-border);
		color: var(--success);
	}

	.message.error {
		background-color: var(--error-bg);
		border: 1px solid var(--error-border);
		color: var(--error);
	}

	.submit-button {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}

	/* Button styles now inherited from Button component */

	@media (min-width: 768px) {
		.newsletter {
			padding: 3rem 2rem;
		}
		/* Use default underline size and positioning from component */
		.form-card {
			padding: 1.75rem 2rem;
			gap: 1.5rem;
		}
		.inputs-grid {
			grid-template-columns: 1fr;
			gap: 1.25rem 1rem;
		}

		.checkbox-group {
			flex-direction: row;
			gap: 2rem;
		}

		.checkbox-label {
			flex: 1;
		}
	}
</style>
