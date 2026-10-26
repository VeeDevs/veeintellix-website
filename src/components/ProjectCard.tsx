import { ArrowUpRight } from "lucide-react";
import type { projects } from "@/data/site";

type Project = (typeof projects)[number];
export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <article className={`project-card project-card-${index % 2}`}>
      <a
        className="project-image"
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit the live ${project.title} project`}
      >
        <img src={project.image} alt={project.alt} loading="lazy" />
        <span className="project-open">
          <ArrowUpRight size={19} />
        </span>
      </a>
      <div className="project-copy">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.tags[1]}</span>
        </div>
        <h3>
          <a href={project.url} target="_blank" rel="noreferrer">
            {project.title}{" "}
            <span className="project-subtitle">/ {project.subtitle}</span>
          </a>
        </h3>
        <p>{project.description}</p>
        <a
          className="text-link"
          href={project.url}
          target="_blank"
          rel="noreferrer"
        >
          View live project <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}
