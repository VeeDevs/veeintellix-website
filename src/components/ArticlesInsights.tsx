import { ArrowUpRight, Newspaper, ShieldAlert, TrendingUp } from "lucide-react";

type FeaturedArticle = {
  icon: typeof TrendingUp;
  title: string;
  date: string;
  problem: string;
  detail: string;
  whyUs: string;
  stat: string;
  source: string;
  lessons?: string[];
};

const featuredArticles: FeaturedArticle[] = [
  {
    icon: TrendingUp,
    title: "Traditional Websites vs Modern Revenue Engines",
    date: "March 2026",
    problem:
      "Many businesses still run brochure-style websites with poor mobile speed and weak conversion journeys, which limits sales performance.",
    detail:
      "Modern website architecture prioritises speed, intent-driven UX and analytics-led conversion flows. This means faster discovery, stronger trust and better lead quality.",
    whyUs:
      "VeeIntellix combines UX, frontend engineering and business analytics to modernise websites into measurable growth channels.",
    stat: "53% of mobile users leave if a page takes longer than around 3 seconds (Think with Google).",
    source:
      "https://www.thinkwithgoogle.com/intl/en-emea/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/",
  },
  {
    icon: TrendingUp,
    title: "Automation as a Sales Multiplier",
    date: "March 2026",
    problem:
      "Manual follow-ups, spreadsheet reporting and disconnected systems slow down deal cycles and leak opportunities.",
    detail:
      "Workflow automation can route leads faster, trigger sales actions, and keep pipeline data clean while your team focuses on closing.",
    whyUs:
      "We implement practical automations with governance and measurable KPIs, so efficiency gains turn into repeatable revenue improvements.",
    stat: "Top sales teams using AI are much more likely to exceed targets (Salesforce State of Sales, 2024).",
    source: "https://www.salesforce.com/news/stories/state-of-sales-report/",
  },
  {
    icon: ShieldAlert,
    title: "Cybersecurity Lessons from Recent South African Incidents",
    date: "March 2026",
    problem:
      "Recent incidents show that data exposure, service disruption and delayed incident response can damage trust and operations quickly.",
    detail:
      "Recent public incidents and regulator guidance highlight the need for strong access control, monitoring, backups, and clear incident reporting plans.",
    whyUs:
      "VeeIntellix delivers layered security hardening with policy alignment, technical controls and incident-readiness playbooks for real operations.",
    stat: "South African institutions such as Parliament and SAA publicly reported cyber incidents in 2025.",
    lessons: [
      "Protect privileged accounts with MFA and strict access segmentation.",
      "Implement endpoint detection and centralised logging for faster response.",
      "Maintain tested offline backups to reduce ransomware recovery risk.",
      "Run incident drills and POPIA-aligned notification workflows in advance.",
    ],
    source: "https://www.parliament.gov.za/press-releases/parliament-cyber-attack",
  },
];

const newsSlides = [
  {
    title: "South African Parliament confirmed a cyber attack and active containment steps",
    date: "May 31, 2025",
    summary:
      "Parliament announced active containment after a confirmed cyber incident affecting digital services and internal operations.",
    link: "https://www.parliament.gov.za/press-releases/parliament-cyber-attack",
  },
  {
    title: "SAA disclosed a significant cyber incident affecting core digital systems",
    date: "May 2025",
    summary:
      "South African Airways reported disruption in digital operations and outlined recovery and forensic response measures.",
    link: "https://www.flysaa.com/about-us/media-room/media-statements/saa-cyber-incident-stakeholder-statement",
  },
  {
    title: "POPIA Section 22 requires responsible parties to notify regulator and data subjects after compromises",
    date: "Active legal duty",
    summary:
      "Organisations handling personal information must have response plans that support timely legal notification obligations.",
    link: "https://inforegulator.org.za/wp-content/uploads/2020/07/InfoRegSA-Act-4-of-2013-POPIA.pdf",
  },
  {
    title: "Mobile speed remains a key conversion driver for digital sales journeys",
    date: "Industry benchmark",
    summary:
      "Speed and UX quality on mobile continue to influence bounce, trust and conversion in digital commerce.",
    link: "https://www.thinkwithgoogle.com/intl/en-emea/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/",
  },
];

const tickerItems = [...newsSlides, ...newsSlides];

const ArticlesInsights = () => {
  return (
    <section id="articles" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_20%_20%,hsla(174,84%,44%,0.14),transparent_32%),radial-gradient(circle_at_80%_70%,hsla(196,92%,56%,0.15),transparent_30%)]" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            Articles & <span className="gradient-text">Market Intelligence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recent insights, statistics and tech signals tied directly to the solutions we build for growth, automation and cybersecurity.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <article
              key={article.title}
              className="rounded-2xl border border-border bg-card/90 p-6 shadow-[0_18px_45px_hsla(210,45%,7%,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/55"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/12 flex items-center justify-center">
                  <article.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">{article.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{article.problem}</p>
              <p className="text-sm text-foreground/95 mb-3">{article.detail}</p>
              <p className="text-sm text-foreground/95 mb-4">{article.whyUs}</p>
              <p className="text-sm rounded-lg border border-primary/25 bg-primary/10 p-3 mb-4">{article.stat}</p>
              {article.lessons && (
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-widest text-primary/90 mb-2">Prevention Lessons</p>
                  <ul className="space-y-1.5 text-sm text-foreground/95">
                    {article.lessons.map((lesson) => (
                      <li key={lesson} className="flex gap-2">
                        <span className="text-primary">-</span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <a
                href={article.source}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Source
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card/80 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-xl">Live Tech & Risk News Stream</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {newsSlides.map((news) => (
              <a
                key={news.title}
                href={news.link}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-xl border border-border/80 bg-muted/35 p-4 transition-colors hover:bg-muted/60"
              >
                <p className="text-xs text-primary font-semibold mb-2">{news.date}</p>
                <h4 className="font-heading text-lg mb-2">{news.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{news.summary}</p>
              </a>
            ))}
          </div>

          <div className="news-marquee">
            <div className="news-marquee-track">
              {tickerItems.map((news, index) => (
                <a
                  key={`${news.title}-${index}`}
                  href={news.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="news-pill"
                >
                  <span className="font-semibold">{news.date}</span>
                  <span className="mx-2">|</span>
                  <span>{news.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesInsights;
