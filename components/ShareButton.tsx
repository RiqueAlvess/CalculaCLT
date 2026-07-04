"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

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
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-accent-500 hover:text-accent-700 sm:w-auto"
    >
      <Share2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      {copied ? "Copiado!" : "Compartilhar resultado"}
    </button>
  );
}
