import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";

export default function Hero({ startHero }) {
  const roles = [
    "Web Developer",
    "Full Stack Developer",
    "Student",
    "Problem Solver"
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🧠 Advanced Parallax (multi-layer depth)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  const depthX = useTransform(smoothX, (val) => val * 1.5);
  const depthY = useTransform(smoothY, (val) => val * 1.5);

  useEffect(() => {
    if (!startHero) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 120;
      const y = (e.clientY - window.innerHeight / 2) / 120;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [startHero, mouseX, mouseY]);

  // 🧠 Improved Typing
  useEffect(() => {
    if (!startHero) return;

    const current = roles[index];
    const speed = isDeleting ? 35 : 85;
    const pause = 1200;

    const handleTyping = () => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));
        if (text === current) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(current.substring(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % roles.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, startHero]);

  return (
    <section className="hero">

      {/* Background Glow */}
      <motion.div
        className="hero-bg-glow"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.96 }}
        animate={startHero ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{ x: depthX, y: depthY }}
        className="hero-content"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={startHero ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Hi, It's <span>Papneet</span>
        </motion.h1>

        <motion.p
          className="typing-text"
          initial={{ opacity: 0 }}
          animate={startHero ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 1 }}
        >
          I'm a <span className="highlight">{text}</span>
          <motion.span
            className="cursor"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            |
          </motion.span>
        </motion.p>

        <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={startHero ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{
                scale: 1.08,
                boxShadow: "0px 10px 40px rgba(255,0,0,0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open("https://github.com/papneetswain4-alt", "_blank")}
            >
            View My Work
        </motion.button>

      </motion.div>

      {/* Subtle floating particles */}
      <motion.div
        className="floating-orb"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
