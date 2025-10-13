import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../index.css';
import ThumbnailWithPreview from './ThumbnailWithPreview';

interface Video {
  id: string;
  title: string;
  year: number;
  program: string;
  category: string;
  thumbnail: string;
  src: string;
  description?: string;
  contributors?: string;
  music?: string;
  musicLink?: string;
  contributorLink?: string;
}

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [isEnded, setIsEnded] = useState(false);
  // const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [metadata, setMetadata] = useState({
    duration: '',
    resolution: '',
    size: '',
  });

  // Load metadata including file size
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleLoadedMetadata = async () => {
      const duration = vid.duration;
      const width = vid.videoWidth;
      const height = vid.videoHeight;

      let sizeText = 'Unknown';
      try {
        const response = await fetch(video.src, { method: 'HEAD' });
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
          const sizeMB = (parseInt(contentLength, 10) / (1024 * 1024)).toFixed(2);
          sizeText = `${sizeMB} MB`;
        }
      } catch (err) {
        console.warn('Failed to get video size:', err);
      }

      setMetadata({
        duration: `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`,
        resolution: `${width}x${height}`,
        size: sizeText,
      });
    };

    vid.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => vid.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [video.src]);

  // Animate overlay when video ends
  useEffect(() => {
    if (isEnded && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, scale: 0.95, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [isEnded]);

  // Reset overlay when the video source changes
  useEffect(() => {
    setIsEnded(false);
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 });
    }
  }, [video.src]);

  const handleReplay = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play();
      setIsEnded(false);
    }
  };

  const handleDownload = async () => {
  try {
    const response = await fetch(video.src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.title}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

  return (
    <section className="flex flex-col items-center justify-center !mt-36 !px-4 w-full max-w-7xl mx-auto text-gray-300">
      {/* Title */}
      <h2 className="sr-only">Joni Putkinen | Joni's video edit of {video.title}</h2>
      <h3 className="text-4xl font-extrabold gradienttext text-center !mb-12 lg:!mb-14">
        {video.title}
      </h3>

      {/* Video + details */}
      <div className="flex flex-col lg:flex-row items-start justify-center !gap-10 xl:!gap-20 w-full relative">
        {/* Left: Video */}
        <div className="relative lg:flex-[3] flex justify-center">
          <video
            ref={videoRef}
            src={video.src}
            controls
            onEnded={() => setIsEnded(true)}
            onPlay={() => setIsEnded(false)}
            className="w-full max-w-4xl rounded-lg shadow-lg border border-gray-700 2xl:!max-h-[600px] 3xl:!max-h-[1000px] bg-black"
          />

          {/* Overlay when video ends */}
          {isEnded && (
            <div
              ref={overlayRef}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-lg pointer-events-none"
            >
              <div className="flex flex-col items-center pointer-events-auto">
                <ThumbnailWithPreview src={video.thumbnail} alt={video.title} size={180} />
                <button
                  onClick={handleReplay}
                  className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer text-white !px-6 !py-2 rounded font-semibold !mb-3 !mt-2 transition-transform hover:scale-105"
                >
                  Replay
                </button>
                <a
                  href={video.src}
                  onClick={handleDownload}
                  className="text-gray-300 hover:text-white underline !text-sm"
                >
                  Download video
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:flex-[1] !mt-8 lg:!mt-0 lg:text-left text-center 2xl:!ml-6">
          {video.description && (
            <div className="text-gray-400 !mb-6 leading-relaxed">{video.description}</div>
          )}

          {/* Thumbnail preview */}
          <div className="!mt-10 !mb-6 flex-col md:flex-row flex !items-center">
            <ThumbnailWithPreview src={video.thumbnail} alt={video.title} size={128} />
          </div>

          <div className="!mb-2">
            <span className="font-semibold text-white !text-sm">Year:</span> {video.year}
          </div>
          <div className="!mb-2">
            <span className="font-semibold text-white">Editing program:</span> {video.program}
          </div>
          <div className="!mb-2">
            <span className="font-semibold text-white">Category:</span> {video.category}
          </div>

          {/* Auto metadata */}
          <div className="!mt-6 !space-y-1 !text-sm text-gray-400">
            <div>
              <span className="font-semibold text-white">Duration:</span> {metadata.duration || 'Loading...'}
            </div>
            <div>
              <span className="font-semibold text-white">Resolution:</span> {metadata.resolution || 'Loading...'}
            </div>
            <div>
              <span className="font-semibold text-white">File size:</span> {metadata.size || '...'}
            </div>
          </div>

          {/* Quality selector */}
          {/* <div className="!mt-8">
            <label className="!text-sm text-gray-400 !mr-2">Quality:</label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="bg-gray-800 text-white !px-2 !py-1 rounded border border-gray-700"
            >
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
            </select>
          </div> */}

          {/* Download button */}
          <div className="!mt-8">
            <a
              href={video.src}
              download
              className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold !px-5 !py-2 rounded transition-transform hover:scale-105"
            >
              ⬇ Download video
            </a>
          </div>

          {/* Music info */}
          {video.music && (
            <div className="!mt-8 text-gray-400">
              <p>
                <span className="font-semibold text-white">Music:</span>{' '}
                {video.musicLink ? (
                  <a
                    href={video.musicLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    {video.music}
                  </a>
                ) : (
                  video.music
                )}
              </p>
            </div>
          )}

          {/* Contributors */}
          {video.contributors && (
            <div className="!mt-6 text-gray-400">
              <span className="font-semibold text-white block !mb-1">Contributors:</span>
              {video.contributorLink ? (
                <a
                  href={video.contributorLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  {video.contributors}
                </a>
              ) : (
                <p>{video.contributors}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
