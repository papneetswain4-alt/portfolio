import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { experience } from "../../data/experience";

export default function Experience() {
  const timelineRef = useRef(null);

  useEffect(() => {
    let frame;
    const updateProgress = () => {
      const timeline = timelineRef.current;
      if (!timeline) return;
      const rect = timeline.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.58 - rect.top) / Math.max(rect.height, 1)));
      timeline.style.setProperty("--timeline-progress", progress.toFixed(3));
      frame = window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="experience" id="experience">
      <div className="section-shell">
        <div className="section-marker"><span>03</span><i /><span>DEVELOPMENT JOURNEY</span></div>
        <div className="section-heading">
          <div><p>THE WORK BEHIND THE WORK</p><h2>Experience <em>&amp; growth</em></h2></div>
          <p>Not a list of titles — a record of the systems, ideas, and engineering habits I keep developing.</p>
        </div>
        <div className="timeline" ref={timelineRef}>
          <div className="timeline-progress" aria-hidden="true" />
          {experience.map((item, index) => (
            <motion.article
              className="timeline-entry"
              key={item.year}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <span className="timeline-year">{item.year}</span>
              <div className="timeline-dot" />
              <div className="timeline-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>{item.technologies}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
