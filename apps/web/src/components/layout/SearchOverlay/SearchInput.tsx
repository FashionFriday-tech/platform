import React, { useEffect, useState } from 'react';

const FASHION_KEYWORDS = ['Search by brands', "Search by model's name", 'Search by category'];

// Defined Interface to replace 'any'
interface SearchInputProps {
  query: string;
  setQuery: (val: string) => void;
  onSave: (val: string) => void;
}

export const SearchInput = ({ query, setQuery, onSave }: SearchInputProps) => {
  const [index, setIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = FASHION_KEYWORDS[index] ?? ''; // Added null-coalescing safety
    const timeout = setTimeout(
      () => {
        setPlaceholder(
          isDeleting
            ? fullText.substring(0, placeholder.length - 1)
            : fullText.substring(0, placeholder.length + 1),
        );

        if (!isDeleting && placeholder === fullText) {
          setTimeout(() => setIsDeleting(true), 1000);
        } else if (isDeleting && placeholder === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % FASHION_KEYWORDS.length);
        }
      },
      isDeleting ? 20 : 50,
    );

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, index]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        // Cleaned up logic to satisfy "no-unsafe-call" and "no-unsafe-return"
        if (e.key === 'Enter' && query.trim()) {
          onSave(query);
          setQuery('');
        }
      }}
      placeholder={placeholder}
      className="w-full border-b-4 border-white/10 bg-transparent py-6 text-2xl font-black uppercase italic tracking-tighter outline-none transition-all placeholder:text-white/20 md:text-4xl"
      autoFocus
    />
  );
};
