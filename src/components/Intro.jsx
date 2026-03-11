import { motion } from "framer-motion";

export default function Intro({ onFinish }) {
  const name = "Papneet";

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.5
      }
    }
  };

  const letter = {
    hidden: {
      opacity: 0,
      y: 80,
      rotateX: -90,
      scale: 0.6,
      filter: "blur(10px)"
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    delay: Math.random() * 1.5,
    size: Math.random() * 4 + 2
  }));

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Sweep */}
      <motion.div
        className="intro-bg-sweep"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Pulsing Ring */}
      <motion.div
        className="intro-ring"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.5, 1.5, 2],
          opacity: [0.6, 0.3, 0]
        }}
        transition={{
          duration: 2.5,
          delay: 0.5,
          ease: "easeOut"
        }}
      />

      {/* Breathing Glow */}
      <motion.div
        className="intro-glow"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Particle Burst */}
      <div className="intro-particles">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="intro-particle"
            style={{
              top: "50%",
              left: "50%",
              width: p.size,
              height: p.size
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: p.x * 4,
              y: p.y * 4,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: p.delay + 0.8,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Name Reveal */}
      <motion.h1
        className="intro-name"
        variants={container}
        initial="hidden"
        animate="show"
        style={{ perspective: 1200 }}
      >
        {name.split("").map((char, index) => (
          <motion.span key={index} variants={letter}>
            {char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="intro-tag"
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          delay: 1.8,
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        With great code comes great responsibility.
      </motion.p>

      {/* Light Streak */}
      <motion.div
        className="intro-light-streak"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{
          delay: 1.5,
          duration: 1.5,
          ease: "easeInOut"
        }}
      />

      {/* Exit Fade */}
      <motion.div
        className="intro-exit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8, duration: 0.8 }}
        onAnimationComplete={onFinish}
      />
    </motion.div>
  );
}
