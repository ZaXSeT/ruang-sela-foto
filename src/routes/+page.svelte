<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Figure from '#lib/components/Figure.svelte';
	import { HERO, STORIES } from '#lib/stories.ts';
	import { rupiah } from '#lib/studio.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const from = $derived(Math.min(...data.packages.map((p) => p.price_idr)));
	const pkgName = (id: string) => data.packages.find((p) => p.id === id)?.name ?? '';
</script>

<Seo
	title="Ruang Sela Foto · Foto pasangan dan keluarga di Bandung"
	description="Tiga cerita foto pasangan dan keluarga, paket mulai Rp850.000, dan formulir untuk menanyakan tanggal. Proyek konsep dengan data contoh."
/>

<section class="hero" aria-labelledby="judul">
	<div class="hero-photo">
		<Figure photo={HERO} ratio="4 / 5" sizes="(min-width: 64rem) 50vw, 100vw" eager />
	</div>
	<div class="hero-text">
		<h1 id="judul">Ruang Sela Foto</h1>
		<p class="lede">Fotografer pasangan dan keluarga di Bandung.</p>
		<p class="body">
			Saya memotret pagi biasa, jalan pulang, dan sarapan di rumah. Tanpa banyak arahan pose, supaya yang
			tersisa adalah cara kalian memang saling melihat.
		</p>
		<a class="btn" href={`/cerita/${STORIES[2].slug}`}>Lihat cerita</a>
	</div>
</section>

<section class="index" id="cerita" aria-labelledby="judul-cerita">
	<h2 id="judul-cerita">Tiga cerita</h2>
	<ol>
		{#each STORIES as s, i (s.slug)}
			<li class:flip={i % 2 === 1}>
				<a href={`/cerita/${s.slug}`} class="cover" tabindex="-1" aria-hidden="true">
					<Figure photo={s.cover} ratio="3 / 2" sizes="(min-width: 64rem) 55vw, 100vw" />
				</a>
				<div class="entry">
					<p class="meta">Sesi {pkgName(s.packageId).toLowerCase()}</p>
					<h3><a href={`/cerita/${s.slug}`}>{s.title}</a></h3>
					<p>{s.intro.split('. ')[0]}.</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<section class="pkg" aria-labelledby="judul-paket">
	<h2 id="judul-paket">Dua paket, mulai {rupiah(from)}</h2>
	<p>
		{#each data.packages as p, i (p.id)}{i > 0 ? ' dan ' : ''}{p.name} {p.duration_min} menit untuk {p.photos} foto jadi{/each}.
		Foto diserahkan dalam {data.packages[0]?.delivery_days ?? 7} hari kerja.
	</p>
	<a class="btn line" href="/paket">Lihat paket dan tanyakan tanggal</a>
</section>

<style>
	/* Hero: foto menempel ke tepi layar (kanan di desktop, kiri-kanan di HP) */
	.hero {
		display: grid;
		background: var(--charcoal);
		color: var(--ivory);
	}
	.hero-photo :global(img) {
		height: 100%;
	}
	.hero-text {
		display: grid;
		gap: 1.1rem;
		justify-items: start;
		align-content: end;
		padding: 2.5rem var(--gutter) 3rem;
	}
	.hero .body {
		color: #d5ccbe;
	}
	.hero .lede {
		color: var(--bronze-soft);
	}
	.hero .btn {
		background: var(--ivory);
		color: var(--charcoal);
		border-color: var(--ivory);
	}
	.hero .btn:hover {
		background: var(--bronze-soft);
		border-color: var(--bronze-soft);
	}
	h1 {
		font-size: clamp(3.4rem, 14vw, 8.5rem);
		font-weight: 400;
		letter-spacing: -0.015em;
		line-height: 0.95;
	}
	.lede {
		font-family: var(--serif);
		font-size: clamp(1.4rem, 4.5vw, 1.9rem);
		line-height: 1.25;
	}
	.body {
		max-width: 30rem;
		color: var(--charcoal-soft);
	}

	.index {
		padding: 5rem var(--gutter) 0;
	}
	.index > h2,
	.pkg h2 {
		font-size: clamp(2.4rem, 6.5vw, 5rem);
		font-weight: 400;
		margin-bottom: 2rem;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 3.5rem;
	}
	li {
		display: grid;
		gap: 1rem;
	}
	.cover {
		display: block;
	}
	.entry {
		display: grid;
		gap: 0.5rem;
		max-width: 28rem;
	}
	.meta {
		font-size: 0.9rem;
		color: var(--muted);
	}
	h3 {
		font-size: clamp(1.9rem, 4.5vw, 3.4rem);
		font-weight: 400;
	}
	.meta {
		color: var(--bronze);
	}
	h3 a {
		text-decoration: none;
	}
	h3 a:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}
	.entry p:last-child {
		color: var(--charcoal-soft);
	}

	.pkg {
		margin: 5rem var(--gutter) 0;
		padding-top: 2.5rem;
		border-top: 1px solid var(--bronze);
		display: grid;
		gap: 1rem;
		justify-items: start;
	}
	.pkg h2 {
		margin-bottom: 0;
	}
	.pkg p {
		max-width: var(--text);
		color: var(--charcoal-soft);
	}

	@media (min-width: 64rem) {
		.hero {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			min-height: calc(100svh - var(--header-h));
		}
		.hero-photo {
			order: 2;
		}
		.hero-photo :global(img) {
			aspect-ratio: auto !important;
			height: calc(100svh - var(--header-h));
			min-height: 36rem;
		}
		.hero-text {
			padding-block: 3rem 4rem;
		}
		li {
			grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
			gap: 3rem;
			align-items: end;
		}
		li.flip .cover {
			order: 2;
		}
	}
</style>
