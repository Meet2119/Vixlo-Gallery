export default function Banner() {
  return (
    <section className="">
      <div className="px-4 h-100 w-100 lg:flex lg:items-center lg:justify-between">
    
        <div className="mt-8 lg:mt-0">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:-mx-2">
            <input
              id="email"
              type="text"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg sm:mx-2 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-teal-400 dark:focus:border-teal-400 focus:ring-teal-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="eg. Nature"
            />

            <button className="px-6 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-teal-600 rounded-lg focus:ring focus:ring-teal-300 focus:ring-opacity-80 fo sm:mx-2 hover:bg-teal-500 focus:outline-none focus:bg-teal-500">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
