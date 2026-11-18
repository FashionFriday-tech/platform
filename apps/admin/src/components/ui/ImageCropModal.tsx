'use client';

import { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, type Crop, makeAspectCrop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  file: File | string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  aspectRatioLabel?: string;
  title?: string;
}

export function ImageCropModal({
  file,
  onCropComplete,
  onCancel,
  aspectRatio,
  aspectRatioLabel,
  title = 'Crop & Frame Image',
}: ImageCropModalProps) {
  const defaultAspect = aspectRatio ?? 3 / 4;
  const [imgSrc, setImgSrc] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [selectedAspect, setSelectedAspect] = useState<number | undefined>(defaultAspect);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Set up image source from File or URL string
  useEffect(() => {
    if (typeof file === 'string') {
      setImgSrc(file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        setImgSrc(reader.result);
      }
    });
    reader.readAsDataURL(file);
  }, [file]);

  const applyCropWithAspect = (targetAspect: number | undefined, locked: boolean) => {
    const image = imgRef.current;
    if (!image) {
      return;
    }

    const { width, height } = image;
    let newCrop: Crop;

    if (locked && targetAspect) {
      newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          targetAspect,
          width,
          height,
        ),
        width,
        height,
      );
    } else {
      newCrop = {
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5,
      };
    }

    setCrop(newCrop);
    setCompletedCrop(newCrop);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    const initialCrop = isLocked && selectedAspect
      ? centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          selectedAspect,
          width,
          height,
        ),
        width,
        height,
      )
      : {
        unit: '%' as const,
        width: 90,
        height: 90,
        x: 5,
        y: 5,
      };

    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  };

  const handleSelectAspect = (ratio: number | undefined) => {
    if (ratio === undefined) {
      setIsLocked(false);
      setSelectedAspect(undefined);
      applyCropWithAspect(undefined, false);
    } else {
      setIsLocked(true);
      setSelectedAspect(ratio);
      applyCropWithAspect(ratio, true);
    }
  };

  const handleToggleLock = () => {
    const nextLocked = !isLocked;
    setIsLocked(nextLocked);

    if (nextLocked) {
      const ratio = selectedAspect ?? defaultAspect;
      setSelectedAspect(ratio);
      applyCropWithAspect(ratio, true);
    }
  };

  const handleResetCrop = () => {
    applyCropWithAspect(selectedAspect, isLocked);
  };

  const handleCropSave = () => {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      return;
    }

    // Use HTML5 Canvas to perform the crop in the client browser
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const targetWidth = Math.max(1, Math.round(completedCrop.width * scaleX));
    const targetHeight = Math.max(1, Math.round(completedCrop.height * scaleY));

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

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
      targetHeight,
    );

    // Convert canvas to Blob (webp format with 90% quality)
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      },
      'image/webp',
      0.9,
    );
  };

  const presets = [
    ...(aspectRatio
      ? [
        {
          label: aspectRatioLabel ?? `${Math.round(aspectRatio * 100) / 100}:1 Frame`,
          value: aspectRatio,
        },
      ]
      : [{ label: '3:4 Frame', value: 3 / 4 }]),
    { label: '8:5 (Catalogue)', value: 8 / 5 },
    { label: '16:9 (Landscape)', value: 16 / 9 },
    { label: '1:1 (Square)', value: 1 },
    { label: 'Freeform', value: undefined },
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111111]">
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
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">{title}</h3>
              <p className="text-xs text-black/60 dark:text-white/60">
                Adjust frame crop and lock aspect ratio to match exact storefront dimensions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <svg
              className="h-4 w-4 text-black/60 dark:text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Frame Locking & Aspect Ratio Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-black/[0.02] px-6 py-2.5 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {/* Lock/Unlock Toggle */}
            <button
              type="button"
              onClick={handleToggleLock}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${isLocked
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                }`}
            >
              {isLocked ? (
                <>
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Frame Locked</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                  <span>Freeform (Unlocked)</span>
                </>
              )}
            </button>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              {presets.map((preset) => {
                const isActive =
                  isLocked &&
                  preset.value !== undefined &&
                  Math.abs((selectedAspect ?? 0) - preset.value) < 0.01;
                const isFreeActive = !isLocked && preset.value === undefined;

                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      handleSelectAspect(preset.value);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${isActive || isFreeActive
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                      }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset / Center */}
          <button
            type="button"
            onClick={handleResetCrop}
            className="text-xs font-semibold text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            Reset Frame
          </button>
        </div>

        {/* Crop Area */}
        <div className="flex max-h-[60vh] min-h-[340px] items-center justify-center overflow-auto bg-black/5 p-6 dark:bg-white/5">
          {imgSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => {
                setCrop(c);
              }}
              onComplete={(c) => {
                setCompletedCrop(c);
              }}
              aspect={isLocked ? selectedAspect : undefined}
              className="max-h-full"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                crossOrigin="anonymous"
                style={{ maxHeight: '52vh', maxWidth: '100%', objectFit: 'contain' }}
              />
            </ReactCrop>
          ) : (
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 border-t border-black/5 bg-gray-50/50 px-6 py-4 dark:border-white/5 dark:bg-black/20">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-black/60 transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#111111] dark:text-white/60 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
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
