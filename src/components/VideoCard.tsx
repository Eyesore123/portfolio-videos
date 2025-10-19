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

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hoverTimeout = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Lazy load via IntersectionObserver
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

  // Handle delayed hover preview
  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => setHovered(true), 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(false);
  };

  // Play / pause video
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

  // Scroll to top but allow navigation
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link
      to={`/videos/${video.id}`}
      onClick={handleClick}
      className="flex flex-col rounded-lg hover:scale-105 hover:cursor-pointer transition overflow-hidden shadow-lg hover:shadow-2xl w-64 bg-gray-900"
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
          className={`w-full h-40 object-cover ${loading ? 'opacity-0' : hovered ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
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

      <div className="!p-2">
        <h5 className="text-white !pb-8 !border-b-1 border-white">{video.title}</h5>
        <h2 className="sr-only">{video.title}</h2>
        <p className="text-sm text-gray-400 !mt-3">
          {video.year} | {video.category}
        </p>
      </div>
    </Link>
  );
}
