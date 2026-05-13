import React from 'react';
import Image from 'next/image';

interface Props {
  images: any[];
  draggedIndex: number | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
  handleReorder: (oldIndex: number, newIndex: number) => void;
  removeImage: (id: string) => void;
}

export function ProductMediaUploadGrid({
  images,
  draggedIndex,
  fileInputRef,
  handleImageUpload,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleReorder,
  removeImage,
}: Props) {
  return (
    <>
      {/* Main Image Preview */}
      <div
        draggable
        onDragStart={(e) => {
          handleDragStart(e, 0);
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => {
          handleDrop(e, 0);
        }}
        onDragEnd={handleDragEnd}
        className={`group relative mb-4 aspect-[3/4] w-full cursor-move overflow-hidden rounded-2xl border border-black/5 bg-black/5 transition-all dark:border-white/5 dark:bg-white/5 ${draggedIndex === 0 ? 'scale-95 border-black/20 opacity-50 dark:border-white/20' : ''}`}
      >
        <Image
          width={500}
          height={500}
          src={images[0].url}
          alt="Main product"
          className="pointer-events-none h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute top-3 left-3 rounded-lg border border-black/5 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-black/90">
          <span className="text-xs font-bold text-black dark:text-white">Main Image</span>
        </div>
        <button
          onClick={() => {
            removeImage(images[0].id);
          }}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white text-red-500 opacity-0 shadow-sm transition-transform group-hover:opacity-100 hover:scale-110 dark:border-white/5 dark:bg-black"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Grid Previews */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {images.slice(1).map((img, index) => {
          const actualIndex = index + 1; // 1-based index in the array for the dropdown (0 is main)
          return (
            <div
              key={img.id}
              draggable
              onDragStart={(e) => {
                handleDragStart(e, actualIndex);
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                handleDrop(e, actualIndex);
              }}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-[3/4] cursor-move overflow-hidden rounded-xl border border-black/5 bg-black/5 transition-all dark:border-white/5 dark:bg-white/5 ${draggedIndex === actualIndex ? 'scale-95 border-black/20 opacity-50 dark:border-white/20' : ''}`}
            >
              <Image
                width={500}
                height={500}
                src={img.url}
                alt={`Preview ${actualIndex}`}
                className="pointer-events-none h-full w-full object-cover"
              />

              {/* Position Number Overlay */}
              <div className="pointer-events-auto absolute top-1.5 left-1.5 flex items-center overflow-hidden rounded-md bg-black/60 shadow-sm backdrop-blur-md">
                <select
                  value={actualIndex}
                  onChange={(e) => {
                    handleReorder(actualIndex, parseInt(e.target.value));
                  }}
                  className="cursor-pointer appearance-none bg-transparent px-1.5 py-0.5 text-center text-[10px] font-bold text-white outline-none"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                >
                  {images.map((_, i) => (
                    <option
                      key={i}
                      value={i}
                      className="bg-white text-black dark:bg-[#1a1a1a] dark:text-white"
                    >
                      {i === 0 ? 'Main' : i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remove button */}
              <button
                onClick={() => {
                  removeImage(img.id);
                }}
                className="absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-black/5 bg-white text-red-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-white/5 dark:bg-black"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          );
        })}

        {/* Add More Button */}
        {images.length < 10 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/20 transition-colors hover:border-black/40 hover:bg-black/5 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5"
          >
            <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-black/60 transition-transform group-hover:scale-110 dark:bg-white/10 dark:text-white/80">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-black/50 dark:text-white/50">Add</span>
          </div>
        )}
      </div>
    </>
  );
}
