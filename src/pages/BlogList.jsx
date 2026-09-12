import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { posts } from "../data/posts";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function BlogList() {
  const sectionRef = useScrollReveal();

  useEffect(() => {
    document.title = "Dispatches / Archive | Papneet Swain";
  }, []);

  return (
    <>
      <Navbar />
      <main className="blog-page">
        <section className="blog-hero" ref={sectionRef}>
          <div className="section-atmosphere projects-atmosphere" aria-hidden="true" />
          <div className="section-shell">
            <div className="section-marker" data-reveal>
              <span>05</span>
              <i />
              <span>DISPATCHES / ARCHIVE</span>
            </div>

            <div className="section-heading" data-reveal data-scroll-heading>
              <div>
                <p>KNOWLEDGE IN ORBIT</p>
                <h2>
                  Engineering <em>reflections</em>
                </h2>
              </div>
              <p>
                Notes on building scalable architectures, generative systems, and creative web experiences from first principles.
              </p>
            </div>

            <div className="blog-grid" data-reveal>
              {posts.map((post, index) => {
                const numberStr = String(index + 1).padStart(2, "0");
                return (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="blog-card-link"
                    aria-label={`Read dispatch: ${post.title}`}
                  >
                    <article className="project-card blog-card cursor-can-hover" data-reveal-item tabIndex={0}>
                      <div className="project-card-body">
                        <div className="project-card-top">
                          <span>
                            {numberStr} / {post.date}
                          </span>
                          <i>{post.readTime}</i>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <div className="project-card-bottom">
                          <div>
                            {post.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                          <span className="project-open">
                            READ <b>↗</b>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            <div className="blog-footer-meta" data-reveal>
              <span>
                <b>{posts.length}</b> DISPATCHES RECORDED
              </span>
              <Link to="/" className="cursor-can-hover back-home-link">
                ← RETURN TO ORBIT
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
