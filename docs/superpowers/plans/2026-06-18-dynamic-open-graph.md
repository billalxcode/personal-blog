# Dynamic Open Graph Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan file `opengraph-image.tsx` pada rute `/articles/[slug]` untuk menghasilkan gambar Open Graph dinamis berbasis teks (desain Academic Light dengan latar belakang `#f4f4f5`) secara otomatis saat artikel diakses.

**Architecture:** Menggunakan konvensi rute bawaan Next.js `opengraph-image` dan API `ImageResponse` dari `next/og`. Mengunduh font Lora (Serif) dari Google Fonts CDN secara asinkron untuk merender teks tebal (Bold) pada judul dan teks normal (Regular) pada footer.

**Tech Stack:** Next.js (App Router, v16.2.9), React 19, next/og, TypeScript.

---

### Task 1: Membuat Skrip Verifikasi Independen
Untuk menguji pengambilan data artikel dan koneksi internet (unduh font) sebelum kita menulis kode Next.js.

**Files:**
- Create: `scratch/verify-og.ts`

- [ ] **Step 1: Tulis skrip verifikasi**
  Buat file `scratch/verify-og.ts` yang mengimpor `getArticleBySlug` dan melakukan pengunduhan font untuk memvalidasi alur data.

```typescript
import { getArticleBySlug } from "../lib/mdx";

async function verify() {
  console.log("Menjalankan verifikasi...");
  
  // 1. Uji getArticleBySlug dengan slug contoh
  const slug = "agentic-ai-framework";
  const article = getArticleBySlug(slug);
  if (!article) {
    throw new Error(`Artikel dengan slug '${slug}' tidak ditemukan.`);
  }
  console.log("✓ Berhasil memuat artikel:", article.metadata.title);

  // 2. Uji unduh font dari CDN
  const fontUrl = "https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0fvvLDQ.ttf";
  console.log("Mengunduh font dari:", fontUrl);
  const res = await fetch(fontUrl);
  if (!res.ok) {
    throw new Error(`Gagal mengunduh font: ${res.statusText}`);
  }
  const buffer = await res.arrayBuffer();
  console.log(`✓ Berhasil mengunduh font. Ukuran: ${buffer.byteLength} byte`);
  console.log("Verifikasi SELESAI dan BERHASIL!");
}

verify().catch((err) => {
  console.error("✗ Verifikasi gagal:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Jalankan skrip verifikasi**
  Jalankan skrip menggunakan `bun` atau `npx tsx` untuk memastikan semuanya berjalan dengan sukses.
  Run: `npx tsx scratch/verify-og.ts`
  Expected: Output log menampilkan keberhasilan memuat artikel dan mengunduh font.

- [ ] **Step 3: Commit skrip verifikasi**
  Run: `git add scratch/verify-og.ts && git commit -m "test: add scratch script to verify article and font loading"`

---

### Task 2: Membuat File Generator Gambar Open Graph
Membuat file `opengraph-image.tsx` di folder `app/articles/[slug]/`.

**Files:**
- Create: `app/articles/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Tulis kode generator gambar**
  Buat file `app/articles/[slug]/opengraph-image.tsx` dengan kode render `ImageResponse` menggunakan warna latar belakang `#f4f4f5` dan memuat font Lora secara dinamis.

```tsx
import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/mdx";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export const alt = "Journal Article Open Graph Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.metadata.title || "Journal Article";
  const author = article?.metadata.author || siteConfig.author.name;
  const domain = siteConfig.url.replace(/^https?:\/\//, "");

  // Mengunduh font Lora Bold untuk judul
  const loraBold = await fetch(
    new URL("https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0fvvLDQ.ttf")
  ).then((res) => {
    if (!res.ok) throw new Error("Failed to load Lora-Bold font");
    return res.arrayBuffer();
  });

  // Mengunduh font Lora Regular untuk footer
  const loraRegular = await fetch(
    new URL("https://fonts.gstatic.com/s/lora/v32/0QIvMX1D_JOuMw7wfA.ttf")
  ).then((res) => {
    if (!res.ok) throw new Error("Failed to load Lora-Regular font");
    return res.arrayBuffer();
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f4f4f5",
          padding: "80px",
          fontFamily: "Lora, Georgia, serif",
          boxSizing: "border-box",
        }}
      >
        {/* Konten Utama: Judul Artikel */}
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#000000",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          {title}
        </div>

        {/* Footer pembatas */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "2px solid #111111",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: 500,
              color: "#333333",
            }}
          >
            Oleh {author}
          </span>
          <span
            style={{
              fontSize: "24px",
              fontFamily: "monospace",
              color: "#666666",
            }}
          >
            {domain}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Lora",
          data: loraRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Lora",
          data: loraBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
```

- [ ] **Step 2: Jalankan compile check menggunakan `npm run build`**
  Jalankan build Next.js untuk memverifikasi tidak ada kesalahan tipe data (TypeScript) atau kompilasi pada file baru tersebut.
  Run: `npm run build`
  Expected: Build selesai tanpa ada error di file `opengraph-image.tsx`.

- [ ] **Step 3: Commit perubahan**
  Run: `git add app/articles/[slug]/opengraph-image.tsx && git commit -m "feat: implement dynamic open graph image for articles"`

---

### Task 3: Verifikasi Manual URL Gambar OG
Memastikan gambar ter-render dengan benar saat server lokal berjalan.

**Files:**
- None (Hanya verifikasi manual)

- [ ] **Step 1: Jalankan server dev lokal**
  Run: `npm run dev` (atau biarkan berjalan)
  Expected: Dev server menyala di `http://localhost:3000` (atau port lain).

- [ ] **Step 2: Buka URL gambar OG secara langsung**
  Akses di browser: `http://localhost:3000/articles/agentic-ai-framework/opengraph-image`
  Expected: Browser menampilkan gambar PNG berukuran 1200x630 dengan tulisan "Agentic AI Framework..." berlatar abu-abu `#f4f4f5`.
