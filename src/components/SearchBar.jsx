import { useEffect, useState } from "react";

const HERO_SLIDES = [
  "public/hero/1.jpeg",
  "public/hero/2.jpeg",
  "public/hero/3.jpeg",
  "public/hero/4.jpeg",
  "public/hero/5.jpeg",
];

export default function SearchBar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  categories,
  activeCategory,
  onCategorySelect,
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[430px] sm:h-[480px] lg:h-[520px] overflow-hidden">
      <div className="absolute inset-0">
        {HERO_SLIDES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
              index === activeSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          Discover Stunning Photography
        </h2>
        <p className="mt-3 text-white/90 text-sm sm:text-base">
          Search by keyword or pick a category to explore.
        </p>

        <form
          onSubmit={onSearchSubmit}
          className="mt-8 w-full max-w-3xl flex flex-col sm:flex-row gap-3"
        >
          <label htmlFor="search-input" className="sr-only">
            Search photos
          </label>
          <input
            id="search-input"
            type="text"
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder="Search photos, e.g. mountain, portrait, city..."
            className="h-12 w-full rounded-xl border border-white/40 bg-white/95 px-4 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <button
            type="submit"
            className="h-12 px-6 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.value;
            return (
              <button
                key={category.label}
                type="button"
                onClick={() => onCategorySelect(category.value)}
                className={`cursor-pointer px-4 py-2 rounded-full border text-sm transition-colors ${
                  isActive
                    ? "bg-white text-gray-900 border-white"
                    : "bg-white/15 border-white/50 text-white hover:bg-white/25"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
