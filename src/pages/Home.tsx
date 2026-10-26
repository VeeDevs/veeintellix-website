import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Layers3,
  MoveUpRight,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { projects, processSteps, services } from "@/data/site";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> DIGITAL PRODUCTS · SOFTWARE ·
            SYSTEMS
          </p>
          <h1>
            Technology that moves <em>your business</em> forward.
          </h1>
          <p className="hero-lede">
            We design and develop useful digital products, business websites and
            software solutions that help organisations work smarter and grow.
          </p>
          <div className="hero-actions">
            <Link to="/estimate" className="button button-lime">
              Estimate a project <ArrowUpRight size={17} />
            </Link>
            <Link to="/work" className="text-link">
              Explore our work <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-footnote">
            <span>Independent technology partner</span>
            <span className="hero-separator" />
            <span>Projects scoped around your needs</span>
          </div>
        </div>
        <div
          className="hero-visual"
          aria-label="Selected live project screenshots"
        >
          <div className="hero-visual-top">
            <span>SELECTED WORK</span>
            <span>01 — 04</span>
          </div>
          <a
            className="hero-feature"
            href={projects[0].url}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={projects[0].image}
              alt={projects[0].alt}
              loading="eager"
            />
            <span className="hero-feature-label">
              <strong>PrioPray</strong>
              <small>Daily Devotion · Web application</small>
            </span>
            <span className="hero-feature-arrow">
              <ArrowUpRight size={18} />
            </span>
          </a>
          <div className="hero-secondary">
            <a href={projects[1].url} target="_blank" rel="noreferrer">
              <img src={projects[1].image} alt={projects[1].alt} />
              <span>
                PulseSync <ArrowUpRight size={13} />
              </span>
            </a>
            <a href={projects[2].url} target="_blank" rel="noreferrer">
              <img src={projects[2].image} alt={projects[2].alt} />
              <span>
                Epoch <ArrowUpRight size={13} />
              </span>
            </a>
          </div>
          <p className="visual-caption">
            Real products, in use.{" "}
            <span>
              View all projects <ArrowDown size={13} />
            </span>
          </p>
        </div>
        <div className="hero-index" aria-hidden="true">
          V / M3
        </div>
      </section>

      <section
        className="services-overview section-shell section-space"
        id="services"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT WE DO</p>
            <h2>
              Good technology starts
              <br />
              with a <em>clear purpose.</em>
            </h2>
          </div>
          <Link to="/services" className="text-link">
            Explore our services <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="service-grid-home">
          {services.slice(0, 4).map((service, i) => {
            const Icon = [Braces, Layers3, Workflow, MoveUpRight][i];
            return (
              <article className="service-teaser" key={service.number}>
                <span className="service-number">{service.number}</span>
                <Icon size={22} strokeWidth={1.5} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link
                  to="/services"
                  aria-label={`Learn about ${service.title}`}
                >
                  <ArrowUpRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="work-section section-space">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SELECTED WORK</p>
              <h2>
                Made for the way
                <br />
                people <em>actually work.</em>
              </h2>
            </div>
            <Link to="/work" className="text-link">
              See every project <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="project-grid home-project-grid">
            {projects.slice(0, 4).map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="process-section section-space">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A PRACTICAL PROCESS</p>
              <h2>
                From first conversation
                <br />
                to <em>work in your hands.</em>
              </h2>
            </div>
            <p className="section-intro">
              The right delivery path depends on the project. We make the steps
              and decisions clear as we go.
            </p>
          </div>
          <div className="process-list">
            {processSteps.map(([n, title, text]) => (
              <article className="process-item" key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="principles-section section-space">
        <div className="section-shell principles-layout">
          <div>
            <p className="eyebrow">HOW WE THINK</p>
            <h2>
              Technology should
              <br />
              make things <em>easier.</em>
            </h2>
            <p className="section-intro">
              A useful solution fits the people and systems around it. We focus
              on clear communication, practical scope and software that can be
              maintained after launch.
            </p>
            <Link to="/about" className="text-link">
              More about VeeIntellix <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="principle-list">
            <div>
              <span>01</span>
              <h3>Clear communication</h3>
              <p>
                Know what is happening, what comes next and where decisions are
                needed.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>Practical scope</h3>
              <p>
                Build around the problem and constraints, with work agreed
                before it begins.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Maintainable delivery</h3>
              <p>
                Leave behind a solution and handover that make sense beyond
                launch day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="closing-cta section-shell">
        <p className="eyebrow">HAVE A PROJECT IN MIND?</p>
        <div className="closing-content">
          <h2>
            Let's make the
            <br />
            <em>next step clear.</em>
          </h2>
          <div>
            <p>
              Tell us what you are trying to achieve. We will use it to start a
              practical conversation about scope, timing and budget.
            </p>
            <Link to="/estimate" className="button button-lime">
              Start a project brief <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <span className="cta-watermark" aria-hidden="true">
          V.
        </span>
      </section>
    </>
  );
}
