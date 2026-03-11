import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  FaJava,
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaDatabase
} from "react-icons/fa";

import { SiC, SiMysql, SiExpress, SiFlask, SiPostgresql } from "react-icons/si";

const categories = [
  {
    title: "Languages",
    items: [
      { icon: <FaJava />, name: "Java" },
      { icon: <SiC />, name: "C" },
      { icon: <FaPython />, name: "Python" },
      { icon: <FaJs />, name: "JavaScript" },
    ]
  },
  {
    title: "Frontend",
    items: [
      { icon: <FaHtml5 />, name: "HTML5" },
      { icon: <FaCss3Alt />, name: "CSS3" },
      { icon: <FaReact />, name: "React" },
    ]
  },
  {
    title: "Backend & Database",
    items: [
      { icon: <FaNodeJs />, name: "Node.js" },
      { icon: <SiExpress />, name: "Express" },
      { icon: <SiFlask />, name: "Flask" },
      { icon: <SiMysql />, name: "MySQL" },
      { icon: <SiPostgresql />, name: "PostgreSQL" },
      { icon: <FaDatabase />, name: "MongoDB" },
    ]
  },
  {
    title: "Tools & DevOps",
    items: [
      { icon: <FaGitAlt />, name: "Git" },
      { icon: <FaGithub />, name: "GitHub" },
      { icon: <FaDocker />, name: "Docker" },
    ]
  }
];

// Interactive 3D Tilt + Spotlight Skill Component
const SkillCard = ({ item }) => {
  const cardRef = useRef(null);

  // Spotlight mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D Tilt physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Set Spotlight CSS variables
    const spotX = e.clientX - rect.left;
    const spotY = e.clientY - rect.top;
    mouseX.set(spotX);
    mouseY.set(spotY);
    cardRef.current.style.setProperty("--mouse-x", `${spotX}px`);
    cardRef.current.style.setProperty("--mouse-x", `${spotY}px`);

    // Calculate 3D Tilt percentage (-0.5 to 0.5)
    const tiltX = spotX / rect.width - 0.5;
    const tiltY = spotY / rect.height - 0.5;
    x.set(tiltX);
    y.set(tiltY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      className="tech-card spotlight-card"
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
    >
      <motion.div
        className="spotlight-overlay"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(150px circle at ${x}px ${y}px, rgba(225, 6, 0, 0.25), transparent 40%)`
          )
        }}
      />
      
      {/* Content moved forward in Z space for 3D POP */}
      <div style={{ transform: "translateZ(30px)", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
        {item.icon}
        <span>{item.name}</span>
      </div>
    </motion.div>
  );
};

export default function TechArsenal() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="tech-arsenal" id="tech" style={{ perspective: "1500px" }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="section-title" variants={fadeUp}>
          Skills & <span>Technologies</span>
        </motion.h2>
        <motion.p className="section-subtitle" variants={fadeUp}>
          Technologies I work with daily
        </motion.p>

        <div className="skills-categories">
          {categories.map((category, catIndex) => (
            <motion.div key={catIndex} className="skill-category" variants={fadeUp}>
              <h3>{category.title}</h3>
              <motion.div className="tech-container" variants={containerVariants}>
                {category.items.map((item, index) => (
                  <SkillCard key={index} item={item} />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
