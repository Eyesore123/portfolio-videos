import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

export default function About() {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <h2 className="text-4xl font-bold gradienttext text-center !mb-0 !mt-46">
        Important info
      </h2>
      
      <main className="!mt-0 !px-6 text-gray-300 !mx-auto leading-relaxed">

        <section className="!mb-0 lg:max-w-[600px]">
          <h4 className="text-3xl font-bold gradienttext !mb-2">Video takedown requests</h4>
          <p className="!mb-4 !mt-4 text-center">
            This site contains only videos that I have created myself. That means I have edited them, added subtitles and made other changes that have changed the original content.
            
            If you see a clip that you don't like, or think that it has been inappropriately used and wish to remove them, please let me know. You can contact me via the link below.
          </p>

          <div className="flex justify-center gap-6 !mt-6">
            <a
              href="https://joniputkinen.com/contact"
              target='_blank'
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-white transition-colors font-semibold underline-offset-4 hover:underline"
            >
              Contact me
            </a>
          </div>
        </section>
        <section className="lg:!mb-10 lg:max-w-[600px]">
           <h4 className="text-3xl font-bold gradienttext !mb-2">Videos</h4>
          <p className="!mb-4 !mt-4 text-center">
            A lot of the video material originates from TikTok or Youtube. Humor videos made in 2024 were posted on channel called Finnish humor channel (@Finnishhumor) and personal diaries on a channel called Branching Business (@branching_business).
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
