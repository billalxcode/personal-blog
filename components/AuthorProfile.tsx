import { siteConfig } from "@/config/site";

export function AuthorProfile() {
  const { name, affiliation, bio, email } = siteConfig.author;
  return (
    <header className="author-profile">
      <div className="author-kicker" aria-hidden="true">
        Preprint &nbsp;·&nbsp; Vol. 2026 - No. 1 &nbsp;·&nbsp; masbill.xyz
      </div>
      <h1 className="author-name">{name}</h1>
      <p className="author-affiliation">{affiliation}</p>
      <p className="author-bio">{bio}</p>
      <div className="author-correspondence">
        <span className="author-correspondence__label">Correspondence</span>
        <a href={`mailto:${email}`} className="author-correspondence__link">
          {email}
        </a>
        <span className="author-correspondence__sep">·</span>
        <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
      </div>
    </header>
  );
}
