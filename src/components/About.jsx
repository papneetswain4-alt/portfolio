import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const slideRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <section id="about" className="about">
      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="section-title" variants={fadeUp}>
          About <span>Me</span>
        </motion.h2>
        <motion.p className="section-subtitle" variants={fadeUp}>
          A snapshot of who I am and what drives me
        </motion.p>

        <div className="about-grid">
          {/* LEFT SIDE */}
          <motion.div className="about-left" variants={slideLeft}>
            <h3>
              Building <span>scalable systems</span> with logic, structure and purpose.
            </h3>

            <p>
              I'm a Computer Science student with strong foundations in
              programming and analytical thinking. I focus on building practical
              solutions that are clean, efficient, and performance-oriented.
              From full-stack web applications to AI-powered microservices,
              I enjoy turning complex problems into elegant solutions.
            </p>

            <div className="focus-tags">
              <span>Full Stack Development</span>
              <span>Artificial Intelligence</span>
              <span>Cloud & DevOps</span>
            </div>

            <motion.div className="about-stats" variants={fadeUp}>
              <div className="stat-box">
                <h4>8+</h4>
                <p>Projects Built</p>
              </div>
              <div className="stat-box">
                <h4>300+</h4>
                <p>DSA Problems</p>
              </div>
              <div className="stat-box">
                <h4>1200+</h4>
                <p>Coding Hours</p>
              </div>
            </motion.div>

            <motion.div className="learning-journey" variants={fadeUp}>
              <h4>🚀 Current Learning Journey</h4>
              <ul>
                <li>📊 Data Structures & Algorithms</li>
                <li>☕ Advanced Java Concepts</li>
                <li>🌐 Frontend + Backend Integration</li>
                <li>🗄️ Database & API Handling</li>
                <li>🐳 Containerization & Deployment</li>
              </ul>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div className="about-right" variants={slideRight}>
            <motion.div className="about-card" variants={fadeUp}>
              <h3>CORE TECHNOLOGIES</h3>
              <ul>
                <li>Java & Python</li>
                <li>React & JavaScript</li>
                <li>Node.js & Express</li>
                <li>PostgreSQL & MySQL</li>
                <li>Docker & Git</li>
              </ul>
            </motion.div>

            <motion.div className="about-card" variants={fadeUp}>
              <h3>ENGINEERING APPROACH</h3>
              <ul>
                <li>Data Structures & Algorithms</li>
                <li>Modular & Structured Code</li>
                <li>Scalable Architecture</li>
                <li>Performance Optimization</li>
                <li>CI/CD & Cloud Deployment</li>
              </ul>
            </motion.div>

            <motion.div className="about-card" variants={fadeUp}>
              <h3>PROFESSIONAL MINDSET</h3>
              <ul>
                <li>Strong Logical Reasoning</li>
                <li>Adaptability & Quick Learning</li>
                <li>Collaborative Problem Solving</li>
                <li>Growth-Oriented Thinking</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
