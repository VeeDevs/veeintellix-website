export const business = {
  name: "VeeIntellix M3 IT Solutions",
  shortName: "VeeIntellix",
  email: "veerambaufx@gmail.com",
  phone: "+36705686763",
  whatsapp: "36705686763",
  url: "https://veeintellixm3web.vercel.app",
};

export type ProjectCategory = "Websites" | "Web applications";

export const projects = [
  {
    slug: "priopray-daily-devotion",
    title: "PrioPray",
    subtitle: "Daily Devotion",
    category: "Web applications" as ProjectCategory,
    description:
      "An account-based prayer experience with scheduled reminders, personal history and cross-device access.",
    purpose: "A focused digital home for daily devotion and prayer.",
    url: "https://priopray-daily-devotion.vercel.app/",
    image: "/projects/priopray.jpg",
    alt: "Screenshot of the live PrioPray Daily Devotion website",
    tags: ["Web application", "Faith & reflection"],
  },
  {
    slug: "pulsesync",
    title: "PulseSync",
    subtitle: "Living",
    category: "Websites" as ProjectCategory,
    description:
      "A website introducing the PulseSync Living smart-technology concept and its connected home ecosystem.",
    purpose: "A clear web introduction to a smart-living concept.",
    url: "https://pulsesync-webservice.vercel.app/",
    image: "/projects/pulsesync.jpg",
    alt: "Screenshot of the live PulseSync Living website",
    tags: ["Website", "Smart living"],
  },
  {
    slug: "epoch-moments",
    title: "The Epoch",
    subtitle: "Luxury Experiences",
    category: "Websites" as ProjectCategory,
    description:
      "A visual website for curated proposal, anniversary and celebration experiences, with direct WhatsApp booking.",
    purpose:
      "A direct introduction to a luxury experience service and its booking path.",
    url: "https://epoch-website-six.vercel.app/",
    image: "/projects/epoch.jpg",
    alt: "Screenshot of The Epoch luxury experiences website",
    tags: ["Website", "Event experiences"],
  },
  {
    slug: "whisper-of-hope",
    title: "Whisper of Hope",
    subtitle: "Community platform",
    category: "Web applications" as ProjectCategory,
    description:
      "A community-focused experience with reports, chat, groups and an account-based entry flow.",
    purpose:
      "A digital space for sharing information and community interaction.",
    url: "https://whisper-of-hope-report.vercel.app/",
    image: "/projects/whisper-of-hope.jpg",
    alt: "Screenshot of the live Whisper of Hope community platform",
    tags: ["Web application", "Community"],
  },
];

export const services = [
  {
    number: "01",
    title: "Business websites",
    description:
      "Thoughtful websites and landing pages that explain what you do and make it easy for the right people to take the next step.",
    deliverables:
      "Planning, responsive design, development, content structure, contact forms and deployment.",
    examples: "The Epoch · PulseSync Living",
    costFactors:
      "Page count, supplied content, CMS needs and custom integrations.",
  },
  {
    number: "02",
    title: "Web applications",
    description:
      "Purpose-built browser software for workflows, services and products that need more than a static website.",
    deliverables:
      "Requirements, interface design, application development, data connections and quality checks.",
    examples: "PrioPray · Whisper of Hope",
    costFactors:
      "User roles, workflow complexity, data handling and connected services.",
  },
  {
    number: "03",
    title: "E-commerce",
    description:
      "Online stores with clear product discovery and a considered path from browsing to checkout.",
    deliverables:
      "Storefront, catalogue, checkout integration, order workflows and launch support.",
    examples: "Scope and platform depend on your catalogue and payment needs.",
    costFactors:
      "Product catalogue size, payment methods, shipping rules and stock integrations.",
  },
  {
    number: "04",
    title: "Mobile & progressive web apps",
    description:
      "Mobile-first experiences and installable web apps that work well across screen sizes.",
    deliverables:
      "Responsive interfaces, app-like navigation, device testing and deployment guidance.",
    examples:
      "Platform and distribution requirements confirmed during scope review.",
    costFactors:
      "Target platforms, device features, offline needs and app-store requirements.",
  },
  {
    number: "05",
    title: "Automation & AI integration",
    description:
      "Connect repetitive tasks and carefully scoped AI capabilities to the way a team already works.",
    deliverables:
      "Workflow mapping, integrations, guardrails, testing and handover documentation.",
    examples: "Scope depends on the systems, data and approvals involved.",
    costFactors:
      "Number of systems, workflow exceptions, data access and AI usage requirements.",
  },
  {
    number: "06",
    title: "APIs, data & reporting",
    description:
      "Connect services, make data easier to use and present information in a format people can understand.",
    deliverables:
      "API connections, data transformations, dashboards and report interfaces.",
    examples: "Whisper of Hope",
    costFactors: "Data sources, volume, refresh frequency and permissions.",
  },
  {
    number: "07",
    title: "Maintenance & technical support",
    description:
      "Practical help to keep an existing website or application current, stable and understood.",
    deliverables:
      "Updates, issue investigation, improvements, backups and technical guidance as scoped.",
    examples: "Existing systems reviewed before any work is proposed.",
    costFactors:
      "System age, access, documentation quality and the support cadence needed.",
  },
  {
    number: "08",
    title: "Cloud deployment & hosting assistance",
    description:
      "Help prepare an application for release and understand its hosting and operating requirements.",
    deliverables:
      "Deployment configuration, release support, environment setup and hosting guidance as scoped.",
    examples:
      "Hosting providers and ongoing platform costs are agreed separately.",
    costFactors:
      "Application architecture, environments, traffic expectations and provider requirements.",
  },
];

export const processSteps = [
  [
    "01",
    "Discovery",
    "We learn about the people, goals and constraints behind the request.",
  ],
  [
    "02",
    "Scope & estimate",
    "We agree what is included, identify open questions and prepare a written estimate.",
  ],
  [
    "03",
    "Proposal & agreement",
    "The scope, responsibilities, milestones and terms are confirmed before work begins.",
  ],
  [
    "04",
    "Design & development",
    "The solution is built in reviewable stages, with clear communication along the way.",
  ],
  [
    "05",
    "Testing & delivery",
    "We check the agreed work, prepare the launch and hand over the relevant details.",
  ],
  [
    "06",
    "Ongoing support",
    "Maintenance or follow-up improvements can be discussed as a separate arrangement.",
  ],
] as const;
