import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaStar, FaCodeBranch, FaSync, FaExclamationCircle } from "react-icons/fa";

/* ─────────────────────────────────────────────
   CONFIGURATION
───────────────────────────────────────────── */
const GITHUB_USERNAME = "papneetswain4-alt";

// Add repo names here (exact, case-sensitive) to hide them
const EXCLUDED_REPOS = [];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - date) / 86400000);
  if (diffDays === 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `Updated ${Math.floor(diffDays / 30)}mo ago`;
  return `Updated ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
}

function isValidHomepage(url) {
  if (!url || url.trim() === "") return false;
  try {
    const p = new URL(url);
    return p.protocol === "http:" || p.protocol === "https:";
  } catch {
    return false;
  }
}

function formatRepoName(name) {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="project-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text short" />
      <div className="skeleton-tags">
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-tag" />
      </div>
      <div className="skeleton skeleton-btn" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROJECT CARD — 3D tilt + spotlight preserved
───────────────────────────────────────────── */
const ProjectCard = ({ repo, index }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  function handleMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect();
    const spotX = e.clientX - rect.left;
    const spotY = e.clientY - rect.top;
    mouseX.set(spotX);
    mouseY.set(spotY);
    cardRef.current.style.setProperty("--mouse-x", `${spotX}px`);
    cardRef.current.style.setProperty("--mouse-y", `${spotY}px`);
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const tags = [
    ...(repo.language ? [repo.language] : []),
    ...(repo.topics || []),
  ]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 7);

  const hasLive = isValidHomepage(repo.homepage);
  const dateStr = formatDate(repo.updated_at);
  const displayName = formatRepoName(repo.name);
  const delay = Math.min(index * 0.06, 0.45);

  return (
    <motion.div
      ref={cardRef}
      className="project-card spotlight-card"
      // Self-contained animation — does NOT rely on parent whileInView
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {/* Spotlight */}
      <motion.div
        className="spotlight-overlay"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([mx, my]) =>
              `radial-gradient(400px circle at ${mx}px ${my}px, rgba(225,6,0,0.15), transparent 40%)`
          ),
        }}
      />

      <div className="project-content" style={{ transform: "translateZ(30px)" }}>
        <h3 title={displayName}>{displayName}</h3>

        {repo.description && (
          <p className="project-desc">{repo.description}</p>
        )}

        {tags.length > 0 && (
          <div className="tech-tags">
            {tags.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))}
          </div>
        )}

        {(repo.stargazers_count > 0 || repo.forks_count > 0) && (
          <div className="repo-stats">
            {repo.stargazers_count > 0 && (
              <span className="repo-stat" aria-label={`${repo.stargazers_count} stars`}>
                <FaStar size={10} /> {repo.stargazers_count}
              </span>
            )}
            {repo.forks_count > 0 && (
              <span className="repo-stat" aria-label={`${repo.forks_count} forks`}>
                <FaCodeBranch size={10} /> {repo.forks_count}
              </span>
            )}
          </div>
        )}

        {dateStr && <p className="repo-updated">{dateStr}</p>}

        <div className="project-actions" style={{ marginTop: "auto", paddingTop: "1rem" }}>
          {hasLive && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${displayName}`}
            >
              <button className="project-btn primary">
                <FaExternalLinkAlt size={11} /> Live Demo
              </button>
            </a>
          )}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${displayName} on GitHub`}
          >
            <button className="project-btn secondary">
              <FaGithub size={13} /> GitHub
            </button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PROJECTS SECTION
───────────────────────────────────────────── */
export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeSort, setActiveSort] = useState("updated");

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=public`,
        { headers: { Accept: "application/vnd.github+json" } }
      );

      // Detect rate limiting specifically
      if (res.status === 403 || res.status === 429) {
        const resetTime = res.headers.get("X-RateLimit-Reset");
        const resetsAt = resetTime
          ? new Date(parseInt(resetTime) * 1000).toLocaleTimeString()
          : "soon";
        throw new Error(`rate_limited:${resetsAt}`);
      }

      if (!res.ok) throw new Error(`api_error:${res.status}`);

      const data = await res.json();

      // GitHub occasionally returns an object (error) instead of array
      if (!Array.isArray(data)) throw new Error("api_error:bad_response");

      const valid = data.filter(
        (r) => !r.fork && !EXCLUDED_REPOS.includes(r.name)
      );
      setRepos(valid);
    } catch (err) {
      const msg = err.message || "";
      if (msg.startsWith("rate_limited:")) {
        const time = msg.split(":")[1];
        setError(`GitHub API rate limit reached. Resets at ${time}. Please try again later.`);
      } else if (msg.startsWith("api_error:")) {
        setError("Could not reach the GitHub API. Please check your connection and try again.");
      } else {
        setError("Unable to load GitHub projects. Please try again later.");
      }
      console.error("[Projects] fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Build language filter list from fetched data
  const languages = [
    "ALL",
    ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean))).sort(),
  ];

  // Apply filter
  const filtered =
    activeFilter === "ALL"
      ? repos
      : repos.filter((r) => r.language === activeFilter);

  // Apply sort
  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === "updated") return new Date(b.updated_at) - new Date(a.updated_at);
    if (activeSort === "stars") return b.stargazers_count - a.stargazers_count;
    if (activeSort === "created") return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  return (
    <section className="projects" id="projects" style={{ perspective: "1500px" }}>

      {/* Heading — always visible, own animation */}
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        GitHub <span>Projects</span>
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Live from my GitHub — automatically updated
      </motion.p>

      {/* Filter + Sort Controls — shown once data is ready */}
      {!loading && !error && repos.length > 0 && (
        <motion.div
          className="projects-controls"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="filter-buttons" role="group" aria-label="Filter by language">
            {languages.map((lang) => (
              <button
                key={lang}
                className={`filter-btn${activeFilter === lang ? " active" : ""}`}
                onClick={() => setActiveFilter(lang)}
                aria-pressed={activeFilter === lang}
              >
                {lang}
              </button>
            ))}
          </div>

          <select
            className="sort-select"
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            aria-label="Sort repositories"
          >
            <option value="updated">Latest Updated</option>
            <option value="stars">Most Stars</option>
            <option value="created">Recently Created</option>
          </select>
        </motion.div>
      )}

      {/* Loading — skeleton grid */}
      {loading && (
        <div
          className="projects-grid"
          aria-label="Loading projects"
          aria-busy="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <motion.div
          className="projects-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <FaExclamationCircle size={28} style={{ color: "var(--primary-color)", opacity: 0.7 }} />
          <p>{error}</p>
          <button
            className="project-btn primary"
            onClick={fetchRepos}
            aria-label="Retry loading projects"
          >
            <FaSync size={11} /> Retry
          </button>
        </motion.div>
      )}

      {/* Empty filter result */}
      {!loading && !error && sorted.length === 0 && repos.length > 0 && (
        <motion.p
          className="projects-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          No repositories found for the selected filter.
        </motion.p>
      )}

      {/* No repos at all */}
      {!loading && !error && repos.length === 0 && (
        <motion.p
          className="projects-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          No public repositories found.
        </motion.p>
      )}

      {/* Repository cards grid */}
      {!loading && !error && sorted.length > 0 && (
        <>
          {/* key forces remount on filter/sort change so all cards re-animate */}
          <div
            key={`${activeFilter}-${activeSort}`}
            className="projects-grid"
          >
            {sorted.map((repo, index) => (
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>

          <motion.p
            className="projects-count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Showing {sorted.length} {sorted.length === 1 ? "repository" : "repositories"}
            {activeFilter !== "ALL" ? ` · ${activeFilter}` : ""}
          </motion.p>
        </>
      )}
    </section>
  );
}
