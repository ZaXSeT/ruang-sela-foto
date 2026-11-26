<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { afterNavigate } from '$app/navigation';
	import { STORIES } from '#lib/stories.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Menu HP: <details> tetap bisa dibuka tanpa JavaScript; dengan JS ditutup otomatis setelah pindah halaman.
	let menuOpen = $state(false);
	afterNavigate(() => {
		menuOpen = false;
	});
	$effect(() => {
		document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
	});
	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && menuOpen) {
			menuOpen = false;
			document.querySelector<HTMLElement>('.menu summary')?.focus();
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<meta name="theme-color" content="#1c1a18" />
</svelte:head>

<svelte:window onkeydown={onKey} />

<a class="skip" href="#isi">Langsung ke isi</a>

<!-- Navbar penuh dari tepi ke tepi, menempel di atas. -->
<header class="site">
	<a class="mark" href="/">Ruang Sela Foto</a>

	<nav class="inline" aria-label="Utama">
		<a href="/#cerita">Cerita</a>
		<a href="/paket">Paket</a>
		<a class="ask" href="/tanya">Tanyakan tanggal</a>
	</nav>

	<details class="menu" bind:open={menuOpen}>
		<summary>
			<span class="label">{menuOpen ? 'Tutup' : 'Menu'}</span>
			<span class="bars" aria-hidden="true"><i></i><i></i></span>
		</summary>
		<div class="panel">
			<nav aria-label="Menu utama">
				<a class="big" href="/#cerita">Cerita</a>
				<ul>
					{#each STORIES as s (s.slug)}
						<li><a href={`/cerita/${s.slug}`}>{s.title}</a></li>
					{/each}
				</ul>
				<a class="big" href="/paket">Paket</a>
				<p class="sub">Pasangan dan Keluarga, mulai Rp850.000</p>
			</nav>
			<div class="panel-foot">
				<a class="btn" href="/tanya">Tanyakan tanggal</a>
				<p>Bandung · pertanyaan dibalas lewat email dalam 1–2 hari kerja</p>
			</div>
		</div>
	</details>
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
		font-size: clamp(1.3rem, 4.5vw, 1.55rem);
		font-weight: 500;
		letter-spacing: 0.01em;
		text-decoration: none;
		white-space: nowrap;
	}

	/* ── Navigasi desktop ── */
	.inline {
		display: none;
		align-items: center;
		gap: clamp(0.9rem, 2.5vw, 2rem);
	}
	.inline a {
		text-decoration: none;
		padding-block: 0.3rem;
		border-bottom: 1px solid transparent;
	}
	.inline a:hover {
		border-bottom-color: var(--bronze-soft);
		color: var(--bronze-soft);
	}
	.inline a.ask {
		padding: 0.5rem 1rem;
		border: 1px solid var(--bronze);
		color: var(--bronze-soft);
	}
	.inline a.ask:hover {
		background: var(--bronze);
		color: var(--charcoal);
	}

	/* ── Menu HP ── */
	summary {
		list-style: none;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-height: 2.75rem;
		padding-inline: 0.25rem;
		cursor: pointer;
		font-size: 0.95rem;
		letter-spacing: 0.04em;
		color: var(--bronze-soft);
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.bars {
		display: grid;
		gap: 6px;
		width: 22px;
	}
	.bars i {
		display: block;
		height: 1.5px;
		background: var(--ivory);
		transition: transform 0.2s ease;
	}
	.menu[open] .bars i:first-child {
		transform: translateY(3.75px) rotate(45deg);
	}
	.menu[open] .bars i:last-child {
		transform: translateY(-3.75px) rotate(-45deg);
	}
	.panel {
		position: fixed;
		inset: var(--header-h) 0 0 0;
		z-index: 29;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 2rem;
		padding: 2rem var(--gutter) calc(2rem + env(safe-area-inset-bottom));
		background: var(--charcoal);
		color: var(--ivory);
		overflow-y: auto;
	}
	.panel nav {
		display: grid;
		justify-items: start;
	}
	.panel .big {
		font-family: var(--serif);
		font-size: clamp(2.6rem, 13vw, 3.6rem);
		line-height: 1.05;
		text-decoration: none;
	}
	.panel .big + ul,
	.panel .sub {
		margin: 0.5rem 0 1.75rem;
	}
	.panel ul {
		list-style: none;
		padding: 0 0 0 0.15rem;
		display: grid;
		gap: 0.15rem;
	}
	.panel ul a {
		display: inline-block;
		padding-block: 0.3rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.2rem;
		color: var(--bronze-soft);
		text-decoration: none;
	}
	.panel .sub {
		color: #bfb5a6;
	}
	.panel-foot {
		display: grid;
		gap: 0.9rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--bronze);
		font-size: 0.9rem;
		color: #bfb5a6;
	}
	.panel-foot .btn {
		width: 100%;
		min-height: 3.25rem;
		background: var(--ivory);
		color: var(--charcoal);
		border-color: var(--ivory);
	}

	@media (min-width: 48rem) {
		.inline {
			display: flex;
		}
		.menu {
			display: none;
		}
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
</style>
