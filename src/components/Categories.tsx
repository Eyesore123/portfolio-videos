import '../index.css';

interface CategoriesProps {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}

export default function Categories({ categories, activeCategory, onSelect }: CategoriesProps) {
  return (
   <section className="!mt-12 flex justify-center items-center w-full gap-4 min-h-[50px] relative">
  {/* Blur background */}
  <div className="absolute inset-0 blur2 blur4 z-0"></div>

  {/* Buttons */}
  <div className="relative z-10 flex flex-row !gap-2 !-mt-4 justify-center max-w-fit px-2">
    {categories.map(cat => (
      <button
        key={cat}
        className={`!px-4 !py-2 rounded hover:cursor-pointer font-semibold ${
          activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'
        }`}
        onClick={() => onSelect(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
</section>

  );
}
