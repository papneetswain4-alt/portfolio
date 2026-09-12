import { useEffect, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useScrollParallax } from "../hooks/useScrollParallax";

const GITHUB_USERNAME = "papneetswain4-alt";

export default function About() {
  const [projects, setProjects] = useState(null);
  const sectionRef = useScrollReveal();
  const parallaxRef = useScrollParallax();

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)
      .then((response) => {
        if (!response.ok) throw new Error("GitHub request failed");
        return response.json();
      })
      .then((repos) => setProjects(repos.filter((repo) => !repo.fork).length))
      .catch(() => setProjects(null));
  }, []);

  return (
    <section className="about" id="about" ref={parallaxRef}>
      <div className="section-atmosphere about-atmosphere" data-parallax-layer data-depth="-30" aria-hidden="true" />
      <div ref={sectionRef}>
      <div className="section-shell">
        <div className="section-marker" data-reveal><span>01</span><i /><span>ABOUT ME</span></div>
        <div className="section-heading" data-reveal data-scroll-heading>
          <div><p>THE PERSON BEHIND THE CODE</p><h2>Building with <em>purpose</em></h2></div>
          <p>A curious engineer focused on useful products, thoughtful interfaces, and systems that stay understandable as they grow.</p>
        </div>
        <div className="about-main">
          <div className="about-intro" data-reveal>
            <p className="about-kicker">A PRACTICAL ENGINEERING MINDSET</p>
            <h2>Turning complex ideas into <span>clear, reliable software.</span></h2>
            <p className="about-description">I&apos;m a Computer Science student and full stack developer who enjoys working across the product surface — from shaping a user experience to designing the API and data model underneath it.</p>
            <p className="about-description">My work is guided by strong fundamentals, deliberate interaction design, and a constant search for simpler solutions to difficult problems.</p>
            <div className="about-focus"><span className="focus-label">CURRENT ORBIT</span><div className="focus-list"><span>FULL STACK DEVELOPMENT</span><span>ARTIFICIAL INTELLIGENCE</span><span>CLOUD &amp; DEVOPS</span></div></div>
          </div>
          <aside className="about-signals" data-reveal>
            <div className="signals-header"><div><span className="signals-eyebrow">FIELD NOTES</span><h3>What I bring to a build</h3></div><span className="live-indicator">● ACTIVE</span></div>
            <div className="profile-items" data-reveal-item>
              <span>Product thinking from first sketch to deployment</span>
              <span>Frontend craft with performance in mind</span>
              <span>Backend systems designed for clarity</span>
              <span>Continuous learning and honest iteration</span>
            </div>
            <div className="signals-grid" data-reveal-item>
              <div className="signal"><span className="signal-number">{projects ?? "--"}</span><span className="signal-source">GITHUB</span><p>Projects built</p><div className="signal-line"><span /></div></div>
              <div className="signal"><span className="signal-number">300+</span><span className="signal-source">LEETCODE</span><p>Problems solved</p><div className="signal-line"><span /></div></div>
              <div className="signal"><span className="signal-number">∞</span><span className="signal-source">MINDSET</span><p>Things to learn</p><div className="signal-line"><span /></div></div>
            </div>
          </aside>
        </div>
        <div className="engineering-profile" data-reveal>
          <div className="profile-heading"><span>02</span><i /><h3>ENGINEERING PROFILE</h3></div>
          <div className="profile-grid" data-reveal-item>
            <div className="profile-column"><span className="profile-label">CORE TECHNOLOGIES</span><div className="profile-items"><span>Java &amp; Python</span><span>React &amp; JavaScript</span><span>Node.js &amp; Express</span><span>PostgreSQL &amp; MySQL</span></div></div>
            <div className="profile-column"><span className="profile-label">HOW I WORK</span><div className="profile-items"><span>Modular architecture</span><span>Performance optimization</span><span>Accessible interfaces</span><span>Iterative delivery</span></div></div>
            <div className="profile-column"><span className="profile-label">WHAT MATTERS</span><div className="profile-items"><span>Useful over impressive</span><span>Readable over clever</span><span>Details that earn trust</span><span>Always keep improving</span></div></div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
