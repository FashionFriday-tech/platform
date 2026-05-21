'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  file: File;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export function ImageCropModal({ file, onCropComplete, onCancel }: ImageCropModalProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Set up image source from file
  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(file);
  }, [file]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Create initial 3:4 aspect crop centered in the image
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        3 / 4,
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  };

  const handleCropSave = async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) return;

    // Use HTML5 Canvas to perform the crop in the client browser
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Set 3:4 output resolution (e.g. 1200x1600 or relative to cropped area)
    const targetWidth = Math.round(completedCrop.width * scaleX);
    const targetHeight = Math.round(completedCrop.height * scaleY);
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Convert canvas to Blob (webp format with 85% quality to save space)
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      },
      'image/webp',
      0.85
    );
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-xl flex-col rounded-3xl border border-black/5 bg-white shadow-2xl overflow-hidden dark:border-white/5 dark:bg-[#111111]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white">Crop Image (3:4 Ratio)</h3>
          </div>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors dark:bg-white/5 dark:hover:bg-white/10"
          >
            <svg className="h-4 w-4 text-black/60 dark:text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crop Area */}
        <div className="flex max-h-[60vh] min-h-[300px] items-center justify-center overflow-auto bg-black/5 p-6 dark:bg-white/5">
          {imgSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={3 / 4}
              className="max-h-full"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: '50vh', objectFit: 'contain' }}
              />
            </ReactCrop>
          ) : (
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 border-t border-black/5 bg-gray-50/50 px-6 py-4 dark:border-white/5 dark:bg-black/20">
          <button
            onClick={onCancel}
            className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-black/60 transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#111111] dark:text-white/60 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleCropSave}
            className="rounded-full bg-black px-6 py-2 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            Apply & Crop
          </button>
        </div>
      </div>
    </div>
  );
}
