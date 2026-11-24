# Ruang Sela Foto: cerita foto dan tanya tanggal

Demo portofolio untuk fotografer independen. Calon klien membaca tiga cerita foto (pasangan dan keluarga), membuka paket yang dipakai di cerita itu, lalu menanyakan tanggal. Fotografer menerima pertanyaan yang sudah mencantumkan paket, tanggal, dan kontak.

Nama studio, nama orang dalam cerita, dan semua pertanyaan di proyek ini fiktif. Foto berasal dari Pexels (lihat [Aset dan lisensi](#aset-dan-lisensi)).

**Status:** selesai dan teruji lokal (24 Nov 2026). Belum di-deploy. Langkahnya ada di bagian [Deploy ke Vercel](#deploy-ke-vercel).

| Cerita di HP | Konfirmasi di HP |
|---|---|
| ![Cerita "Jalan pulang setelah hujan" di lebar 390 px](docs/hp-cerita.png) | ![Konfirmasi dengan status Menunggu balasan](docs/hp-menunggu-balasan.png) |

## Stack

- SvelteKit 3 (Svelte 5, TypeScript), form action, `@sveltejs/adapter-vercel`, runtime Node.js 22 (region `sin1`).
- Supabase Postgres lewat driver `postgres` dari fungsi server.
- Cerita foto berupa konten lokal terstruktur (`src/lib/stories.ts`). Daftar paket dan pertanyaan disimpan di Postgres.
- Postgres lokal tertanam (`embedded-postgres`) untuk dev dan tes.

## Prasyarat

- Node.js 22 atau lebih baru (diuji dengan Node 24.11).
- npm 10 atau lebih baru.

## Menjalankan lokal

```powershell
npm install
copy .env.example .env      # isi DATABASE_URL dengan URL lokal di bawah
npm run db:start            # terminal 1: Postgres lokal di port 55403
npm run db:setup            # terminal 2: migrasi + seed paket
npm run dev                 # http://localhost:5173
```

```
DATABASE_URL=postgres://postgres:postgres-lokal@127.0.0.1:55403/ruang_sela_foto
```

| Perintah | Fungsi |
|---|---|
| `npm run db:start` | Menyalakan Postgres lokal dan membuat database `ruang_sela_foto` serta `ruang_sela_foto_test` |
| `npm run db:migrate` / `db:seed` / `db:setup` | Migrasi dan seed paket (keduanya aman diulang) |
| `npm run check` · `npm run lint` | Pemeriksaan tipe · ESLint |
| `npm test` | Tes F1–F4 terhadap database tes terpisah |
| `npm run build` | Build produksi untuk Vercel |
| `npm run build:local` lalu `npm run start:local` | Pratinjau produksi lokal di http://localhost:4173 (adapter Node, CSRF aktif) |
| `npm run pertanyaan` | Akses pemilik (lihat di bawah) |
| `npm run images` | Memproses ulang foto dari `assets-src/raw` |

> **Catatan Windows:** langkah akhir `npm run build` membuat symlink untuk Vercel Build Output dan gagal dengan `EPERM` jika Developer Mode Windows belum aktif. Kompilasi aplikasinya lulus, dan build di Vercel (Linux) tidak terdampak. Untuk menguji build di Windows, pakai `build:local`.

## Akses pemilik

```powershell
npm run pertanyaan                          # semua pertanyaan, urut tanggal sesi
npm run pertanyaan -- --status menunggu     # yang belum dibalas
npm run pertanyaan -- --tanggal 2026-12-12  # satu tanggal sesi
```

Contoh keluaran dengan data fiktif:

```
Ruang Sela Foto · 2 pertanyaan
────────────────────────────────────────────────────────────────
Sabtu, 12 Desember 2026  ·  Pasangan  ·  Menunggu balasan
   Laras Wening <laras@contoh.id>
   "Kami ingin sesi pagi di kafe dekat rumah, sebelum jam 9."
   masuk 2026-11-24 13:09 UTC
Sabtu, 12 Desember 2026  ·  Keluarga  ·  Menunggu balasan
   Bima Arya <bima@contoh.id>
   "Dua anak, satu kucing."
   masuk 2026-11-24 13:09 UTC
────────────────────────────────────────────────────────────────
```

## Aturan bisnis

- Ada tiga cerita: **Dua cangkir sebelum kota bangun** (pasangan), **Minggu pagi di rumah Nara** (keluarga), dan **Jalan pulang setelah hujan** (pasangan). Foto dalam satu cerita berasal dari satu sesi pemotretan yang sama.
- Paket aktif: **Pasangan** Rp850.000 / 60 menit / 25 foto, dan **Keluarga** Rp1.200.000 / 90 menit / 40 foto. Keduanya diserahkan dalam 7 hari kerja. Paket *Prewedding luar kota* sengaja dibuat nonaktif sebagai contoh paket yang ditolak server.
- Tombol **Tanyakan tanggal** di akhir cerita membuka `/tanya?paket=…&dari=…`, sehingga paket sudah terpilih saat formulir terbuka.
- Tanggal sesi harus mulai besok sampai 365 hari ke depan menurut Asia/Jakarta. Tanggal disimpan sebagai `date` (tanggal lokal) dan selalu dibaca sebagai teks `YYYY-MM-DD`, sehingga tidak bergeser karena zona waktu. Ini diuji dengan koneksi bertimezone Los Angeles.
- Tanggal yang sama boleh ditanyakan beberapa orang karena tidak ada constraint unik. Konfirmasi tidak menjanjikan slot: statusnya **Menunggu balasan**.

## Keamanan dan privasi

- Validasi server dengan zod: paket dicek ke daftar tepercaya di database, tanggal harus ada di kalender dan masuk rentang, nama 2–60 huruf, email valid (disimpan huruf kecil), dan catatan maksimal 500 karakter. Semua kesalahan dilaporkan per field sekaligus, dan isian lain tetap terisi.
- Query berparameter. Origin form diperiksa oleh CSRF SvelteKit di produksi (diuji: lintas origin mendapat 403).
- Pembatasan laju disimpan di Postgres (`foto.rate_limits`, 8 kiriman per 10 menit per IP yang di-hash).
- Schema privat `foto`, dengan akses `anon`/`authenticated` Supabase dicabut.
- Balasan kirim hanya berisi paket, tanggal, dan status. Nama, email, dan catatan tidak pernah dikirim kembali ke browser, dan tidak ada halaman atau endpoint publik yang membaca pertanyaan.
- Log menyamarkan email dan nomor. `.env` dan `.data/` tidak masuk git. `/og` hanya ada saat dev.

## Hasil tes dan verifikasi (lokal, 24 Nov 2026)

| Pemeriksaan | Cara | Hasil |
|---|---|---|
| Tipe · lint | `npm run check` · `npm run lint` | 0 error · bersih |
| Tes aturan bisnis | `npm test` | 20/20 lulus |
| Build | `npm run build` / `build:local` | kompilasi lulus; symlink Vercel ditolak Windows; build Node lulus |
| F1 di browser (390 px) | Cerita "Dua cangkir…" → **Tanyakan tanggal** → **Isi contoh** → kirim | Paket Pasangan sudah terpilih; konfirmasi "Sabtu, 12 Desember 2026 · Menunggu balasan" dengan salinan yang diminta; fokus pindah ke judul |
| F2 di browser + CLI | Pertanyaan kedua (Keluarga) untuk 12 Des | Dua baris terpisah di `npm run pertanyaan`; tanggal tetap bisa ditanyakan |
| F3 di browser | Tanggal 1 Nov + email `bima@` | Pesan di bawah field tanggal dan email; nama, catatan, dan paket tetap terisi; fokus ke field pertama yang salah; tidak ada baris baru |
| F3 lewat HTTP | paket nonaktif | 400 dengan error `packageId` |
| F4 (server produksi lokal) | Ambil `/`, `/paket`, `/tanya`, tiga cerita, dan `__data.json`-nya setelah ada pertanyaan | Tidak ada nama, email, atau catatan pengirim di HTML maupun data publik |
| Restart | Postgres dihentikan dan dinyalakan ulang | 4 pertanyaan tetap terbaca |
| Layout | 390 px dan 1440 px | Tanpa scroll horizontal; urutan foto bermakna di HP tanpa hover maupun animasi |

Environment: Windows 11, Node 24.11.1, Postgres tertanam lokal. Vercel Preview dan Production belum diuji.

## Deploy ke Vercel

1. **Database.** Siapkan Supabase untuk Production dan Preview. Pakai connection string **Transaction pooler** (port 6543).
2. **Migrasi dan seed** dari terminal:
   ```powershell
   $env:DATABASE_URL = "<url pooler Preview>"; npm run db:setup
   $env:DATABASE_URL = "<url pooler Production>"; npm run db:setup
   ```
3. **Proyek Vercel** `ruang-sela-foto` dengan **Root Directory** `03-ruang-sela-foto`. Build `npm run build`. Foto ada di `static/foto` (sekitar 2,2 MB) dan dideploy sebagai file statis.
4. **Environment variable** `DATABASE_URL`: Preview diisi URL database Preview, Production diisi URL database Production.
5. **Uji Preview:** jalankan F1 dari HP, cek dengan `npm run pertanyaan` memakai URL Preview, lalu buka situs di browser lain dan pastikan data pengirim tidak muncul.
6. **Production:** buka di jendela privat, periksa `/og.jpg`, kirim satu pertanyaan sintetis, redeploy, dan pastikan pertanyaan itu masih ada.

`og:image` otomatis memakai domain permintaan, misalnya `https://ruang-sela-foto.vercel.app/og.jpg`. Bagikan tautan beranda atau tautan satu cerita di Threads, bukan `/tanya` yang sudah terisi.

## Konten Threads

**Caption (siap edit):**

> Fotografer: berapa kali calon klien DM "kak, pricelist?" lalu hilang?
>
> Saya buat demo portofolio untuk fotografer pasangan dan keluarga. Calon klien membaca satu cerita foto, melihat paket yang dipakai di cerita itu, lalu langsung menanyakan tanggal. Pertanyaan yang masuk sudah berisi paket, tanggal, dan email, jadi kamu tinggal cek jadwal dan membalas.
>
> Coba dari HP (data contoh): [tautan]
>
> Fotografer yang mau situs seperti ini, DM aja. Kita mulai dari cerita foto terbaikmu.

**Alur rekam layar 20 detik (HP, 390 px):**

| Detik | Layar | Teks di layar |
|---|---|---|
| 0–4 | Beranda: foto payung, "Ruang Sela Foto", lalu gulir ke "Tiga cerita" | "Pricelist saja tidak cukup" |
| 4–15 | Buka "Dua cangkir sebelum kota bangun", gulir beberapa foto, kotak paket Pasangan Rp850.000, **Tanyakan tanggal**, **Isi contoh**, **Kirim pertanyaan** | "Dari cerita langsung ke tanggal" |
| 15–20 | Konfirmasi: Pasangan · Sabtu, 12 Desember 2026 · *Menunggu balasan* | "Pertanyaan masuk lengkap. Fotografer? DM." |

## Aset dan lisensi

Semua foto dari Pexels ([Lisensi Pexels](https://www.pexels.com/license/): bebas dipakai, atribusi tidak wajib). Foto disimpan dalam rasio asli (dua ukuran WebP). Pemotongan di layar memakai titik fokus per foto (`focus` di `src/lib/stories.ts`) melalui CSS `object-position`.

| Cerita | Fotografer | Foto Pexels |
|---|---|---|
| Dua cangkir sebelum kota bangun | SHVETS production | 8972572, 8972566, 8972560, 8972554, 8972571, 8972556, 8972581 |
| Minggu pagi di rumah Nara | Pavel Danilyuk | 7220443, 7220436, 7220442, 7220458, 7220448, 7220468 |
| Jalan pulang setelah hujan | Daniel Rocha | 10429483, 10429484, 10429485, 10429486 |

Setiap foto bisa dibuka di `https://www.pexels.com/photo/<nomor>/`. Nama orang dalam cerita (Ratna, Hendra, Nara) adalah tokoh fiktif untuk demo, bukan nama model foto.

`static/og.jpg` adalah tangkapan halaman `/og` proyek ini (1200×630). Font Cormorant Garamond dan Karla dibundel lewat Fontsource (SIL Open Font License).

## Struktur

```
db/migrations/001_init.sql      packages, inquiries, rate_limits (schema foto)
scripts/                        db-local, migrate, seed, pertanyaan, images, start-local
src/lib/stories.ts              tiga cerita, urutan foto, titik fokus, caption
src/lib/dates.ts                tanggal WIB dan rentang tanggal sesi
src/lib/server/inquiries.ts     paket tepercaya, validasi, simpan pertanyaan, data pemilik
src/routes/+page.svelte         beranda dan indeks cerita
src/routes/cerita/[slug]/       esai foto + paket terkait
src/routes/paket/               daftar paket
src/routes/tanya/               formulir dan konfirmasi
tests/inquiries.test.ts         skenario F1–F4
```
