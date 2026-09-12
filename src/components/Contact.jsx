import { motion } from "framer-motion";
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="section-shell">
        <div className="section-marker"><span>06</span><i /><span>CONTACT</span></div>
        <div className="section-heading"><div><p>OPEN CHANNEL</p><h2>Let&apos;s build <em>something</em></h2></div><p>Have an idea worth exploring? Send a signal. I&apos;m always interested in thoughtful products and difficult problems.</p></div>
        <motion.div className="contact-grid" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <a href="mailto:papneetswain4@gmail.com" className="contact-social contact-social-email cursor-can-hover">
            <FaEnvelope className="contact-social-icon" />
            <span className="contact-social-content"><span>EMAIL</span><strong>papneetswain4@gmail.com</strong></span>
            <FaArrowRight className="contact-social-arrow" />
          </a>
          <a href="https://www.linkedin.com/in/papneet-swain-92a2b9343/" target="_blank" rel="noreferrer" className="contact-social contact-social-linkedin cursor-can-hover">
            <FaLinkedin className="contact-social-icon" />
            <span className="contact-social-content"><span>LINKEDIN</span><strong>/in/papneet-swain</strong></span>
            <FaArrowRight className="contact-social-arrow" />
          </a>
          <a href="https://github.com/papneetswain4-alt" target="_blank" rel="noreferrer" className="contact-social contact-social-github cursor-can-hover">
            <FaGithub className="contact-social-icon" />
            <span className="contact-social-content"><span>GITHUB</span><strong>papneetswain4-alt</strong></span>
            <FaArrowRight className="contact-social-arrow" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
