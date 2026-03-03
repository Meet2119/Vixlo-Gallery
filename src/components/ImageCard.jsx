import { memo } from "react";

const ImageCard = memo(function ImageCard({ image, onOpenModal }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenModal(image)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenModal(image);
        }
      }}
      className="relative group overflow-hidden rounded-xl bg-gray-100 shadow-sm text-left w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      <img
        src={image.src.large}
        alt={image.alt || "Gallery image"}
        loading="lazy"
        width={image.width}
        height={image.height}
        decoding="async"
        className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-medium text-white truncate">
          {image.photographer}
        </p>
      </div>
    </div>
  );
});

export default ImageCard;
