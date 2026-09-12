import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollParallax() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      const headings = root.querySelectorAll("[data-scroll-heading]");
      const layers = root.querySelectorAll("[data-parallax-layer]");

      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { autoAlpha: 0.32, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: heading,
              start: "top 92%",
              end: "top 48%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || -24);
        gsap.to(layer, {
          y: depth,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, []);

  return rootRef;
}
