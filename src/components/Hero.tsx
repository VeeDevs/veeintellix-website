import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid animate-grid-move opacity-50" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-[100px]" />

      <div className="container mx-auto px-4 pt-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Available for new projects in Pretoria & Remote
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            We Build Digital{" "}
            <span className="gradient-text">Excellence</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Transforming ideas into powerful software, stunning websites, and innovative mobile applications. Experience the future with our AI-powered visual builder.
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
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              Explore Services
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "150+", label: "Projects Delivered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "24/7", label: "Support Available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
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
