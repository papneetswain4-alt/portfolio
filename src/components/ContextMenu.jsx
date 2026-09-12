import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiCopy, FiGithub, FiMoon, FiSun } from "react-icons/fi";

const EMAIL = "papneetswain4@gmail.com";
const GITHUB_URL = "https://github.com/papneetswain4-alt";
const THEME_STORAGE_KEY = "portfolio-theme";
const HINT_STORAGE_KEY = "context-menu-hint-seen";

const menuItems = [
  { id: "github", label: "GitHub", icon: FiGithub },
  { id: "email", label: "Copy email", icon: FiCopy },
  { id: "theme", label: "Theme", icon: FiMoon },
];

function getTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ContextMenu() {
  const [menu, setMenu] = useState(null);
  const [hintVisible, setHintVisible] = useState(false);
  const menuRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    if (!window.localStorage.getItem(HINT_STORAGE_KEY)) {
      setHintVisible(true);
    }

    const handleContextMenu = (event) => {
      if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;

      event.preventDefault();
      const padding = 112;
      const x = Math.min(Math.max(event.clientX, padding), window.innerWidth - padding);
      const y = Math.min(Math.max(event.clientY, padding), window.innerHeight - padding);
      setMenu({ x, y });
      setHintVisible(false);
      window.localStorage.setItem(HINT_STORAGE_KEY, "true");

      window.requestAnimationFrame(() => {
        if (rippleRef.current) {
          gsap.fromTo(
            rippleRef.current,
            { scale: 0.1, opacity: 0.75 },
            { scale: 1, opacity: 0, duration: 0.65, ease: "power2.out" },
          );
        }
        if (menuRef.current) {
          gsap.fromTo(
            menuRef.current,
            { opacity: 0, scale: 0.72, rotate: -8 },
            { opacity: 1, scale: 1, rotate: 0, duration: 0.42, ease: "back.out(1.6)" },
          );
        }
      });
    };

    const closeMenu = (event) => {
      if (menuRef.current && menuRef.current.contains(event.target)) return;
      setMenu(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenu(null);
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const close = () => setMenu(null);

  const toggleTheme = () => {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    document.body.classList.add("theme-transition");
    document.documentElement.dataset.theme = nextTheme;
    document.body.dataset.theme = nextTheme;
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.body.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: nextTheme }));
    window.setTimeout(() => document.body.classList.remove("theme-transition"), 500);
    close();
  };

  const handleAction = async (id) => {
    if (id === "github") {
      window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
    } else if (id === "email") {
      await navigator.clipboard?.writeText(EMAIL);
    } else if (id === "theme") {
      toggleTheme();
      return;
    }
    close();
  };

  return (
    <>
      {hintVisible && <div className="context-menu-hint">RIGHT-CLICK TO EXPLORE</div>}
      {menu && (
        <>
          <div className="context-menu-ripple" ref={rippleRef} style={{ left: menu.x, top: menu.y }} />
          <div
            className="context-menu"
            ref={menuRef}
            style={{ left: menu.x, top: menu.y }}
            role="menu"
            aria-label="Quick actions"
          >
            <span className="context-menu-center" aria-hidden="true">P.</span>
            {menuItems.map((item, index) => {
              const Icon = item.id === "theme" && getTheme() === "light" ? FiSun : item.icon;
              const angle = (index / menuItems.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 74;
              return (
                <button
                  className="context-menu-item cursor-can-hover"
                  key={item.id}
                  type="button"
                  role="menuitem"
                  style={{ "--item-x": `${Math.cos(angle) * radius}px`, "--item-y": `${Math.sin(angle) * radius}px` }}
                  onClick={() => handleAction(item.id)}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
