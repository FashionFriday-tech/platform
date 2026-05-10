import React from 'react';
import { ProductMediaUploadGrid } from './ProductMediaUploadGrid';
import { ProductMediaEmbedVideo } from './ProductMediaEmbedVideo';

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
  videoLink: string;
  setVideoLink: (val: string) => void;
  videoId: string | null;
  embedUrl: string | null;
}

export function ProductMediaUpload({
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
  videoLink,
  setVideoLink,
  videoId,
  embedUrl
}: Props) {
  return (
    <div className="rounded-[2rem] bg-white p-7 shadow-sm dark:bg-[#111]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black dark:text-white">Upload Media</h2>
        <span className="text-xs font-bold text-black/50 dark:text-white/50">
          {images.length}/10 Images
        </span>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative mb-4 flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/20 bg-black/5 transition-colors hover:border-black/40 hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:hover:border-white/40 dark:hover:bg-white/10"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 dark:bg-black">
            <svg
              className="h-5 w-5 text-black dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-black/80 dark:text-white/80">
            Click to upload images
          </span>
          <span className="mt-1 text-xs font-medium text-black/40 dark:text-white/40">
            Up to 10 images
          </span>
        </div>
      ) : (
        <ProductMediaUploadGrid
          images={images}
          draggedIndex={draggedIndex}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          handleReorder={handleReorder}
          removeImage={removeImage}
        />
      )}

      <ProductMediaEmbedVideo
        videoLink={videoLink}
        setVideoLink={setVideoLink}
        videoId={videoId}
        embedUrl={embedUrl}
      />
    </div>
  );
}
