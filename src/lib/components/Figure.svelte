<script lang="ts">
	import { position, src, srcset, type Photo } from '#lib/stories.ts';

	let {
		photo,
		ratio,
		sizes = '100vw',
		eager = false,
		caption
	}: {
		photo: Photo;
		/** Rasio tampilan, mis. "3 / 2". Kosong = rasio asli foto. */
		ratio?: string;
		sizes?: string;
		eager?: boolean;
		caption?: string;
	} = $props();
</script>

<figure>
	<img
		src={src(photo)}
		srcset={srcset(photo)}
		{sizes}
		width={photo.w}
		height={photo.h}
		alt={photo.alt}
		loading={eager ? 'eager' : 'lazy'}
		fetchpriority={eager ? 'high' : undefined}
		decoding="async"
		style:aspect-ratio={ratio ?? `${photo.w} / ${photo.h}`}
		style:object-position={position(photo)}
	/>
	{#if caption}<figcaption>{caption}</figcaption>{/if}
</figure>

<style>
	figure {
		margin: 0;
	}
	img {
		width: 100%;
		object-fit: cover;
		background: var(--ivory-deep);
	}
	figcaption {
		margin-top: 0.6rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.1rem;
		line-height: 1.4;
		color: var(--charcoal-soft);
		max-width: 34rem;
	}
</style>
