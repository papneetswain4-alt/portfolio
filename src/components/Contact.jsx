import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Contact() {
  const sectionRef = useScrollReveal();

  return (
    <section className="contact" id="contact">
      <div className="section-shell" ref={sectionRef}>
        <div className="section-marker" data-reveal><span>06</span><i /><span>CONTACT</span></div>
        <div className="section-heading" data-reveal data-scroll-heading><div><p>OPEN CHANNEL</p><h2>Let&apos;s build <em>something</em></h2></div><p>Have an idea worth exploring? Send a signal. I&apos;m always interested in thoughtful products and difficult problems.</p></div>
        <div className="contact-grid" data-reveal>
          <a href="mailto:papneetswain4@gmail.com" className="contact-social contact-social-email cursor-can-hover" data-reveal-item>
            <FaEnvelope className="contact-social-icon" />
            <span className="contact-social-content"><span>EMAIL</span><strong>papneetswain4@gmail.com</strong></span>
            <FaArrowRight className="contact-social-arrow" />
          </a>
          <a href="https://www.linkedin.com/in/papneet-swain-92a2b9343/" target="_blank" rel="noreferrer" className="contact-social contact-social-linkedin cursor-can-hover" data-reveal-item>
            <FaLinkedin className="contact-social-icon" />
            <span className="contact-social-content"><span>LINKEDIN</span><strong>/in/papneet-swain</strong></span>
            <FaArrowRight className="contact-social-arrow" />
          </a>
          <a href="https://github.com/papneetswain4-alt" target="_blank" rel="noreferrer" className="contact-social contact-social-github cursor-can-hover" data-reveal-item>
            <FaGithub className="contact-social-icon" />
            <span className="contact-social-content"><span>GITHUB</span><strong>papneetswain4-alt</strong></span>
            <FaArrowRight className="contact-social-arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
