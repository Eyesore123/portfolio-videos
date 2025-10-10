import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import VideoCarousel from '../components/VideoCarousel';
import Footer from '../components/Footer';
import videos from '../data/videos.json';
import '../index.css';

const allCategories = ['All', ...Array.from(new Set(videos.map(v => v.category)))];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVideos = activeCategory === 'All'
    ? videos
    : videos.filter(v => v.category.includes(activeCategory));

  return (
    <div className="layout-wrapper">
      <Navbar />
      <h1 className="sr-only">Joni's video library - an amazing collection of high quality edits and reels | Joni Putkinen</h1>
      <Hero
        title="Joni's video library"
        subtitle="Explore amazing videos, video editing projects, reels and experiments!"
      />
      <Categories
        categories={allCategories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <VideoCarousel videos={filteredVideos} />
      <Footer />
    </div>
  );
}
