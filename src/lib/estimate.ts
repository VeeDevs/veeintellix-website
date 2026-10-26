export type ProjectType =
  | "landing"
  | "website"
  | "ecommerce"
  | "webapp"
  | "mobile"
  | "automation"
  | "api"
  | "upgrade"
  | "other";
export type Complexity = "basic" | "standard" | "advanced";
export type DesignLevel = "adapted" | "custom" | "premium";

// Draft planning ranges in ZAR. Business-owner approval is required before publication as final rates.
export const pricing = {
  currency: "ZAR",
  categories: {
    landing: { label: "Landing page", min: 5000, max: 10000 },
    website: { label: "Business website", min: 10000, max: 24000 },
    ecommerce: { label: "E-commerce store", min: 22000, max: 55000 },
    webapp: { label: "Custom web application", min: 30000, max: 80000 },
    mobile: { label: "Mobile application", min: 35000, max: 95000 },
    automation: {
      label: "Automation or AI integration",
      min: 12000,
      max: 42000,
    },
    api: { label: "API / backend development", min: 14000, max: 50000 },
    upgrade: { label: "Maintenance / system upgrade", min: 4000, max: 22000 },
    other: { label: "Other / not sure", min: 8000, max: 30000 },
  } satisfies Record<ProjectType, { label: string; min: number; max: number }>,
  features: {
    responsive: { label: "Responsive implementation", min: 0, max: 0 },
    design: { label: "Custom UI/UX design", min: 2500, max: 7000 },
    cms: { label: "Content management", min: 3000, max: 8000 },
    contact: { label: "Contact forms", min: 800, max: 2200 },
    booking: { label: "Booking & scheduling", min: 4000, max: 12000 },
    auth: { label: "Authentication & roles", min: 3500, max: 10000 },
    dashboard: { label: "Business dashboard", min: 5000, max: 14000 },
    payments: { label: "Payments", min: 3500, max: 10000 },
    integrations: { label: "External integrations", min: 2500, max: 9000 },
    notifications: { label: "Notifications & email", min: 1800, max: 5000 },
    whatsapp: { label: "WhatsApp integration", min: 1800, max: 5000 },
    ai: { label: "AI functionality", min: 5000, max: 18000 },
    analytics: { label: "Reporting & analytics", min: 3000, max: 9000 },
    migration: { label: "Data migration", min: 2500, max: 10000 },
    qa: { label: "Testing & QA", min: 2000, max: 6500 },
    deployment: { label: "Deployment", min: 1000, max: 3500 },
    documentation: { label: "Documentation", min: 1000, max: 3500 },
    maintenance: { label: "Maintenance setup", min: 1500, max: 5000 },
  } satisfies Record<string, { label: string; min: number; max: number }>,
  complexity: {
    basic: { label: "Basic", factor: 0 },
    standard: { label: "Standard", factor: 0.2 },
    advanced: { label: "Advanced", factor: 0.45 },
  } satisfies Record<Complexity, { label: string; factor: number }>,
  design: {
    adapted: { label: "Template adaptation", factor: 0 },
    custom: { label: "Standard custom design", factor: 0.12 },
    premium: { label: "Premium custom design", factor: 0.25 },
  } satisfies Record<DesignLevel, { label: string; factor: number }>,
  urgency: {
    flexible: { label: "Flexible", factor: 0 },
    soon: { label: "As soon as feasible", factor: 0.1 },
    rush: { label: "Urgent (subject to feasibility)", factor: 0.2 },
  },
};

export type EstimateInput = {
  type: ProjectType;
  features: string[];
  complexity: Complexity;
  design: DesignLevel;
  urgency: keyof typeof pricing.urgency;
};
export function calculateEstimate(input: EstimateInput) {
  const base = pricing.categories[input.type];
  const featureKeys = [...new Set(input.features)].filter(
    (key) => key in pricing.features,
  ) as (keyof typeof pricing.features)[];
  const featureMin = featureKeys.reduce(
    (sum, key) => sum + pricing.features[key].min,
    0,
  );
  const featureMax = featureKeys.reduce(
    (sum, key) => sum + pricing.features[key].max,
    0,
  );
  const factor =
    pricing.complexity[input.complexity].factor +
    pricing.design[input.design].factor +
    pricing.urgency[input.urgency].factor;
  const round = (amount: number) => Math.round(amount / 500) * 500;
  return {
    min: round((base.min + featureMin) * (1 + factor)),
    max: round((base.max + featureMax) * (1 + factor)),
    featureKeys,
  };
}

export function money(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: pricing.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const featureGroups: Record<ProjectType, string[]> = {
  landing: [
    "responsive",
    "design",
    "contact",
    "analytics",
    "qa",
    "deployment",
    "documentation",
    "maintenance",
  ],
  website: [
    "responsive",
    "design",
    "cms",
    "contact",
    "booking",
    "notifications",
    "whatsapp",
    "analytics",
    "qa",
    "deployment",
    "documentation",
    "maintenance",
  ],
  ecommerce: [
    "responsive",
    "design",
    "cms",
    "payments",
    "integrations",
    "notifications",
    "whatsapp",
    "analytics",
    "migration",
    "qa",
    "deployment",
    "documentation",
    "maintenance",
  ],
  webapp: [
    "responsive",
    "design",
    "auth",
    "dashboard",
    "booking",
    "payments",
    "integrations",
    "notifications",
    "whatsapp",
    "ai",
    "analytics",
    "migration",
    "qa",
    "deployment",
    "documentation",
    "maintenance",
  ],
  mobile: [
    "responsive",
    "design",
    "auth",
    "payments",
    "integrations",
    "notifications",
    "whatsapp",
    "ai",
    "analytics",
    "qa",
    "deployment",
    "documentation",
    "maintenance",
  ],
  automation: [
    "integrations",
    "notifications",
    "whatsapp",
    "ai",
    "analytics",
    "migration",
    "qa",
    "deployment",
    "documentation",
    "maintenance",
  ],
  api: [
    "auth",
    "integrations",
    "notifications",
    "ai",
    "analytics",
    "migration",
    "qa",
    "deployment",
    "documentation",
    "maintenance",
  ],
  upgrade: [
    "responsive",
    "cms",
    "integrations",
    "notifications",
    "analytics",
    "migration",
    "qa",
    "deployment",
    "documentation",
    "maintenance",
  ],
  other: Object.keys(pricing.features),
};
