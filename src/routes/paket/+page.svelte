<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Figure from '#lib/components/Figure.svelte';
	import { STORIES } from '#lib/stories.ts';
	import { rupiah } from '#lib/studio.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const coverFor = (id: string) => STORIES.find((s) => s.packageId === id)!;
</script>

<Seo
	title="Paket · Ruang Sela Foto"
	description="Paket Pasangan Rp850.000 (60 menit, 25 foto) dan Keluarga Rp1.200.000 (90 menit, 40 foto). Tanyakan tanggal sesi. Proyek konsep dengan data contoh."
/>

<div class="page">
	<header>
		<h1>Paket</h1>
		<p>
			Harga sudah termasuk penyuntingan semua foto jadi. Jadwal belum terkunci sampai saya membalas
			pertanyaanmu dan kita sepakat soal tanggal.
		</p>
	</header>

	<div class="list">
		{#each data.packages as p (p.id)}
			{@const story = coverFor(p.id)}
			<section class="pkg" aria-labelledby={`paket-${p.id}`}>
				<Figure photo={story.cover} ratio="3 / 2" sizes="(min-width: 64rem) 34rem, 100vw" />
				<h2 id={`paket-${p.id}`}>{p.name}</h2>
				<p class="price">Mulai {rupiah(p.price_idr)}</p>
				<p class="summary">{p.summary}</p>
				<dl>
					<div><dt>Durasi</dt><dd>{p.duration_min} menit</dd></div>
					<div><dt>Foto jadi</dt><dd>{p.photos} foto</dd></div>
					<div><dt>Penyerahan</dt><dd>{p.delivery_days} hari kerja</dd></div>
				</dl>
				<div class="actions">
					<a class="btn" href={`/tanya?paket=${p.id}`}>Tanyakan tanggal<span class="visually-hidden">{` untuk paket ${p.name}`}</span></a>
					<a href={`/cerita/${story.slug}`}>Contoh: {story.title}</a>
				</div>
			</section>
		{/each}
	</div>
</div>

<style>
	.page {
		padding-inline: var(--gutter);
	}
	header {
		padding-block: 2rem 2.5rem;
		max-width: 40rem;
	}
	h1 {
		font-size: clamp(2.8rem, 10vw, 4.5rem);
		font-weight: 400;
	}
	header p {
		margin-top: 1rem;
		color: var(--charcoal-soft);
	}
	.list {
		display: grid;
		gap: 3.5rem;
	}
	.pkg {
		display: grid;
		gap: 0.6rem;
		align-content: start;
	}
	.pkg h2 {
		font-size: 2.4rem;
		margin-top: 0.75rem;
	}
	.price {
		font-family: var(--serif);
		font-size: 1.6rem;
	}
	.summary {
		color: var(--charcoal-soft);
		max-width: 32rem;
	}
	dl {
		margin: 0.5rem 0 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		border-block: 1px solid var(--rule);
		padding-block: 0.8rem;
	}
	dt {
		font-size: 0.85rem;
		color: var(--muted);
	}
	dd {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.3rem;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;
		margin-top: 0.75rem;
	}
	@media (min-width: 64rem) {
		.list {
			grid-template-columns: 1fr 1fr;
			gap: 3rem;
		}
	}
</style>
