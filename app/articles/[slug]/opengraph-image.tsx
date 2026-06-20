import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/mdx";
import { siteConfig } from "@/config/site";

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

  // Mengunduh font Lora (Variable Font) yang berisi wght 400 dan 700
  const loraFontData = await fetch(
    new URL(
      "https://github.com/google/fonts/raw/main/ofl/lora/Lora%5Bwght%5D.ttf",
    ),
  ).then((res) => {
    if (!res.ok) throw new Error("Failed to load Lora font");
    return res.arrayBuffer();
  });

  return new ImageResponse(
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
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Lora",
          data: loraFontData,
          style: "normal",
          weight: 400,
        },
        {
          name: "Lora",
          data: loraFontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
