import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { useScrollReveal } from "../hooks/useScrollReveal";

const USERNAME = "papneetswain4-alt";
const colors = { JavaScript: "#f1e05a", Python: "#3572A5", HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219", TypeScript: "#3178c6" };

const Header = () => (
  <>
    <div className="section-marker" data-reveal><span>05</span><i /><span>GITHUB / OPEN SOURCE</span></div>
    <div className="section-heading" data-reveal data-scroll-heading><div><p>LIVE DEVELOPMENT SIGNALS</p><h2>Code in <em>motion</em></h2></div><p>A live, lightweight snapshot of the public work and technologies shaping my current orbit.</p></div>
  </>
);

export default function GitHubActivity() {
  const sectionRef = useScrollReveal();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [state, setState] = useState("loading");
  const [theme, setTheme] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.dataset.theme || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const handleTheme = (e) => setTheme(e.detail);
    window.addEventListener("portfolio-theme-change", handleTheme);
    return () => window.removeEventListener("portfolio-theme-change", handleTheme);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated&type=public`),
    ])
      .then(async ([profileResponse, reposResponse]) => {
        if (!profileResponse.ok || !reposResponse.ok) throw new Error("GitHub unavailable");
        const profileData = await profileResponse.json();
        const reposData = await reposResponse.json();
        setProfile(profileData);
        setRepos(reposData.filter((repo) => !repo.fork).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const stats = useMemo(() => ({
    stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    forks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
  }), [repos]);

  const languages = useMemo(() => {
    const counts = {};
    repos.forEach((repo) => { if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1; });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    return entries.map(([name, count]) => [name, Math.round((count / total) * 100)]);
  }, [repos]);

  return (
    <section className="github-activity" id="github">
      <div className="section-shell" ref={sectionRef}>
        <Header />
        {state === "loading" && <div className="github-profile"><div className="github-loading">CONNECTING TO GITHUB...</div></div>}
        {state === "error" && <div className="github-profile github-error"><FaGithub /><span>GITHUB DATA TEMPORARILY UNAVAILABLE</span><a className="cursor-can-hover" href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer">OPEN GITHUB ↗</a></div>}
        {state === "ready" && (
          <>
            <motion.div className="github-signals" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="github-signal"><span className="github-signal-number">{profile?.public_repos ?? repos.length}</span><span className="github-signal-source">REPOSITORIES</span><p>Public projects</p><div className="github-signal-line"><span /></div></div>
              <div className="github-signal"><span className="github-signal-number">{stats.stars}</span><span className="github-signal-source">STARS</span><p>Across public work</p><div className="github-signal-line"><span /></div></div>
              <div className="github-signal"><span className="github-signal-number">{profile?.followers ?? 0}</span><span className="github-signal-source">FOLLOWERS</span><p>People following along</p><div className="github-signal-line"><span /></div></div>
              <div className="github-signal"><span className="github-signal-number">{stats.forks}</span><span className="github-signal-source">FORKS</span><p>Shared experiments</p><div className="github-signal-line"><span /></div></div>
            </motion.div>
            <div className="github-profile">
              <div className="github-profile-grid">
                <div><span className="github-profile-label">LANGUAGE DISTRIBUTION</span><div className="github-languages">{languages.map(([name, percentage]) => <div className="github-language" key={name}><div className="github-language-top"><span><i style={{ background: colors[name] || "var(--accent)" }} />{name}</span><b>{percentage}%</b></div><div className="github-language-bar"><span style={{ width: `${percentage}%`, background: colors[name] || "var(--accent)" }} /></div></div>)}</div></div>
                <div><span className="github-profile-label">CONTRIBUTION ACTIVITY</span><img className="github-streak" src={theme === "light" ? `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=light&background=ffffff&ring=c9363d&fire=c9363d&currStreakLabel=3974a8&sideLabels=5c6876&dates=8994a2&border=dadee5` : `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=dark&background=0d1320&ring=e94a4a&fire=e94a4a&currStreakLabel=8bb8e8&sideLabels=8c98a8&dates=566171&border=263247`} alt="GitHub contribution streak" loading="lazy" /></div>
              </div>
            </div>
            <div className="github-recent"><div className="github-recent-heading"><div><p className="eyebrow">LATEST TRANSMISSIONS</p><h3>Recent repositories</h3></div><a className="cursor-can-hover" href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer">VIEW PROFILE ↗</a></div><div className="github-repository-list">{repos.slice(0, 5).map((repo, index) => <a className="github-repository cursor-can-hover" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id}><span className="github-repository-number">{String(index + 1).padStart(2, "0")}</span><div><h4>{repo.name} <FaGithub /></h4><p>{repo.description || "No description provided."}</p></div><span className="github-repository-meta">{repo.language || "CODE"}<br />{new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span><span className="github-repository-arrow">↗</span></a>)}</div></div>
          </>
        )}
      </div>
    </section>
  );
}
