import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const projects = [
  {
    title: "Title Verification System",
    description:
      "High-performance, AI-powered microservices system for verifying publication titles using phonetic (Soundex/Metaphone) and NLP semantic search (FAISS + Sentence Transformers).",
    tech: ["React", "Node.js", "Python", "Flask", "PostgreSQL", "Docker"],
    impact:
      "Automated compliance validation for ~160,000 titles, preventing duplicates and conceptually similar entries.",
    live: "https://title-verification-system.netlify.app",
    github: "https://github.com/papneetswain4-alt/title-verification-system",
    featured: true
  },
  {
    title: "Dev Tracker (MERN)",
    description:
      "Full-stack productivity app with JWT authentication, streak tracking, analytics charts, and GitHub-style heatmap.",
    tech: ["React", "Node.js", "MongoDB", "JWT"],
    impact:
      "Built secure authentication, protected routes, and deployed production-ready architecture.",
    live: "https://dev-tracker-mern.netlify.app",
    github: "https://github.com/papneetswain4-alt/Dev-tracker",
    featured: true
  },
  {
    title: "Foodify – Ordering System",
    description:
      "Full-stack restaurant ordering platform with Google OAuth, role-based admin access, and REST APIs.",
    tech: ["HTML", "Node.js", "MongoDB", "Express"],
    impact:
      "Implemented secure authentication, menu CRUD, and cloud deployment.",
    live: "https://foodily-orders.netlify.app",
    github: "https://github.com/papneetswain4-alt/restaurant-ordering-system-frontend",
    featured: true
  },
  {
    title: "Hospital Management System",
    description:
      "Relational database system managing patients, doctors, and appointments with optimized schema design.",
    tech: ["MySQL", "SQL", "DBMS"],
    impact:
      "Improved data retrieval efficiency and minimized redundancy.",
    featured: false
  }
];

// Interactive 3D Tilt + Spotlight Card Component
const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);

  // Spotlight mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D Tilt physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  function handleMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect();

    // Set Spotlight CSS variables
    const spotX = e.clientX - rect.left;
    const spotY = e.clientY - rect.top;
    mouseX.set(spotX);
    mouseY.set(spotY);
    cardRef.current.style.setProperty("--mouse-x", `${spotX}px`);
    cardRef.current.style.setProperty("--mouse-x", `${spotY}px`);

    // Calculate 3D Tilt percentage (-0.5 to 0.5)
    const tiltX = (e.clientX - rect.left) / rect.width - 0.5;
    const tiltY = (e.clientY - rect.top) / rect.height - 0.5;
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
      className={`project-card ${project.featured ? "featured" : ""} spotlight-card`}
      variants={fadeUp}
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
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(225, 6, 0, 0.15), transparent 40%)`
          )
        }}
      />

      {/* Featured Badge - lower translateZ so it doesn't break boundaries */}
      {project.featured && (
        <div className="featured-badge" style={{ transform: "translateZ(10px)" }}>
          ★ Featured
        </div>
      )}

      {/* Content moved slightly forward in Z space for 3D effect */}
      <div className="project-content" style={{ transform: "translateZ(30px)" }}>
        
        <h3>{project.title}</h3>

        <p className="project-desc">{project.description}</p>

        <div className="tech-tags">
          {project.tech.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>

        <p className="impact">{project.impact}</p>

        <div className="project-actions">
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer">
              <button className="project-btn primary" style={{ transform: "translateZ(20px)" }}>
                <FaExternalLinkAlt size={11} /> Live Demo
              </button>
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              <button className="project-btn secondary" style={{ transform: "translateZ(20px)" }}>
                <FaGithub size={13} /> Source Code
              </button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <section className="projects" id="projects" style={{ perspective: "1500px" }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2 className="section-title" variants={fadeUp}>
          Featured <span>Projects</span>
        </motion.h2>
        <motion.p className="section-subtitle" variants={fadeUp}>
          A selection of projects I've built and deployed
        </motion.p>

        <motion.div className="projects-grid" variants={containerVariants}>
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
