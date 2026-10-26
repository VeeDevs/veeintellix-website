import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { business } from "@/data/site";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const sendEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSent(false);
    setSending(true);
    try {
      const response = await fetch("/api/project-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name,
          email,
          category: "General enquiry",
          message,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.accepted !== true) {
        throw new Error(result.error || "Your message could not be sent. Please try again.");
      }
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Your message could not be sent. Please email us directly.");
    } finally {
      setSending(false);
    }
  };

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
      <section className="contact-form-shell section-shell">
        <div>
          <p className="eyebrow">SEND AN ENQUIRY</p>
          <h2>Write to us directly.</h2>
          <p>Your message is sent from this site to {business.email}.</p>
        </div>
        <form className="contact-form" onSubmit={sendEnquiry}>
          <label className="contact-field">
            <span>Your name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required maxLength={120} />
          </label>
          <label className="contact-field">
            <span>Email address</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required maxLength={254} />
          </label>
          <label className="contact-field">
            <span>How can we help?</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={15} maxLength={6000} rows={6} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          {sent && <p className="form-success" role="status">Your enquiry has been sent. We’ll reply to {email || "your email"}.</p>}
          <button className="button button-dark" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send enquiry"} <Send size={15} />
          </button>
          <p className="contact-form-note">Your message is used only to respond to this enquiry.</p>
        </form>
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
