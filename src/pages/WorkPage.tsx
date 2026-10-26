import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/site";
import { ProjectCard } from "@/components/ProjectCard";

export default function WorkPage() {
  const categories = [
    "All work",
    ...new Set(projects.map((project) => project.category)),
  ];
  const [active, setActive] = useState("All work");
  const visible = useMemo(
    () =>
      active === "All work"
        ? projects
        : projects.filter((project) => project.category === active),
    [active],
  );
  return (
    <>
      <section className="page-hero section-shell">
        <p className="eyebrow">OUR WORK / LIVE PROJECTS</p>
        <h1>
          Useful ideas,
          <br />
          <em>out in the world.</em>
        </h1>
        <p>
          A selection of live websites and applications. Open a project to
          explore it in its own environment.
        </p>
      </section>
      <section className="work-list section-shell">
        <div
          className="filter-row"
          role="group"
          aria-label="Filter projects by category"
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-chip${active === category ? " selected" : ""}`}
              aria-pressed={active === category}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <p className="work-count">
          {visible.length} live {visible.length === 1 ? "project" : "projects"}
        </p>
        <div className="project-grid">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
        <div className="portfolio-note">
          <span>Each preview is captured from the live project website.</span>
          <a href="https://github.com/VeeDevs" target="_blank" rel="noreferrer">
            Explore public source repositories <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
