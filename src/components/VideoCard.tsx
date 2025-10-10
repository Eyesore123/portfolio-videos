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

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      to={`/videos/${video.id}`}
      className="flex flex-col rounded-lg hover:scale-105 hover:cursor-pointer transition overflow-hidden shadow-lg hover:shadow-2xl w-64 bg-gray-900"
    >
      <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover"/>
      <div className="!p-2">
        <h5 className="text-white">{video.title}</h5>
        <h2 className="sr-only">{video.title}</h2>
        <p className="text-sm text-gray-400">{video.year} | {video.program}</p>
        <p className="text-xs text-gray-500">{video.category}</p>
      </div>
    </Link>
  );
}
