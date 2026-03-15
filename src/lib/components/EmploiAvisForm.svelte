<script lang="ts">
	import { enhance } from '$app/forms'
	import toast from 'svelte-french-toast'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'

	export let lang: Lang = 'fr'

	$: t = getT(lang)

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
				toast.success(t.emploi_ia.feedback_form_success, {
					duration: 4000,
					position: 'top-center'
				})
			} else if (result.type === 'failure') {
				toast.error(t.emploi_ia.feedback_form_error, {
					duration: 4000,
					position: 'top-center'
				})
			}
			await update()
		}
	}}
>
	<label for="avis"> {t.emploi_ia.feedback_form_label} </label>
	<textarea
		id="avis"
		name="avis"
		rows="4"
		placeholder={t.emploi_ia.feedback_form_placeholder}
		required
	></textarea>

	<button type="submit" disabled={isSubmitting}>
		{isSubmitting ? t.emploi_ia.feedback_form_submitting : t.emploi_ia.feedback_form_submit}
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
		border: 1px solid var(--border);
		border-radius: 8px;
		resize: vertical;
		width: 100%;
		background: var(--bg);
		color: var(--text);
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
