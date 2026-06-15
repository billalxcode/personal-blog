import Image from "next/image";
import { siteConfig } from "@/config/site";

export function ProjectList() {
  const projects = siteConfig.projects;

  if (!projects || (projects.length as number) === 0) {
    return null;
  }

  return (
    <section className="project-section">
      <h2 className="section-title">Projects & Systems</h2>
      <div className="project-grid">
        {projects.map((project, idx) => (
          <div key={idx} className="project-card">
            <div className="project-thumbnail-wrapper">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 720px) 100vw, 180px"
                className="project-thumbnail-image"
              />
            </div>
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-links">
                {Object.entries(project.links).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    [{key.toUpperCase()}]
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
