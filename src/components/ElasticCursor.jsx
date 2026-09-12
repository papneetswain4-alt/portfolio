import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Exact reference constants
const CURSOR_DIAMETER = 50;
const DOT_SIZE = 12;
const WRAP_PADDING = 8;
const WRAP_RADIUS = 12;
const WRAP_EASE = 0.2;
const TARGET_PULL = 0.35;
const TARGET_EASE = 0.25;
const TARGET_MAX_PULL = 12;
const CURSOR_PARALLAX = 0.12;
const CURSOR_MAX_LEAD = 10;
const SPRING_DURATION = 1.5;
const SPRING_EASE = "elastic.out(1, 0.5)";

// Math helper functions
const lerp = (a, b, t) => a + (b - a) * t;

const getScale = (diffX, diffY) => {
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);
  return Math.min(distance / 735, 0.35);
};

const getAngle = (diffX, diffY) => {
  return (Math.atan2(diffY, diffX) * 180) / Math.PI;
};

export default function ElasticCursor() {
  // Checklist 6 & Reduced Motion: Disable custom cursor on mobile widths, touch devices, and prefers-reduced-motion
  const [isDisabled, setIsDisabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      ("ontouchstart" in window && window.innerWidth <= 1024)
    );
  });

  const dotRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateDisabled = () => {
      setIsDisabled(
        mqMobile.matches ||
        mqMotion.matches ||
        ("ontouchstart" in window && window.innerWidth <= 1024)
      );
    };

    mqMobile.addEventListener("change", updateDisabled);
    mqMotion.addEventListener("change", updateDisabled);
    window.addEventListener("resize", updateDisabled);

    return () => {
      mqMobile.removeEventListener("change", updateDisabled);
      mqMotion.removeEventListener("change", updateDisabled);
      window.removeEventListener("resize", updateDisabled);
    };
  }, []);

  useEffect(() => {
    if (isDisabled) return undefined;

    const dot = dotRef.current;
    const blob = blobRef.current;
    if (!dot || !blob) return undefined;

    // Checklist 5: Hidden until first move guard
    let cursorMoved = false;

    // Cursor coordinates & state
    const pointer = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const currentPull = { x: 0, y: 0 };

    let activeTarget = null;
    let targetRect = null;
    let isDetaching = false;

    let dotOpacity = 0;
    let blobOpacity = 0;

    const jelly = {
      x: 0,
      y: 0,
      w: CURSOR_DIAMETER,
      h: CURSOR_DIAMETER,
      r: CURSOR_DIAMETER / 2,
      rot: 0,
      sx: 1,
      sy: 1,
    };

    // Checklist 4: GSAP quickSetters for high performance 60fps rendering
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setDotOpacity = gsap.quickSetter(dot, "opacity");

    const setBlobX = gsap.quickSetter(blob, "x", "px");
    const setBlobY = gsap.quickSetter(blob, "y", "px");
    const setBlobWidth = gsap.quickSetter(blob, "width", "px");
    const setBlobHeight = gsap.quickSetter(blob, "height", "px");
    const setBlobRadius = gsap.quickSetter(blob, "borderRadius", "px");
    const setBlobRotation = gsap.quickSetter(blob, "rotation", "deg");
    const setBlobScaleX = gsap.quickSetter(blob, "scaleX");
    const setBlobScaleY = gsap.quickSetter(blob, "scaleY");
    const setBlobOpacity = gsap.quickSetter(blob, "opacity");

    // Initialize transform origin and centering
    gsap.set([dot, blob], {
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      transformOrigin: "center center",
    });

    const releaseTarget = (element) => {
      if (!element) return;
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
      });
    };

    // Checklist 2 & 3: Mouse move handler
    const onMouseMove = (e) => {
      // Checklist 5: First move initialization (prevents stray-circle bug at 0,0)
      if (!cursorMoved) {
        cursorMoved = true;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pos.x = e.clientX;
        pos.y = e.clientY;
        jelly.x = e.clientX;
        jelly.y = e.clientY;
        vel.x = 0;
        vel.y = 0;

        setDotX(pointer.x);
        setDotY(pointer.y);
        setBlobX(jelly.x);
        setBlobY(jelly.y);

        dotOpacity = 1;
        blobOpacity = 1;
        setDotOpacity(1);
        setBlobOpacity(1);
      }

      pointer.x = e.clientX;
      pointer.y = e.clientY;

      // Checklist 2 & 3: Velocity calculation inside GSAP tween's onUpdate
      gsap.to(pos, {
        x: e.clientX,
        y: e.clientY,
        duration: SPRING_DURATION,
        ease: SPRING_EASE,
        overwrite: "auto",
        onUpdate: () => {
          vel.x = (e.clientX - pos.x) * 1.2;
          vel.y = (e.clientY - pos.y) * 1.2;
        },
        onComplete: () => {
          vel.x = 0;
          vel.y = 0;
        },
      });

      // Interactive element detection via delegation
      const hoverEl = e.target?.closest?.(".cursor-can-hover");
      if (hoverEl) {
        if (hoverEl !== activeTarget) {
          if (activeTarget) {
            releaseTarget(activeTarget);
          }
          activeTarget = hoverEl;
          targetRect = activeTarget.getBoundingClientRect();
          currentPull.x = 0;
          currentPull.y = 0;
          isDetaching = false;
        }
      } else if (activeTarget) {
        releaseTarget(activeTarget);
        activeTarget = null;
        targetRect = null;
        currentPull.x = 0;
        currentPull.y = 0;
        isDetaching = true;
      }
    };

    // Checklist 3: Scrolling recalculation logic
    const onScroll = () => {
      if (activeTarget) {
        targetRect = activeTarget.getBoundingClientRect();
      }
    };

    const onMouseLeave = () => {
      if (activeTarget) {
        releaseTarget(activeTarget);
        activeTarget = null;
        targetRect = null;
        currentPull.x = 0;
        currentPull.y = 0;
        isDetaching = true;
      }
      setDotOpacity(0);
      setBlobOpacity(0);
    };

    const onMouseEnter = () => {
      if (cursorMoved) {
        setBlobOpacity(1);
        setDotOpacity(activeTarget ? 0 : 1);
      }
    };

    // Checklist 4: Single shared gsap.ticker render loop
    const render = () => {
      if (!cursorMoved) return;

      if (activeTarget) {
        // Checklist 3: MAGNETIC HOVER/WRAP STATE
        targetRect = activeTarget.getBoundingClientRect();

        const targetW = targetRect.width + WRAP_PADDING * 2;
        const targetH = targetRect.height + WRAP_PADDING * 2;

        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        // Hovered element ITSELF gets pulled slightly toward the pointer (TARGET_MAX_PULL)
        let pullX = (pointer.x - targetCenterX) * TARGET_PULL;
        let pullY = (pointer.y - targetCenterY) * TARGET_PULL;
        const pullDist = Math.hypot(pullX, pullY);
        if (pullDist > TARGET_MAX_PULL) {
          const ratio = TARGET_MAX_PULL / pullDist;
          pullX *= ratio;
          pullY *= ratio;
        }

        currentPull.x = lerp(currentPull.x, pullX, TARGET_EASE);
        currentPull.y = lerp(currentPull.y, pullY, TARGET_EASE);
        gsap.set(activeTarget, { x: currentPull.x, y: currentPull.y });

        // Blob parallax lead toward pointer within wrapped target (CURSOR_PARALLAX, CURSOR_MAX_LEAD)
        let leadX = (pointer.x - targetCenterX) * CURSOR_PARALLAX;
        let leadY = (pointer.y - targetCenterY) * CURSOR_PARALLAX;
        const leadDist = Math.hypot(leadX, leadY);
        if (leadDist > CURSOR_MAX_LEAD) {
          const ratio = CURSOR_MAX_LEAD / leadDist;
          leadX *= ratio;
          leadY *= ratio;
        }

        const destX = targetCenterX + leadX;
        const destY = targetCenterY + leadY;

        // Checklist 6: Wrap lerp easing per frame
        jelly.x = lerp(jelly.x, destX, WRAP_EASE);
        jelly.y = lerp(jelly.y, destY, WRAP_EASE);
        jelly.w = lerp(jelly.w, targetW, WRAP_EASE);
        jelly.h = lerp(jelly.h, targetH, WRAP_EASE);
        jelly.r = lerp(jelly.r, WRAP_RADIUS, WRAP_EASE);
        jelly.rot = lerp(jelly.rot, 0, WRAP_EASE);
        jelly.sx = lerp(jelly.sx, 1, WRAP_EASE);
        jelly.sy = lerp(jelly.sy, 1, WRAP_EASE);

        // Dot fades to opacity 0 while wrapping
        dotOpacity = lerp(dotOpacity, 0, WRAP_EASE);
      } else {
        // Checklist 2: FREE-ROAM STATE
        if (isDetaching) {
          jelly.x = lerp(jelly.x, pos.x, WRAP_EASE);
          jelly.y = lerp(jelly.y, pos.y, WRAP_EASE);
          if (Math.hypot(pos.x - jelly.x, pos.y - jelly.y) < 1) {
            isDetaching = false;
          }
        } else {
          jelly.x = pos.x;
          jelly.y = pos.y;
        }

        // Velocity-based squish/stretch formula
        const scale = getScale(vel.x, vel.y);
        const targetW = CURSOR_DIAMETER + scale * 300;
        jelly.w = lerp(jelly.w, targetW, 0.4);
        jelly.h = lerp(jelly.h, CURSOR_DIAMETER, WRAP_EASE);
        jelly.r = lerp(jelly.r, CURSOR_DIAMETER / 2, WRAP_EASE);
        jelly.sx = 1 + scale;
        jelly.sy = 1 - scale * 2;

        const velSpeed = Math.hypot(vel.x, vel.y);
        if (velSpeed > 0.5) {
          jelly.rot = getAngle(vel.x, vel.y);
        }

        // Dot fades back to 1 in free-roam
        dotOpacity = lerp(dotOpacity, 1, WRAP_EASE);
      }

      // Checklist 2: Small dot tracks RAW pointer position with zero smoothing
      setDotX(pointer.x);
      setDotY(pointer.y);
      setDotOpacity(dotOpacity);

      // Update jelly blob
      setBlobX(jelly.x);
      setBlobY(jelly.y);
      setBlobWidth(jelly.w);
      setBlobHeight(jelly.h);
      setBlobRadius(jelly.r);
      setBlobRotation(jelly.rot);
      setBlobScaleX(jelly.sx);
      setBlobScaleY(jelly.sy);
      setBlobOpacity(blobOpacity);
    };

    window.addEventListener("pointermove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    gsap.ticker.add(render);

    return () => {
      window.removeEventListener("pointermove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      gsap.ticker.remove(render);
      if (activeTarget) {
        releaseTarget(activeTarget);
      }
    };
  }, [isDisabled]);

  // Checklist 6: Mobile / Touch / Reduced Motion renders null
  if (isDisabled) {
    return null;
  }

  // Checklist 1: Two cursor elements with backdropFilter: invert(100%)
  return (
    <>
      <div
        ref={dotRef}
        className="elastic-cursor-dot"
        aria-hidden="true"
        style={{
          width: `${DOT_SIZE}px`,
          height: `${DOT_SIZE}px`,
          backdropFilter: "invert(100%)",
          WebkitBackdropFilter: "invert(100%)",
        }}
      />
      <div
        ref={blobRef}
        className="elastic-cursor-blob"
        aria-hidden="true"
        style={{
          width: `${CURSOR_DIAMETER}px`,
          height: `${CURSOR_DIAMETER}px`,
          backdropFilter: "invert(100%)",
          WebkitBackdropFilter: "invert(100%)",
        }}
      />
    </>
  );
}
