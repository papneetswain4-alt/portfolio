import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Intro({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false);
  const [reduceMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const exitTimer = window.setTimeout(
      () => setIsExiting(true),
      reduceMotion ? 80 : 2920
    );
    const finishTimer = window.setTimeout(
      onFinish,
      reduceMotion ? 120 : 3800
    );
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, [onFinish, reduceMotion]);

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      animate={isExiting
        ? { opacity: 0, filter: "blur(10px)", scale: 1.015 }
        : { opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{
        duration: reduceMotion ? 0.01 : (isExiting ? 0.95 : 0.7),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="intro-atmosphere" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => <span key={index} style={{ "--particle-index": index }} />)}
      </div>
      <motion.div
        className="intro-signal"
        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
        animate={isExiting
          ? { opacity: 0, y: -8, filter: "blur(4px)" }
          : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0.01 : 1.15, delay: reduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        <span /> GALAXY OS / BOOT SEQUENCE
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        animate={isExiting
          ? { opacity: 0, y: -12, filter: "blur(7px)" }
          : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: reduceMotion ? 0.01 : (isExiting ? 0.9 : 1.3),
          delay: reduceMotion ? 0 : (isExiting ? 0 : 0.3),
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        PAPNEET
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={isExiting
          ? { opacity: 0, y: -8, filter: "blur(4px)" }
          : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0.01 : 1.1, delay: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        FULL STACK DEVELOPER
      </motion.p>
      <motion.div
        className="intro-progress"
        initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
        animate={isExiting
          ? { opacity: 0, y: -6, filter: "blur(3px)" }
          : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0.01 : 1.1, delay: reduceMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
      >
        <span /><b>INITIALIZING...</b>
      </motion.div>
    </motion.div>
  );
}
