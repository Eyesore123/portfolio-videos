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
  return (
    <section className="!mt-12 !px-4 overflow-x-auto flex !gap-6">
        <div className='w-full flex justify-center flex-wrap'>
            {videos.map(video => (
                <Link
                key={video.id}
                to={`/videos/${video.id}`}
                className="flex-none w-64 !ml-4 !mr-4 rounded overflow-hidden shadow-lg hover:shadow-2xl transition"
                >
                <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover"/>
                <div className="!p-2 bg-gray-900">
                    <h4 className="sr-only">{video.title}</h4>
                    <h5 className="text-white">{video.title}</h5>
                    <p className="!text-sm text-gray-400">{video.year} | {video.program}</p>
                </div>
                </Link>
            ))}
      </div>
    </section>
  );
}
