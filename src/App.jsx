import { useEffect, useRef, useState } from "react";

import Home from "./pages/Home";
import Intro from "./components/Intro";
import WebBackground from "./components/WebBackground";
import SmoothScroll from "./components/SmoothScroll";


function App() {

  const [showIntro, setShowIntro] = useState(true);
  const [startHero, setStartHero] = useState(false);


  // ==========================================
  // CURSOR REFS
  // ==========================================

  const cursorRef = useRef(null);
  const cursorTextRef = useRef(null);
  const outlineRef = useRef(null);
  const progressRef = useRef(null);


  // ==========================================
  // INTRO FINISH
  // ==========================================

  const handleIntroFinish = () => {

    setShowIntro(false);

    setTimeout(() => {
      setStartHero(true);
    }, 100);

  };


  // ==========================================
  // CURSOR / MAGNETIC / SCROLL SYSTEM
  // ==========================================

  useEffect(() => {

    const cursor = cursorRef.current;
    const cursorText = cursorTextRef.current;
    const outline = outlineRef.current;
    const progressBar = progressRef.current;


    if (
      !cursor ||
      !cursorText ||
      !outline ||
      !progressBar
    ) {
      return;
    }


    // ==========================================
    // POINTER POSITION
    // ==========================================

    let mouseX =
      window.innerWidth / 2;

    let mouseY =
      window.innerHeight / 2;


    // ==========================================
    // SMALL DOT POSITION
    // ==========================================

    let dotX = mouseX;
    let dotY = mouseY;


    // ==========================================
    // LARGE CURSOR POSITION
    // ==========================================

    let circleX = mouseX;
    let circleY = mouseY;


    // ==========================================
    // LARGE CURSOR VELOCITY
    // ==========================================

    let velocityX = 0;
    let velocityY = 0;


    // ==========================================
    // PREVIOUS POSITION
    // ==========================================

    let previousCircleX =
      circleX;

    let previousCircleY =
      circleY;


    // ==========================================
    // SMOOTH ANGLE
    // ==========================================

    let currentAngle = 0;


    // ==========================================
    // ANIMATION FRAME
    // ==========================================

    let animationFrame;


    // ==========================================
    // MOUSE MOVE
    // ==========================================

    const moveCursor = (e) => {

      mouseX = e.clientX;
      mouseY = e.clientY;

    };


    document.addEventListener(
      "mousemove",
      moveCursor
    );


    // ==========================================
    // SCROLL PROGRESS
    // ==========================================

    const handleScroll = () => {

      const scrollTop =
        window.scrollY;


      const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;


      const progress =
        documentHeight > 0
          ? (scrollTop / documentHeight) * 100
          : 0;


      progressBar.style.width =
        `${progress}%`;

    };


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    handleScroll();


    // ==========================================
    // MAGNETIC ELEMENTS
    // ==========================================

    const magneticElements =
      document.querySelectorAll(
        "a, button, .project-card"
      );


    const magneticData = [];


    magneticElements.forEach((element) => {

      const data = {

        element,

        x: 0,
        y: 0,

      };


      magneticData.push(data);


      // ========================================
      // MOUSE ENTER
      // ========================================

      const handleEnter = () => {

        cursor.classList.add(
          "cursor-hover"
        );


        cursorText.innerText = "";

      };


      // ========================================
      // MOUSE LEAVE
      // ========================================

      const handleLeave = () => {

        cursor.classList.remove(
          "cursor-hover"
        );


        cursorText.innerText = "";


        data.x = 0;
        data.y = 0;


        element.style.transform = "";

      };


      element.addEventListener(
        "mouseenter",
        handleEnter
      );


      element.addEventListener(
        "mouseleave",
        handleLeave
      );


      data.handleEnter =
        handleEnter;


      data.handleLeave =
        handleLeave;

    });


    // ==========================================
    // ANIMATION
    // ==========================================

    const animate = () => {


      // ========================================
      // 1. SMALL DOT
      // ========================================

      /*
        The small dot is fast and responsive.
      */

      dotX +=
        (mouseX - dotX) *
        0.45;


      dotY +=
        (mouseY - dotY) *
        0.45;


      cursor.style.transform = `
        translate3d(
          ${dotX}px,
          ${dotY}px,
          0
        )
        translate(-50%, -50%)
      `;


      // ========================================
      // 2. LARGE CURSOR SPRING
      // ========================================

      /*
        The large circle follows the small
        dot smoothly.
      */

      const followX =
        dotX - circleX;


      const followY =
        dotY - circleY;


      velocityX +=
        followX * 0.055;


      velocityY +=
        followY * 0.055;


      // ========================================
      // 3. DAMPING
      // ========================================

      velocityX *= 0.78;
      velocityY *= 0.78;


      // ========================================
      // 4. UPDATE POSITION
      // ========================================

      circleX += velocityX;
      circleY += velocityY;


      // ========================================
      // 5. CALCULATE VELOCITY
      // ========================================

      const movementX =
        circleX - previousCircleX;


      const movementY =
        circleY - previousCircleY;


      const speed =
        Math.sqrt(
          movementX * movementX +
          movementY * movementY
        );


      // ========================================
      // 6. MOVEMENT ANGLE
      // ========================================

      if (speed > 0.01) {

        const targetAngle =
          Math.atan2(
            movementY,
            movementX
          ) *
          180 /
          Math.PI;


        let angleDifference =
          targetAngle -
          currentAngle;


        // Prevent long rotation.

        while (
          angleDifference > 180
        ) {

          angleDifference -= 360;

        }


        while (
          angleDifference < -180
        ) {

          angleDifference += 360;

        }


        currentAngle +=
          angleDifference * 0.12;

      }


      // ========================================
      // 7. SUBTLE STRETCH
      // ========================================

      /*
        Very small deformation.

        The cursor stays mostly circular.
      */

      const stretch =
        Math.min(
          speed * 0.025,
          0.14
        );


      const scaleX =
        1 + stretch;


      const scaleY =
        1 - stretch * 0.35;


      // ========================================
      // 8. APPLY LARGE CURSOR
      // ========================================

      outline.style.transform = `
        translate3d(
          ${circleX}px,
          ${circleY}px,
          0
        )
        translate(-50%, -50%)
        rotate(${currentAngle}deg)
        scale(
          ${scaleX},
          ${scaleY}
        )
      `;


      // ========================================
      // 9. DOT INSIDE / OUTSIDE
      // ========================================

      const distanceX =
        dotX - circleX;


      const distanceY =
        dotY - circleY;


      const distance =
        Math.sqrt(
          distanceX * distanceX +
          distanceY * distanceY
        );


      const cursorRadius =
        21 +
        stretch * 15;


      if (
        distance >
        cursorRadius
      ) {

        cursor.classList.add(
          "cursor-outside"
        );

      } else {

        cursor.classList.remove(
          "cursor-outside"
        );

      }


      // ========================================
      // 10. MAGNETIC ELEMENTS
      // ========================================

      magneticData.forEach((data) => {

        const element =
          data.element;


        const rect =
          element.getBoundingClientRect();


        const elementX =
          rect.left +
          rect.width / 2;


        const elementY =
          rect.top +
          rect.height / 2;


        const dx =
          mouseX - elementX;


        const dy =
          mouseY - elementY;


        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          );


        const radius = 100;


        if (
          distance < radius &&
          distance > 0
        ) {

          const strength =
            (
              1 -
              distance / radius
            ) * 0.12;


          const targetX =
            dx * strength;


          const targetY =
            dy * strength;


          data.x +=
            (
              targetX -
              data.x
            ) * 0.12;


          data.y +=
            (
              targetY -
              data.y
            ) * 0.12;


          element.style.transform = `
            translate3d(
              ${data.x}px,
              ${data.y}px,
              0
            )
          `;

        } else {

          data.x +=
            (0 - data.x) *
            0.12;


          data.y +=
            (0 - data.y) *
            0.12;


          element.style.transform = `
            translate3d(
              ${data.x}px,
              ${data.y}px,
              0
            )
          `;

        }

      });


      // ========================================
      // SAVE PREVIOUS POSITION
      // ========================================

      previousCircleX =
        circleX;


      previousCircleY =
        circleY;


      // ========================================
      // NEXT FRAME
      // ========================================

      animationFrame =
        requestAnimationFrame(
          animate
        );

    };


    // ==========================================
    // START
    // ==========================================

    animate();


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      document.removeEventListener(
        "mousemove",
        moveCursor
      );


      window.removeEventListener(
        "scroll",
        handleScroll
      );


      cancelAnimationFrame(
        animationFrame
      );


      magneticData.forEach((data) => {

        data.element.removeEventListener(
          "mouseenter",
          data.handleEnter
        );


        data.element.removeEventListener(
          "mouseleave",
          data.handleLeave
        );


        data.element.style.transform =
          "";

      });

    };

  }, []);


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <SmoothScroll>

      <>

        {/* =====================================
            INTRO
        ====================================== */}

        {showIntro && (

          <Intro
            onFinish={
              handleIntroFinish
            }
          />

        )}


        {/* =====================================
            3D BACKGROUND
        ====================================== */}

        <WebBackground />


        {/* =====================================
            MAIN PORTFOLIO
        ====================================== */}

        <Home
          startHero={startHero}
        />


        {/* =====================================
            SMALL CURSOR DOT
        ====================================== */}

        <div
          ref={cursorRef}
          className="custom-cursor"
        >

          <span
            ref={cursorTextRef}
          />

        </div>


        {/* =====================================
            LARGE CURSOR
        ====================================== */}

        <div
          ref={outlineRef}
          className="cursor-outline"
        />


        {/* =====================================
            SCROLL PROGRESS
        ====================================== */}

        <div
          ref={progressRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,

            height: "3px",

            background:
              "var(--primary-color)",

            zIndex: 9999,

            width: "0%",

            boxShadow:
              "0 0 10px var(--primary-color)",

            transition:
              "width 0.1s ease-out",
          }}
        />

      </>

    </SmoothScroll>

  );
}


export default App;