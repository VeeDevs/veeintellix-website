import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  ShoppingCart,
  Bot,
  ShieldCheck,
  CloudCog,
  BrainCircuit,
} from "lucide-react";

type Product = {
  icon: typeof Globe;
  title: string;
  summary: string;
  whatItIs: string;
  importance: string;
  industryChallenges: string[];
  howWeSolve: string;
  tags: string[];
};

const products: Product[] = [
  {
    icon: Globe,
    title: "Website Modernisation",
    summary: "Click to know more",
    whatItIs:
      "A full redesign of outdated websites into fast, conversion-focused digital products.",
    importance:
      "A modern website is your primary trust and sales channel, especially on mobile.",
    industryChallenges: [
      "Slow page speed and high bounce rates",
      "Outdated UX that kills lead flow",
      "Poor SEO architecture and weak visibility",
    ],
    howWeSolve:
      "VeeIntellix rebuilds architecture, UX and performance with analytics to improve lead quality and conversion outcomes.",
    tags: ["Speed", "UX", "SEO"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    summary: "Click to know more",
    whatItIs:
      "End-to-end ecommerce implementation and optimisation for product discovery, checkout and retention.",
    importance:
      "Online revenue depends on a frictionless buying journey and measurable conversion flow.",
    industryChallenges: [
      "Cart abandonment at checkout",
      "Unclear product journeys",
      "Disconnected marketing and sales data",
    ],
    howWeSolve:
      "We optimise product funnels, streamline checkout and connect analytics so every stage of the buyer journey is measurable.",
    tags: ["Checkout", "Payments", "Conversion"],
  },
  {
    icon: Bot,
    title: "Business Automation",
    summary: "Click to know more",
    whatItIs:
      "Automation of repetitive workflows across sales, support and operations using integrated systems.",
    importance:
      "Automation reduces delay and human bottlenecks, so teams focus on high-value work.",
    industryChallenges: [
      "Manual follow-ups and missed opportunities",
      "Slow reporting and fragmented tools",
      "Operational errors from repetitive tasks",
    ],
    howWeSolve:
      "VeeIntellix maps your processes, then implements governed automation pipelines and AI assistants with clear ROI metrics.",
    tags: ["Workflow", "AI Ops", "Integrations"],
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity Hardening",
    summary: "Click to know more",
    whatItIs:
      "Layered security controls, incident readiness and compliance-aware protection for your systems.",
    importance:
      "Cyber incidents directly impact trust, continuity and legal obligations around data handling.",
    industryChallenges: [
      "Weak identity controls and access sprawl",
      "Delayed detection and response",
      "Insufficient incident preparation",
    ],
    howWeSolve:
      "We deploy practical hardening, monitoring and response playbooks aligned to your operational reality and compliance obligations.",
    tags: ["Risk", "Resilience", "Response"],
  },
  {
    icon: CloudCog,
    title: "Cloud & DevOps Platforms",
    summary: "Click to know more",
    whatItIs:
      "Scalable cloud architecture and delivery pipelines designed for stability, speed and secure releases.",
    importance:
      "Reliable delivery infrastructure is essential for product growth and uptime.",
    industryChallenges: [
      "Unstable deployments",
      "No observability or release confidence",
      "Escalating infra costs with poor architecture",
    ],
    howWeSolve:
      "VeeIntellix builds CI/CD, monitoring and cost-aware cloud foundations that improve release quality and availability.",
    tags: ["CI/CD", "Uptime", "Observability"],
  },
  {
    icon: BrainCircuit,
    title: "AI Solutions & Insights",
    summary: "Click to know more",
    whatItIs:
      "Business-focused AI assistants, intelligence workflows and decision-support systems.",
    importance:
      "AI creates competitive advantage when tied to concrete business outcomes.",
    industryChallenges: [
      "AI hype with no clear use case",
      "Low trust in generated outputs",
      "No governance around data and prompts",
    ],
    howWeSolve:
      "We design governed AI implementations tied to process outcomes, with practical safeguards, validation and measurable impact.",
    tags: ["AI", "Governance", "Productivity"],
  },
];

const ProductRotator = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section id="products" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-50 bg-[radial-gradient(circle_at_15%_15%,hsla(196,92%,56%,0.15),transparent_35%),radial-gradient(circle_at_85%_85%,hsla(32,95%,55%,0.16),transparent_33%)]" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            Product <span className="gradient-text">Flip Showcase</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click any card to flip and see what the product is, why it matters, industry challenges, and how VeeIntellix solves it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const isFlipped = activeCard === index;
            return (
              <button
                key={product.title}
                type="button"
                className={`flip-card ${isFlipped ? "is-flipped" : ""}`}
                onClick={() => setActiveCard(isFlipped ? null : index)}
                aria-label={`Flip card for ${product.title}`}
              >
                <div className="flip-card-inner">
                  <article className="flip-card-face flip-card-front">
                    <div className="w-14 h-14 rounded-xl bg-primary/12 flex items-center justify-center mb-4">
                      <product.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-2xl font-semibold mb-3 text-left">{product.title}</h3>
                    <p className="text-sm text-primary/95 mb-3 text-left font-medium">{product.summary}</p>
                    <p className="text-sm text-muted-foreground text-left">
                      Tap to reveal product detail, industry pain points, and why VeeIntellix is the best-fit solution partner.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border/70 text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>

                  <article className="flip-card-face flip-card-back">
                    <h3 className="font-heading text-xl font-semibold mb-3 text-left">{product.title}</h3>
                    <div className="space-y-3 text-left">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary/90 mb-1">What It Is</p>
                        <p className="text-sm text-foreground/95">{product.whatItIs}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary/90 mb-1">Why It Is Important</p>
                        <p className="text-sm text-foreground/95">{product.importance}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary/90 mb-1">Industry Challenges</p>
                        <ul className="space-y-1 text-sm text-foreground/95">
                          {product.industryChallenges.map((challenge) => (
                            <li key={challenge} className="flex gap-2">
                              <span className="text-primary">-</span>
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary/90 mb-1">How VeeIntellix Solves It</p>
                        <p className="text-sm text-foreground/95">{product.howWeSolve}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href="#consultation"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                      >
                        Get Quote
                      </a>
                      <Link
                        to="/quote-builder"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium text-primary-foreground"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        Create AI Quote
                      </Link>
                    </div>
                  </article>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductRotator;
