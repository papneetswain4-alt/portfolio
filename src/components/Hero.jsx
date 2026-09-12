import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaArrowDown, FaArrowUpRightFromSquare, FaGithub, FaLinkedin } from "react-icons/fa6";
import { useScrollParallax } from "../hooks/useScrollParallax";

const links = {
  github: "https://github.com/papneetswain4-alt",
  linkedin: "https://www.linkedin.com/in/papneet-swain-92a2b9343/",
};

export default function Hero({ startHero }) {
  const roles = ["PROBLEM SOLVER", "DEVELOPER", "SOFTWARE ENGINEER", "FULL STACK DEVELOPER"];
  const [roleIndex, setRoleIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const sectionRef = useScrollParallax();
  const entranceEase = [0.16, 1, 0.3, 1];

  const itemVariants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 18, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0.01 : 1.08,
        ease: entranceEase,
      },
    },
  };

  const wordVariants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 24, rotateX: -35, filter: "blur(10px)" },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0.01 : 1.28,
        delay: reduceMotion ? 0 : 0.2 + index * 0.075,
        ease: entranceEase,
      },
    }),
  };

  const ctaVariants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduceMotion
        ? { duration: 0.01 }
        : { type: "tween", duration: 1.15, ease: [0.16, 1, 0.3, 1] },
    },
  };

  useEffect(() => {
    if (reduceMotion || !startHero) return undefined;
    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [reduceMotion, startHero, roles.length]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="hero" id="home" ref={sectionRef}>
      <div className="hero-grid" data-parallax-layer data-depth="-42" />
      <motion.div
        className="hero-content"
        initial="hidden"
        animate={startHero ? "visible" : "hidden"}
        variants={{
          hidden: reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 10, filter: "blur(5px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              duration: reduceMotion ? 0.01 : 1.5,
              ease: entranceEase,
              staggerChildren: reduceMotion ? 0 : 0.15,
              delayChildren: reduceMotion ? 0 : 0.08,
            },
          },
        }}
      >
        <motion.p className="hero-kicker" variants={itemVariants}><span /> HI, I&apos;M</motion.p>
        <h1 aria-label="Papneet">
          {"PAPNEET".split("").map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              custom={index}
              variants={wordVariants}
              initial="hidden"
              animate={startHero ? "visible" : "hidden"}
              style={{ display: "inline-block", transformOrigin: "50% 100%" }}
            >
              {letter}
            </motion.span>
          ))}
          <motion.em variants={itemVariants}>.</motion.em>
        </h1>
        <motion.div className="hero-role" aria-live="polite" variants={itemVariants}>
          <i aria-hidden="true" />
          <span className="hero-role-viewport">
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                className="hero-role-text"
                key={roles[roleIndex]}
                initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10, filter: "blur(5px)" }}
                transition={{
                  duration: reduceMotion ? 0 : 0.92,
                  ease: [0.42, 0, 0.58, 1],
                }}
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>
        <motion.p className="hero-description" variants={itemVariants}>Computer Science Engineering student building modern software and exploring full-stack development &amp; AI.</motion.p>
        <motion.div className="hero-actions" variants={itemVariants}>
          <motion.button className="button button-solid cursor-can-hover" variants={ctaVariants} onClick={() => scrollTo("projects")}>VIEW PROJECTS <FaArrowUpRightFromSquare /></motion.button>
          <motion.button className="button button-ghost cursor-can-hover" variants={ctaVariants} onClick={() => scrollTo("contact")}>CONTACT ME <FaArrowUpRightFromSquare /></motion.button>
        </motion.div>
        <motion.div className="hero-links" variants={itemVariants}>
          <motion.a href={links.github} target="_blank" rel="noreferrer" variants={ctaVariants}><FaGithub /> GITHUB</motion.a>
          <motion.a href={links.linkedin} target="_blank" rel="noreferrer" variants={ctaVariants}><FaLinkedin /> LINKEDIN</motion.a>
          <motion.a href="#contact" variants={ctaVariants}><span className="hero-link-dot" /> AVAILABLE FOR OPPORTUNITIES</motion.a>
        </motion.div>
      </motion.div>
      <div className="hero-aside"><span>PERSONAL UNIVERSE / 2026</span><span>05°12&apos; N / 085°50&apos; E</span></div>
      <button className="scroll-cue cursor-can-hover" onClick={() => scrollTo("about")} aria-label="Scroll to about"><span>SCROLL TO EXPLORE</span><FaArrowDown /></button>
    </section>
  );
}
