"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, Loader2, Mail } from "lucide-react";
import { lerUltimoPedidoId } from "@/lib/relatorio/session";

type Status = "checking" | "pending" | "paid" | "not_found" | "timeout";

const MAX_ATTEMPTS = 20;
const POLL_INTERVAL_MS = 3000;

function ObrigadoContent() {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const fromQuery = searchParams.get("order") || searchParams.get("id") || searchParams.get("s1");
    const resolved = fromQuery || lerUltimoPedidoId();
    setId(resolved);
    if (!resolved) setStatus("not_found");
  }, [searchParams]);

  useEffect(() => {
    if (!id) return;
    let attempts = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch(`/api/relatorio/${id}/status`);
        const data = (await res.json()) as { status: Status | "not_found" };
        if (cancelled) return;

        if (data.status === "paid") {
          setStatus("paid");
          return;
        }
        if (data.status === "not_found") {
          setStatus("not_found");
          return;
        }
        setStatus("pending");
        if (attempts < MAX_ATTEMPTS) {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setStatus("timeout");
        }
      } catch {
        if (!cancelled && attempts < MAX_ATTEMPTS) {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center sm:px-8">
      {(status === "checking" || status === "pending") && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-accent-600" strokeWidth={1.5} aria-hidden="true" />
          <h1 className="mt-5 text-2xl font-bold text-slate-900">Confirmando seu pagamento...</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Isso costuma levar só alguns segundos no Pix ou cartão. Se você pagou por boleto, a
            confirmação pode levar até 2 dias úteis — não se preocupe, enviaremos o relatório por
            e-mail assim que for aprovado.
          </p>
        </>
      )}

      {status === "paid" && id && (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-700">
            <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">Seu relatório está pronto!</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Também enviamos uma cópia em PDF para o seu e-mail.
          </p>
          <a
            href={`/api/relatorio/${id}`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-accent-700"
          >
            <Download className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Baixar relatório em PDF
          </a>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Mail className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Verifique também a caixa de spam, caso não encontre o e-mail.
          </p>
        </>
      )}

      {status === "timeout" && (
        <>
          <h1 className="text-2xl font-bold text-slate-900">Ainda estamos processando</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Seu pagamento pode ainda estar sendo confirmado. Assim que aprovado, o relatório é
            enviado automaticamente para o seu e-mail. Atualize esta página em alguns instantes.
          </p>
        </>
      )}

      {status === "not_found" && (
        <>
          <h1 className="text-2xl font-bold text-slate-900">Não encontramos seu pedido</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Se você já concluiu o pagamento, o relatório também foi enviado para o seu e-mail.
            Caso contrário, volte para uma calculadora, gere seu resultado e tente novamente.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Voltar para a página inicial
          </Link>
        </>
      )}
    </section>
  );
}

export default function ObrigadoClient() {
  return (
    <Suspense fallback={null}>
      <ObrigadoContent />
    </Suspense>
  );
}
