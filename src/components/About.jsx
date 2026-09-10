import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GITHUB_USERNAME = "papneetswain4-alt";

export default function About() {
  const [githubProjects, setGithubProjects] = useState(null);
  const [githubLoading, setGithubLoading] = useState(true);

  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
        );

        if (!response.ok) {
          throw new Error("GitHub request failed");
        }

        const repos = await response.json();

        // Ignore forks so the number represents projects
        // actually created by the user.
        const ownProjects = repos.filter((repo) => !repo.fork);

        setGithubProjects(ownProjects.length);
      } catch (error) {
        console.error("GitHub stats error:", error);
        setGithubProjects(null);
      } finally {
        setGithubLoading(false);
      }
    };

    fetchGithubStats();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="about" className="about">
      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* SECTION HEADER */}
        <motion.div className="about-header" variants={fadeUp}>
          <div className="about-index">
            <span>01</span>
            <i></i>
            <span>ABOUT</span>
          </div>
        </motion.div>

        {/* MAIN INTRO */}
        <div className="about-main">
          <motion.div className="about-intro" variants={fadeUp}>
            <p className="about-kicker">BUILDING WITH PURPOSE</p>

            <h2>
              Building <span>scalable systems</span>
              <br />
              with logic, structure & purpose.
            </h2>

            <p className="about-description">
              I'm a Computer Science student with strong foundations in
              programming and analytical thinking. I focus on building
              practical solutions that are clean, efficient, and
              performance-oriented.
            </p>

            <p className="about-description">
              From full-stack web applications to AI-powered microservices,
              I enjoy turning complex problems into elegant, maintainable
              solutions.
            </p>

            {/* FOCUS */}
            <div className="about-focus">
              <div className="focus-label">CURRENT FOCUS</div>

              <div className="focus-list">
                <span>FULL STACK DEVELOPMENT</span>
                <span>ARTIFICIAL INTELLIGENCE</span>
                <span>CLOUD & DEVOPS</span>
              </div>
            </div>
          </motion.div>

          {/* LIVE SIGNALS */}
          <motion.div className="about-signals" variants={fadeUp}>
            <div className="signals-header">
              <div>
                <span className="signals-eyebrow">LIVE SIGNALS</span>
                <h3>Development Activity</h3>
              </div>

              <span className="live-indicator">
                <i></i>
                LIVE
              </span>
            </div>

            <div className="signals-grid">
              {/* GITHUB */}
              <div className="signal">
                <div className="signal-top">
                  <span className="signal-number">
                    {githubLoading
                      ? "..."
                      : githubProjects !== null
                      ? `${githubProjects}+`
                      : "--"}
                  </span>

                  <span className="signal-source">GITHUB</span>
                </div>

                <p>Projects Built</p>

                <div className="signal-line">
                  <span></span>
                </div>
              </div>

              {/* LEETCODE */}
              <div className="signal">
                <div className="signal-top">
                  <span className="signal-number">300+</span>
                  <span className="signal-source">LEETCODE</span>
                </div>

                <p>Problems Solved</p>

                <div className="signal-line">
                  <span></span>
                </div>
              </div>

              {/* WAKATIME */}
              <div className="signal">
                <div className="signal-top">
                  <span className="signal-number">1200+</span>
                  <span className="signal-source">WAKATIME</span>
                </div>

                <p>Coding Hours</p>

                <div className="signal-line">
                  <span></span>
                </div>
              </div>
            </div>

            <div className="signals-footer">
              <span>DATA SOURCES</span>
              <span>GITHUB / LEETCODE / WAKATIME</span>
            </div>
          </motion.div>
        </div>

        {/* ENGINEERING PROFILE */}
        <motion.div className="engineering-profile" variants={fadeUp}>
          <div className="profile-heading">
            <span>02</span>
            <i></i>
            <h3>ENGINEERING PROFILE</h3>
          </div>

          <div className="profile-grid">
            {/* TECHNOLOGIES */}
            <div className="profile-column">
              <span className="profile-label">CORE TECHNOLOGIES</span>

              <div className="profile-items">
                <span>Java & Python</span>
                <span>React & JavaScript</span>
                <span>Node.js & Express</span>
                <span>PostgreSQL & MySQL</span>
                <span>Docker & Git</span>
              </div>
            </div>

            {/* APPROACH */}
            <div className="profile-column">
              <span className="profile-label">ENGINEERING APPROACH</span>

              <div className="profile-items">
                <span>Data Structures & Algorithms</span>
                <span>Modular Architecture</span>
                <span>Performance Optimization</span>
                <span>Scalable Systems</span>
                <span>CI/CD & Cloud Deployment</span>
              </div>
            </div>

            {/* MINDSET */}
            <div className="profile-column">
              <span className="profile-label">PROFESSIONAL MINDSET</span>

              <div className="profile-items">
                <span>Logical Problem Solving</span>
                <span>Adaptability</span>
                <span>Collaborative Development</span>
                <span>Continuous Learning</span>
                <span>Growth-Oriented Thinking</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}