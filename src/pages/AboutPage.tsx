import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { business } from "@/data/site";

export default function AboutPage() {
  return (
    <>
      <section className="page-hero section-shell">
        <p className="eyebrow">ABOUT / VEEINTELLIX M3</p>
        <h1>
          Technology with
          <br />
          <em>people in mind.</em>
        </h1>
        <p>
          VeeIntellix M3 IT Solutions works on software, websites and digital
          systems that help people and organisations get things done.
        </p>
      </section>
      <section className="about-body section-shell">
        <div className="about-lead">
          <span className="about-monogram">
            V<span>.</span>
          </span>
          <div>
            <p className="eyebrow">A DIRECT, PRACTICAL APPROACH</p>
            <h2>
              Start with the need.
              <br />
              Choose the right tool.
            </h2>
          </div>
        </div>
        <div className="about-copy">
          <p>
            Technology is useful when it fits the context around it: the people
            using it, the processes it supports, the budget available and the
            systems it must work with.
          </p>
          <p>
            VeeIntellix M3 focuses on understanding those details, agreeing a
            workable scope and delivering in clear stages. Work can include
            business websites, web applications, mobile experiences, automation,
            integrations and data presentation.
          </p>
          <p>
            Projects are discussed directly with the business. Before work
            begins, the goal is to make the deliverables, dependencies and open
            questions understandable to everyone involved.
          </p>
        </div>
      </section>
      <section className="about-values section-shell">
        <div>
          <p className="eyebrow">WORKING PRINCIPLES</p>
          <h2>
            Good work is
            <br />
            <em>understandable.</em>
          </h2>
        </div>
        <div className="value-list">
          <p>
            <Check size={16} /> Scope is discussed before commitments are made.
          </p>
          <p>
            <Check size={16} /> Estimates account for the features and systems
            involved.
          </p>
          <p>
            <Check size={16} /> Trade-offs and dependencies are made clear.
          </p>
          <p>
            <Check size={16} /> Handover and future maintenance are considered.
          </p>
        </div>
      </section>
      <section className="contact-strip section-shell">
        <div>
          <p className="eyebrow">TALK TO THE BUSINESS DIRECTLY</p>
          <h2>
            Have a question
            <br />
            about what we do?
          </h2>
        </div>
        <a href={`mailto:${business.email}`} className="button button-lime">
          Email VeeIntellix <ArrowUpRight size={16} />
        </a>
      </section>
    </>
  );
}
