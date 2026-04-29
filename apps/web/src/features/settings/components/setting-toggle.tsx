import React from 'react';

import { motion } from 'motion/react';

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function SettingToggle({ icon, label, active, onToggle }: SettingToggleProps) {
  return (
    <div className="flex cursor-pointer items-center justify-between p-6" onClick={onToggle}>
      <div className="flex items-center gap-4 text-left">
        <div className="bg-foreground text-background rounded-2xl p-3 transition-all">{icon}</div>
        <span className="text-sm font-black tracking-tight uppercase italic">{label}</span>
      </div>
      <div
        className={`flex h-7 w-12 items-center rounded-full px-1.5 transition-all ${
          active ? 'bg-foreground' : 'bg-foreground/10'
        }`}
      >
        <motion.div
          animate={{ x: active ? 20 : 0 }}
          className="bg-background h-4 w-4 rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}
