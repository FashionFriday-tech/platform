import React, { useState } from 'react';
import Image from 'next/image';

import { LabelWithTick } from './LabelWithTick';

interface Props {
  videoLink: string;
  setVideoLink: (val: string) => void;
  videoId: string | null;
  embedUrl: string | null;
}

export function ProductMediaEmbedVideo({ videoLink, setVideoLink, videoId, embedUrl }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="border-t border-black/5 pt-4 dark:border-white/5">
      <LabelWithTick
        label="Embed Video"
        status={videoLink.trim().length >= 10 ? 'valid' : 'empty'}
      />

      {/* Embed Preview */}
      {videoId && (
        <div className="group relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/5 bg-black/5 shadow-sm dark:border-white/5 dark:bg-white/5">
          {!isPlaying ? (
            <div
              className="relative h-full w-full cursor-pointer"
              onClick={() => {
                setIsPlaying(true);
              }}
            >
              <Image
                width={500}
                height={500}
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt="Video Thumbnail"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                  <svg className="ml-1 h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              className="absolute top-1/2 left-0 aspect-[9/16] w-full -translate-y-1/2"
              src={embedUrl ?? ''}
              title="YouTube Shorts player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      )}

      <div className="relative flex w-full items-center">
        <div className="absolute left-3">
          <svg
            className="h-4 w-4 text-black/40 dark:text-white/40"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
          </svg>
        </div>
        <input
          type="text"
          value={videoLink}
          onChange={(e) => {
            setVideoLink(e.target.value);
            setIsPlaying(false);
          }}
          placeholder="Paste YouTube URL"
          className="w-full rounded-xl border border-transparent bg-black/5 py-3 pr-4 pl-9 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
        />
      </div>
    </div>
  );
}
