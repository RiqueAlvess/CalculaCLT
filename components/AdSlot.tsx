/**
 * Reserved ad space. AdSense is not wired up yet.
 *
 * When the AdSense account is approved, replace the contents of this
 * component with the actual <ins className="adsbygoogle" ...> tag and
 * load the AdSense script (`pagead2.googlesyndication.com`) once in
 * app/layout.tsx via next/script with strategy="afterInteractive".
 */
export default function AdSlot({ label = "Publicidade" }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex min-h-[100px] w-full max-w-5xl items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-xs text-slate-300"
    >
      {/* AdSense slot placeholder — cole aqui o <ins class="adsbygoogle"> após aprovação */}
      {label}
    </div>
  );
}
