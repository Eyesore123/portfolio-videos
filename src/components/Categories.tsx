import '../index.css';

interface CategoriesProps {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}

export default function Categories({ categories, activeCategory, onSelect }: CategoriesProps) {
  return (
    <section className="relative flex justify-center items-center w-full !mt-12">
      {/* Container that defines blur size */}
      <div className="relative flex flex-wrap justify-center items-center !gap-2 !px-2 !pb-5 !pt-1 z-10 max-w-fit">
        {/* Blur background matching button area */}
        <div className="absolute inset-0 rounded-lg blur2 blur4 bg-gray-900/40 !backdrop-blur-md z-0"></div>

        {/* Buttons grid */}
        <div className="relative z-10 grid grid-cols-2 sm:!grid-cols-3 md:!flex md:!flex-row !gap-2 justify-center items-center">
          {categories.map(cat => (
            <button
              key={cat}
              className={`!px-4 !py-2 rounded font-semibold transition hover:cursor-pointer ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => onSelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
