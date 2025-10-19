import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
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
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hoverTimeout = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Lazy load video when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Hover delay
  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => setHovered(true), 300);
  };
  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(false);
  };

  // Play/pause on hover
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (hovered) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [hovered]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link
      key={video.id}
      to={`/videos/${video.id}`}
      onClick={handleClick}
      className="flex-none w-64 hover:scale-105 transition rounded-lg overflow-hidden shadow-lg hover:shadow-2xl bg-gray-900"
    >
      <div
        ref={cardRef}
        className="relative w-full h-40"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size={48} />
          </div>
        )}

        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-40 object-cover transition-opacity duration-300 ${
            loading ? 'opacity-0' : hovered ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />

        {isVisible && (
          <video
            ref={videoRef}
            src={video.src}
            className={`absolute inset-0 w-full h-40 object-cover transition-opacity duration-500 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
            playsInline
            preload="none"
            loop
            muted
          />
        )}
      </div>

      <div className="!p-2 bg-gray-900">
        <h5 className="text-white font-semibold !pb-3 !border-b border-white !min-h-[135px]">
          {video.title}
        </h5>
        <p className="text-sm text-gray-400 !mt-3">
          {video.year} | {video.category}
        </p>
      </div>
    </Link>
  );
}

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const latestYear = Math.max(...videos.map(v => Number(v.year)));
  const limitedVideos = videos
    .filter(v => Number(v.year) === latestYear)
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 4);

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
