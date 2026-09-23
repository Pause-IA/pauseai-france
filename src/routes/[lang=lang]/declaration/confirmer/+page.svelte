<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '$components/Button.svelte'
	import { Card, PageHero } from '$components/ui'
	import DeclarationNextSteps from '$components/DeclarationNextSteps.svelte'
	import type { PageData } from './$types'

	// Lien reçu par e-mail : /[lang]/declaration/confirmer?t=<jeton>.
	// La confirmation passe par un bouton (POST) et non par la simple ouverture
	// du lien, que les antivirus de messagerie déclenchent automatiquement.

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = `/${data.lang}`
	$: title = isEn ? 'Confirm your signature' : 'Confirmer votre signature'

	let token = ''
	let state: 'loading' | 'ready' | 'sending' | 'done' | 'invalid' | 'error' = 'loading'
	let alreadyConfirmed = false
	let listed = false

	onMount(() => {
		token = new URLSearchParams(window.location.search).get('t') ?? ''
		state = token ? 'ready' : 'invalid'
	})

	async function confirm() {
		state = 'sending'
		try {
			const res = await fetch('/api/declaration/confirm', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token })
			})
			const result = (await res.json()) as {
				success?: boolean
				alreadyConfirmed?: boolean
				listed?: boolean
			}
			if (res.ok && result.success) {
				alreadyConfirmed = Boolean(result.alreadyConfirmed)
				listed = Boolean(result.listed)
				state = 'done'
			} else {
				state = res.status === 400 ? 'invalid' : 'error'
			}
		} catch {
			state = 'error'
		}
	}
</script>

<svelte:head>
	<title>{title} – Pause IA</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<article>
	<PageHero>{isEn ? 'The PauseAI statement' : 'La déclaration PauseAI'}</PageHero>

	<Card>
		<div aria-live="polite">
			{#if state === 'loading'}
				<p>…</p>
			{:else if state === 'ready' || state === 'sending'}
				<h2>{title}</h2>
				<p>
					{#if isEn}
						One click to confirm your email address: your signature will then be counted.
					{:else}
						Un clic pour confirmer votre adresse e-mail : votre signature sera alors comptabilisée.
					{/if}
				</p>
				<Button on:click={confirm} disabled={state === 'sending'}>
					{#if state === 'sending'}
						{isEn ? 'Confirming…' : 'Confirmation…'}
					{:else}
						{isEn ? 'Confirm my signature' : 'Confirmer ma signature'}
					{/if}
				</Button>
			{:else if state === 'done'}
				<h2>
					{#if alreadyConfirmed}
						{isEn ? 'Your signature was already confirmed' : 'Votre signature était déjà confirmée'}
					{:else}
						{isEn
							? 'Thank you, your signature is confirmed!'
							: 'Merci, votre signature est confirmée !'}
					{/if}
				</h2>
				<p>
					{#if isEn}
						{listed
							? 'Your name now appears in the list of signatories.'
							: 'It is now counted among the signatures.'}
						<a href="{prefix}/declaration">See the statement</a>.
					{:else}
						{listed
							? 'Votre nom apparaît désormais dans la liste des signataires.'
							: 'Elle est désormais comptée parmi les signatures.'}
						<a href="{prefix}/declaration">Voir la déclaration</a>.
					{/if}
				</p>
				<DeclarationNextSteps lang={data.lang} />
			{:else if state === 'invalid'}
				<h2>{isEn ? 'Invalid or expired link' : 'Lien invalide ou expiré'}</h2>
				<p>
					{#if isEn}
						This confirmation link is incomplete or has expired (links are valid for 30 days).
						<a href="{prefix}/declaration#signer">Sign again</a> to receive a new one.
					{:else}
						Ce lien de confirmation est incomplet ou a expiré (les liens sont valables 30 jours).
						<a href="{prefix}/declaration#signer">Signez à nouveau</a> pour en recevoir un nouveau.
					{/if}
				</p>
			{:else}
				<h2>{isEn ? 'Something went wrong' : 'Une erreur est survenue'}</h2>
				<p>
					{isEn
						? 'Your signature could not be confirmed right now. Please try again in a few minutes.'
						: 'Votre signature n’a pas pu être confirmée pour le moment. Merci de réessayer dans quelques minutes.'}
				</p>
				<Button on:click={confirm}>{isEn ? 'Try again' : 'Réessayer'}</Button>
			{/if}
		</div>
	</Card>
</article>

<style>
	article {
		max-inline-size: var(--width-content);
		margin-inline: auto;
		margin-top: 3rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	h2 {
		margin: 0 0 1rem;
		font-size: 1.5rem;
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
	}
</style>
