import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BadgeCheck } from "lucide-react";
import InstallAppPrompt from "@/components/InstallAppPrompt";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid animate-grid-move opacity-50" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/20 blur-[100px]" />

      <div className="container mx-auto px-4 pt-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/35 bg-primary/10 text-primary text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Open for new projects in Pretoria and Remote
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Software delivery with{" "}
            <span className="gradient-text">clear scope and fast execution</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            From idea to launch, we design and build reliable products across web, mobile, automation, and cloud infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/quote-builder"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-medium text-primary-foreground neon-glow transition-all hover:scale-105"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="w-5 h-5" />
              Try AI Quote Builder
            </Link>
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.34s" }}>
            <InstallAppPrompt />
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.35s" }}>
            <BadgeCheck className="w-4 h-4 text-accent" />
            Fixed milestones, transparent pricing, and weekly updates
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "150+", label: "Projects Delivered" },
              { value: "98%", label: "Client Retention" },
              { value: "48 hrs", label: "Proposal Turnaround" },
            ].map((stat) => (
              <div key={stat.label} className="text-center rounded-xl border border-border/80 bg-card/70 p-5">
                <div className="font-heading text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
