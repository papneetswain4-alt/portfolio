import { FaEnvelope, FaGithub, FaLinkedin, FaArrowUp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <h2>PAPNEET<span>.</span></h2>
            <p>Full Stack Developer / Building inside the galaxy</p>
          </div>
          <a className="footer-contact cursor-can-hover" href="mailto:papneetswain4@gmail.com">LET&apos;S BUILD TOGETHER <FaArrowUp /></a>
        </div>
        <div className="footer-divider" />
        <div className="footer-bottom">
          <div className="footer-links">
            <a className="cursor-can-hover" href="https://github.com/papneetswain4-alt" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
            <a className="cursor-can-hover" href="https://www.linkedin.com/in/papneet-swain-92a2b9343/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a className="cursor-can-hover" href="mailto:papneetswain4@gmail.com" aria-label="Email"><FaEnvelope /></a>
          </div>
          <span>BUILT WITH REACT / THREE.JS</span>
          <span>© {new Date().getFullYear()} PAPNEET SWAIN</span>
        </div>
      </div>
    </footer>
  );
}
