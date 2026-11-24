<script lang="ts">
	import { HERO, STORIES, position, src } from '#lib/stories.ts';
</script>

<svelte:head><meta name="robots" content="noindex" /></svelte:head>

<div class="og">
	<img src={src(HERO)} alt="" width={HERO.w} height={HERO.h} style:object-position={position(HERO)} />
	<div class="text">
		<p class="name">Ruang Sela Foto</p>
		<p class="line">Foto pasangan dan keluarga di Bandung</p>
		<ol>
			{#each STORIES as s (s.slug)}<li>{s.title}</li>{/each}
		</ol>
		<p class="small">Paket mulai Rp850.000 · tanyakan tanggal dari HP</p>
	</div>
</div>

<style>
	:global(header.site),
	:global(footer.site),
	:global(.skip) {
		display: none !important;
	}
	.og {
		width: 1200px;
		height: 630px;
		display: grid;
		grid-template-columns: 470px 1fr;
		background: var(--ivory);
		overflow: hidden;
	}
	img {
		width: 470px;
		height: 630px;
		object-fit: cover;
	}
	.text {
		padding: 70px 64px 0;
	}
	.name {
		font: 400 92px/0.95 var(--serif);
		letter-spacing: -0.01em;
	}
	.line {
		margin-top: 16px;
		font: 400 34px var(--serif);
		color: var(--charcoal-soft);
	}
	ol {
		margin: 40px 0 0;
		padding: 22px 0 0 0;
		list-style: none;
		border-top: 1px solid var(--charcoal);
		display: grid;
		gap: 6px;
		font: italic 400 32px var(--serif);
	}
	.small {
		margin-top: 30px;
		font-size: 21px;
		color: var(--muted);
	}
</style>
