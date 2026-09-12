import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useVisitorCount } from "../hooks/useVisitorCount";

const THEME_STORAGE_KEY = "portfolio-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [, setLogoClicks] = useState(0);
  const { visitorCount, isEnabled } = useVisitorCount();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);

    const handleThemeChange = (event) => setTheme(event.detail);
    window.addEventListener("portfolio-theme-change", handleThemeChange);
    return () => window.removeEventListener("portfolio-theme-change", handleThemeChange);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
          setActive(section.id || "home");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.body.classList.add("theme-transition");
    document.documentElement.dataset.theme = nextTheme;
    document.body.dataset.theme = nextTheme;
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.body.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: nextTheme }));

    window.setTimeout(() => {
      document.body.classList.remove("theme-transition");
    }, 500);
  };

  const handleLogoClick = () => {
    scrollTo("home");
    setLogoClicks((current) => {
      const next = current + 1;
      if (next >= 5) {
        window.dispatchEvent(new Event("portfolio-easter-egg"));
        return 0;
      }
      return next;
    });
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <button className="logo cursor-can-hover" onClick={handleLogoClick} aria-label="Go to home">
        P<span>.</span>
      </button>

      <button
        className={`hamburger cursor-can-hover ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li
          className={`cursor-can-hover ${active === "about" ? "active" : ""}`}
          onClick={() => scrollTo("about")}
        >
          About
        </li>
        <li
          className={`cursor-can-hover ${active === "tech" ? "active" : ""}`}
          onClick={() => scrollTo("tech")}
        >
          Skills
        </li>
        <li
          className={`cursor-can-hover ${active === "experience" ? "active" : ""}`}
          onClick={() => scrollTo("experience")}
        >
          Journey
        </li>
        <li
          className={`cursor-can-hover ${active === "projects" ? "active" : ""}`}
          onClick={() => scrollTo("projects")}
        >
          Projects
        </li>
        <li
          className={`cursor-can-hover ${active === "github" ? "active" : ""}`}
          onClick={() => scrollTo("github")}
        >
          GitHub
        </li>
        <li
          className={`cursor-can-hover ${active === "contact" ? "active" : ""}`}
          onClick={() => scrollTo("contact")}
        >
          Contact
        </li>
      </ul>

      <button
        className="theme-toggle cursor-can-hover"
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        aria-pressed={theme === "light"}
      >
        {theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        <span>{theme === "dark" ? "LIGHT" : "DARK"}</span>
      </button>

      {isEnabled && visitorCount !== null && (
        <span className="visitor-count" aria-label={`${visitorCount} people viewing`}>
          <i aria-hidden="true" />
          {visitorCount} VIEWING
        </span>
      )}
    </nav>
  );
}
