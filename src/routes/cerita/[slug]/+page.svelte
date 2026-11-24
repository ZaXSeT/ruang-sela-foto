<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Figure from '#lib/components/Figure.svelte';
	import { storyBySlug, type Photo } from '#lib/stories.ts';
	import { rupiah } from '#lib/studio.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const story = $derived(storyBySlug(data.slug)!);
	const ratioOf = (p: Photo, portrait: string, landscape: string) => (p.w > p.h ? landscape : portrait);
</script>

<Seo title={`${story.title} · Ruang Sela Foto`} description={story.intro} />

<article>
	<header class="opening">
		<h1>{story.title}</h1>
		<p class="meta">{story.meta}</p>
		<p class="intro">{story.intro}</p>
	</header>

	{#each story.blocks as block, i (i)}
		{#if block.type === 'wide'}
			<div class="block wide">
				<Figure photo={block.photo} ratio="3 / 2" sizes="(min-width: 75rem) 72rem, 100vw" eager={i === 0} caption={block.caption} />
			</div>
		{:else if block.type === 'tall'}
			<div class="block tall">
				<Figure photo={block.photo} ratio="4 / 5" sizes="(min-width: 40rem) 32rem, 100vw" eager={i === 0} caption={block.caption} />
			</div>
		{:else if block.type === 'pair'}
			<div class="block pair">
				<div class="two">
					{#each block.photos as p (p.id)}
						<Figure photo={p} ratio={ratioOf(p, '4 / 5', '3 / 2')} sizes="(min-width: 48rem) 50vw, 100vw" />
					{/each}
				</div>
				{#if block.caption}<p class="pair-caption">{block.caption}</p>{/if}
			</div>
		{:else}
			<p class="block note">{block.text}</p>
		{/if}
	{/each}

	<p class="closing">{story.closing}</p>

	{#if data.pkg}
		<aside class="offer" aria-labelledby="judul-paket">
			<p class="small">Cerita ini memakai paket</p>
			<h2 id="judul-paket">{data.pkg.name}</h2>
			<dl>
				<div><dt>Mulai</dt><dd>{rupiah(data.pkg.price_idr)}</dd></div>
				<div><dt>Durasi</dt><dd>{data.pkg.duration_min} menit</dd></div>
				<div><dt>Foto jadi</dt><dd>{data.pkg.photos} foto</dd></div>
				<div><dt>Penyerahan</dt><dd>{data.pkg.delivery_days} hari kerja</dd></div>
			</dl>
			<a class="btn" href={`/tanya?paket=${data.pkg.id}&dari=${story.slug}`}>Tanyakan tanggal</a>
		</aside>
	{/if}

	<nav class="next" aria-label="Cerita berikutnya">
		<a href={`/cerita/${data.next.slug}`}>Cerita berikutnya: {data.next.title}</a>
	</nav>
</article>

<style>
	article {
		padding-inline: var(--gutter);
	}
	.opening {
		max-width: 46rem;
		padding-block: 2rem 2.5rem;
	}
	h1 {
		font-size: clamp(2.6rem, 10vw, 5.2rem);
		font-weight: 400;
		line-height: 0.98;
		letter-spacing: -0.01em;
	}
	.meta {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: var(--muted);
	}
	.intro {
		margin-top: 1.25rem;
		font-size: 1.1rem;
		max-width: var(--text);
		color: var(--charcoal-soft);
	}
	.block {
		margin-block: 3rem;
	}
	.wide {
		max-width: 72rem;
	}
	.tall {
		max-width: 32rem;
	}
	.two {
		display: grid;
		gap: 1rem;
	}
	.pair-caption,
	.note {
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.15rem;
		line-height: 1.45;
		color: var(--charcoal-soft);
		max-width: 34rem;
	}
	.pair-caption {
		margin-top: 0.6rem;
	}
	.note {
		font-size: clamp(1.35rem, 4vw, 1.75rem);
		color: var(--charcoal);
		padding-left: 1.25rem;
		border-left: 1px solid var(--charcoal);
	}
	.closing {
		max-width: var(--text);
		margin-block: 3.5rem 2.5rem;
		font-size: 1.1rem;
	}
	.offer {
		max-width: 30rem;
		border-top: 1px solid var(--charcoal);
		border-bottom: 1px solid var(--charcoal);
		padding-block: 1.5rem;
		display: grid;
		gap: 0.75rem;
		justify-items: start;
	}
	.small {
		font-size: 0.9rem;
		color: var(--muted);
	}
	.offer h2 {
		font-size: 2.4rem;
	}
	dl {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem 2rem;
		width: 100%;
	}
	dt {
		font-size: 0.85rem;
		color: var(--muted);
	}
	dd {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.35rem;
	}
	.next {
		margin-top: 2.5rem;
	}
	.next a {
		font-family: var(--serif);
		font-size: 1.3rem;
	}

	@media (min-width: 48rem) {
		.two {
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
			align-items: start;
		}
		.block {
			margin-block: 5rem;
		}
		.tall {
			margin-left: auto;
			margin-right: 12%;
		}
		.note {
			margin-left: 18%;
		}
	}
</style>
