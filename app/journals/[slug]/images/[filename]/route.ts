import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface RouteProps {
  params: Promise<{ slug: string; filename: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { slug, filename } = await params;
  const imagePath = path.join(
    process.cwd(),
    "journals",
    slug,
    "images",
    filename
  );

  if (!fs.existsSync(imagePath)) {
    return new NextResponse("Image Not Found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const ext = path.extname(filename).toLowerCase();

  let contentType = "image/png";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".gif") contentType = "image/gif";
  else if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".svg") contentType = "image/svg+xml";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
