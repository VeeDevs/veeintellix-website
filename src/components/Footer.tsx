import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-heading font-bold text-primary-foreground text-sm">V</div>
          <span className="font-heading font-semibold text-foreground">VeeIntellix M3</span>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Built with <Heart className="w-3 h-3 text-accent" /> in Pretoria © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
