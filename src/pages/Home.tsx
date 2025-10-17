import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import VideoCarousel from '../components/VideoCarousel';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import '../index.css';

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [allCategories, setAllCategories] = useState<string[]>(['All']);

  useEffect(() => {
    fetch('/data/videos.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
      })
      .then(data => {
        // Sort videos by year (descending) if available
        const sorted = [...data].sort((a, b) => {
          const yearA = parseInt(a.year || '0', 10);
          const yearB = parseInt(b.year || '0', 10);
          return yearB - yearA;
        });
        setVideos(sorted);

        const uniqueCategories = Array.from(
          new Set(data.map((v: any) => v.category) as string[])
        );
        setAllCategories(['All', ...uniqueCategories]);
      })
      .catch(err => console.error('Error loading videos:', err));
  }, []);

  const categoryDescriptions: Record<string, string> = {
    "Anime + Music": "Fast-paced anime edits with energetic beats and stylish motion.",
    "Anime": "A selection of cinematic anime edits and visual experiments.",
    "Cars": "Car edits showcasing the power of the PNP-Power car mechanic.",
    "Humor": "Old shorts from my Finnish humor channel (YouTube). Click Videos page to see more.",
  };

  // Show 4 recent 2025 videos if "All"
  const filteredVideos = useMemo(() => {
    if (activeCategory === 'All') {
      const vids2025 = videos.filter(v => v.year === 2025);
      if (vids2025.length >= 4) return vids2025.slice(0, 4);
      // Fallback: take newest 4
      return videos.slice(0, 4);
    }
    return videos.filter(v => v.category === activeCategory).slice(0, 4);
  }, [videos, activeCategory]);

  return (
    <div className="layout-wrapper">
      <Navbar />
      <h2 className="sr-only">
        Joni's video library - an amazing collection of high-quality edits and reels | Joni Putkinen
      </h2>

      <Hero
        title="Joni's video library"
        subtitle="Explore amazing videos, video editing projects, reels and experiments!"
      />

      <Banner />

      <Categories
        categories={allCategories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <section className="!mt-0">
        <VideoCarousel videos={filteredVideos} />
        <div className="!mt-0 !mb-4 flex justify-center items-center gap-2 w-full">
          <p className="w-full text-center text-gray-400 !mt-4 !mb-4 max-w-2xl mx-auto">
            {activeCategory === 'All'
              ? "Here you see 4 recently made videos. Click on a category or the Videos page to explore more!"
              : categoryDescriptions[activeCategory] ||
                "Here you see 4 videos from this category. Visit the Videos page to see more!"}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
