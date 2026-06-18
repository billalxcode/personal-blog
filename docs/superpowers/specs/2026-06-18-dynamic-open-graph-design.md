# Rencana Desain: Dynamic Open Graph Image

Menambahkan fitur dynamic Open Graph (OG) image untuk artikel blog agar otomatis di-generate menggunakan teks saja (judul artikel, penulis, dan sumber domain) ketika halaman diakses.

## Deskripsi Fungsional

Saat tautan artikel dibagikan ke media sosial (seperti Twitter, LinkedIn, Discord, dll.), platform tersebut akan menampilkan gambar pratinjau (Open Graph image). Dibandingkan menggunakan gambar statis atau tidak ada gambar sama sekali, kita akan men-generate gambar PNG berukuran 1200x630 piksel secara dinamis menggunakan judul artikel, nama penulis, dan domain blog.

Desain visual mengikuti estetika "Academic Light" yang disukai pengguna:
* Latar belakang abu-abu terang (`#f4f4f5`) yang selaras dengan warna latar belakang halaman web.
* Teks judul menggunakan font serif elegan (Lora) untuk mempertahankan nuansa jurnal ilmiah/akademik.
* Footer yang menampilkan nama penulis di sebelah kiri, dan domain web (`journal.myweb.xyz`) di sebelah kanan dengan font monospace.
* Tidak ada header tambahan di bagian atas untuk menjaga tampilan tetap bersih.

## Usulan Perubahan Teknis

### 1. Rute Baru: `app/articles/[slug]/opengraph-image.tsx`

Membuat file generator gambar OG bawaan Next.js menggunakan API `ImageResponse` dari `next/og`.

File ini akan:
1. Menerima promise `params` dan menunggu penyelesaiannya untuk mendapatkan `slug`.
2. Memanggil `getArticleBySlug(slug)` dari `lib/mdx.ts` untuk mengambil detail artikel (judul, penulis).
3. Mengunduh font **Lora-Bold** dan **Lora-Regular** secara asinkron dari Google Fonts CDN agar rendering teks serif konsisten di semua lingkungan runtime (termasuk Vercel Serverless/Edge).
4. Me-render elemen JSX dengan gaya flexbox inline yang didukung Satori ke dalam `ImageResponse`.

### 2. Integrasi Metadata Halaman `app/articles/[slug]/page.tsx`

Dengan meletakkan `opengraph-image.tsx` langsung di dalam folder rute `app/articles/[slug]/`, Next.js secara otomatis mendeteksi rute gambar tersebut dan menyuntikkan tag meta OG berikut ke dalam `<head>` halaman artikel secara otomatis:
* `<meta property="og:image" content="..." />`
* `<meta property="og:image:width" content="1200" />`
* `<meta property="og:image:height" content="630" />`
* `<meta property="og:image:type" content="image/png" />`

Kita tidak perlu mengubah properti `openGraph` secara manual di `generateMetadata` untuk menambahkan tautan gambar, karena Next.js akan mendeteksi dan menambahkannya secara otomatis.

---

## Spesifikasi Desain & Kode

### Font CDN URLs:
* Lora Bold (untuk Judul): `https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0fvvLDQ.ttf`
* Lora Regular (untuk Footer): `https://fonts.gstatic.com/s/lora/v32/0QIvMX1D_JOuMw7wfA.ttf`

### Konfigurasi ImageResponse:
* Lebar: 1200px
* Tinggi: 630px
* Tipe Konten: `image/png`

---

## Rencana Verifikasi

### Pengujian Lokal (Manual)
1. Jalankan aplikasi secara lokal dengan `npm run dev`.
2. Akses rute gambar OG secara langsung melalui browser: `http://localhost:3000/articles/[slug-artikel]/opengraph-image` (misalnya: `/articles/agentic-ai-framework/opengraph-image`).
3. Verifikasi secara visual bahwa gambar PNG di-render dengan latar belakang `#f4f4f5`, teks judul berukuran besar dengan font serif tebal, pembatas solid, dan footer berisi nama penulis serta domain web.

### Pengujian Build Produksi
1. Jalankan perintah `npm run build` untuk memastikan tidak ada kesalahan kompilasi (compile-time errors) atau masalah TypeScript.
