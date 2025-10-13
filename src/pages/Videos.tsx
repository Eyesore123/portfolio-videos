import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Categories from '../components/Categories';
import VideoGrid from '../components/VideoGrid';
import '../index.css';

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [inputValue, setInputValue] = useState(1);
  const videosPerPage = 16;

  useEffect(() => {
    fetch('/data/videos.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
      })
      .then(data => setVideos(data))
      .catch(err => console.error('Error loading videos:', err));
  }, []);

  const allCategories = useMemo(
    () => ['All', ...Array.from(new Set(videos.map(v => v.category)))],
    [videos]
  );

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchesSearch =
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.program.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || v.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [videos, search, activeCategory]);

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = currentPage * videosPerPage;
  const visibleVideos = filteredVideos.slice(startIndex, startIndex + videosPerPage);
  const hasMore = currentPage < totalPages - 1;

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
    setInputValue(page + 1);
  };

  const handleFirstPage = () => handlePageChange(0);
  const handleLastPage = () => handlePageChange(totalPages - 1);

  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNumber = inputValue;
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        handlePageChange(pageNumber - 1);
      }
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    setInputValue(1);
  }, [search, activeCategory]);

  return (
    <div className="layout-wrapper min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow !pt-36 !px-6 text-white">
        <div className="sr-only">
          Joni's video library - an amazing collection of high quality edits and reels | Joni Putkinen
        </div>
        <h2 className="text-4xl font-bold gradienttext text-center !mb-8 !mt-10">
          All Videos
        </h2>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full !max-w-md !px-4 !py-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none !focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <Categories
          categories={allCategories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <div>
          {filteredVideos.length > 0 ? (
            <>
              <VideoGrid videos={visibleVideos} />

              <div className="flex justify-center items-center !gap-2 md:!gap-4 !mt-8 !mb-10 customdiv">
                <button
                  onClick={handleFirstPage}
                  disabled={currentPage === 0}
                  className="paginationbutton !px-2 !py-1 md:!px-4 md:!py-2 bg-[#5800FF] text-white rounded hover:bg-[#E900FF] disabled:opacity-50 transition-colors text-sm md:text-base"
                >
                  <img src="/first.svg" alt="First" />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="paginationbutton !px-2 !py-1 md:!px-4 md:!py-2 bg-[#5800FF] text-white rounded hover:bg-[#E900FF] disabled:opacity-50 transition-colors text-sm md:text-base"
                >
                  Previous
                </button>

                <span className="!text-sm md:!text-base">
                  Page {currentPage + 1} of {totalPages}
                </span>

                <input
                  type="number"
                  name="number"
                  value={inputValue}
                  onChange={e => setInputValue(parseInt(e.target.value) || 1)}
                  onKeyDown={handlePageInput}
                  className="!w-10 md:!w-12 !h-8 !text-sm md:!text-base text-center bg-gray-800 border border-gray-600 rounded"
                />

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasMore}
                  className="paginationbutton !px-2 !py-1 md:!px-4 md:!py-2 bg-[#5800FF] text-white rounded hover:bg-[#E900FF] disabled:opacity-50 transition-colors text-sm md:text-base"
                >
                  Next
                </button>

                <button
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages - 1}
                  className="paginationbutton !px-2 !py-1 md:!px-4 md:!py-2 bg-[#5800FF] text-white rounded hover:bg-[#E900FF] disabled:opacity-50 transition-colors text-sm md:text-base"
                >
                  <img src="/last.svg" alt="Last" />
                </button>
              </div>
            </>
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
