import { Link } from 'react-router-dom';
import { useState } from 'react';
import Spinner from './Spinner';
import '../index.css';

interface Video {
  id: string;
  title: string;
  year: number;
  program: string;
  category: string;
  thumbnail: string;
  src: string;
}

interface VideoCarouselProps {
  videos: Video[];
}

function VideoCard({ video }: { video: Video }) {
  const [loading, setLoading] = useState(true);

  return (
    <Link
      key={video.id}
      to={`/videos/${video.id}`}
      className="flex-none w-64 hover:scale-105 transition rounded overflow-hidden shadow-lg hover:shadow-2xl"
    >
      <div className="relative w-full !h-40">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size={48} />
          </div>
        )}

        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-40 object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>

      <div className="!p-2 bg-gray-900">
        <h5 className="text-white font-semibold !pb-3 !border-b border-white">{video.title}</h5>
        <p className="text-sm text-gray-400 !mt-3">{video.year} | {video.category}</p>
      </div>
    </Link>
  );
}

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const limitedVideos = [...videos].sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <section className="!mt-0 !px-4 overflow-x-auto overflow-y-hidden flex justify-center">
      <div className="w-full flex justify-center flex-wrap !gap-6 xl:!gap-4">
        {limitedVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
