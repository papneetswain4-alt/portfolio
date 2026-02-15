import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const top = section.offsetTop - 100;
        const height = section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
          setActive(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <h2 className="logo" onClick={() => scrollTo("home")}>
       {"<> P. </>"}
      </h2>

      <ul>
        <li
          className={active === "about" ? "active" : ""}
          onClick={() => scrollTo("about")}
        >
          About
        </li>

        <li
          className={active === "projects" ? "active" : ""}
          onClick={() => scrollTo("projects")}
        >
          Projects
        </li>

        <li
          className={active === "contact" ? "active" : ""}
          onClick={() => scrollTo("contact")}
        >
          Contact
        </li>
      </ul>
    </nav>
  );
}
