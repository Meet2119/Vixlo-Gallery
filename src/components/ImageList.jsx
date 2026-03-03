import { useState, useEffect, useMemo } from "react";
import ImageCard from "./ImageCard";

export default function ImageList({
  images,
  loading,
  hasNextPage,
  sentinelRef,
  onOpenModal,
}) {
  const [colCount, setColCount] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColCount(1);
      else if (window.innerWidth < 1024) setColCount(2);
      else setColCount(3);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Split images into columns for the Masonry effect
  const columns = useMemo(() => {
    const cols = Array.from({ length: colCount }, () => []);
    const heights = Array(colCount).fill(0);

    for (const image of images) {
      const ratio =
        image.width && image.height ? image.height / image.width : 1;
      const target = heights.indexOf(Math.min(...heights));
      cols[target].push(image);
      heights[target] += ratio;
    }

    return cols;
  }, [images, colCount]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-row gap-6">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6 flex-1">
            {col.map((image) => (
              <ImageCard image={image} key={image.id} onOpenModal={onOpenModal} />
            ))}
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10" aria-live="polite">
          <div
            className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"
            role="status"
            aria-label="Loading more images"
          />
        </div>
      )}

      {hasNextPage && <div ref={sentinelRef} className="h-2" aria-hidden="true" />}
    </div>
  );
}
