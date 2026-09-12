import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { marked } from "marked";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { posts } from "../data/posts";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function BlogPost() {
  const { slug } = useParams();
  const sectionRef = useScrollReveal();
  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = postIndex !== -1 ? posts[postIndex] : null;

  useEffect(() => {
    document.title = post ? `${post.title} | Papneet Swain` : "Dispatch Not Found | Papneet Swain";
  }, [post]);

  const htmlContent = useMemo(() => {
    if (!post?.content) return "";
    return marked.parse(post.content, { breaks: true, gfm: true });
  }, [post]);

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="blog-page not-found-page">
          <div className="section-shell not-found-shell" ref={sectionRef}>
            <div className="not-found-badge" data-reveal>SIGNAL 404</div>
            <h1 data-reveal>DISPATCH NOT FOUND</h1>
            <p data-reveal>
              The article or transmission you are looking for has either drifted out of orbital range or does not exist.
            </p>
            <div data-reveal>
              <Link to="/blog" className="not-found-cta cursor-can-hover">
                ← RETURN TO DISPATCHES
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  return (
    <>
      <Navbar />
      <main className="blog-page blog-post-page" ref={sectionRef}>
        <article className="blog-article-shell">
          <nav className="blog-breadcrumb" aria-label="Breadcrumb" data-reveal>
            <Link to="/blog" className="blog-back-link cursor-can-hover">
              ← BACK TO DISPATCHES
            </Link>
            <span className="blog-breadcrumb-sep">/</span>
            <span className="blog-breadcrumb-current">{post.title}</span>
          </nav>

          <header className="blog-article-header" data-reveal>
            <div className="blog-meta-tags">
              <span className="blog-date">{post.date}</span>
              <span className="blog-meta-dot">•</span>
              <span className="blog-read-time">{post.readTime}</span>
            </div>
            <h1 className="blog-article-title">{post.title}</h1>
            <p className="blog-article-excerpt">{post.excerpt}</p>
            <div className="blog-tag-pills">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="blog-divider" />

          <section
            className="blog-markdown-body"
            data-reveal
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="blog-divider" />

          <footer className="blog-article-footer">
            <div className="blog-nav-adjacent" data-reveal>
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="blog-adjacent-card prev cursor-can-hover"
                  aria-label={`Previous dispatch: ${prevPost.title}`}
                >
                  <span className="adjacent-label">← PREVIOUS DISPATCH</span>
                  <span className="adjacent-title">{prevPost.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="blog-adjacent-card next cursor-can-hover"
                  aria-label={`Next dispatch: ${nextPost.title}`}
                >
                  <span className="adjacent-label">NEXT DISPATCH →</span>
                  <span className="adjacent-title">{nextPost.title}</span>
                </Link>
              ) : (
                <div />
              )}
            </div>

            <div className="blog-return-row" data-reveal>
              <Link to="/blog" className="blog-return-btn cursor-can-hover">
                ← BACK TO ALL DISPATCHES
              </Link>
            </div>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
