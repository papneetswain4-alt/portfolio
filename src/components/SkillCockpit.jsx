import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCode,
  FaCss3Alt,
  FaDocker,
  FaFigma,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaJava,
  FaJs,
  FaLaptopCode,
  FaLinux,
  FaNodeJs,
  FaPlug,
  FaPython,
  FaReact,
} from "react-icons/fa";
import {
  SiExpress,
  SiFlask,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiThreedotjs,
  SiTypescript,
} from "react-icons/si";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { keyboardSkills } from "./tech-keyboard/keyboard-skills";

const iconBySkill = {
  TypeScript: SiTypescript,
  HTML5: FaHtml5,
  Express: SiExpress,
  React: FaReact,
  "Three.js": SiThreedotjs,
  GitHub: FaGithub,
  "REST APIs": FaPlug,
  SQL: FaCode,
  Docker: FaDocker,
  Figma: FaFigma,
  Git: FaGitAlt,
  Flask: SiFlask,
  JavaScript: FaJs,
  Java: FaJava,
  Linux: FaLinux,
  CSS3: FaCss3Alt,
  C: FaCode,
  "VS Code": FaLaptopCode,
  MongoDB: SiMongodb,
  "Node.js": FaNodeJs,
  MySQL: SiMysql,
  Python: FaPython,
  PostgreSQL: SiPostgresql,
};

function HudCorners() {
  return (
    <>
      <i className="skill-cockpit-corner skill-cockpit-corner-tl" />
      <i className="skill-cockpit-corner skill-cockpit-corner-tr" />
      <i className="skill-cockpit-corner skill-cockpit-corner-bl" />
      <i className="skill-cockpit-corner skill-cockpit-corner-br" />
    </>
  );
}

export default function SkillCockpit() {
  const sectionRef = useScrollReveal();
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [pinnedSkill, setPinnedSkill] = useState(null);
  const displayedSkill = hoveredSkill || pinnedSkill;

  return (
    <div ref={sectionRef} className="skill-cockpit">
      <svg className="skill-cockpit-filters" aria-hidden="true" focusable="false">
        <filter id="liquid-glass-distort" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves="2"
            seed="7"
            result="glassNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="glassNoise"
            scale="2.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className="skill-cockpit-viewport" data-reveal>
        <span className="skill-cockpit-hardware skill-cockpit-hardware-tl" aria-hidden="true" />
        <span className="skill-cockpit-hardware skill-cockpit-hardware-tr" aria-hidden="true" />
        <span className="skill-cockpit-hardware skill-cockpit-hardware-bl" aria-hidden="true" />
        <span className="skill-cockpit-hardware skill-cockpit-hardware-br" aria-hidden="true" />
        <div className="skill-cockpit-glass">
          <span className="skill-cockpit-sheen" aria-hidden="true" />

          <div className="skill-cockpit-hud-position" aria-live="polite">
            <AnimatePresence mode="wait">
              {displayedSkill ? (
                <motion.div
                  className="skill-cockpit-hud"
                  key={displayedSkill.name}
                  style={{ "--skill-color": displayedSkill.color }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <HudCorners />
                  <span className="skill-cockpit-hud-kicker">MODULE PROJECTION // ONLINE</span>
                  <strong>{displayedSkill.name}</strong>
                  <span className="skill-cockpit-hud-meta">{displayedSkill.category} · {displayedSkill.context}</span>
                  <p>{displayedSkill.description}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="skill-cockpit-label-strip">
          <div className="skill-cockpit-idle">
            <span className="skill-cockpit-status-dot" />
            <span>{displayedSkill ? "MODULE LINK ESTABLISHED" : "SELECT A MODULE"}</span>
          </div>
          <span className="skill-cockpit-bezel-label">NAV // 02 · TECH ARSENAL</span>
        </div>
      </div>

      <div className="skill-cockpit-controls" aria-label="Skill modules">
        {keyboardSkills.map((skill) => {
          const Icon = iconBySkill[skill.name] || FaCode;
          const isHovered = hoveredSkill?.name === skill.name;
          const isPinned = pinnedSkill?.name === skill.name;
          return (
            <motion.button
              type="button"
              className={`skill-cockpit-control cursor-can-hover ${isHovered ? "is-hovered" : ""} ${isPinned ? "is-pinned" : ""}`}
              data-reveal-item
              key={skill.objectName}
              style={{ "--skill-color": skill.color }}
              aria-label={`${skill.name}, ${skill.category}, ${skill.description}`}
              aria-pressed={isPinned}
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
              onFocus={() => setHoveredSkill(skill)}
              onBlur={() => setHoveredSkill(null)}
              onClick={() => setPinnedSkill(skill)}
              whileTap={{ scale: 0.96, y: 2 }}
            >
              <Icon aria-hidden="true" />
              <span>{skill.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
