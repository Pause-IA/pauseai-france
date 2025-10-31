<script>
	import { enhance } from '$app/forms'
	import toast from 'svelte-french-toast'

	let isSubmitting = false
</script>

<form
	method="post"
	id="avis-form"
	use:enhance={() => {
		isSubmitting = true
		return async ({ result, update }) => {
			isSubmitting = false
			if (result.type === 'success') {
				toast.success('Merci pour votre retour !', {
					duration: 4000,
					position: 'top-center'
				})
			} else if (result.type === 'failure') {
				toast.error('Une erreur est survenue. Veuillez réessayer.', {
					duration: 4000,
					position: 'top-center'
				})
			}
			await update()
		}
	}}
>
	<label for="avis"> Faites-nous un retour sur ce que vous aimeriez que l’on améliore ? </label>
	<textarea
		id="avis"
		name="avis"
		rows="4"
		placeholder="ex: J’aimerais avoir des graphiques pour savoir quels sont les métiers les plus impactés par l’IA.
"
		required
	></textarea>

	<button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
	</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 2rem 0;
		width: 100%;
	}

	label {
		font-weight: bold;
	}

	textarea {
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		resize: vertical;
		width: 100%;
		background: white;
	}

	button {
		align-self: flex-start;
		background-color: #ff9416;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border-radius: 4px;
		cursor: pointer;
		width: 100%;
		font-size: large;
		font-weight: bold;
	}

	button:hover:not(:disabled) {
		background-color: #e68314;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
