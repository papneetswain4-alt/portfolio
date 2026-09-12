import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiCopy, FiGithub, FiMoon, FiSmile, FiSun } from "react-icons/fi";

const EMAIL = "papneetswain4@gmail.com";
const GITHUB_URL = "https://github.com/papneetswain4-alt";
const THEME_STORAGE_KEY = "portfolio-theme";
const HINT_STORAGE_KEY = "context-menu-hint-seen";

const menuItems = [
  { id: "github", label: "GitHub", icon: FiGithub },
  { id: "email", label: "Copy email", icon: FiCopy },
  { id: "theme", label: "Theme", icon: FiMoon },
  { id: "react", label: "React", icon: FiSmile },
];

const REACTIONS = [
  { id: "happy", emoji: "😀", label: "Happy" },
  { id: "heart", emoji: "❤️", label: "Heart" },
  { id: "sad", emoji: "😢", label: "Sad" },
  { id: "crying", emoji: "😭", label: "Crying" },
  { id: "extra-happy", emoji: "🤩", label: "Extra-happy" },
  { id: "fire", emoji: "🔥", label: "Fire" },
];

const REACTION_RADIUS = 88;

function getTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function BurstParticle({ particle, emoji }) {
  const elRef = useRef(null);

  useEffect(() => {
    if (!elRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(
      elRef.current,
      {
        x: particle.originX,
        y: particle.originY,
        scale: 0.35,
        opacity: 1,
        rotate: 0,
      },
      {
        x: particle.originX + (reduceMotion ? 0 : particle.targetX),
        y: particle.originY + (reduceMotion ? -16 : particle.targetY),
        scale: reduceMotion ? 1 : particle.scale,
        opacity: 0,
        rotate: reduceMotion ? 0 : particle.rotation,
        duration: reduceMotion ? 0.3 : particle.duration,
        ease: "power2.out",
      }
    );
  }, [particle]);

  return (
    <span
      ref={elRef}
      className="reaction-burst-particle"
      style={{ left: 0, top: 0 }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}

function BurstBadge({ burst }) {
  return (
    <span
      className="reaction-burst-indicator"
      style={{ left: burst.originX, top: burst.originY }}
      aria-hidden="true"
    >
      {burst.intensity === "HIGH" ? `HIGH INTENSITY ${burst.emoji}` : burst.emoji}
    </span>
  );
}

export default function ContextMenu() {
  const [menu, setMenu] = useState(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [reactionRing, setReactionRing] = useState(null);
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const [bursts, setBursts] = useState([]);
  const [reactionCounts, setReactionCounts] = useState({});

  const menuRef = useRef(null);
  const rippleRef = useRef(null);
  const ringRef = useRef(null);
  const reactionItemRefs = useRef([]);
  const activeReactionRef = useRef(null);
  const pressStateRef = useRef({
    startTime: 0,
    startX: 0,
    startY: 0,
    hasDragged: false,
    originX: 0,
    originY: 0,
  });

  const closeAll = useCallback(() => {
    setMenu(null);
    setReactionRing(null);
    setHoveredReaction(null);
    activeReactionRef.current = null;
  }, []);

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
      setReactionRing(null);
      setHoveredReaction(null);
      activeReactionRef.current = null;
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

    const handlePointerDownOutside = (event) => {
      if (
        (menuRef.current && menuRef.current.contains(event.target)) ||
        (ringRef.current && ringRef.current.contains(event.target))
      ) {
        return;
      }
      closeAll();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeAll();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("pointerdown", handlePointerDownOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("pointerdown", handlePointerDownOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAll]);

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
    closeAll();
  };

  const triggerReaction = useCallback((reaction, intensity, origin) => {
    setReactionCounts((prev) => ({
      ...prev,
      [reaction.id]: (prev[reaction.id] || 0) + 1,
    }));

    const particleCount = intensity === "HIGH" ? 9 : 3;
    const burstId = `${reaction.id}-${Date.now()}`;

    const particles = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = intensity === "HIGH" ? 70 + Math.random() * 85 : 30 + Math.random() * 30;
      return {
        id: `${burstId}-${i}`,
        originX: origin.x,
        originY: origin.y,
        targetX: Math.cos(angle) * speed,
        targetY: Math.sin(angle) * speed - (intensity === "HIGH" ? 85 : 55),
        scale: intensity === "HIGH" ? 1.8 + Math.random() * 0.7 : 1.25 + Math.random() * 0.3,
        rotation: (Math.random() - 0.5) * 50,
        duration: intensity === "HIGH" ? 1.25 + Math.random() * 0.3 : 0.85 + Math.random() * 0.2,
      };
    });

    const newBurst = {
      id: burstId,
      emoji: reaction.emoji,
      label: reaction.label,
      intensity,
      originX: origin.x,
      originY: origin.y,
      particles,
    };

    setBursts((prev) => [...prev, newBurst]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 1600);

    closeAll();
  }, [closeAll]);

  const handleAction = async (id) => {
    if (id === "github") {
      window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
    } else if (id === "email") {
      await navigator.clipboard?.writeText(EMAIL);
    } else if (id === "theme") {
      toggleTheme();
      return;
    }
    closeAll();
  };

  const handleReactPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const padding = 110;
    const originX = Math.min(Math.max(e.clientX, padding), window.innerWidth - padding);
    const originY = Math.min(Math.max(e.clientY, padding), window.innerHeight - padding);

    setReactionRing({ x: originX, y: originY });
    setHoveredReaction(null);
    activeReactionRef.current = null;
    pressStateRef.current = {
      startTime: performance.now(),
      startX: e.clientX,
      startY: e.clientY,
      hasDragged: false,
      originX,
      originY,
    };

    window.requestAnimationFrame(() => {
      if (ringRef.current) {
        gsap.fromTo(
          ringRef.current,
          { scale: 0.3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(1.8)" },
        );
      }
    });

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - pressStateRef.current.startX;
      const dy = moveEvent.clientY - pressStateRef.current.startY;
      if (Math.hypot(dx, dy) > 12) {
        pressStateRef.current.hasDragged = true;
      }

      let closestIndex = null;
      let minDistance = Infinity;

      REACTIONS.forEach((_, idx) => {
        const angle = (idx / REACTIONS.length) * Math.PI * 2 - Math.PI / 2;
        const itemX = pressStateRef.current.originX + Math.cos(angle) * REACTION_RADIUS;
        const itemY = pressStateRef.current.originY + Math.sin(angle) * REACTION_RADIUS;
        const dist = Math.hypot(moveEvent.clientX - itemX, moveEvent.clientY - itemY);

        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = idx;
        }
      });

      const newHovered = minDistance <= 56 ? closestIndex : null;
      activeReactionRef.current = newHovered;
      setHoveredReaction(newHovered);

      reactionItemRefs.current.forEach((itemEl, idx) => {
        if (!itemEl) return;
        if (idx === newHovered) {
          gsap.to(itemEl, { scale: 1.55, duration: 0.16, ease: "power2.out", overwrite: "auto" });
        } else {
          gsap.to(itemEl, { scale: 1.0, duration: 0.16, ease: "power2.out", overwrite: "auto" });
        }
      });
    };

    const onPointerUp = (upEvent) => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      const duration = performance.now() - pressStateRef.current.startTime;
      const dragDistance = Math.hypot(
        upEvent.clientX - pressStateRef.current.startX,
        upEvent.clientY - pressStateRef.current.startY
      );
      const targetIdx = activeReactionRef.current;

      if (targetIdx !== null) {
        const intensity = (pressStateRef.current.hasDragged || dragDistance > 16 || duration > 200)
          ? "HIGH"
          : "MEDIUM";
        triggerReaction(REACTIONS[targetIdx], intensity, { x: upEvent.clientX, y: upEvent.clientY });
      } else if (!pressStateRef.current.hasDragged && duration < 240) {
        // Quick tap: leave ring open for keyboard or direct click
      } else {
        closeAll();
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleReactionClick = (e, reaction) => {
    e.stopPropagation();
    triggerReaction(reaction, "MEDIUM", { x: e.clientX, y: e.clientY });
  };

  const handleRingKeyDown = (e, index) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % REACTIONS.length;
      reactionItemRefs.current[next]?.focus();
      setHoveredReaction(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + REACTIONS.length) % REACTIONS.length;
      reactionItemRefs.current[prev]?.focus();
      setHoveredReaction(prev);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const angle = (index / REACTIONS.length) * Math.PI * 2 - Math.PI / 2;
      const origin = reactionRing
        ? {
            x: reactionRing.x + Math.cos(angle) * REACTION_RADIUS,
            y: reactionRing.y + Math.sin(angle) * REACTION_RADIUS,
          }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      triggerReaction(REACTIONS[index], "MEDIUM", origin);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeAll();
    }
  };

  const handleItemKeyDown = (e, item, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (item.id === "react") {
        const angle = (index / menuItems.length) * Math.PI * 2 - Math.PI / 2;
        const originX = menu.x + Math.cos(angle) * 78;
        const originY = menu.y + Math.sin(angle) * 78;
        setReactionRing({ x: originX, y: originY });
        setHoveredReaction(0);
        window.requestAnimationFrame(() => {
          reactionItemRefs.current[0]?.focus();
        });
      } else {
        handleAction(item.id);
      }
    }
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
              const radius = 78;
              const isReact = item.id === "react";

              return (
                <button
                  className={`context-menu-item cursor-can-hover ${isReact && reactionRing ? "is-active" : ""}`}
                  key={item.id}
                  type="button"
                  role="menuitem"
                  tabIndex={0}
                  style={{
                    "--item-x": `${Math.cos(angle) * radius}px`,
                    "--item-y": `${Math.sin(angle) * radius}px`,
                  }}
                  onPointerDown={isReact ? handleReactPointerDown : undefined}
                  onClick={!isReact ? () => handleAction(item.id) : undefined}
                  onKeyDown={(e) => handleItemKeyDown(e, item, index)}
                  aria-label={item.label}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {reactionRing && (
        <div
          className="reaction-picker-ring"
          ref={ringRef}
          style={{ left: reactionRing.x, top: reactionRing.y }}
          role="menu"
          aria-label="Reaction options"
        >
          {REACTIONS.map((reaction, index) => {
            const angle = (index / REACTIONS.length) * Math.PI * 2 - Math.PI / 2;
            const rx = Math.cos(angle) * REACTION_RADIUS;
            const ry = Math.sin(angle) * REACTION_RADIUS;
            const isMagnified = hoveredReaction === index;

            return (
              <button
                key={reaction.id}
                ref={(el) => (reactionItemRefs.current[index] = el)}
                type="button"
                role="menuitem"
                tabIndex={0}
                className={`reaction-picker-item cursor-can-hover ${isMagnified ? "is-magnified" : ""}`}
                style={{
                  left: `${rx}px`,
                  top: `${ry}px`,
                }}
                onClick={(e) => handleReactionClick(e, reaction, index)}
                onKeyDown={(e) => handleRingKeyDown(e, index)}
                aria-label={`React with ${reaction.label}`}
              >
                <span aria-hidden="true">{reaction.emoji}</span>
                <span className="reaction-picker-label">{reaction.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {bursts.length > 0 && (
        <div className="reaction-burst-container">
          {bursts.map((burst) => (
            <div key={burst.id}>
              <BurstBadge burst={burst} />
              {burst.particles.map((p) => (
                <BurstParticle key={p.id} particle={p} emoji={burst.emoji} />
              ))}
            </div>
          ))}
        </div>
      )}

      {Object.values(reactionCounts).some((count) => count > 0) && (
        <div className="reactions-tally" aria-label="Reaction counts this session">
          <span className="reactions-tally-label">REACTIONS</span>
          {REACTIONS.filter((r) => (reactionCounts[r.id] || 0) > 0).map((r) => (
            <span className="reactions-tally-item" key={r.id} title={`${r.label}: ${reactionCounts[r.id]}`}>
              <span>{r.emoji}</span>
              <b>×{reactionCounts[r.id]}</b>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
