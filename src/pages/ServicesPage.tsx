import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "@/data/site";

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero section-shell">
        <p className="eyebrow">SERVICES / CAPABILITIES</p>
        <h1>
          Digital solutions
          <br />
          for <em>real work.</em>
        </h1>
        <p>
          From a clear first website to a custom system: choose the part of your
          business you need technology to support.
        </p>
        <Link to="/estimate" className="button button-lime">
          Estimate a project <ArrowUpRight size={16} />
        </Link>
      </section>
      <section className="service-catalog section-shell">
        {services.map((service) => (
          <article
            className="service-row"
            id={service.number}
            key={service.number}
          >
            <span className="service-number">{service.number}</span>
            <div className="service-row-main">
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
            <div className="service-row-detail">
              <span className="eyebrow">TYPICAL DELIVERABLES</span>
              <p>{service.deliverables}</p>
              <span className="eyebrow">RELATED WORK / SCOPE</span>
              <p>{service.examples}</p>
              <span className="eyebrow">WHAT AFFECTS COST</span>
              <p>{service.costFactors}</p>
            </div>
            <Link
              className="service-row-link"
              to="/estimate"
              aria-label={`Estimate a ${service.title} project`}
            >
              <ArrowRight size={19} />
            </Link>
          </article>
        ))}
      </section>
      <section className="scope-note section-shell">
        <div>
          <p className="eyebrow">COST & SCOPE</p>
          <h2>
            Every estimate starts
            <br />
            with <em>the details.</em>
          </h2>
        </div>
        <div>
          <p>
            Budget depends on functionality, integrations, design needs,
            existing systems and delivery constraints. The project estimator
            gives an early planning range from the choices you make; a confirmed
            proposal follows a conversation and agreed scope.
          </p>
          <ul>
            <li>
              <Check size={15} /> Hosting, domains and third-party subscriptions
              are separate.
            </li>
            <li>
              <Check size={15} /> Support and ongoing maintenance are scoped
              separately.
            </li>
            <li>
              <Check size={15} /> A delivery date is confirmed after feasibility
              review.
            </li>
          </ul>
          <Link to="/estimate" className="text-link">
            Create a project brief <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
