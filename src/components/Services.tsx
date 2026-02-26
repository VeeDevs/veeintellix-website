import { Code, Globe, Smartphone, Zap, Cloud, Users } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Custom Software",
    description: "Enterprise-grade applications built with cutting-edge technologies. From SaaS platforms to internal tools.",
    tags: ["Cloud Architecture", "API Development", "Database Design"],
  },
  {
    icon: Globe,
    title: "Web Solutions",
    description: "High-performance websites and web applications. We specialize in revamps, PWAs, and e-commerce solutions.",
    tags: ["Website Revamps", "E-commerce", "Progressive Web Apps"],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications for iOS, Android, and Flutter with exceptional UX.",
    tags: ["iOS & Android", "Flutter/React Native", "App Store Optimization"],
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Streamline workflows with intelligent automation. RPA, CI/CD pipelines, and business process automation.",
    tags: ["Workflow Automation", "CI/CD", "RPA Solutions"],
  },
  {
    icon: Cloud,
    title: "Cloud Hosting",
    description: "Scalable, secure hosting solutions. Managed cloud infrastructure with 99.9% uptime guarantee.",
    tags: ["AWS/Azure/GCP", "Managed Services", "Security & Backup"],
  },
  {
    icon: Users,
    title: "IT Consulting",
    description: "Strategic technology consulting for digital transformation. Architecture review and roadmap planning.",
    tags: ["Digital Strategy", "Tech Architecture", "Project Planning"],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">
            Our <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            End-to-end digital solutions tailored to accelerate your business growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_hsla(217,91%,60%,0.15)]"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2 text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
