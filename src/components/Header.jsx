import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <NavLink to="/explore" className="text-3xl font-bold tracking-tight text-gray-900">
            Vixlo<span className="text-pink-600">.</span>
          </NavLink>
          <nav className="hidden md:block">
            <ul className="flex gap-8 text-md font-medium text-gray-500">
              <li>
                <NavLink
                  to="/explore"
                  className={({ isActive }) =>
                    `transition hover:text-black ${isActive ? "text-black" : ""}`
                  }
                >
                  Explore
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `transition hover:text-black ${isActive ? "text-black" : ""}`
                  }
                >
                  Categories
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* <div className="flex items-center gap-6">
          <button className="text-sm font-medium text-gray-600 hover:text-black transition">
            Log in
          </button>
          <button className="bg-black text-white px-5 py-2.5 text-sm font-semibold rounded-full hover:bg-gray-800 transition shadow-sm">
            Sign up
          </button>
        </div> */}
      </div>
    </header>
  );
}
