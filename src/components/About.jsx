import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="about" className="about">
      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 className="section-title" variants={fadeUp}>
          About Me
        </motion.h2>

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
            </p>

            <div className="focus-tags">
              <span>Web Development</span>
              <span>Artificial Intelligence</span>
              <span>Robotics</span>
            </div>

            {/* Stats */}
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
              </ul>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div className="about-right" variants={slideRight}>
            <motion.div className="about-card" variants={fadeUp}>
              <h3>Core Technologies</h3>
              <ul>
                <li>Java</li>
                <li>C Programming</li>
                <li>React & JavaScript</li>
                <li>MySQL</li>
                <li>Node.js</li>
              </ul>
            </motion.div>

            <motion.div className="about-card" variants={fadeUp}>
              <h3>Engineering Approach</h3>
              <ul>
                <li>Data Structures & Algorithms</li>
                <li>Modular & Structured Code</li>
                <li>Scalable Architecture</li>
                <li>Performance Optimization</li>
              </ul>
            </motion.div>

            <motion.div className="about-card" variants={fadeUp}>
              <h3>Professional Mindset</h3>
              <ul>
                <li>Strong Logical Reasoning</li>
                <li>Adaptability</li>
                <li>Continuous Learning</li>
                <li>Growth-Oriented Thinking</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
