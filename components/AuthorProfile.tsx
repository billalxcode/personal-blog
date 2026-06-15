import { siteConfig } from "@/config/site";

export function AuthorProfile() {
  const { name, affiliation, bio } = siteConfig.author;
  return (
    <header className="author-profile">
      <h1 className="author-name">{name}</h1>
      <p className="author-affiliation">{affiliation}</p>
      <p className="author-bio">{bio}</p>
    </header>
  );
}
