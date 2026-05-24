import React, { useEffect, useState } from 'react';

const FASHION_KEYWORDS = [
  'Search by brands...',
  "Search by model's name...",
  'Search by category...',
  'Search sneakers, apparel, watches...',
];

interface SearchInputProps {
  query: string;
  setQuery: (val: string) => void;
  onSave: (val: string) => void;
}

export const SearchInput = ({ query, setQuery, onSave }: SearchInputProps) => {
  const [index, setIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter animation effect
  useEffect(() => {
    const fullText = FASHION_KEYWORDS[index] ?? '';
    let speed = isDeleting ? 30 : 80;

    if (!isDeleting && placeholder === fullText) {
      speed = 1800; // Hold full phrase
    } else if (isDeleting && placeholder === '') {
      speed = 300; // Pause before next phrase
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && placeholder === fullText) {
        setIsDeleting(true);
      } else if (isDeleting && placeholder === '') {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % FASHION_KEYWORDS.length);
      } else {
        setPlaceholder(
          isDeleting
            ? fullText.substring(0, placeholder.length - 1)
            : fullText.substring(0, placeholder.length + 1),
        );
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, index]);

  const displayPlaceholder = query ? '' : `${placeholder}${showCursor ? '│' : ' '}`;

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && query.trim()) {
          onSave(query);
          setQuery('');
        }
      }}
      placeholder={displayPlaceholder}
      className="w-full border-b-2 border-foreground/30 focus:border-foreground bg-transparent py-4 sm:py-6 text-xl sm:text-2xl md:text-4xl font-black tracking-tighter uppercase italic transition-all outline-none placeholder:text-foreground/40 text-foreground"
      autoFocus
    />
  );
};
