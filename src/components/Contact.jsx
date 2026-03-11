import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_9exb7ni",
        "template_4cfwz8b",
        form.current,
        "gp-tawX-cGRzYgfaW"
      )
      .then(() => {
        alert("Message sent successfully 🚀");
        form.current.reset();
      })
      .catch(() => {
        alert("Something went wrong ❌");
      });
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const smoothReveal = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="contact" className="contact">
      <motion.div
        className="contact-grid"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* LEFT SIDE */}
        <motion.div className="contact-left" variants={smoothReveal}>
          <motion.h2 variants={smoothReveal}>
            Let's <span style={{ color: "var(--primary-color)" }}>Talk</span>
          </motion.h2>

          <motion.p variants={smoothReveal}>
            Have a project in mind or just want to say hi?
            I'm always open to discussing new ideas, collaborations,
            and opportunities.
          </motion.p>

          <motion.div className="contact-icons" variants={smoothReveal}>
            <a
              href="https://www.linkedin.com/in/papneet-swain-92a2b9343/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/papneetswain4-alt"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a href="mailto:papneetswain4@gmail.com" title="Email">
              <FaEnvelope />
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE FORM */}
        <motion.div className="contact-right" variants={smoothReveal}>
          <motion.form
            ref={form}
            onSubmit={sendEmail}
            className="contact-form"
            variants={smoothReveal}
          >
            <div className="form-group">
              <label htmlFor="user_name">Name</label>
              <input type="text" id="user_name" name="user_name" placeholder="Your name" required />
            </div>

            <div className="form-group">
              <label htmlFor="user_email">Email</label>
              <input type="email" id="user_email" name="user_email" placeholder="your@email.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Your message..." required />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(225,6,0,0.3)" }}
              whileTap={{ scale: 0.97 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </section>
  );
}
