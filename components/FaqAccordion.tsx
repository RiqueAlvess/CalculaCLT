"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/schema";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-card">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-800 sm:text-base"
            >
              <span>{item.question}</span>
              <span
                className={`shrink-0 text-brand-600 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
