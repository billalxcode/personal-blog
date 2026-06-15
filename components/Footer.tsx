import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <p>{siteConfig.footer.copyright}</p>
    </footer>
  );
}
