import SkillCockpit from "./SkillCockpit";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function TechArsenal() {
  const sectionRef = useScrollReveal();

  return (
    <section className="tech-arsenal" id="tech">
      <div className="section-shell" ref={sectionRef}>
        <div className="section-marker" data-reveal><span>02</span><i /><span>TECH ARSENAL</span></div>
        <div className="section-heading" data-reveal data-scroll-heading><div><p>TOOLS I ACTUALLY USE</p><h2>Skills in <em>practice</em></h2></div><p>Technologies applied across real projects — from interface design to backend infrastructure.</p></div>
        <SkillCockpit />
      </div>
    </section>
  );
}
