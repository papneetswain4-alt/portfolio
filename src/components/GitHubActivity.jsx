import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaUsers,
  FaCode,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

const GITHUB_USERNAME = "papneetswain4-alt";

const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  Shell: "#89e051",
  PHP: "#4F5D95",
  EJS: "#a91e50",
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GitHubActivity() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const [profileResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),

          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=public`
          ),
        ]);

        if (!profileResponse.ok || !reposResponse.ok) {
          throw new Error("GitHub request failed");
        }

        const profileData = await profileResponse.json();
        const reposData = await reposResponse.json();

        if (!Array.isArray(reposData)) {
          throw new Error("Invalid GitHub response");
        }

        setProfile(profileData);

        const ownRepos = reposData
          .filter((repo) => !repo.fork)
          .sort(
            (a, b) =>
              new Date(b.updated_at) - new Date(a.updated_at)
          );

        setRepos(ownRepos);
      } catch (err) {
        console.error("GitHub activity error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  /* =========================
     GITHUB METRICS
  ========================= */

  const totalStars = repos.reduce(
    (total, repo) => total + repo.stargazers_count,
    0
  );

  const totalForks = repos.reduce(
    (total, repo) => total + repo.forks_count,
    0
  );

  /* =========================
     LANGUAGE DATA
  ========================= */

  const languageCount = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  const languages = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const totalLanguageRepos = languages.reduce(
    (total, [, count]) => total + count,
    0
  );

  /* =========================
     RECENT REPOSITORIES
  ========================= */

  const recentRepos = repos.slice(0, 4);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="github-activity" id="github">
        <div className="github-container">

          <div className="github-header">
            <div className="github-index">
              <span>05</span>
              <i></i>
              <span>GITHUB ACTIVITY</span>
            </div>
          </div>

          <div className="github-heading">
            <div>
              <p>OPEN SOURCE / DEVELOPMENT</p>

              <h2>
                GitHub <span>Activity</span>
              </h2>
            </div>

            <p className="github-heading-description">
              A live snapshot of repositories, contribution
              activity, development signals and technologies.
            </p>
          </div>

          <div className="github-loading">
            LOADING GITHUB DATA...
          </div>

        </div>
      </section>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <section className="github-activity" id="github">
        <div className="github-container">

          <div className="github-header">
            <div className="github-index">
              <span>05</span>
              <i></i>
              <span>GITHUB ACTIVITY</span>
            </div>
          </div>

          <div className="github-heading">
            <div>
              <p>OPEN SOURCE / DEVELOPMENT</p>

              <h2>
                GitHub <span>Activity</span>
              </h2>
            </div>

            <p className="github-heading-description">
              GitHub activity could not be loaded right now.
            </p>
          </div>

          <div className="github-error">
            <FaGithub />

            <span>
              GITHUB DATA TEMPORARILY UNAVAILABLE
            </span>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              OPEN GITHUB ↗
            </a>
          </div>

        </div>
      </section>
    );
  }

  return (
    <section className="github-activity" id="github">

      <div className="github-container">

        {/* =========================
            HEADER
        ========================= */}

        <motion.div
          className="github-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="github-index">
            <span>05</span>
            <i></i>
            <span>GITHUB ACTIVITY</span>
          </div>
        </motion.div>


        {/* =========================
            HEADING
        ========================= */}

        <motion.div
          className="github-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div>
            <p>OPEN SOURCE / DEVELOPMENT</p>

            <h2>
              GitHub <span>Activity</span>
            </h2>
          </div>

          <p className="github-heading-description">
            A live snapshot of repositories, contribution
            activity, development signals and technologies.
          </p>
        </motion.div>


        {/* =========================
            ACTIVITY SIGNALS
        ========================= */}

        <motion.div
          className="github-signals"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >

          {/* REPOSITORIES */}

          <motion.div
            className="github-signal"
            variants={fadeUp}
          >
            <div className="github-signal-top">
              <span className="github-signal-number">
                {profile?.public_repos ?? repos.length}
              </span>

              <span className="github-signal-source">
                GITHUB
              </span>
            </div>

            <p>Public Repositories</p>

            <div className="github-signal-line">
              <span></span>
            </div>
          </motion.div>


          {/* STARS */}

          <motion.div
            className="github-signal"
            variants={fadeUp}
          >
            <div className="github-signal-top">
              <span className="github-signal-number">
                {totalStars}
              </span>

              <span className="github-signal-source">
                GITHUB
              </span>
            </div>

            <p>Total Stars</p>

            <div className="github-signal-line">
              <span></span>
            </div>
          </motion.div>


          {/* FOLLOWERS */}

          <motion.div
            className="github-signal"
            variants={fadeUp}
          >
            <div className="github-signal-top">
              <span className="github-signal-number">
                {profile?.followers ?? 0}
              </span>

              <span className="github-signal-source">
                GITHUB
              </span>
            </div>

            <p>Followers</p>

            <div className="github-signal-line">
              <span></span>
            </div>
          </motion.div>


          {/* FORKS */}

          <motion.div
            className="github-signal"
            variants={fadeUp}
          >
            <div className="github-signal-top">
              <span className="github-signal-number">
                {totalForks}
              </span>

              <span className="github-signal-source">
                GITHUB
              </span>
            </div>

            <p>Total Forks</p>

            <div className="github-signal-line">
              <span></span>
            </div>
          </motion.div>

        </motion.div>


        {/* =========================
            DEVELOPMENT PROFILE
        ========================= */}

        <motion.div
          className="github-profile"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >

          <div className="github-profile-heading">
            
            <h3>DEVELOPMENT PROFILE</h3>
          </div>


          <div className="github-profile-grid">

            {/* STREAK */}

            <div className="github-profile-column">

              <span className="github-profile-label">
                CONTRIBUTION ACTIVITY
              </span>

              <div className="github-streak">
                <img
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=radical&background=0a0a0f&ring=E10600&fire=E10600&currStreakLabel=E10600&sideLabels=b0b0c0&dates=707088&border=1a1a2e&border_radius=12`}
                  alt="GitHub contribution streak"
                  loading="lazy"
                />
              </div>

            </div>


            {/* LANGUAGES */}

            <div className="github-profile-column">

              <span className="github-profile-label">
                LANGUAGE DISTRIBUTION
              </span>

              <div className="github-languages">

                {languages.length > 0 ? (
                  languages.map(([language, count]) => {

                    const percentage =
                      totalLanguageRepos > 0
                        ? (count / totalLanguageRepos) * 100
                        : 0;

                    return (
                      <div
                        className="github-language"
                        key={language}
                      >

                        <div className="github-language-top">

                          <span>
                            <i
                              style={{
                                background:
                                  languageColors[language] ||
                                  "var(--primary-color)",
                              }}
                            ></i>

                            {language}
                          </span>

                          <b>
                            {Math.round(percentage)}%
                          </b>

                        </div>

                        <div className="github-language-bar">
                          <span
                            style={{
                              width: `${percentage}%`,
                              background:
                                languageColors[language] ||
                                "var(--primary-color)",
                            }}
                          ></span>
                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="github-loading">
                    NO LANGUAGE DATA
                  </div>
                )}

              </div>

            </div>

          </div>

        </motion.div>


        {/* =========================
            RECENT WORK
        ========================= */}

        <motion.div
          className="github-recent"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >

          <div className="github-recent-heading">

            <div>
              <p>RECENT DEVELOPMENT</p>

              <h3>Latest Repositories</h3>
            </div>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW ALL ↗
            </a>

          </div>


          <div className="github-repository-list">

            {recentRepos.map((repo, index) => (

              <a
                key={repo.id}
                className="github-repository"
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >

                <span className="github-repository-number">
                  {String(index + 1).padStart(2, "0")}
                </span>


                <div className="github-repository-main">

                  <h4>
                    {repo.name}
                    <FaGithub />
                  </h4>

                  <p>
                    {repo.description ||
                      "No repository description provided."}
                  </p>

                </div>


                <div className="github-repository-meta">

                  {repo.language && (
                    <span>
                      {repo.language}
                    </span>
                  )}

                  <span>
                    {formatDate(repo.updated_at)}
                  </span>

                </div>


                <span className="github-repository-arrow">
                  ↗
                </span>

              </a>

            ))}

          </div>

        </motion.div>


      </div>

    </section>
  );
}