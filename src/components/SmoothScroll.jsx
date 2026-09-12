import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerLenis, startLenis, unregisterLenis } from "../lib/lenisController";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });
    registerLenis(lenis);

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", handleScroll);

    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(update);
      startLenis();
      unregisterLenis(lenis);
      lenis.destroy();
    };
  }, []);

  return children;
}