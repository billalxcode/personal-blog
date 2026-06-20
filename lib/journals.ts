import fs from "fs";
import path from "path";
import { JournalMetadata } from "./latex-parser/types";

const JOURNALS_DIR = path.join(process.cwd(), "journals");

export function getJournalMetadata(slug: string): JournalMetadata | null {
  try {
    const metaPath = path.join(JOURNALS_DIR, slug, "metadata.json");
    if (!fs.existsSync(metaPath)) return null;
    const content = fs.readFileSync(metaPath, "utf-8");
    return JSON.parse(content) as JournalMetadata;
  } catch (error) {
    console.error(`Error reading metadata for slug ${slug}:`, error);
    return null;
  }
}

export function getJournalSource(
  slug: string,
  entrypoint: string,
): string | null {
  try {
    const sourcePath = path.join(JOURNALS_DIR, slug, entrypoint);
    if (!fs.existsSync(sourcePath)) return null;
    return fs.readFileSync(sourcePath, "utf-8");
  } catch (error) {
    console.error(`Error reading source for slug ${slug}:`, error);
    return null;
  }
}

export function getAllJournalSlugs(): string[] {
  try {
    if (!fs.existsSync(JOURNALS_DIR)) return [];
    return fs.readdirSync(JOURNALS_DIR).filter((file) => {
      const fullPath = path.join(JOURNALS_DIR, file);
      return fs.statSync(fullPath).isDirectory();
    });
  } catch (error) {
    console.error("Error reading journals directory:", error);
    return [];
  }
}

export function getPublishedJournals(): JournalMetadata[] {
  const slugs = getAllJournalSlugs();
  const journals: JournalMetadata[] = [];

  for (const slug of slugs) {
    const meta = getJournalMetadata(slug);
    if (meta && meta.status === "published") {
      journals.push(meta);
    }
  }

  return journals.sort((a, b) => {
    return (
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  });
}
