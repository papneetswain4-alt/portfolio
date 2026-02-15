import { motion } from "framer-motion";

export default function Intro({ onFinish }) {
  const name = "Papneet";

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3
      }
    }
  };

  const letter = {
    hidden: {
      opacity: 0,
      y: 80,
      rotateX: -90,
      scale: 0.7
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      {/* Cinematic Background Sweep */}
      <motion.div
        className="intro-bg-sweep"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2.5,
          ease: [0.16, 1, 0.3, 1]
        }}
      />

      {/* Breathing Glow */}
      <motion.div
        className="intro-glow"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Name Reveal with 3D Feel */}
      <motion.h1
        className="intro-name"
        variants={container}
        initial="hidden"
        animate="show"
        style={{ perspective: 1000 }}
      >
        {name.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letter}
            style={{ display: "inline-block" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Tagline Fade + Float */}
      <motion.p
        className="intro-tag"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.5,
          duration: 1,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        With great code comes great responsibility.
      </motion.p>

      {/* Light Streak Flash */}
      <motion.div
        className="intro-light-streak"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{
          delay: 1.2,
          duration: 1.8,
          ease: "easeInOut"
        }}
      />

      {/* Smooth Exit Fade */}
      <motion.div
        className="intro-exit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        onAnimationComplete={onFinish}
      />
    </motion.div>
  );
}
