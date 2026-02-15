import { motion } from "framer-motion";

const projects = [
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

export default function Projects() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="projects" id="projects">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className="section-title" variants={fadeUp}>
          Projects
        </motion.h2>

        <motion.div className="projects-grid" variants={containerVariants}>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`project-card ${project.featured ? "featured" : ""}`}
              variants={fadeUp}
              whileHover={{ y: -12 }}
            >
              {project.featured && (
                <div className="featured-badge">★ Featured</div>
              )}

              <div className="project-content">
                <h3>{project.title}</h3>

                <p className="project-desc">
                  {project.description}
                </p>

                <div className="tech-tags">
                  {project.tech.map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </div>

                <p className="impact">
                  {project.impact}
                </p>

                <div className="project-actions">
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer">
                      <button className="project-btn primary">
                        Live Demo
                      </button>
                    </a>
                  )}

                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer">
                      <button className="project-btn secondary">
                        Source Code
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
