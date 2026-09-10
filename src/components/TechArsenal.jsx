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
  FaDatabase,
} from "react-icons/fa";

import {
  SiC,
  SiMysql,
  SiExpress,
  SiFlask,
  SiPostgresql,
} from "react-icons/si";

const categories = [
  {
    id: "01",
    title: "LANGUAGES",
    description: "Core programming & problem solving",
    items: [
      { icon: <FaJava />, name: "Java" },
      { icon: <SiC />, name: "C" },
      { icon: <FaPython />, name: "Python" },
      { icon: <FaJs />, name: "JavaScript" },
    ],
  },
  {
    id: "02",
    title: "FRONTEND",
    description: "Interfaces & interactive experiences",
    items: [
      { icon: <FaHtml5 />, name: "HTML5" },
      { icon: <FaCss3Alt />, name: "CSS3" },
      { icon: <FaReact />, name: "React" },
    ],
  },
  {
    id: "03",
    title: "BACKEND & DATABASE",
    description: "APIs, services & data systems",
    items: [
      { icon: <FaNodeJs />, name: "Node.js" },
      { icon: <SiExpress />, name: "Express" },
      { icon: <SiFlask />, name: "Flask" },
      { icon: <SiMysql />, name: "MySQL" },
      { icon: <SiPostgresql />, name: "PostgreSQL" },
      { icon: <FaDatabase />, name: "MongoDB" },
    ],
  },
  {
    id: "04",
    title: "TOOLS & DEVOPS",
    description: "Development workflow & deployment",
    items: [
      { icon: <FaGitAlt />, name: "Git" },
      { icon: <FaGithub />, name: "GitHub" },
      { icon: <FaDocker />, name: "Docker" },
    ],
  },
];

const SkillItem = ({ item, index }) => {
  const ref = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [4, -4]),
    { stiffness: 300, damping: 25 }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-4, 4]),
    { stiffness: 300, damping: 25 }
  );

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="skill-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="skill-icon">
        {item.icon}
      </div>

      <span>{item.name}</span>

      <div className="skill-arrow">↗</div>
    </motion.div>
  );
};

export default function TechArsenal() {
  return (
    <section className="tech-arsenal" id="tech">
      <div className="skills-container">

        {/* HEADER */}
        <motion.div
          className="skills-header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="skills-index">
            <span>03</span>
            <i></i>
            <span>TECH STACK</span>
          </div>
          
        </motion.div>

        {/* TITLE */}
        <motion.div
          className="skills-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p>TOOLS OF THE TRADE</p>

            <h2>
              Skills & <span>Technologies</span>
            </h2>
          </div>

          <p className="skills-heading-description">
            A practical stack built around software engineering,
            full-stack development, scalable systems and continuous learning.
          </p>
        </motion.div>

        {/* CATEGORY GRID */}
        <div className="skills-grid">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              className={`skill-group skill-group-${categoryIndex + 1}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: categoryIndex * 0.08,
              }}
            >
              {/* CATEGORY HEADER */}
              <div className="skill-group-header">
                <div className="skill-group-number">
                  {category.id}
                </div>

                <div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
              </div>

              {/* SKILLS */}
              <div className="skill-items">
                {category.items.map((item, index) => (
                  <SkillItem
                    key={item.name}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM SYSTEM BAR */}
        <motion.div
          className="skills-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="footer-label">STACK STATUS</span>
            <span className="footer-value">ACTIVE</span>
          </div>

          <div>
            <span className="footer-label">PRIMARY MODE</span>
            <span className="footer-value">FULL STACK</span>
          </div>

          <div>
            <span className="footer-label">CURRENTLY EXPANDING</span>
            <span className="footer-value">AI / CLOUD / DEVOPS</span>
          </div>

          <div className="skills-signal">
            <span></span>
            CONTINUOUSLY LEARNING
          </div>
        </motion.div>

      </div>
    </section>
  );
}