"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { salvarRelatorioPendente } from "@/lib/relatorio/session";
import type { RelatorioPayload } from "@/lib/relatorio/types";

export default function ReportUpsell({ payload }: { payload: RelatorioPayload }) {
  return (
    <div className="rounded-2xl border border-accent-100 bg-accent-50/60 p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-accent-700 shadow-sm">
          <FileText className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-slate-900">Leve esse resultado para o RH ou seu advogado</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Gere um relatório em PDF com o detalhamento completo do seu cálculo, pronto para
            imprimir ou enviar por e-mail.
          </p>
        </div>
      </div>
      <Link
        href="/relatorio-completo"
        onClick={() => salvarRelatorioPendente(payload)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto sm:px-6"
      >
        Gerar relatório em PDF
        <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </Link>
    </div>
  );
}
