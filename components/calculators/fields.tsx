"use client";

import { useState, type ReactNode } from "react";

function formatFromDigits(digits: string): string {
  const num = parseInt(digits || "0", 10);
  const cents = num / 100;
  return cents.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface MoneyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
}

export function MoneyInput({ id, label, value, onChange, helperText }: MoneyInputProps) {
  const [digits, setDigits] = useState(() => Math.round(value * 100).toString());

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    const capped = raw.slice(0, 12);
    setDigits(capped);
    onChange(parseInt(capped || "0", 10) / 100);
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
          R$
        </span>
        <input
          id={id}
          name={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={formatFromDigits(digits)}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
        />
      </div>
      {helperText && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  max?: string;
  min?: string;
}

export function DateInput({ id, label, value, onChange, max, min }: DateInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="date"
        inputMode="numeric"
        value={value}
        max={max}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base font-semibold text-slate-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
      />
    </div>
  );
}

interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface RadioCardGroupProps<T extends string> {
  label: string;
  name: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
}

export function RadioCardGroup<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
}: RadioCardGroupProps<T>) {
  return (
    <div>
      <p className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col rounded-lg border px-4 py-3.5 text-sm transition ${
                checked
                  ? "border-accent-500 bg-accent-50 ring-2 ring-accent-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className={`font-semibold ${checked ? "text-accent-700" : "text-slate-800"}`}>
                {option.label}
              </span>
              {option.description && (
                <span className="mt-0.5 text-xs text-slate-500">{option.description}</span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

interface ToggleYesNoProps {
  label: string;
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleYesNo({ label, name, value, onChange }: ToggleYesNoProps) {
  return (
    <div>
      <p className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { v: false, text: "Não" },
          { v: true, text: "Sim" },
        ].map((opt) => {
          const checked = value === opt.v;
          return (
            <label
              key={opt.text}
              className={`flex cursor-pointer items-center justify-center rounded-lg border px-4 py-3.5 text-sm font-semibold transition ${
                checked
                  ? "border-accent-500 bg-accent-50 text-accent-700 ring-2 ring-accent-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name={name}
                checked={checked}
                onChange={() => onChange(opt.v)}
                className="sr-only"
              />
              {opt.text}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function SubmitCta({ formId, label }: { formId: string; label: string }) {
  return (
    <>
      <button
        type="submit"
        form={formId}
        className="hidden w-full rounded-lg bg-accent-600 py-4 text-base font-semibold text-white transition hover:bg-accent-700 active:scale-[0.99] sm:block"
      >
        {label}
      </button>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md sm:hidden">
        <button
          type="submit"
          form={formId}
          className="w-full rounded-lg bg-accent-600 py-3.5 text-base font-semibold text-white transition active:scale-[0.99]"
        >
          {label}
        </button>
      </div>
    </>
  );
}

export function ResultRow({
  icon,
  label,
  value,
  hint,
  emphasis = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-slate-700">{label}</p>
          {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
      </div>
      <p className={`shrink-0 text-right text-sm font-bold ${emphasis ? "text-accent-700" : "text-slate-800"}`}>
        {value}
      </p>
    </div>
  );
}
