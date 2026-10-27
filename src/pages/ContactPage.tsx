import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { business } from "@/data/site";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailReady, setEmailReady] = useState(false);

  const openEmailDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setEmailReady(false);

    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter your name and a valid email address to continue.");
      return;
    }

    const subject = `Website enquiry from ${name.trim()}`;
    const body = [
      "VeeIntellix M3 IT Solutions — General Enquiry",
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      "Message:",
      message.trim(),
    ].join("\n");

    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEmailReady(true);
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
          <p>
            Your email app will open with the message addressed to {business.email}.
          </p>
        </div>
        <form className="contact-form" onSubmit={openEmailDraft}>
          <label className="contact-field">
            <span>Your name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              maxLength={120}
            />
          </label>
          <label className="contact-field">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label className="contact-field">
            <span>How can we help?</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              minLength={15}
              maxLength={6000}
              rows={6}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {emailReady && (
            <p className="form-success" role="status">
              Your email app should open with the enquiry ready. Review it and
              press Send to deliver your message.
            </p>
          )}
          <button className="button button-dark" type="submit">
            Open email app <Send size={15} />
          </button>
          <p className="contact-form-note">
            Your message stays in your email app until you press Send.
          </p>
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
          Contact details and project information are used only to prepare an
          email draft for your review. They are not sent or stored by this
          website unless you send the email from your mail app. Do not include
          passwords or sensitive personal information.
        </p>
      </section>
    </>
  );
}
