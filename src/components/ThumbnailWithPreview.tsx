import { useState } from 'react';
import Spinner from './Spinner';

interface Props {
  src: string;
  alt: string;
  size?: number; // square size
}

export default function ThumbnailWithSpinner({ src, alt, size = 128 }: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size={48} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 rounded-lg border border-gray-700`}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  );
}
