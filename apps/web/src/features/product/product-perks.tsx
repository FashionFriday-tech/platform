import { CreditCardIcon, RefreshCcwIcon, ShieldCheckIcon, TruckIcon } from '@ff/ui';

export default function ProductPerks() {
  const perks = [
    { icon: <TruckIcon size={18} />, title: 'Express Delivery', desc: 'Arrives in 2-3 days' },
    { icon: <RefreshCcwIcon size={18} />, title: 'Easy Returns', desc: '7-day window' },
    { icon: <CreditCardIcon size={18} />, title: 'COD Available', desc: 'Cash on delivery' },
    { icon: <ShieldCheckIcon size={18} />, title: 'Original Product', desc: '100% Authentic' },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {perks.map((perk, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-[1.5rem] border border-[var(--border-default)] bg-[var(--surface-muted)] p-5"
        >
          <div className="shrink-0 text-[var(--brand-primary)]">{perk.icon}</div>
          <div>
            <h4 className="mb-1 text-[10px] leading-none font-black tracking-widest uppercase">
              {perk.title}
            </h4>
            <p className="text-[10px] text-[var(--text-secondary)]">{perk.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
