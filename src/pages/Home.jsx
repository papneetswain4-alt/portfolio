import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import TechArsenal from "../components/TechArsenal";
import Projects from "../components/Projects";
import GitHubActivity from "../components/GitHubActivity";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home({ startHero }) {
  return (
    <>
      <Navbar />
      <Hero startHero={startHero} />
      <About />
      <TechArsenal />
      <Projects />
      <GitHubActivity />
      <Contact />
      <Footer />
    </>
  );
}
