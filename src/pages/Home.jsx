import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import TechArsenal from "../components/TechArsenal";

export default function Home({ startHero }) {
  return (
    <>
      <Navbar />
      <Hero startHero={startHero} />
      <About />
      <Projects />
      <TechArsenal />
      <Contact />
    </>
  );
}
