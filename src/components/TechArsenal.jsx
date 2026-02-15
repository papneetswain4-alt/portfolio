import { motion } from "framer-motion";
import {
  FaJava,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaDatabase
} from "react-icons/fa";

import { SiC, SiMysql, SiExpress } from "react-icons/si";

export default function TechArsenal() {
  const tech = [
    { icon: <FaJava />, name: "Java" },
    { icon: <SiC />, name: "C Programming" },
    { icon: <FaHtml5 />, name: "HTML" },
    { icon: <FaCss3Alt />, name: "CSS" },
    { icon: <FaJs />, name: "JavaScript" },
    { icon: <FaReact />, name: "React" },
    { icon: <FaNodeJs />, name: "Node.js" },
    { icon: <SiExpress />, name: "Express.js" },
    { icon: <SiMysql />, name: "MySQL" },
    { icon: <FaGitAlt />, name: "Git" },
    { icon: <FaGithub />, name: "GitHub" },
    { icon: <FaDatabase />, name: "DBMS" }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="tech-arsenal" id="tech">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className="section-title" variants={cardVariants}>
          Tech Arsenal
        </motion.h2>

        <motion.div className="tech-container" variants={containerVariants}>
          {tech.map((item, index) => (
            <motion.div
              key={index}
              className="tech-card"
              variants={cardVariants}
              whileHover={{ scale: 1.15 }}
            >
              {item.icon}
              <span>{item.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
