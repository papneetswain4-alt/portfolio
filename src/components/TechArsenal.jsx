import SkillCockpit from "./SkillCockpit";

export default function TechArsenal() {
  return (
    <section className="tech-arsenal" id="tech">
      <div className="section-shell">
        <div className="section-marker"><span>02</span><i /><span>TECH ARSENAL</span></div>
        <div className="section-heading"><div><p>TOOLS I ACTUALLY USE</p><h2>Skills in <em>practice</em></h2></div><p>Technologies applied across real projects — from interface design to backend infrastructure.</p></div>
        <SkillCockpit />
      </div>
    </section>
  );
}
