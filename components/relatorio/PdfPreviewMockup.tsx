import { FileText, CheckCircle2 } from "lucide-react";

export default function PdfPreviewMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
      <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-accent-100/60 blur-2xl" aria-hidden="true" />
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card-hover">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600 text-[10px] font-bold text-white">
              CLT
            </span>
            <span className="text-xs font-semibold text-slate-700">Relatório CalculaCLT</span>
          </div>
          <FileText className="h-4 w-4 text-slate-300" strokeWidth={1.75} aria-hidden="true" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-slate-100" />
          <div className="h-2 w-1/2 rounded-full bg-slate-100" />
        </div>

        <div className="mt-5 rounded-xl bg-accent-50 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-accent-700">
            Total estimado
          </p>
          <div className="mt-1.5 h-4 w-2/3 rounded-full bg-accent-200" />
        </div>

        <div className="mt-5 space-y-2.5">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="flex items-center justify-between gap-3">
              <div className="h-2 w-1/2 rounded-full bg-slate-100" />
              <div className="h-2 w-12 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-[10px] text-slate-400">
          <CheckCircle2 className="h-3 w-3 text-accent-600" strokeWidth={2} aria-hidden="true" />
          Documento pronto para impressão e envio por e-mail
        </div>
      </div>
    </div>
  );
}
