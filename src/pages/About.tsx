import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import '../index.css';

export default function About() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="layout-wrapper">
      <Navbar />
      <h2 className="text-4xl font-bold gradienttext text-center !mb-18 !mt-50">
        About my creative journey
      </h2>

      {/* Image wrapper with loader */}
      <div className="w-full flex justify-center relative !mt-4">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
            <Spinner size={48} />
          </div>
        )}
        <img
          src="/omakuva_compressed.jpg"
          alt="omakuva"
          className={`w-60 h-auto rounded-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>

      <main className="!mt-4 !px-6 text-gray-300 !mx-auto leading-relaxed">
        <section className="!mb-0 lg:max-w-[600px]">
          <h4 className="text-3xl font-bold gradienttext !mb-2">Video editing</h4>
          <p className="!mb-4 !mt-4 text-center">
            My video editing journey started with curiosity. I wondered how far I could push my video editing skills without formal training.
            Could I create compelling stories and rhythm through cuts, effects, and sound? Over time, I began combining my love
            for visual design with structured editing workflows, mainly using{' '}
            <span className="font-semibold text-white">Adobe Premiere Pro</span>.
          </p>
          <p className="!mb-4 !mt-4 text-center">
            I focus on anime edits, fast-paced and phonk-inspired sequences, and cinematic visual compositions.
            My goal is to create atmosphere, emotion, and something I personally enjoy watching.
          </p>
        </section>

        <section className="!mb-0 lg:max-w-[600px]">
          <h4 className="text-3xl font-bold gradienttext !mb-2">Web development meets creativity</h4>
          <p className="!mb-4 !mt-4 text-center">
            While improving my video editing, I realized how web development can amplify creativity.
            Building interactive sites for my projects allows me to experiment with new technologies
            and layouts,pushing my front-end and design skills at the same time.
          </p>
          <p className="text-center">
            This combination helps me refine both skills at once: every animation, layout, and gallery
            is a way to learn something new about coding and storytelling.
          </p>
        </section>

        <section className="!mb-0 lg:max-w-[600px]">
          <h4 className="text-3xl font-bold gradienttext !mb-2">My portfolio site</h4>
          <p className="!mb-4 !mt-4 text-center">
            This site is a continuous experiment. It's built with{' '}
            <span className="font-semibold text-white">React + TypeScript</span>, designed to grow as I do.
            Here I test ideas for UI, performance, and user experience.
            Every video, layout, and animation is part of a bigger learning process — a step toward
            becoming a stronger creative developer.
          </p>

          <div className="flex justify-center gap-6 !mt-6">
            <a
              href="https://joniputkinen.com"
              className="text-purple-400 hover:text-white transition-colors font-semibold underline-offset-4 hover:underline"
            >
              🎬 View my portfolio
            </a>
          </div>
        </section>

        <section className="!mb-20">
          <h4 className="text-3xl font-bold gradienttext !mb-2">Blog & future plans</h4>
          <p className="!mb-4 !mt-4 text-center">
            My blog will focus on the process: how I make websites, what I learn about coding and design,
            and how I integrate web tools into my creative workflow. The goal is to keep learning:
            to build, break, improve, and share insights that could help others mix code and creativity.
          </p>
          <div className="flex justify-center gap-6 !mt-6">
            <a
              href="https://blog.joniputkinen.com"
              className="text-purple-400 hover:text-white transition-colors font-semibold underline-offset-4 hover:underline"
            >
              ✍️ Read my blog
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
