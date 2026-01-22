export const SuggestionTag = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    brand: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    category: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    collection: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    trend: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    keyword: "bg-white/5 text-white/30 border-white/10",
  };
  return (
    <span
      className={`text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${styles[type]}`}
    >
      {type}
    </span>
  );
};
