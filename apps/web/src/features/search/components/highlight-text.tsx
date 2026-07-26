'use client';

interface HighlightTextProps {
  text: string;
  highlight: string;
}

export const HighlightText = ({ text, highlight }: HighlightTextProps) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${highlight.trim()})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="text-brand font-bold underline underline-offset-4">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};
