import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Intro from "./components/Intro";
import WebBackground from "./components/WebBackground";
import SmoothScroll from "./components/SmoothScroll";
import ContextMenu from "./components/ContextMenu";
import ElasticCursor from "./components/ElasticCursor";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.location.pathname === "/";
  });
  const [startHero, setStartHero] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname !== "/";
  });
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

  // Konami Code sequence listener (↑ ↑ ↓ ↓ ← → ← → B A)
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let keyBuffer = [];
    let lastTriggerTime = 0;

    const handleKeyDown = (e) => {
      if (e.target.closest("input, textarea, select, [contenteditable='true']")) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keyBuffer.push(key);
      if (keyBuffer.length > konamiCode.length) {
        keyBuffer.shift();
      }

      const matches = konamiCode.every((expectedKey, idx) => {
        return keyBuffer[idx] === expectedKey;
      });

      if (matches && keyBuffer.length === konamiCode.length) {
        const now = Date.now();
        if (now - lastTriggerTime > 5000) {
          lastTriggerTime = now;
          window.dispatchEvent(new Event("portfolio-easter-egg"));
        }
        keyBuffer = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    <BrowserRouter>
      <ScrollToTop />
      <SmoothScroll>
        <>
          {showIntro && <Intro onFinish={handleIntroFinish} />}
          <WebBackground />

          <Routes>
            <Route path="/" element={<Home startHero={startHero} />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<BlogPost />} />
          </Routes>

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
    </BrowserRouter>
  );
}

export default App;

