import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

export default function About() {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <h1 className="sr-only">About my creative journey - Joni Putkinen</h1>
      <h2 className="text-4xl font-bold gradienttext text-center !mb-8 !mt-50">About my creative journey</h2>

      <main className="!mt-10 !px-6 text-gray-300 !max-w-4xl !mx-auto leading-relaxed">
        <section className="!mb-0">
          <h4 className="text-3xl font-bold gradienttext !mb-2">Video editing</h4>
          <p className="!mb-4 !mt-4 text-center">
            My video editing journey started with curiosity. I wondered how far could I push my video editing skills without formal training.
            Could I create compelling stories and rhythm through cuts, effects, and sound? Over time I began combining my love for visual design with structured editing workflows, mainly using <span className="font-semibold text-white">Adobe Premiere Pro</span>.
          </p>
          <p className='!mb-4 !mt-4 text-center'>
            I focus on anime edits, phonk-inspired sequences, and cinematic visual compositions.
            My goal is to create atmosphere, emotion and something I personally enjoy watching.
          </p>
        </section>

        <section className="!mb-0">
          <h4 className="text-3xl font-bold gradienttext !mb-2">Web development meets creativity</h4>
          <p className="!mb-4 !mt-4 text-center">
            While improving my video editing, I realized how web development can amplify creativity.
            Building interactive sites for my projects allows me to experiment with new technologies
            and layouts — pushing my front-end and design skills at the same time.
          </p>
          <p>
            This combination helps me refine both skills at once: every animation, layout, and gallery
            is a way to learn something new about coding and storytelling.
          </p>
        </section>

        <section className="!mb-0">
          <h4 className="text-3xl font-bold gradienttext !mb-2">My portfolio site</h4>
          <p className="!mb-4 !mt-4 text-center">
            This site is a continuous experiment. It's built with <span className="font-semibold text-white">React + TypeScript</span>,
            designed to grow as I do. Here I test ideas for UI, performance, and user experience.
            Every video, layout, and animation is part of a bigger learning process — a step toward
            becoming a stronger creative developer.
          </p>
        </section>

        <section className="!mb-20">
          <h4 className="text-3xl font-bold gradienttext !mb-2">Blog & future plans</h4>
          <p className="!mb-4 !mt-4 text-center">
            My blog will focus on the process: how I make websites, what I learn about coding and design,
            and how I integrate web tools into my creative workflow. The goal is to keep learning in public: to build, break, improve, and share insights
            that could help others mix code and creativity.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
