import Link from "next/link";
import { quickLinks } from "@/data/profile";

export default function QuickLinksGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 mt-8">
      {quickLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.label}
            href={link.href}
            className="group flex sm:flex-col items-center gap-6 text-center p-4 bg-white sm:p-8 sm:rounded-4xl sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 transition-all duration-500 hover:scale-95 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-zinc-200"
          >
            <div className="bg-transparent sm:bg-zinc-50 p-4 rounded-full text-zinc-900 sm:mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300 sm:shadow-sm">
              <Icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">{link.label}</h3>
            <p className="hidden sm:block text-zinc-500 text-sm leading-relaxed">{link.description}</p>
          </Link>
        );
      })}
    </div>
  );
}