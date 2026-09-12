import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowUpRightFromSquare, FaGithub, FaXmark } from "react-icons/fa6";
import { projects } from "../data/projects";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useScrollParallax } from "../hooks/useScrollParallax";
import { startLenis, stopLenis } from "../lib/lenisController";

function ProjectPreview({ project, modal = false }) {
  const previewRef = useRef(null);
  const hasImage = Boolean(project.image || project.thumbnail);
  const image = project.image || project.thumbnail;

  const handlePointerMove = (event) => {
    if (!previewRef.current || !hasImage) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
    previewRef.current.style.setProperty("--preview-x", `${x}px`);
    previewRef.current.style.setProperty("--preview-y", `${y}px`);
  };

  const resetPointer = () => {
    previewRef.current?.style.setProperty("--preview-x", "0px");
    previewRef.current?.style.setProperty("--preview-y", "0px");
  };

  return (
    <div
      className={`project-preview ${hasImage ? "has-image" : "is-placeholder"} ${modal ? "project-preview-modal" : ""}`}
      ref={previewRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {hasImage ? (
        <img src={image} alt={`${project.title} project preview`} loading="lazy" />
      ) : (
        <>
          <span className="preview-placeholder-label">PROJECT PREVIEW</span>
          <strong>{project.number}</strong>
          <small>{project.category}</small>
        </>
      )}
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  const handleEnter = () => window.dispatchEvent(new CustomEvent("galaxy-project-hover", { detail: { active: true } }));
  const handleLeave = () => window.dispatchEvent(new CustomEvent("galaxy-project-hover", { detail: { active: false } }));

  return (
    <motion.article
      className={`project-card cursor-can-hover ${project.featured ? "is-featured" : ""}`}
      data-reveal-item
      onClick={() => onOpen(project)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex="0"
      onKeyDown={(event) => event.key === "Enter" && onOpen(project)}
      aria-label={`Open details for ${project.title}`}
    >
      <ProjectPreview project={project} />
      <div className="project-card-body">
        <div className="project-card-top"><span>{project.number} / {project.category}</span><i>{project.status}</i></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-card-bottom">
          <div>{project.technologies.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}</div>
          <span className="project-open">VIEW <b>↗</b></span>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.classList.add("modal-open");
    stopLenis();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.classList.remove("modal-open");
      startLenis();
    };
  }, [onClose]);

  return (
    <motion.div className="project-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div className="project-modal" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="project-modal-title" initial={{ y: 28, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 28, opacity: 0, scale: 0.98 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close cursor-can-hover" onClick={onClose} aria-label="Close project details"><FaXmark /></button>
        <ProjectPreview project={project} modal />
        {project.images?.length > 0 && (
          <div className="project-gallery" aria-label="Additional project screenshots">
            {project.images.map((image, index) => (
              <img key={image} src={image} alt={`${project.title} screenshot ${index + 1}`} loading="lazy" />
            ))}
          </div>
        )}
        <div className="modal-copy">
          <span className="eyebrow">{project.number} / {project.category}</span>
          <h2 id="project-modal-title">{project.title}</h2>
          <p>{project.description}</p>
          <div className="modal-columns">
            <div><span className="eyebrow">TECHNOLOGIES</span><div className="modal-tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
            <div><span className="eyebrow">FEATURES</span><ul>{(project.features || []).map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
          </div>
          <div className="modal-actions">
            <a className="cursor-can-hover" href={project.github} target="_blank" rel="noreferrer"><FaGithub /> GITHUB</a>
            {project.demo !== "#" && <a className="cursor-can-hover" href={project.demo} target="_blank" rel="noreferrer"><FaArrowUpRightFromSquare /> LIVE DEMO</a>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionRef = useScrollReveal();
  const parallaxRef = useScrollParallax();
  return (
    <section className="projects" id="projects" ref={parallaxRef}>
      <div className="section-atmosphere projects-atmosphere" data-parallax-layer data-depth="-38" aria-hidden="true" />
      <div ref={sectionRef}>
      <div className="section-shell">
        <div className="section-marker" data-reveal><span>04</span><i /><span>SELECTED WORK</span></div>
        <div className="section-heading" data-reveal data-scroll-heading>
          <div><p>IDEAS MADE REAL</p><h2>Selected <em>projects</em></h2></div>
          <p>A working archive of full-stack products, experiments, and systems built from first principles.</p>
        </div>
        <div className="projects-grid" data-reveal>{projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} onOpen={setSelectedProject} />)}</div>
        <div className="projects-footer" data-reveal><span><b>{projects.length}</b> PROJECTS IN ORBIT</span><a className="cursor-can-hover" href="https://github.com/papneetswain4-alt" target="_blank" rel="noreferrer">MORE ON GITHUB ↗</a></div>
      </div>
      </div>
      <AnimatePresence>{selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}</AnimatePresence>
    </section>
  );
}
