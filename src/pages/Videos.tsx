import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Categories from '../components/Categories';
import VideoGrid from '../components/VideoGrid';
import videos from '../data/videos.json';
import '../index.css';

export default function Videos() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Build categories list dynamically
  const allCategories = useMemo(
    () => ['All', ...Array.from(new Set(videos.map(v => v.category)))],
    []
  );

  // Filter videos by search + category
  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchesSearch =
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.program.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || v.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="layout-wrapper min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow !pt-36 !px-6 text-white">
        <h1 className="sr-only">Joni's video library - an amazing collection of high quality edits and reels | Joni Putkinen</h1>
        <h2 className="text-4xl font-bold gradienttext text-center !mb-8 !mt-10">
          All Videos
        </h2>

        {/* Search */}
        <div className="flex justify-center !mb-8">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md !px-4 !py-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Categories */}
        <Categories
          categories={allCategories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Video grid */}
        <div>
          {filteredVideos.length > 0 ? (
            <VideoGrid videos={filteredVideos} />
          ) : (
            <p className="text-center text-gray-400 !mt-16">
              No videos found matching your filters.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
