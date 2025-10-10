import { useParams } from 'react-router-dom';
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

  // Filter other videos for the grid
  const otherVideos = videos.filter(v => v.id !== id);

  if (!currentVideo) {
    return (
      <div className='layout-wrapper'>
        <Navbar />
        <main className='flex-grow text-center !mt-40 text-white'>
          <h1>Video not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='layout-wrapper'>
      <Navbar />
      <main className='flex flex-col flex-grow items-center !px-4'>
        <VideoPlayer video={currentVideo} />
        <h2 className='text-2xl font-bold gradienttext !mt-16 !mb-6'>Other Videos</h2>
        <VideoGrid videos={otherVideos} />
      </main>
      <Footer />
    </div>
  );
}
