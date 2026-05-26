import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const FASHION_KEYWORDS = [
  'Search by brands',
  "Search by model's name",
  'Search by category',
  'Search sneakers, apparel, watches',
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
    }, 550);
    return () => clearInterval(cursorInterval);
  }, []);

  // Smoother, slightly slower typewriter animation effect
  useEffect(() => {
    const fullText = FASHION_KEYWORDS[index] ?? '';
    let speed = isDeleting ? 35 : 75; // Slower, smoother character typing and deleting

    if (!isDeleting && placeholder === fullText) {
      speed = 2200; // Comfortable pause to read full phrase
    } else if (isDeleting && placeholder === '') {
      speed = 400; // Smooth pause before starting next phrase
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
      className="w-full"
    >
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
        className="w-full border-b-2 border-foreground/30 focus:border-foreground bg-transparent py-4 sm:py-6 text-xl sm:text-2xl md:text-4xl font-black tracking-tighter uppercase italic transition-all duration-300 outline-none placeholder:text-foreground/40 text-foreground"
        autoFocus
      />
    </motion.div>
  );
};

