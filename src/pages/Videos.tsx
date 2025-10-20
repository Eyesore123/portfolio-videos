import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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

  const location = useLocation();
  const navigate = useNavigate();

  // --- Load videos ---
  useEffect(() => {
    fetch('/data/videos.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
      })
      .then(data => setVideos(data))
      .catch(err => console.error('Error loading videos:', err));
  }, []);

  // --- Read category and page from URL ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    const pageFromUrl = parseInt(params.get('page') || '1', 10);

    setActiveCategory(categoryFromUrl || 'All');
    setCurrentPage(!isNaN(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl - 1 : 0);
    setInputValue(!isNaN(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);
  }, [location.search]);

  // --- Scroll to top when page changes ---
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }, [currentPage]);

  // --- Categories list ---
  const allCategories = useMemo(
    () => ['All', ...Array.from(new Set(videos.map(v => v.category)))],
    [videos]
  );

  // --- Filtering ---
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

  // --- Pagination ---
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = currentPage * videosPerPage;
  const visibleVideos = filteredVideos.slice(startIndex, startIndex + videosPerPage);
  const hasMore = currentPage < totalPages - 1;

  const updateUrl = (category: string, page: number) => {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (page > 1) params.set('page', page.toString());
    navigate(`?${params.toString()}`, { replace: false });
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
    setInputValue(page + 1);
    updateUrl(activeCategory, page + 1);
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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
    setInputValue(1);
    updateUrl(activeCategory, 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search, activeCategory]);

  // --- Dynamic SEO title/description ---
  const pageTitle =
    activeCategory === 'All'
      ? "All Videos | Joni Putkinen"
      : `${activeCategory} Videos | Joni Putkinen`;

  const pageDescription =
    visibleVideos.length > 0
      ? `Browse ${visibleVideos.length} video${visibleVideos.length > 1 ? 's' : ''} in the ${
          activeCategory === 'All' ? 'library' : activeCategory
        } category.`
      : 'No videos found matching your filters.';

  // --- JSON-LD structured data for visible videos ---
  const jsonLd = visibleVideos.map(video => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: [video.thumbnail],
    uploadDate: video.uploadDate,
    contentUrl: `https://videos.joniputkinen.com/videos/${video.id}`
  }));

  return (
    <div className="layout-wrapper min-h-screen flex flex-col">
      <Navbar />

      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="flex-grow !pt-36 !px-6 text-white">
        <div className="sr-only">
          Joni's video library - an amazing collection of high-quality edits and reels | Joni Putkinen
        </div>
        <h2 className="text-4xl font-bold gradienttext text-center !mb-8 !mt-10">
          {activeCategory === 'All' ? 'All Videos' : activeCategory}
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

        <div className="flex flex-col items-center lg:!mt-4">
          {filteredVideos.length > 0 ? (
            <>
              <VideoGrid videos={visibleVideos} />

              <div className="flex justify-center items-center !gap-2 md:!gap-4 !mt-8 !mb-10 customdiv">
                <button
                  onClick={handleFirstPage}
                  disabled={currentPage === 0}
                  className="paginationbutton hover:cursor-pointer !px-2 !py-1 md:!px-4 md:!py-2 bg-[#5800FF] text-white rounded hover:bg-[#E900FF] disabled:opacity-50 transition-colors text-sm md:text-base"
                >
                  <img src="/first.svg" alt="First" />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="paginationbutton hover:cursor-pointer !px-2 !py-1 md:!px-4 md:!py-2 bg-[#5800FF] text-white rounded hover:bg-[#E900FF] disabled:opacity-50 transition-colors text-sm md:text-base"
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
                  className="paginationbutton hover:cursor-pointer !px-2 !py-1 md:!px-4 md:!py-2 bg-[#5800FF] text-white rounded hover:bg-[#E900FF] disabled:opacity-50 transition-colors text-sm md:text-base"
                >
                  Next
                </button>

                <button
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages - 1}
                  className="paginationbutton hover:cursor-pointer !px-2 !py-1 md:!px-4 md:!py-2 bg-[#5800FF] text-white rounded hover:bg-[#E900FF] disabled:opacity-50 transition-colors text-sm md:text-base"
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
