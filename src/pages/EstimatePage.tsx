import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clipboard,
  Send,
} from "lucide-react";
import {
  pricing,
  featureGroups,
  calculateEstimate,
  money,
  type ProjectType,
  type Complexity,
  type DesignLevel,
} from "@/lib/estimate";
import { business } from "@/data/site";

const types: ProjectType[] = [
  "landing",
  "website",
  "ecommerce",
  "webapp",
  "mobile",
  "automation",
  "api",
  "upgrade",
  "other",
];
const stepNames = ["Project", "Features", "Preferences", "Review", "Email"];
type Draft = {
  type: ProjectType;
  description: string;
  features: string[];
  complexity: Complexity;
  design: DesignLevel;
  urgency: keyof typeof pricing.urgency;
  existing: string;
  budget: string;
  maintenance: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};
const initial: Draft = {
  type: "website",
  description: "",
  features: ["responsive", "design", "contact", "qa", "deployment"],
  complexity: "standard",
  design: "custom",
  urgency: "flexible",
  existing: "",
  budget: "",
  maintenance: "considering",
  name: "",
  email: "",
  phone: "",
  notes: "",
};

function makeBrief(draft: Draft, range: { min: number; max: number }) {
  const project = pricing.categories[draft.type].label;
  const selected = calculateEstimate(draft).featureKeys.map(
    (key) => pricing.features[key].label,
  );
  return [
    "VeeIntellix M3 IT Solutions — Project Enquiry",
    `Project category: ${project}`,
    `Indicative planning range: ${money(range.min)} – ${money(range.max)} (${pricing.currency})`,
    `Complexity: ${pricing.complexity[draft.complexity].label}`,
    `Design: ${pricing.design[draft.design].label}`,
    `Delivery preference: ${pricing.urgency[draft.urgency].label}`,
    `Selected functionality: ${selected?.length ? selected.join(", ") : "None selected"}`,
    `Existing systems / integrations: ${draft.existing.trim() || "Not specified"}`,
    `Budget preference: ${draft.budget || "Not specified"}`,
    `Maintenance: ${draft.maintenance}`,
    "",
    "Project description:",
    draft.description.trim() || "Not provided",
    "",
    `Name: ${draft.name.trim() || "Not provided"}`,
    `Email: ${draft.email.trim() || "Not provided"}`,
    `Telephone: ${draft.phone.trim() || "Not provided"}`,
    `Additional notes: ${draft.notes.trim() || "None"}`,
    "",
    "Assumptions: This is an indicative planning range calculated from selected scope only. It is not a binding quotation. Final scope, feasibility and price require discussion.",
    "Exclusions: Third-party subscriptions, hosting, domain costs, applicable taxes and ongoing maintenance are priced separately where applicable.",
  ].join("\n");
}

export default function EstimatePage() {
  const [draft, setDraft] = useState<Draft>(initial);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const estimate = useMemo(() => calculateEstimate(draft), [draft]);
  const range = useMemo(
    () => ({ min: estimate.min, max: estimate.max }),
    [estimate],
  );
  const brief = useMemo(() => makeBrief(draft, range), [draft, range]);
  const change = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const changeType = (type: ProjectType) =>
    setDraft((current) => ({
      ...current,
      type,
      features: current.features.filter((feature) =>
        featureGroups[type].includes(feature),
      ),
    }));
  const toggle = (feature: string) =>
    change(
      "features",
      draft.features.includes(feature)
        ? draft.features.filter((item) => item !== feature)
        : [...draft.features, feature],
    );
  const next = () => {
    setError("");
    if (step === 0 && draft.description.trim().length < 15) {
      setError("Add a little more detail so the estimate has useful context.");
      return;
    }
    setStep((current) => Math.min(4, current + 1));
  };
  const previous = () => {
    setError("");
    setStep((current) => Math.max(0, current - 1));
  };
  const emailUrl = useMemo(() => {
    const subject = `Project enquiry — ${pricing.categories[draft.type].label}`;
    const body = `${brief}\n\nPrepared on the VeeIntellix M3 IT Solutions website. Review and send from your email app.`;
    return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [brief, draft.type]);

  const openEmailDraft = () => {
    setError("");
    const normalizedEmail = draft.email.trim();
    const emailParts = normalizedEmail.split("@");
    if (
      !draft.name.trim() ||
      emailParts.length !== 2 ||
      !emailParts[0] ||
      !emailParts[1]?.includes(".") ||
      normalizedEmail.includes(" ")
    ) {
      setError("Enter your name and a valid email address before opening your email app.");
      return;
    }
    window.location.href = emailUrl;
    setStep(4);
  };
  const whatsappUrl = useMemo(() => {
    const full = `${brief}\n\nSent from the VeeIntellix M3 website.`;
    if (full.length <= 1600)
      return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(full)}`;
    const description = draft.description.trim();
    const conciseDescription =
      description.length > 300
        ? `${description.slice(0, 300).replace(/\s+\S*$/, "")}…`
        : description;
    const selected = estimate.featureKeys.map(
      (key) => pricing.features[key].label,
    );
    const featureSummary =
      selected.slice(0, 10).join(", ") +
      (selected.length > 10 ? `, +${selected.length - 10} more` : "");
    const message = [
      "VeeIntellix M3 IT Solutions — Project Enquiry",
      `Category: ${pricing.categories[draft.type].label}`,
      `Description: ${conciseDescription}`,
      `Selected functionality: ${featureSummary || "None selected"}`,
      `Complexity / design: ${pricing.complexity[draft.complexity].label} / ${pricing.design[draft.design].label}`,
      `Delivery preference: ${pricing.urgency[draft.urgency].label} (subject to feasibility)`,
      `Maintenance: ${draft.maintenance}`,
      `Indicative planning range: ${money(range.min)} – ${money(range.max)} (${pricing.currency})`,
      "Assumptions: This is a preliminary planning range, not a binding quotation. Final scope and feasibility require discussion.",
      "Exclusions: Hosting, domains, third-party subscriptions, applicable taxes and ongoing maintenance may be separate.",
      `Name: ${draft.name.trim() || "Not provided"}`,
      `Email: ${draft.email.trim() || "Not provided"}`,
      `Telephone: ${draft.phone.trim() || "Not provided"}`,
      "[Brief shortened for WhatsApp. Copy the complete brief from the website if needed.]",
      "Sent from the VeeIntellix M3 website.",
    ].join("\n");
    return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
  }, [brief, draft, estimate, range]);
  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError(
        "Clipboard access was blocked. Select and copy the brief from the review box.",
      );
    }
  };
  const setChoiceClass = (active: boolean) =>
    `choice-card${active ? " is-selected" : ""}`;

  return (
    <section className="estimator-section section-shell">
      <div className="estimator-heading">
        <p className="eyebrow">PROJECT ESTIMATOR / NO ACCOUNT REQUIRED</p>
        <h1>
          Start with a clearer
          <br />
          <em>project brief.</em>
        </h1>
        <p>
          Describe what you need, choose the relevant scope and get an immediate
          planning range. You can review and edit everything before sending.
        </p>
      </div>
      <div className="estimator-layout">
        <div className="estimator-main">
          <div
            className="step-indicator"
            aria-label={`Step ${Math.min(step + 1, 5)} of 5`}
          >
            {stepNames.map((name, index) => (
              <div
                className={`step-mark${index < step ? " done" : ""}${index === step ? " current" : ""}`}
                key={name}
              >
                <span>{index < step ? <Check size={14} /> : index + 1}</span>
                <small>{name}</small>
              </div>
            ))}
          </div>
          {step === 0 && (
            <div className="estimator-panel">
              <p className="eyebrow">01 / PROJECT TYPE & DESCRIPTION</p>
              <h2>What would you like to build?</h2>
              <div className="type-grid">
                {types.map((type) => (
                  <button
                    type="button"
                    className={setChoiceClass(draft.type === type)}
                    aria-pressed={draft.type === type}
                    key={type}
                    onClick={() => changeType(type)}
                  >
                    {pricing.categories[type].label}
                    {draft.type === type && <Check size={15} />}
                  </button>
                ))}
              </div>
              <label className="field-label" htmlFor="project-description">
                Describe what you want to build, the problem you are solving and
                what the finished product should do.
              </label>
              <textarea
                id="project-description"
                rows={6}
                maxLength={5000}
                value={draft.description}
                onChange={(event) => change("description", event.target.value)}
                placeholder="I need a booking website with service listings, appointment scheduling, online payments, WhatsApp notifications and a dashboard for managing bookings."
              />
              <span className="field-hint">
                Include any details that matter. {draft.description.length}/5000
              </span>
            </div>
          )}
          {step === 1 && (
            <div className="estimator-panel">
              <p className="eyebrow">02 / SCOPE & FEATURES</p>
              <h2>What should it include?</h2>
              <p className="panel-intro">
                Options below are tailored to{" "}
                {pricing.categories[draft.type].label.toLowerCase()}. Select
                anything relevant; you can change it later.
              </p>
              <div className="feature-grid">
                {featureGroups[draft.type].map((key) => {
                  const item =
                    pricing.features[key as keyof typeof pricing.features];
                  const selected = draft.features.includes(key);
                  return (
                    <button
                      type="button"
                      className={`feature-choice${selected ? " is-selected" : ""}`}
                      key={key}
                      aria-pressed={selected}
                      onClick={() => toggle(key)}
                    >
                      <span className="feature-check">
                        {selected && <Check size={14} />}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="estimator-panel">
              <p className="eyebrow">03 / COMPLEXITY & DELIVERY</p>
              <h2>Set the working preferences.</h2>
              <label className="field-label">Functionality complexity</label>
              <div className="choice-grid">
                {Object.entries(pricing.complexity).map(([key, value]) => (
                  <button
                    type="button"
                    key={key}
                    className={setChoiceClass(draft.complexity === key)}
                    aria-pressed={draft.complexity === key}
                    onClick={() => change("complexity", key as Complexity)}
                  >
                    <strong>{value.label}</strong>
                    <small>
                      {key === "basic"
                        ? "A focused set of core requirements"
                        : key === "standard"
                          ? "Several connected features or workflows"
                          : "Advanced rules, roles or dependencies"}
                    </small>
                  </button>
                ))}
              </div>
              <label className="field-label">Design approach</label>
              <div className="choice-grid">
                {Object.entries(pricing.design).map(([key, value]) => (
                  <button
                    type="button"
                    key={key}
                    className={setChoiceClass(draft.design === key)}
                    aria-pressed={draft.design === key}
                    onClick={() => change("design", key as DesignLevel)}
                  >
                    <strong>{value.label}</strong>
                  </button>
                ))}
              </div>
              <div className="two-fields">
                <label className="form-field">
                  Delivery preference
                  <select
                    value={draft.urgency}
                    onChange={(event) =>
                      change("urgency", event.target.value as Draft["urgency"])
                    }
                  >
                    {Object.entries(pricing.urgency).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  Budget preference <span>(optional)</span>
                  <select
                    value={draft.budget}
                    onChange={(event) => change("budget", event.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option>Under R10,000</option>
                    <option>R10,000 – R25,000</option>
                    <option>R25,000 – R50,000</option>
                    <option>R50,000+</option>
                    <option>Need guidance</option>
                  </select>
                </label>
              </div>
              <label className="field-label" htmlFor="existing-systems">
                Existing systems or integrations
              </label>
              <textarea
                id="existing-systems"
                rows={3}
                maxLength={1200}
                value={draft.existing}
                onChange={(event) => change("existing", event.target.value)}
                placeholder="Mention software, services or data this project needs to connect to."
              />
              <label className="form-field maintenance-field">
                Ongoing maintenance
                <select
                  value={draft.maintenance}
                  onChange={(event) =>
                    change("maintenance", event.target.value)
                  }
                >
                  <option value="considering">Open to discussing it</option>
                  <option value="yes">
                    Yes, include a maintenance discussion
                  </option>
                  <option value="no">No ongoing maintenance needed</option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="estimator-panel">
              <div className="review-title">
                <div>
                  <p className="eyebrow">04 / REVIEW YOUR BRIEF</p>
                  <h2>Check the details.</h2>
                </div>
                <button
                  className="text-button"
                  type="button"
                  onClick={copyBrief}
                >
                  <Clipboard size={15} />{" "}
                  {copied ? "Copied" : "Copy full brief"}
                </button>
              </div>
              <p className="panel-intro">
                Your choices stay editable. Go back to any step to make a change
                before sending.
              </p>
              <div className="review-estimate">
                <span>Indicative planning range</span>
                <strong>
                  {money(range.min)} <small>—</small> {money(range.max)}
                </strong>
                <small>Estimates in {pricing.currency}</small>
              </div>
              <pre className="brief-preview">{brief}</pre>
              <p className="estimate-disclaimer">
                Planning estimate only, not a binding quotation. Final pricing
                depends on confirmed scope, feasibility and discussion.
                Third-party subscriptions, hosting, domains, applicable taxes
                and ongoing maintenance are separate.
              </p>
              <div className="two-fields">
                <label className="form-field">
                  Your name <span aria-hidden="true">*</span>
                  <input
                    required
                    aria-required="true"
                    autoComplete="name"
                    maxLength={120}
                    value={draft.name}
                    onChange={(event) => change("name", event.target.value)}
                    placeholder="Name"
                  />
                </label>
                <label className="form-field">
                  Email address <span aria-hidden="true">*</span>
                  <input
                    required
                    aria-required="true"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={draft.email}
                    onChange={(event) => change("email", event.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label className="form-field">
                Telephone <span>(optional)</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  value={draft.phone}
                  onChange={(event) => change("phone", event.target.value)}
                  placeholder="Country code + number"
                />
              </label>
              <label className="field-label" htmlFor="additional-notes">
                Additional notes <span>(optional)</span>
              </label>
              <textarea
                id="additional-notes"
                rows={3}
                maxLength={1500}
                value={draft.notes}
                onChange={(event) => change("notes", event.target.value)}
                placeholder="Anything else you'd like us to know?"
              />
              <p className="privacy-inline">
                Your details stay in this brief until you choose to open your
                email app. Do not include passwords or sensitive personal information.
              </p>
            </div>
          )}
          {step === 4 && (
            <div className="estimator-panel done-panel">
              <span className="done-icon">
                <Check size={24} />
              </span>
              <p className="eyebrow">EMAIL DRAFT READY</p>
              <h2>Thanks, {draft.name.split(" ")[0]}.</h2>
              <p>
                Your email app should open with the project brief addressed to{" "}
                {business.email}. Review the details and press Send in your
                email app to deliver the enquiry.
              </p>
              <button
                className="text-button"
                type="button"
                onClick={copyBrief}
              >
                <Clipboard size={15} /> {copied ? "Copied" : "Copy full brief"}
              </button>
              <a
                className="button button-lime"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Continue on WhatsApp <ArrowUpRight size={16} />
              </a>
            </div>
          )}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          {step < 4 && (
            <div className="estimator-controls">
              {step > 0 && (
                <button
                  type="button"
                  className="button button-light"
                  onClick={previous}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              {step === 3 ? (
                <>
                  <button
                    className="button button-whatsapp"
                    type="button"
                    onClick={() =>
                      window.open(whatsappUrl, "_blank", "noopener,noreferrer")
                    }
                  >
                    Continue on WhatsApp <ArrowUpRight size={15} />
                  </button>
                  <button
                    className="button button-lime"
                    type="button"
                    onClick={openEmailDraft}
                  >
                    Open email app <Send size={15} />
                  </button>
                </>
              ) : (
                <button
                  className="button button-dark"
                  type="button"
                  onClick={next}
                >
                  Continue <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        <aside className="estimate-aside">
          <div className="estimate-card">
            <p className="eyebrow">LIVE ESTIMATE</p>
            <span className="estimate-category">
              {pricing.categories[draft.type].label}
            </span>
            <strong className="estimate-range">
              {money(range.min)}
              <span>—</span>
              {money(range.max)}
            </strong>
            <span className="estimate-currency">
              Indicative range · {pricing.currency}
            </span>
            <div className="estimate-divider" />
            <p>
              {estimate.featureKeys.length} selected{" "}
              {estimate.featureKeys.length === 1 ? "feature" : "features"}
            </p>
            <p>
              {pricing.complexity[draft.complexity].label} functionality ·{" "}
              {pricing.design[draft.design].label}
            </p>
            <p>{pricing.urgency[draft.urgency].label}</p>
            <div className="estimate-divider" />
            <small>
              This is an early planning range, not a binding quote. Timing is
              confirmed after scope and feasibility review.
            </small>
            <small>
              Hosting, domain costs, third-party subscriptions, applicable taxes
              and ongoing support are not included.
            </small>
          </div>
          <div className="rate-note">
            <span className="eyebrow">PRICING NOTE</span>
            <p>
              Range values are initial planning assumptions. Final business
              rates require owner approval and a confirmed project scope.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
