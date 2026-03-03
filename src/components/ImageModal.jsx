export default function ImageModal({
  image,
  onClose,
  hasPrev,
  canGoNext,
  onPrev,
  onNext,
  onDownload,
  isDownloading,
  isLoadingNext,
  currentIndex,
  totalCount,
}) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
              {(image.photographer || "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-wide text-gray-500">
                Photographer
              </p>
              <a
                href={image.photographer_url || image.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-base font-semibold text-gray-900 hover:underline"
              >
                {image.photographer || "Unknown photographer"}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {isDownloading ? "Downloading..." : "Download"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-auto bg-black/5">
          {hasPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-gray-900 shadow-md hover:bg-white"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <img
            src={image.src.large2x || image.src.large}
            alt={image.alt || "Selected gallery image"}
            className="mx-auto h-full max-h-[78vh] w-auto object-contain"
          />

          {canGoNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={isLoadingNext}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-gray-900 shadow-md hover:bg-white"
              aria-label="Next image"
            >
              {isLoadingNext ? (
                <span
                  className="block h-[22px] w-[22px] rounded-full border-2 border-gray-400 border-t-gray-900 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:px-6">
          <p className="line-clamp-1 text-sm text-gray-600">
            {image.alt || "Untitled photo"}
          </p>
          <p className="text-xs text-gray-500">
            {currentIndex}/{totalCount} - Press Esc to close
          </p>
        </div>
      </div>
    </div>
  );
}
