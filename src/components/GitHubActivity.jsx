import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaCodeBranch, FaCode, FaFire } from "react-icons/fa";

const GITHUB_USERNAME = "papneetswain4-alt";

export default function GitHubActivity() {
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
        ]);

        if (userRes.ok && reposRes.ok) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();

          // Calculate language stats
          const langCount = {};
          let totalStars = 0;
          let totalForks = 0;

          reposData.forEach((repo) => {
            if (repo.language) {
              langCount[repo.language] = (langCount[repo.language] || 0) + 1;
            }
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
          });

          const topLangs = Object.entries(langCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

          const totalLangRepos = topLangs.reduce((sum, [, count]) => sum + count, 0);

          setStats({
            publicRepos: userData.public_repos,
            followers: userData.followers,
            totalStars,
            totalForks,
            topLangs,
            totalLangRepos
          });
          setRepos(reposData);
        }
      } catch (err) {
        console.error("GitHub API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const langColors = {
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
    TypeScript: "#3178c6",
    C: "#555555",
    "C++": "#f34b7d",
    Shell: "#89e051",
    PHP: "#4F5D95",
    EJS: "#a91e50",
  };

  // Streak card URL (this one is reliable)
  const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=radical&background=0a0a0f&ring=E10600&fire=E10600&currStreakLabel=E10600&sideLabels=b0b0c0&dates=707088&border=1a1a2e&border_radius=12`;

  return (
    <section className="github-activity" id="github">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="section-title" variants={fadeUp}>
          GitHub <span>Activity</span>
        </motion.h2>
        <motion.p className="section-subtitle" variants={fadeUp}>
          My open source contributions and coding activity
        </motion.p>

        <motion.div className="github-stats-grid" variants={container}>
          {/* Stats Card */}
          <motion.div className="github-stat-card" variants={fadeUp}>
            {loading ? (
              <div className="github-loading">Loading stats...</div>
            ) : stats ? (
              <div className="github-stats-content">
                <h3 className="github-card-title">
                  <FaCode style={{ marginRight: "8px" }} /> GitHub Stats
                </h3>
                <div className="github-stat-items">
                  <div className="github-stat-item">
                    <span className="stat-value">{stats.publicRepos}</span>
                    <span className="stat-label">Repositories</span>
                  </div>
                  <div className="github-stat-item">
                    <span className="stat-value"><FaStar style={{ fontSize: "14px", marginRight: "4px" }} />{stats.totalStars}</span>
                    <span className="stat-label">Total Stars</span>
                  </div>
                  <div className="github-stat-item">
                    <span className="stat-value"><FaCodeBranch style={{ fontSize: "14px", marginRight: "4px" }} />{stats.totalForks}</span>
                    <span className="stat-label">Total Forks</span>
                  </div>
                  <div className="github-stat-item">
                    <span className="stat-value">{stats.followers}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="github-loading">Could not load stats</div>
            )}
          </motion.div>

          {/* Streak Card */}
          <motion.div className="github-stat-card" variants={fadeUp}>
            <img
              src={streakUrl}
              alt="GitHub Streak"
              loading="lazy"
            />
          </motion.div>

          {/* Top Languages Card */}
          <motion.div className="github-stat-card" variants={fadeUp}>
            {loading ? (
              <div className="github-loading">Loading languages...</div>
            ) : stats && stats.topLangs.length > 0 ? (
              <div className="github-stats-content">
                <h3 className="github-card-title">
                  <FaFire style={{ marginRight: "8px" }} /> Top Languages
                </h3>
                <div className="github-langs">
                  {stats.topLangs.map(([lang, count]) => {
                    const pct = Math.round((count / stats.totalLangRepos) * 100);
                    return (
                      <div key={lang} className="github-lang-item">
                        <div className="lang-header">
                          <span className="lang-dot" style={{ background: langColors[lang] || "#ccc" }}></span>
                          <span className="lang-name">{lang}</span>
                          <span className="lang-pct">{pct}%</span>
                        </div>
                        <div className="lang-bar-bg">
                          <motion.div
                            className="lang-bar-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ background: langColors[lang] || "#ccc" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="github-loading">No language data</div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
