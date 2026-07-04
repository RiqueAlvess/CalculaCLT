"use client";

import { useState } from "react";

export default function ShareButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = getText();

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text, title: "CalculaCLT" });
        return;
      } catch {
        // user cancelled share or share failed — fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-money-500 hover:text-money-700 sm:w-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 10.632a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
        />
      </svg>
      {copied ? "Copiado!" : "Compartilhar resultado"}
    </button>
  );
}
