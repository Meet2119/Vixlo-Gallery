import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants/categories";

const CATEGORY_COVERS = {
  nature:
    "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&h=800",
  travel:
    "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&h=800",
  food: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&h=800",
  technology:
    "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&h=800",
  architecture:
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=800",
  animals:
    "https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&h=800",
  art: "https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&h=800",
};

export default function CategoriesPage() {
  const categories = CATEGORIES.filter((item) => item.value !== "");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
          Browse Categories
        </h1>
        <p className="mt-2 text-gray-600">
          Pick a category to open filtered results in Explore.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.value}
            to={`/explore?category=${encodeURIComponent(category.value)}`}
            className="group relative h-64 overflow-hidden rounded-2xl"
          >
            <img
              src={CATEGORY_COVERS[category.value]}
              alt={category.label}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-white text-2xl font-semibold tracking-tight">
                {category.label}
              </p>
              <p className="mt-1 text-white/90 text-sm">
                Open {category.label.toLowerCase()} photos
              </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
