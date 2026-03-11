import { useEffect, useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
import { FaGithub } from "react-icons/fa";

// Magnetic Button Component
const MagneticButton = ({ children, className, onClick, style, whileHover }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2); // Magnetic pull strength
    y.set(middleY * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className={className}
      onClick={onClick}
      style={{ x: smoothX, y: smoothY, ...style }}
      whileHover={whileHover}
      whileTap={{ scale: 0.95 }}
    >
      {/* Container for text/icons that moves slightly more for parallax */}
      <motion.span
        style={{ x: useTransform(smoothX, (v) => v * 0.5), y: useTransform(smoothY, (v) => v * 0.5), display: "inline-flex", alignItems: "center", gap: "8px" }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default function Hero({ startHero }) {
  const roles = [
    "Full Stack Developer",
    "Web Developer",
    "Problem Solver",
    "Open Source Enthusiast"
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Split-text animation mapping
  const name = "Papneet";
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 18 });
  const depthX = useTransform(smoothX, (val) => val * 1.5);
  const depthY = useTransform(smoothY, (val) => val * 1.5);

  useEffect(() => {
    if (!startHero) return;
    const handleMouseMove = (e) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / 100);
      mouseY.set((e.clientY - window.innerHeight / 2) / 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [startHero, mouseX, mouseY]);

  useEffect(() => {
    if (!startHero) return;
    const current = roles[index];
    const speed = isDeleting ? 35 : 80;

    const handleTyping = () => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));
        if (text === current) setTimeout(() => setIsDeleting(true), 1500);
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

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const targetPosition = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="hero" id="home">
      <motion.div
        className="hero-bg-glow"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={startHero ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: depthX, y: depthY }}
        className="hero-content"
      >
        <motion.p
          className="hero-greeting"
          initial={{ opacity: 0, y: 20 }}
          animate={startHero ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome to my portfolio
        </motion.p>

        <h1 className="hero-title">
          <motion.span
            initial={{ opacity: 0 }}
            animate={startHero ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Hi, I'm{" "}
          </motion.span>
          <span className="hero-name-split">
            {name.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={startHero ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{
                  delay: 0.6 + i * 0.05,
                  duration: 0.8,
                  type: "spring",
                  damping: 12,
                  stiffness: 100
                }}
                style={{ display: "inline-block", color: "var(--primary-color)" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          className="typing-text"
          initial={{ opacity: 0 }}
          animate={startHero ? { opacity: 1 } : {}}
          transition={{ delay: 1.1, duration: 0.8 }}
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

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={startHero ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          I build scalable web applications with modern technologies.
          Passionate about clean code, performance, and great user experiences.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={startHero ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <MagneticButton
            className="btn-primary"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(225,6,0,0.4)" }}
            onClick={() => scrollTo("projects")}
          >
            View Projects
          </MagneticButton>

          <MagneticButton
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.open("https://github.com/papneetswain4-alt", "_blank")}
          >
            <FaGithub /> GitHub
          </MagneticButton>
          
          <MagneticButton
            className="btn-outline"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollTo("contact")}
          >
            Contact Me
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="floating-orb"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
