import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import TechArsenal from "../components/TechArsenal";
import Experience from "../components/experience/Experience";
import Projects from "../components/Projects";
import GitHubActivity from "../components/GitHubActivity";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home({ startHero }) {
  useEffect(() => {
    document.title = "Papneet Swain | Full Stack Developer & AI Engineer";
  }, []);

  return (
    <>
      <Navbar />
      <Hero startHero={startHero} />
      <About />
      <TechArsenal />
      <Experience />
      <Projects />
      <GitHubActivity />
      <Contact />
      <Footer />
    </>
  );
}
