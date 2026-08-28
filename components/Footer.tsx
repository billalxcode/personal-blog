import { siteConfig } from "@/config/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">{siteConfig.footer.copyright}</p>
        <nav className="site-footer__nav" aria-label="Footer">
          <Link href="/sitemap" className="footer-sitemap-link">
            Sitemap
          </Link>
          <span className="site-footer__sep">·</span>
          <a
            href={`mailto:${siteConfig.author.email}`}
            className="footer-sitemap-link"
          >
            Contact
          </a>
          <span className="site-footer__sep">·</span>
          <span className="site-footer__meta">
            Set in STIX Two Text & IBM Plex Mono - Preprint
          </span>
        </nav>
      </div>
    </footer>
  );
}
