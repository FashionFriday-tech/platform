import React from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  prefix?: string;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  required?: boolean;
}

export const FormInput = ({
  label,
  value,
  onChange,
  prefix,
  placeholder,
  inputRef,
  required,
}: FormInputProps) => (
  <div className="w-full space-y-1">
    <label className="text-foreground-subtle ml-1 flex justify-between text-[9px] font-black tracking-widest uppercase">
      {label}
      {required && <span className="text-brand text-[8px] opacity-60">Required</span>}
    </label>
    <div className="relative">
      {prefix && (
        <span className="text-foreground-subtle absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold">
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        className={`bg-background border-border focus:border-brand placeholder:text-foreground-subtle/50 w-full rounded-xl border py-2.5 text-xs font-bold transition-all outline-none ${
          prefix ? 'pl-10' : 'px-3'
        } ${required && !value ? 'border-dashed' : ''}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  </div>
);
