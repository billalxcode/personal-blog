import { siteConfig } from "@/config/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        {siteConfig.footer.copyright} |{" "}
        <Link href="/sitemap" className="footer-sitemap-link">
          Sitemap
        </Link>
      </p>
    </footer>
  );
}
