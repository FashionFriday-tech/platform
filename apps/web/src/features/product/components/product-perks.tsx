import { TruckIcon, RefreshCcwIcon, ShieldCheckIcon, CreditCardIcon } from "@ff/ui";

export default function ProductPerks() {
  const perks = [
    { icon: <TruckIcon size={18} />, title: "Express Delivery", desc: "Arrives in 2-3 days" },
    { icon: <RefreshCcwIcon size={18} />, title: "Easy Returns", desc: "7-day window" },
    { icon: <CreditCardIcon size={18} />, title: "COD Available", desc: "Cash on delivery" },
    { icon: <ShieldCheckIcon size={18} />, title: "Original Product", desc: "100% Authentic" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10">
      {perks.map((perk, i) => (
        <div key={i} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-[var(--surface-muted)] border border-[var(--border-default)]">
          <div className="text-[var(--brand-primary)] shrink-0">{perk.icon}</div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
              {perk.title}
            </h4>
            <p className="text-[10px] text-[var(--text-secondary)]">{perk.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}