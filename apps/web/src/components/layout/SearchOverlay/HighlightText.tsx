export const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span className="text-foreground/20">{text}</span>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span
            key={i}
            className="text-foreground font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            {part}
          </span>
        ) : (
          <span key={i} className="text-foreground/10">
            {part}
          </span>
        ),
      )}
    </span>
  );
};
