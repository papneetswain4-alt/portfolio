import { useCallback, useEffect, useRef, useState } from "react";

import Home from "./pages/Home";
import Intro from "./components/Intro";
import WebBackground from "./components/WebBackground";
import SmoothScroll from "./components/SmoothScroll";
import ContextMenu from "./components/ContextMenu";
import ElasticCursor from "./components/ElasticCursor";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [startHero, setStartHero] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const progressRef = useRef(null);

  const handleIntroFinish = useCallback(() => {
    setShowIntro(false);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setStartHero(true), reduceMotion ? 0 : 15);
  }, []);

  useEffect(() => {
    const handleEasterEgg = () => {
      setShowEasterEgg(true);
      window.setTimeout(() => setShowEasterEgg(false), 2600);
    };

    window.addEventListener("portfolio-easter-egg", handleEasterEgg);
    return () => window.removeEventListener("portfolio-easter-egg", handleEasterEgg);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SmoothScroll>
      <>
        {showIntro && <Intro onFinish={handleIntroFinish} />}
        <WebBackground />
        <Home startHero={startHero} />
        <ContextMenu />
        <ElasticCursor />

        {showEasterEgg && (
          <div className="easter-egg" aria-hidden="true">
            <span className="easter-egg-comet" />
            <span className="easter-egg-copy">ORBITAL SIGNAL DETECTED</span>
          </div>
        )}

        <div
          ref={progressRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "3px",
            background: "var(--primary-color)",
            zIndex: 9999,
            width: "0%",
            boxShadow: "0 0 10px var(--primary-color)",
            transition: "width 0.1s ease-out",
          }}
        />
      </>
    </SmoothScroll>
  );
}

export default App;
