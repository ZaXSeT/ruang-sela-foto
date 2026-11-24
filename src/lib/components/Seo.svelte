<script lang="ts">
	import { page } from '$app/state';

	let { title, description }: { title: string; description: string } = $props();
	const origin = $derived(page.url.origin);
	const canonical = $derived(origin + page.url.pathname);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:site_name" content="Ruang Sela Foto" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={`${origin}/og.jpg`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Pasangan berjalan di bawah payung setelah hujan, foto dari Ruang Sela Foto" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={`${origin}/og.jpg`} />
</svelte:head>
