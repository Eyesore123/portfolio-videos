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

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link
      to={`/videos/${video.id}`}
      onClick={handleClick}
      className="flex flex-col rounded-lg hover:scale-105 hover:cursor-pointer transition overflow-hidden shadow-lg hover:shadow-2xl w-64 bg-gray-900"
    >
      <div className="relative w-full h-40">
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

      <div className="!p-2">
        <h5 className="text-white !pb-3 !border-b-1 border-white">{video.title}</h5>
        <h2 className="sr-only">{video.title}</h2>
        <p className="text-sm text-gray-400 !mt-3">
          {video.year} | {video.category}
        </p>
      </div>
    </Link>
  );
}
