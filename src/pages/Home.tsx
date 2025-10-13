import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import VideoCarousel from '../components/VideoCarousel';
import Footer from '../components/Footer';
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
        setVideos(data);
        const categories = ['All', ...(data.map((v: any) => v.category) as string[])] as string[];
        setAllCategories(categories);
      })
      .catch(err => console.error('Error loading videos:', err));
  }, []);

  const categoryDescriptions: Record<string, string> = {
    "Anime + Music": "Fast-paced anime edits with energetic beats and stylish motion.",
    "Anime": "A selection of cinematic anime edits and visual experiments.",
  };

  const filteredVideos =
    activeCategory === 'All'
      ? videos
      : videos.filter(v => v.category.includes(activeCategory));

  // Randomize and limit to 4
  const visibleVideos = [...filteredVideos].sort(() => Math.random() - 0.5).slice(0, 4);

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

      <Categories
        categories={allCategories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <section className="!mt-0">
        <VideoCarousel videos={visibleVideos} />
        <div className="!mt-0 !mb-4 flex justify-center items-center gap-2 w-full">
          <p className="w-full text-center text-gray-400 !mt-4 !mb-4 max-w-2xl mx-auto">
            {activeCategory === 'All'
              ? "Here you see 4 random videos. Click on a category or Videos page to explore more!"
              : categoryDescriptions[activeCategory] ||
                "Here you see 4 random videos from this category. Visit the Videos page to see more!"}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
