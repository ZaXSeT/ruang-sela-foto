<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>{page.status === 404 ? 'Halaman tidak ada' : 'Ada gangguan'} · Ruang Sela Foto</title></svelte:head>

<section class="err">
	<h1>{page.status === 404 ? 'Halaman tidak ada' : 'Ada gangguan'}</h1>
	<p>
		{page.status === 404
			? 'Alamat ini tidak ada di Ruang Sela Foto.'
			: (page.error?.message ?? 'Coba muat ulang halaman.')}
	</p>
	<p><a class="btn" href="/#cerita">Lihat cerita</a></p>
</section>

<style>
	.err {
		padding: 3rem var(--gutter) 4rem;
		display: grid;
		gap: 1rem;
		justify-items: start;
	}
	h1 {
		font-size: 3rem;
		font-weight: 400;
	}
</style>
