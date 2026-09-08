import { useEffect, useRef, useState } from "react";
import Home from "./pages/Home";
import Intro from "./components/Intro";
import WebBackground from "./components/WebBackground";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [startHero, setStartHero] = useState(false);

  const cursorRef = useRef(null);
  const cursorTextRef = useRef(null);
  const outlineRef = useRef(null);
  const progressRef = useRef(null);

  // 🔥 Handle Intro Finish + Delay Hero
  const handleIntroFinish = () => {
    setShowIntro(false);

    setTimeout(() => {
      setStartHero(true);
    }, 100); // 1.5 second delay
  };

  // 🔥 Premium Custom Cursor with Velocity Scaling & Scroll Progress
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorText = cursorTextRef.current;
    const outline = outlineRef.current;
    const progressBar = progressRef.current;

    if (!cursor || !cursorText || !outline || !progressBar) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    let velX = 0;
    let velY = 0;

    const moveCursor = (e) => {
      velX = e.clientX - mouseX;
      velY = e.clientY - mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", moveCursor);

    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
      progressBar.style.width = scrolled;
    };
    
    window.addEventListener("scroll", handleScroll);

    let dotX = mouseX;
    let dotY = mouseY;

    function animate() {
      // Fast lerp for the central dot
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      // Slower lerp for the subtle outer ring (creates the trailing effect)
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;

      cursor.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    }

    animate();

    const hoverElements = document.querySelectorAll(
      "a, button, .project-card"
    );

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("cursor-hover");
        cursorText.innerText = "VIEW";
      });

      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-hover");
        cursorText.innerText = "";
      });
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {showIntro && <Intro onFinish={handleIntroFinish} />}

      <WebBackground />
      <Home startHero={startHero} />

      <div ref={cursorRef} className="custom-cursor">
        <span ref={cursorTextRef}></span>
      </div>

      <div ref={outlineRef} className="cursor-outline"></div>
      
      {/* Scroll Progress Bar */}
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
          transition: "width 0.1s ease-out"
        }}
      />
    </>
  );
}

export default App;
