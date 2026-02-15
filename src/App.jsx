import { useEffect, useRef, useState } from "react";
import Home from "./pages/Home";
import Intro from "./components/Intro";
import WebBackground from "./components/WebBackground";
import Lenis from "@studio-freight/lenis";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [startHero, setStartHero] = useState(false);

  const cursorRef = useRef(null);
  const cursorTextRef = useRef(null);
  const outlineRef = useRef(null);

  // 🔥 Smooth Scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 🔥 Handle Intro Finish + Delay Hero
  const handleIntroFinish = () => {
    setShowIntro(false);

    setTimeout(() => {
      setStartHero(true);
    }, 100); // 1.5 second delay
  };

  // 🔥 Premium Custom Cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorText = cursorTextRef.current;
    const outline = outlineRef.current;

    if (!cursor || !cursorText || !outline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    document.addEventListener("mousemove", moveCursor);

    function animate() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      outline.style.left = `${outlineX}px`;
      outline.style.top = `${outlineY}px`;

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
    </>
  );
}

export default App;
