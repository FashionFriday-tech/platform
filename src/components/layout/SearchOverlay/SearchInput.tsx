import React, { useState, useEffect } from "react";

const FASHION_KEYWORDS = [
  "Search by brands",
  "Search by model's name",
  "Search by category",
];

export const SearchInput = ({ query, setQuery, onSave }: any) => {
  const [index, setIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = FASHION_KEYWORDS[index];
    const timeout = setTimeout(() => {
      setPlaceholder(isDeleting 
        ? fullText.substring(0, placeholder.length - 1) 
        : fullText.substring(0, placeholder.length + 1)
      );

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % FASHION_KEYWORDS.length);
      }
    }, isDeleting ? 20 : 50);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, index]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && query.trim() && (onSave(query), setQuery(""))}
      placeholder={placeholder}
      className="w-full text-2xl md:text-4xl italic tracking-tighter font-black uppercase bg-transparent py-6 border-b-4 border-white/10 outline-none transition-all placeholder:text-white/20"
      autoFocus
    />
  );
};