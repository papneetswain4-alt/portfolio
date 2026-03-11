import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from "react-icons/fa";

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
          <a href="mailto:papneetswain4@gmail.com" title="Email">
            <FaEnvelope />
          </a>
        </div>

        <p>
          Built with <FaHeart style={{ color: "var(--primary-color)", verticalAlign: "middle", margin: "0 4px" }} /> using <span>React</span> & <span>Vite</span>
        </p>

        <p>
          © {new Date().getFullYear()} Papneet Swain. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
