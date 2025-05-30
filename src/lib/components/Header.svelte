<script lang="ts">
	import NavLink from '$components/Navlink.svelte'
	import Logo from '$components/Logo.svelte'
	import { page } from '$app/stores'
	import Button from '$components/Button.svelte'
	import Banner from '$components/Banner.svelte'

	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	$: onHomepage = $page.url.pathname == '/'

	let open = false
	// Workaround to trigger transitions on render
	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

<Banner visible={true}>
	Nous avons <a href="/waitbutwhy1" target="_blank">traduit</a> et <a href="https://pauseia.substack.com/p/la-revolution-de-lia-dix-ans-apres" target="_blank">mis en perspective</a> la série de Wait But Why sur l'IA ! Fun et pédagogique, elle permet de se familiariser avec le potentiel et les dangers de l'IA.
</Banner>

<!-- probably have to change nav colors and classes to respond to banner presence instead of route -->
{#if mounted || !onHomepage}
	<nav in:fade={{ duration: 500, delay: 200 }}>
		<a href="/" class="logo">
			<div class="big-logo">
				<Logo animate fill_pause={onHomepage ? 'white' : 'black'} />
			</div>
			<div class="small-logo">
				<Logo animate only_circle />
			</div>
		</a>

		<div class="nav-right">
			<div class="nav-links">
				<NavLink href="/qui-sommes-nous">A propos</NavLink>
				<NavLink href="/dangers">Dangers</NavLink>
				<NavLink href="/propositions">Propositions</NavLink>
				<NavLink href="https://pauseia.substack.com/">Blog</NavLink>
				<NavLink href="/dons">Donner</NavLink>
				<Button href="/agir" alt={onHomepage}>Agir</Button>
			</div>
			<button aria-label="Open mobile menu" class="hamburger" on:click={() => (open = !open)}>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect y="0" height="3" width="24" fill={onHomepage ? 'white' : 'black'} />
					<rect y="10.5" height="3" width="24" fill={onHomepage ? 'white' : 'black'} />
					<rect y="21" height="3" width="24" fill={onHomepage ? 'white' : 'black'} />
				</svg>
			</button>
		</div>

		<div class="sidebar" class:open>
			<div class="sidebar-head">
				<a href="/" class="logo">
					<Logo animate={onHomepage} fill_circle="white" fill_ai="white" />
				</a>
				<button aria-label="Close mobile menu" class="hamburger" on:click={() => (open = !open)}>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							y="2.21387"
							width="3.13043"
							height="30.8142"
							transform="rotate(-45 0 2.21387)"
							fill="black"
						/>
						<rect
							x="21.7891"
							y="0.000244141"
							width="3.13043"
							height="30.8142"
							transform="rotate(45 21.7891 0.000244141)"
							fill="black"
						/>
					</svg>
				</button>
			</div>
			<div class="sidebar-links">
				<a href="/qui-sommes-nous" on:click={() => (open = !open)}><h2>A propos</h2></a>
				<a href="/dangers" on:click={() => (open = !open)}><h2>Dangers</h2></a>
				<a href="/propositions" on:click={() => (open = !open)}><h2>Propositions</h2></a>
				<a href="/agir" on:click={() => (open = !open)}><h2>Agir</h2></a>
				<a href="https://pauseia.substack.com/" on:click={() => (open = !open)}><h2>Blog</h2></a>
				<a href="/dons" on:click={() => (open = !open)}><h2>Dons</h2></a>
				<a href="/nous-rejoindre" on:click={() => (open = !open)}><h2>Nous rejoindre</h2></a>
			</div>
		</div>
	</nav>
{/if}

<style>
	.sidebar {
		position: fixed;
		height: 100%;
		width: 100%;
		background: #ff9416;
		top: 0;
		left: 100%;
		transition: left 0.3s ease-in-out;
		z-index: 1000;
	}

	.sidebar-links {
		display: flex;
		flex-direction: column;
	}

	.sidebar-links a {
		text-decoration: none;
	}

	.sidebar-links a:hover {
		color: white;
	}

	.sidebar-links h2 {
		font-size: 1.5rem;
		margin-bottom: 2rem;
	}

	.sidebar-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2rem;
	}

	.open {
		left: 0;
	}

	nav {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		z-index: 2;
	}

	nav,
	.sidebar {
		padding: 1rem;
	}

	.nav-right {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.nav-links {
		display: none;
		flex-wrap: wrap;
		justify-content: center;
		align-items: stretch;
		gap: 1rem;
	}

	.hamburger {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.logo {
		line-height: 0;
	}

	.small-logo {
		display: block;
	}

	.small-logo :global(svg) {
		width: 3rem;
	}

	.big-logo {
		display: none;
	}

	@media (min-width: 480px) {
		.big-logo {
			display: block;
		}

		.small-logo {
			display: none;
		}
	}

	@media (min-width: 640px) {
		nav,
		.sidebar {
			padding: 2rem 2rem;
		}
	}
	@media (min-width: 768px) {
		nav,
		.sidebar {
			padding: 2rem 4rem;
		}
	}

	@media (min-width: 1024px) {
		nav {
			flex-direction: row;
			align-items: center;
		}

		.nav-links {
			display: flex;
		}

		.hamburger,
		.sidebar {
			display: none;
		}
		nav {
			padding: 2rem 6rem;
		}
		.nav-links {
			gap: 1.3rem;
		}
	}

	@media (min-width: 1280px) {
		.big-logo {
			display: block;
		}

		.small-logo {
			display: none;
		}

		.nav-links {
			gap: 2rem;
		}
	}
</style>
