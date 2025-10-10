import { useParams, Link } from 'react-router-dom';
import '../index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoPlayer from '../components/VideoPlayer';
import VideoGrid from '../components/VideoGrid';
import videos from '../data/videos.json';

export default function VideoDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // Find the current video by ID
  const currentVideo = videos.find(v => v.id === id);

  if (!currentVideo) {
    return (
      <div className="layout-wrapper">
        <Navbar />
        <main className="flex-grow text-center !mt-40 text-white">
          <h1>Video not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter videos by same category (excluding current video)
  const sameCategoryVideos = videos.filter(
    (v) => v.category === currentVideo.category && v.id !== currentVideo.id
  );

  // Select other categories (excluding the current one)
  const otherCategories = Array.from(
    new Set(videos.map((v) => v.category))
  ).filter((cat) => cat !== currentVideo.category);

  // Choose one or two random videos from other categories
  const randomFromOtherCategories = videos
    .filter((v) => v.category !== currentVideo.category)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="flex flex-col flex-grow items-center !px-4">
        {/* Main video */}
        <VideoPlayer video={currentVideo} />

        {/* Related videos section */}
        {sameCategoryVideos.length > 0 && (
          <>
            <h2 className="text-2xl font-bold gradienttext !mt-16 !mb-6">
              More in {currentVideo.category}
            </h2>
            <VideoGrid videos={sameCategoryVideos} />
          </>
        )}

        {/* Explore other categories */}
        <section className="!mt-20 text-center">
          <h3 className="text-xl font-semibold text-gray-200 !mb-4">
            Explore more categories
          </h3>
          <div className="flex flex-wrap justify-center !gap-3 !mb-10">
            {otherCategories.map((cat) => (
              <Link
                key={cat}
                to={`/videos?category=${encodeURIComponent(cat)}`}
                className="!px-4 !py-2 rounded-md bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white transition"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Show random teasers from other categories */}
          <VideoGrid videos={randomFromOtherCategories} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
