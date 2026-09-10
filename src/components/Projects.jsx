import { motion } from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowRight,
} from "react-icons/fa";

const projects = [
  {
    number: "01",
    featured: true,
    title: "TITLE VERIFICATION SYSTEM",
    category: "ARTIFICIAL INTELLIGENCE / NLP",
    description:
      "An AI-powered title verification system that validates publication titles using phonetic matching, semantic similarity, NLP algorithms, and automated probability scoring.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "Python",
      "NLP",
      "PostgreSQL",
      "Docker",
    ],
    status: "COMPLETED",
    github: "https://github.com/papneetswain4-alt/title-verification-system",
    demo: "https://title-verification-system.netlify.app/",
  },

  {
    number: "02",
    featured: true,
    title: "FOODIFY",
    category: "FULL STACK WEB APPLICATION",
    description:
      "A full-stack online food ordering system where customers can browse restaurant menus, authenticate with Google, add items to their cart, place orders, and track their activity, with an admin dashboard for restaurant management.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Netlify",
      "Render",
    ],
    status: "COMPLETED",
    github: "https://github.com/papneetswain4-alt/restaurant-ordering-system",
    demo: "https://foodily-orders.netlify.app/",
  },

  {
    number: "03",
    featured: false,
    title: "DEV TRACKER",
    category: "FULL STACK / DEVELOPER PRODUCTIVITY",
    description:
      "A developer productivity platform for tracking daily coding hours, problems solved, development streaks, goals, and GitHub-style contribution activity with authentication and analytics.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Recharts",
      "Netlify",
      "Render",
    ],
    status: "COMPLETED",
    github: "https://github.com/papneetswain4-alt/Dev-tracker",
    demo: "https://dev-tracker-mern.netlify.app/",
  },

  {
    number: "04",
    featured: false,
    title: "ALUMNI PORTAL",
    category: "DJANGO / UNIVERSITY MANAGEMENT",
    description:
      "A Django-based university alumni portal designed to connect alumni and students through authentication, alumni profiles, news, events, galleries, and centralized alumni management.",
    technologies: [
      "Python",
      "Django",
      "MySQL",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    status: "IN DEVELOPMENT",
    github: "https://github.com/papneetswain4-alt/alumni-portal",
    demo: "#",
  },

  {
    number: "05",
    featured: false,
    title: "PERSONAL PORTFOLIO",
    category: "FRONTEND / PERSONAL BRAND",
    description:
      "A modern responsive developer portfolio built to showcase projects, technical skills, development experience, and achievements with smooth animations and a GitHub-powered project section.",
    technologies: [
      "React",
      "Vite",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Framer Motion",
    ],
    status: "COMPLETED",
    github: "https://github.com/papneetswain4-alt/portfolio",
    demo: "https://spidey-portfolio.netlify.app/",
  },
];
function ProjectCard({ project, index }) {
  return (
    <motion.article
      className={`project-item ${
        project.featured ? "project-featured" : ""
      }`}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: "easeOut",
      }}
    >
      {/* NUMBER */}
      <div className="project-number">
        {project.number}
      </div>

      {/* MAIN CONTENT */}
      <div className="project-main">
        <div className="project-meta">
          <span>{project.category}</span>

          <span className="project-status">
            <i></i>
            {project.status}
          </span>
        </div>

        <h3>{project.title}</h3>

        <p>{project.description}</p>

        <div className="project-tech">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="project-actions">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} on GitHub`}
        >
          <FaGithub />
          <span>CODE</span>
        </a>

        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View live demo of ${project.title}`}
        >
          <FaExternalLinkAlt />
          <span>LIVE</span>
        </a>

        <div className="project-arrow">
          <FaArrowRight />
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="projects-container">

        {/* HEADER */}
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="projects-index">
            <span>04</span>
            <i></i>
            <span>SELECTED WORK</span>
          </div>

        </motion.div>

        {/* TITLE */}
        <motion.div
          className="projects-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p>WHAT I'VE BUILT</p>

            <h2>
              Selected <span>Projects</span>
            </h2>
          </div>

          <p>
            A collection of projects that represent how I approach
            engineering problems — from idea and architecture to
            implementation and deployment.
          </p>
        </motion.div>

        {/* PROJECT LIST */}
        <div className="projects-list">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* FOOTER */}
        <motion.div
          className="projects-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span>
            <b>{projects.length}</b> SELECTED PROJECTS
          </span>

          <span>
            MORE PROJECTS AVAILABLE ON{" "}
            <a
              href="https://github.com/papneetswain4-alt"
              target="_blank"
              rel="noopener noreferrer"
            >
              GITHUB ↗
            </a>
          </span>
        </motion.div>

      </div>
    </section>
  );
}