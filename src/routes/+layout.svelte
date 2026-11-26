<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<meta name="theme-color" content="#1c1a18" />
</svelte:head>

<a class="skip" href="#isi">Langsung ke isi</a>

<!-- Navbar penuh dari tepi ke tepi, menempel di atas. -->
<header class="site">
	<a class="mark" href="/">Ruang Sela Foto</a>
	<nav aria-label="Utama">
		<a href="/#cerita">Cerita</a>
		<a href="/paket">Paket</a>
		<a class="ask" href="/tanya">Tanyakan tanggal</a>
	</nav>
</header>

<main id="isi">
	{@render children()}
</main>

<footer class="site">
	<p class="foot-mark">Ruang Sela Foto</p>
	<div class="foot-info">
		<p>Fotografer pasangan dan keluarga · Bandung</p>
		<p>
			Proyek konsep untuk portofolio. Nama studio, nama orang dalam cerita, dan pertanyaan di situs ini
			fiktif. Foto dari Pexels.
		</p>
	</div>
</footer>

<style>
	.skip {
		position: absolute;
		left: 0.5rem;
		top: -3rem;
		background: var(--ivory);
		color: var(--charcoal);
		padding: 0.5rem 0.75rem;
		z-index: 60;
	}
	.skip:focus {
		top: 0.5rem;
	}
	header.site {
		position: sticky;
		top: 0;
		z-index: 30;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
		height: var(--header-h);
		padding-inline: var(--gutter);
		background: var(--charcoal);
		color: var(--ivory);
		border-bottom: 1px solid var(--bronze);
	}
	.mark {
		font-family: var(--serif);
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		text-decoration: none;
		white-space: nowrap;
	}
	nav {
		display: flex;
		align-items: center;
		gap: clamp(0.9rem, 2.5vw, 2rem);
	}
	nav a {
		text-decoration: none;
		padding-block: 0.3rem;
		border-bottom: 1px solid transparent;
	}
	nav a:hover {
		border-bottom-color: var(--bronze-soft);
		color: var(--bronze-soft);
	}
	nav a.ask {
		padding: 0.5rem 1rem;
		border: 1px solid var(--bronze);
		color: var(--bronze-soft);
	}
	nav a.ask:hover {
		background: var(--bronze);
		color: var(--charcoal);
	}
	footer.site {
		margin-top: 5rem;
		padding: 3rem var(--gutter);
		background: var(--charcoal);
		color: #cfc6b8;
		border-top: 1px solid var(--bronze);
		font-size: 0.9rem;
		display: grid;
		gap: 1.25rem;
	}
	.foot-mark {
		font-family: var(--serif);
		font-size: clamp(2.8rem, 10vw, 8rem);
		font-weight: 400;
		line-height: 0.95;
		color: var(--bronze-soft);
	}
	.foot-info {
		display: grid;
		gap: 0.4rem;
	}
	@media (min-width: 48rem) {
		.foot-info {
			grid-template-columns: 1fr 2fr;
			gap: 2rem;
		}
	}
	@media (max-width: 34rem) {
		nav a:not(.ask) {
			display: none;
		}
		nav a.ask {
			padding: 0.45rem 0.75rem;
			font-size: 0.9rem;
		}
	}
</style>
