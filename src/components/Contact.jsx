// Contact.jsx

import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

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
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const reveal = {
    hidden: {
      opacity: 0,
      y: 35,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">

        {/* SECTION HEADER */}
        <motion.div
          className="contact-header"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="contact-index">
            <span>06</span>
            <i></i>
            <span>CONTACT</span>
          </div>

        </motion.div>

        {/* SECTION TITLE */}
        <motion.div
          className="contact-heading"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={reveal}>
            <p>LET'S CONNECT / BUILD SOMETHING</p>

            <h2>
              Let's <span>Talk</span>
            </h2>
          </motion.div>

          <motion.p
            className="contact-heading-description"
            variants={reveal}
          >
            Have a project in mind, an idea worth building, or simply
            want to connect? Drop me a message and let's create
            something meaningful together.
          </motion.p>
        </motion.div>

        {/* TWO BOXES */}
        <motion.div
          className="contact-grid"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >

          {/* LEFT BOX */}
          <motion.div
            className="contact-box contact-details"
            variants={reveal}
          >
            <div className="contact-box-header">
              <div className="contact-box-number">01</div>

              <div>
                <span>GET IN TOUCH</span>
                <h3>DIRECT CONNECTION</h3>
              </div>
            </div>
            
            <div className="contact-socials">

              <a
                href="mailto:papneetswain4@gmail.com"
                className="contact-social"
              >
                <div className="contact-social-icon">
                  <FaEnvelope />
                </div>

                <div className="contact-social-content">
                  <span>EMAIL</span>
                  <strong>papneetswain4@gmail.com</strong>
                </div>

                <FaArrowRight className="contact-social-arrow" />
              </a>

              <a
                href="https://www.linkedin.com/in/papneetswain4/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social"
              >
                <div className="contact-social-icon">
                  <FaLinkedin />
                </div>

                <div className="contact-social-content">
                  <span>LINKEDIN</span>
                  <strong>/in/papneetswain4</strong>
                </div>

                <FaArrowRight className="contact-social-arrow" />
              </a>

              <a
                href="https://github.com/papneetswain4-alt"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social"
              >
                <div className="contact-social-icon">
                  <FaGithub />
                </div>

                <div className="contact-social-content">
                  <span>GITHUB</span>
                  <strong>papneetswain4-alt</strong>
                </div>

                <FaArrowRight className="contact-social-arrow" />
              </a>

            </div>

          </motion.div>

          {/* RIGHT BOX */}
          <motion.div
            className="contact-box contact-message"
            variants={reveal}
          >
            <div className="contact-box-header">
              <div className="contact-box-number">02</div>

              <div>
                <span>START A CONVERSATION</span>
                <h3>SEND A MESSAGE</h3>
              </div>
            </div>

            <motion.form
              ref={form}
              onSubmit={sendEmail}
              className="contact-form"
            >

              <div className="form-group">
                <label htmlFor="user_name">NAME</label>

                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_email">EMAIL</label>

                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">MESSAGE</label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(225, 6, 0, 0.3)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <span>SEND MESSAGE</span>
                <FaArrowRight />
              </motion.button>

            </motion.form>

          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}