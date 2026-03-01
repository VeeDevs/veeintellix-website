import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles, Shield } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-heading font-bold text-primary-foreground text-lg">
              V
            </div>
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-foreground text-sm leading-tight">VeeIntellix</div>
              <div className="text-[10px] text-primary tracking-widest">M3 IT SOLUTIONS</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <Link to="/quote-builder" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Visual Builder</Link>
            <a href="/#consultation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Book Consultation</a>
            <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
            <Link
              to="/quote-builder"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              AI Quote Builder
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="/#services" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>Services</a>
            <Link to="/quote-builder" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>Visual Builder</Link>
            <a href="/#consultation" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>Book Consultation</a>
            <Link to="/admin/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
            <Link
              to="/quote-builder"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium w-fit"
              onClick={() => setIsOpen(false)}
            >
              <Sparkles className="w-4 h-4" />
              AI Quote Builder
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
