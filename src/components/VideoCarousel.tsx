import { Link } from 'react-router-dom';
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

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  // Randomize & limit to 4
  const limitedVideos = [...videos].sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <section className="!mt-0 !px-4 overflow-x-auto flex justify-center">
      <div className="w-full flex justify-center flex-wrap !gap-4">
        {limitedVideos.map(video => (
          <Link
            key={video.id}
            to={`/videos/${video.id}`}
            className="flex-none w-64 hover:scale-105 transition rounded overflow-hidden shadow-lg hover:shadow-2xl"
          >
            <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover"/>
            <div className="!p-2 bg-gray-900">
              <h5 className="text-white font-semibold">{video.title}</h5>
              <p className="!text-sm text-gray-400">{video.year} | {video.program}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
