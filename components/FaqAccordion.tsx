"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/schema";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-card">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-slate-800 sm:text-base"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-accent-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
