import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../constants/categories";
import ImageList from "../components/ImageList";
import ImageModal from "../components/ImageModal";
import SearchBar from "../components/SearchBar";
import ShowMessage from "../components/ShowMessage";

const API_KEY = "12wjSzdq1KWhBCq4djVwBRVl6Ly53hh3DJtL4zmarODdcjR9vkVvGqwM";
const PER_PAGE = 15;

async function fetchImages({ pageParam = 1, queryKey, signal }) {
  const [, activeQuery] = queryKey;
  const isSearch = activeQuery.trim().length > 0;
  const endpoint = isSearch
    ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        activeQuery,
      )}&page=${pageParam}&per_page=${PER_PAGE}`
    : `https://api.pexels.com/v1/curated?page=${pageParam}&per_page=${PER_PAGE}`;

  const res = await fetch(endpoint, {
    headers: { Authorization: API_KEY },
    signal,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  const data = await res.json();
  const photos = data.photos ?? [];

  return {
    photos,
    nextPage: photos.length === PER_PAGE ? pageParam + 1 : undefined,
  };
}

function createDownloadName(image) {
  const base =
    (image.alt || `photo-${image.id}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `photo-${image.id}`;
  return `${base}.jpg`;
}

export default function ExplorePage() {
  const sentinelRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";

  const [searchInput, setSearchInput] = useState(categoryFromUrl);
  const [activeQuery, setActiveQuery] = useState(categoryFromUrl);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setSearchInput(categoryFromUrl);
    setActiveQuery(categoryFromUrl);
    setSelectedImageId(null);
    setPendingAdvance(false);
  }, [categoryFromUrl]);

  const {
    data,
    error,
    isError,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["images", activeQuery],
    initialPageParam: 1,
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    retry: 1,
    staleTime: 60_000,
  });

  console.log(data);
  console.log(isPending);
  console.log(isError);
  console.log(error);
  console.log(hasNextPage);
  console.log(isFetchingNextPage);
  const images = useMemo(() => {
    const seen = new Set();
    const merged = [];

    for (const page of data?.pages ?? []) {
      for (const photo of page.photos) {
        if (!seen.has(photo.id)) {
          seen.add(photo.id);
          merged.push(photo);
        }
      }
    }

    return merged;
  }, [data]);

  const selectedImageIndex = useMemo(() => {
    if (selectedImageId === null) return -1;
    return images.findIndex((image) => image.id === selectedImageId);
  }, [images, selectedImageId]);

  const selectedImage =
    selectedImageIndex >= 0 ? images[selectedImageIndex] : null;
  const hasPrevImage = selectedImageIndex > 0;
  const hasNextImage =
    selectedImageIndex >= 0 && selectedImageIndex < images.length - 1;
  const canGoNext = hasNextImage || Boolean(hasNextPage);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchInput.trim();
    setSearchParams(query ? { category: query } : {});
  };

  const handleCategorySelect = (value) => {
    setSearchParams(value ? { category: value } : {});
  };

  const handleOpenModal = (image) => {
    setSelectedImageId(image.id);
  };

  const handleCloseModal = () => {
    setSelectedImageId(null);
    setPendingAdvance(false);
  };

  const handlePrevImage = () => {
    if (!hasPrevImage) return;
    setSelectedImageId(images[selectedImageIndex - 1].id);
  };

  const handleNextImage = async () => {
    if (!selectedImage) return;

    if (hasNextImage) {
      setSelectedImageId(images[selectedImageIndex + 1].id);
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      setPendingAdvance(true);
      await fetchNextPage();
    }
  };

  const handleDownloadImage = async () => {
    if (!selectedImage) return;

    const downloadUrl =
      selectedImage.src.original ||
      selectedImage.src.large2x ||
      selectedImage.src.large;

    setIsDownloading(true);

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = createDownloadName(selectedImage);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (!hasNextPage) return;
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "1000px 0px",
      },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!pendingAdvance) return;
    if (hasNextImage) {
      setSelectedImageId(images[selectedImageIndex + 1].id);
      setPendingAdvance(false);
      return;
    }
    if (!isFetchingNextPage) {
      setPendingAdvance(false);
    }
  }, [
    pendingAdvance,
    hasNextImage,
    images,
    selectedImageIndex,
    isFetchingNextPage,
  ]);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setSelectedImageId(null);
        setPendingAdvance(false);
        return;
      }
      if (event.key === "ArrowLeft" && hasPrevImage) {
        setSelectedImageId(images[selectedImageIndex - 1].id);
        return;
      }
      if (event.key === "ArrowRight") {
        if (hasNextImage) {
          setSelectedImageId(images[selectedImageIndex + 1].id);
          return;
        }
        if (hasNextPage && !isFetchingNextPage) {
          setPendingAdvance(true);
          void fetchNextPage();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [
    selectedImage,
    hasPrevImage,
    hasNextImage,
    selectedImageIndex,
    images,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <>
      <SearchBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        categories={CATEGORIES}
        activeCategory={activeQuery}
        onCategorySelect={handleCategorySelect}
      />

      <main>
        {isError && <ShowMessage>{error.message}</ShowMessage>}

        {!isError && isPending && (
          <div
            className="flex items-center justify-center py-10"
            aria-live="polite"
          >
            <div
              className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"
              role="status"
              aria-label="Loading images"
            />
          </div>
        )}

        {!isError && (
          <ImageList
            images={images}
            loading={isFetchingNextPage}
            hasNextPage={Boolean(hasNextPage)}
            sentinelRef={sentinelRef}
            onOpenModal={handleOpenModal}
          />
        )}
      </main>

      <ImageModal
        image={selectedImage}
        onClose={handleCloseModal}
        hasPrev={hasPrevImage}
        canGoNext={canGoNext}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        onDownload={handleDownloadImage}
        isDownloading={isDownloading}
        isLoadingNext={pendingAdvance || (!hasNextImage && isFetchingNextPage)}
        currentIndex={selectedImageIndex + 1}
        totalCount={images.length}
      />
    </>
  );
}
