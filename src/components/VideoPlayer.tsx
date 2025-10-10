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

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <div className="flex flex-col items-center !mt-24">
      <h2 className="text-3xl font-bold gradienttext !mt-20 !mb-34">{video.title}</h2>
      <video
        src={video.src}
        controls
        className="w-full max-w-2xl rounded-lg shadow-lg"
      />
      <p className="text-gray-400 !mb-2 !mt-20 !text-sm">{video.year} | {video.program}</p>
    </div>
  );
}
