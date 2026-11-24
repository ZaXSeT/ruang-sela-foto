<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick, untrack } from 'svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { addDays, longDate } from '#lib/dates.ts';
	import { STUDIO, rupiah } from '#lib/studio.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const initial = untrack(() => ({ ...form?.values, selected: data.selected }));
	let packageId = $state(initial.packageId || initial.selected || '');
	let date = $state(initial.date ?? '');
	let name = $state(initial.name ?? '');
	let email = $state(initial.email ?? '');
	let note = $state(initial.note ?? '');
	let submitting = $state(false);

	let errors = $derived<Record<string, string>>(form?.errors ?? {});
	let message = $derived(form?.message ?? '');
	let inquiry = $derived(form?.inquiry ?? null);
	let doneHeading: HTMLElement | undefined = $state();

	function fillExample() {
		// Sabtu pertama setelah dua minggu dari sekarang, supaya contoh terlihat realistis.
		let d = addDays(data.range.min, 13);
		while (!longDate(d).startsWith('Sabtu')) d = addDays(d, 1);
		date = d;
		name = 'Laras Wening';
		email = 'laras@contoh.id';
		note = 'Kami ingin sesi pagi di kafe dekat rumah, sebelum jam 9.';
	}

	function again() {
		inquiry = null;
		date = '';
		note = '';
	}
</script>

<Seo
	title="Tanyakan tanggal · Ruang Sela Foto"
	description="Pilih paket, tanggal sesi, lalu tinggalkan nama dan email. Fotografer memeriksa jadwal sebelum menyetujui sesi. Proyek konsep dengan data contoh."
/>

<div class="page">
	{#if inquiry}
		<section class="done" aria-labelledby="judul-selesai">
			<h1 id="judul-selesai" tabindex="-1" bind:this={doneHeading}>Pertanyaan terkirim</h1>
			<dl>
				<div><dt>Paket</dt><dd>{inquiry.packageName}</dd></div>
				<div><dt>Tanggal sesi</dt><dd>{longDate(inquiry.date)}</dd></div>
				<div><dt>Status</dt><dd class="status">Menunggu balasan</dd></div>
			</dl>
			<p class="copy">
				Pertanyaan demo tersimpan. Dalam layanan ini, fotografer memeriksa jadwal sebelum menyetujui sesi.
			</p>
			<p class="muted">{STUDIO.contact} Tanggal ini belum dipesan untukmu sampai ada balasan.</p>
			<div class="actions">
				<a class="btn line" href="/#cerita" onclick={again}>Kembali ke cerita</a>
			</div>
		</section>
	{:else}
		<header>
			{#if data.from}
				<a class="back" href={`/cerita/${data.from.slug}`}>Kembali ke “{data.from.title}”</a>
			{/if}
			<h1>Tanyakan tanggal</h1>
			<p>Pilih paket dan tanggal. Saya membalas lewat email setelah memeriksa jadwal.</p>
		</header>

		<form
			method="POST"
			novalidate
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					await update({ reset: false });
					await tick();
					if (result.type === 'success') {
						window.scrollTo({ top: 0 });
						doneHeading?.focus();
					} else {
						(
							document.querySelector<HTMLElement>('[aria-invalid="true"]') ??
							document.querySelector<HTMLElement>('.field-error, .notice')
						)?.focus();
					}
				};
			}}
		>
			<fieldset aria-describedby={errors.packageId ? 'err-paket' : undefined}>
				<legend>Paket</legend>
				{#if errors.packageId}<p class="field-error" id="err-paket" tabindex="-1">{errors.packageId}</p>{/if}
				<div class="choices">
					{#each data.packages as p (p.id)}
						<label class="choice" class:on={packageId === p.id}>
							<input type="radio" name="packageId" value={p.id} bind:group={packageId} />
							<span class="c-name">{p.name}</span>
							<span class="c-meta">{rupiah(p.price_idr)} · {p.duration_min} menit · {p.photos} foto · {p.delivery_days} hari kerja</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<p class="demo-flag">
				Proyek konsep · gunakan data contoh.
				<button type="button" class="linkish" onclick={fillExample}>Isi contoh</button>
			</p>

			<div class="field">
				<label for="date">Tanggal sesi</label>
				<input
					id="date"
					name="date"
					type="date"
					min={data.range.min}
					max={data.range.max}
					bind:value={date}
					aria-invalid={errors.date ? 'true' : undefined}
					aria-describedby="hint-tanggal{errors.date ? ' err-tanggal' : ''}"
				/>
				<p class="hint" id="hint-tanggal">
					Mulai besok sampai setahun ke depan. Tanggal yang sama boleh ditanyakan beberapa orang.
				</p>
				{#if errors.date}<p class="field-error" id="err-tanggal">{errors.date}</p>{/if}
			</div>

			<div class="field">
				<label for="name">Nama</label>
				<input
					id="name"
					name="name"
					type="text"
					autocomplete="name"
					maxlength="60"
					bind:value={name}
					aria-invalid={errors.name ? 'true' : undefined}
					aria-describedby={errors.name ? 'err-nama' : undefined}
				/>
				{#if errors.name}<p class="field-error" id="err-nama">{errors.name}</p>{/if}
			</div>

			<div class="field">
				<label for="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					inputmode="email"
					maxlength="254"
					bind:value={email}
					aria-invalid={errors.email ? 'true' : undefined}
					aria-describedby="hint-email{errors.email ? ' err-email' : ''}"
				/>
				<p class="hint" id="hint-email">Balasan dikirim ke alamat ini.</p>
				{#if errors.email}<p class="field-error" id="err-email">{errors.email}</p>{/if}
			</div>

			<div class="field">
				<label for="note">Catatan <span class="opt">(opsional)</span></label>
				<textarea
					id="note"
					name="note"
					rows="4"
					maxlength="500"
					bind:value={note}
					aria-invalid={errors.note ? 'true' : undefined}
					aria-describedby="hint-catatan{errors.note ? ' err-catatan' : ''}"
				></textarea>
				<p class="hint" id="hint-catatan">Lokasi yang dibayangkan, jumlah orang, atau jam yang cocok.</p>
				{#if errors.note}<p class="field-error" id="err-catatan">{errors.note}</p>{/if}
			</div>

			{#if message}<p class="notice" tabindex="-1" role="alert">{message}</p>{/if}

			<button class="btn send" type="submit" disabled={submitting}>
				{submitting ? 'Mengirim…' : 'Kirim pertanyaan'}
			</button>
		</form>
	{/if}
</div>

<style>
	.page {
		padding-inline: var(--gutter);
		max-width: 40rem;
	}
	header {
		padding-block: 2rem 1.5rem;
	}
	.back {
		display: inline-block;
		margin-bottom: 1rem;
		font-family: var(--serif);
		font-size: 1.15rem;
	}
	h1 {
		font-size: clamp(2.6rem, 9vw, 4rem);
		font-weight: 400;
	}
	header p {
		margin-top: 0.75rem;
		color: var(--charcoal-soft);
	}
	form {
		display: grid;
		gap: 1.5rem;
	}
	fieldset {
		border: 0;
		margin: 0;
		padding: 0;
		min-width: 0;
	}
	legend {
		font-weight: 650;
		padding: 0;
		margin-bottom: 0.5rem;
	}
	.choices {
		display: grid;
		gap: 0.6rem;
	}
	.choice {
		position: relative;
		display: grid;
		gap: 0.1rem;
		padding: 0.85rem 1rem 0.85rem 2.75rem;
		border: 1px solid var(--rule);
		background: #fbf8f2;
		cursor: pointer;
	}
	.choice.on {
		border-color: var(--charcoal);
		box-shadow: inset 0 0 0 1px var(--charcoal);
	}
	.choice input {
		position: absolute;
		left: 1rem;
		top: 1.15rem;
		width: 1.1rem;
		height: 1.1rem;
		accent-color: var(--charcoal);
	}
	.c-name {
		font-family: var(--serif);
		font-size: 1.5rem;
		line-height: 1.1;
	}
	.c-meta {
		font-size: 0.9rem;
		color: var(--muted);
	}
	.demo-flag {
		font-size: 0.9rem;
		background: var(--ivory-deep);
		padding: 0.55rem 0.8rem;
	}
	.linkish {
		background: none;
		border: 0;
		padding: 0.25rem;
		font-weight: 700;
		text-decoration: underline;
		cursor: pointer;
		color: var(--charcoal);
	}
	.field label {
		display: block;
		font-weight: 650;
		margin-bottom: 0.3rem;
	}
	.opt {
		font-weight: 400;
		color: var(--muted);
	}
	.field input,
	.field textarea {
		width: 100%;
		min-height: 3rem;
		padding: 0.65rem 0.8rem;
		border: 1px solid #8a8378;
		border-radius: 0;
		background: #fffdf9;
		font: inherit;
		color: var(--charcoal);
	}
	.field textarea {
		resize: vertical;
	}
	.field [aria-invalid='true'] {
		border: 2px solid var(--alert);
	}
	.hint {
		font-size: 0.85rem;
		color: var(--muted);
		margin-top: 0.3rem;
	}
	.field-error {
		color: var(--alert);
		font-weight: 650;
		font-size: 0.95rem;
		margin-top: 0.3rem;
	}
	.notice {
		border-left: 3px solid var(--alert);
		padding: 0.6rem 0.9rem;
		background: #f6e8e2;
	}
	.send {
		justify-self: start;
		min-width: 14rem;
	}

	.done {
		padding-top: 2.5rem;
		display: grid;
		gap: 1.25rem;
	}
	.done h1:focus {
		outline: none;
	}
	.done dl {
		margin: 0;
		border-block: 1px solid var(--charcoal);
		padding-block: 1rem;
		display: grid;
		gap: 0.6rem;
	}
	.done dl div {
		display: grid;
		grid-template-columns: 8rem 1fr;
		gap: 1rem;
		align-items: baseline;
	}
	.done dt {
		font-size: 0.9rem;
		color: var(--muted);
	}
	.done dd {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.45rem;
	}
	.status {
		font-style: italic;
	}
	.copy {
		font-family: var(--serif);
		font-size: 1.35rem;
		line-height: 1.4;
	}
	.muted {
		color: var(--muted);
	}
</style>
