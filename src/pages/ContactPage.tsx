import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { business } from "@/data/site";

export default function ContactPage() {
  return (
    <>
      <section className="page-hero section-shell">
        <p className="eyebrow">CONTACT / START A CONVERSATION</p>
        <h1>
          Tell us what
          <br />
          <em>you have in mind.</em>
        </h1>
        <p>
          Share a project idea, ask about a service or start with a question. No
          account is needed.
        </p>
      </section>
      <section className="contact-options section-shell">
        <a className="contact-option" href={`mailto:${business.email}`}>
          <span className="contact-icon">
            <Mail />
          </span>
          <span>
            <small>EMAIL</small>
            <strong>{business.email}</strong>
            <p>Send a note directly to the business.</p>
          </span>
          <ArrowUpRight />
        </a>
        <a
          className="contact-option"
          href={`https://wa.me/${business.whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-icon">
            <MessageCircle />
          </span>
          <span>
            <small>WHATSAPP</small>
            <strong>+{business.phone.slice(1)}</strong>
            <p>Start a WhatsApp conversation.</p>
          </span>
          <ArrowUpRight />
        </a>
      </section>
      <section className="contact-next section-shell">
        <div>
          <p className="eyebrow">FOR PROJECTS</p>
          <h2>
            Have the basics
            <br />
            figured out?
          </h2>
        </div>
        <div>
          <p>
            Build an editable project brief, see how the planning range is
            calculated and choose whether to send it by email or WhatsApp.
          </p>
          <Link className="button button-dark" to="/estimate">
            Estimate a project <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section id="privacy" className="privacy-note section-shell">
        <span className="eyebrow">PRIVACY</span>
        <p>
          Contact details and project information are used only to respond to
          your enquiry and discuss the requested work. Do not include passwords
          or sensitive personal information. Enquiries are not stored in a
          public profile or account.
        </p>
      </section>
    </>
  );
}
