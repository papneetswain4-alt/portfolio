import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_OPTIONS = {
  selector: "[data-reveal]",
  staggerSelector: "[data-reveal-item]",
  start: "top 84%",
  once: true,
};

function getEase() {
  if (typeof window === "undefined") return "power3.out";
  const cssEase = window.getComputedStyle(document.documentElement).getPropertyValue("--ease").trim();
  return cssEase || "cubic-bezier(0.16, 1, 0.3, 1)";
}

export function useScrollReveal(options = {}) {
  const rootRef = useRef(null);
  const config = { ...DEFAULT_OPTIONS, ...options };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const revealElements = gsap.utils.toArray(config.selector, root);
      const ease = getEase();

      revealElements.forEach((element) => {
        const items = element.querySelectorAll(config.staggerSelector);
        const targets = items.length ? items : [element];

        gsap.fromTo(
          targets,
          {
            autoAlpha: 0,
            y: reduceMotion ? 0 : 24,
            scale: reduceMotion ? 1 : 0.96,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: reduceMotion ? 0.01 : 0.72,
            ease,
            stagger: reduceMotion ? 0 : 0.08,
            overwrite: "auto",
            scrollTrigger: {
              trigger: element,
              start: config.start,
              once: config.once,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [config.once, config.selector, config.staggerSelector, config.start]);

  return rootRef;
}
