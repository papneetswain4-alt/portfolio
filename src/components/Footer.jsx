import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
  FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <motion.div
        className="footer-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-main">

          <div className="footer-brand">
            <h2>
              PAPNEET SWAIN<span>.</span>
            </h2>

            <p>
              Developer · Designer · Problem Solver
            </p>
          </div>

          <a
            href="mailto:papneetswain4@gmail.com"
            className="footer-contact"
          >
            <span>LET'S BUILD TOGETHER</span>
            <FaArrowUp />
          </a>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">

          <div className="footer-links">
            <a
              href="https://github.com/papneetswain4-alt"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/papneet-swain-92a2b9343/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="mailto:papneetswain4@gmail.com"
              title="Email"
            >
              <FaEnvelope />
            </a>
          </div>

          <p className="footer-made">
            MADE WITH <FaHeart /> BY PAPNEET SWAIN
          </p>

          <p className="footer-copy">
            © {new Date().getFullYear()} PAPNEET SWAIN
          </p>

        </div>
      </motion.div>
    </footer>
  );
}