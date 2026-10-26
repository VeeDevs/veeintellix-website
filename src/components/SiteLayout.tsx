import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { business } from "@/data/site";

const links = [
  ["Services", "/services"],
  ["Our work", "/work"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = window.localStorage.getItem("veeintellix-theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });
  const location = useLocation();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("veeintellix-theme", theme);
  }, [theme]);
  useEffect(() => {
    const pages: Record<string, [string, string]> = {
      "/": [
        "Useful technology, thoughtfully made",
        "VeeIntellix M3 designs and develops useful business websites, software, mobile experiences, automation and data solutions.",
      ],
      "/services": [
        "Services",
        "Business websites, web applications, mobile experiences, automation, integrations, data solutions and technical support from VeeIntellix M3.",
      ],
      "/work": [
        "Our work",
        "Explore live websites and applications built for real services, communities and business needs.",
      ],
      "/about": [
        "About",
        "Learn about VeeIntellix M3 IT Solutions and its practical approach to websites, software and digital systems.",
      ],
      "/estimate": [
        "Estimate a project",
        "Create an editable project brief and get an immediate, indicative project planning range in ZAR.",
      ],
      "/contact": [
        "Contact",
        "Contact VeeIntellix M3 directly by email or WhatsApp to discuss a project or service.",
      ],
    };
    const [title, description] = pages[location.pathname] ?? [
      "Page not found",
      "The requested VeeIntellix M3 page could not be found.",
    ];
    document.title = `${title} | VeeIntellix M3 IT Solutions`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", `${business.url}${location.pathname}`);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `${business.url}${location.pathname}`);
  }, [location.pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-wrap">
          <Link
            to="/"
            aria-label="VeeIntellix home"
            className="brand"
            onClick={() => setOpen(false)}
          >
            <span className="brand-mark" aria-hidden="true">
              V<span>.</span>
            </span>
            <span className="brand-copy">
              <strong>VeeIntellix</strong>
              <small>M3 IT SOLUTIONS</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              aria-pressed={theme === "dark"}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <NavLink
              to="/estimate"
              className={({ isActive }) =>
                `button button-dark nav-cta${isActive ? " active-cta" : ""}`
              }
            >
              Estimate a project <ArrowUpRight size={15} />
            </NavLink>
          </nav>
          <button
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            <button
            className="theme-toggle mobile-theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          {links.map(([label, to]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/estimate"
              className={({ isActive }) =>
                `button button-dark${isActive ? " active-cta" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              Estimate a project <ArrowUpRight size={16} />
            </NavLink>
          </nav>
        )}
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Link to="/" className="brand footer-brand">
              <span className="brand-mark">
                V<span>.</span>
              </span>
              <span className="brand-copy">
                <strong>VeeIntellix</strong>
                <small>M3 IT SOLUTIONS</small>
              </span>
            </Link>
            <p className="footer-note">Useful technology, thoughtfully made.</p>
          </div>
          <div className="footer-column">
            <span className="eyebrow">Explore</span>
            <Link to="/services">Services</Link>
            <Link to="/work">Our work</Link>
            <Link to="/about">About</Link>
            <Link to="/estimate">Project estimate</Link>
          </div>
          <div className="footer-column">
            <span className="eyebrow">Get in touch</span>
            <a href={`mailto:${business.email}`}>{business.email}</a>
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp <ArrowUpRight size={13} />
            </a>
            <Link to="/contact">Contact page</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          <span>
            Project enquiries are handled directly.{" "}
            <Link to="/contact#privacy">Privacy note</Link>
          </span>
        </div>
      </footer>
      {location.pathname !== "/estimate" && (
        <a
          className="mobile-contact"
          href={`https://wa.me/${business.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Contact VeeIntellix on WhatsApp"
        >
          WhatsApp <ArrowUpRight size={15} />
        </a>
      )}
    </>
  );
}
