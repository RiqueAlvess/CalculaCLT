"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Loader2, Mail, Send } from "lucide-react";
import { lerRelatorioPendente } from "@/lib/relatorio/session";
import type { RelatorioPayload } from "@/lib/relatorio/types";

type Status = "generating" | "ready" | "not_found" | "error";
type EmailStatus = "idle" | "sending" | "sent" | "error";

export default function ObrigadoClient() {
  const [status, setStatus] = useState<Status>("generating");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const payloadRef = useRef<RelatorioPayload | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const payload = lerRelatorioPendente();
    payloadRef.current = payload;

    if (!payload) {
      setStatus("not_found");
      return;
    }

    let cancelled = false;

    async function gerar() {
      try {
        const { gerarRelatorioPdfBlob } = await import("@/lib/pdf/renderClient");
        const blob = await gerarRelatorioPdfBlob(payload!);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setBlobUrl(url);
        setStatus("ready");
      } catch (err) {
        console.error("erro ao gerar relatório no navegador", err);
        if (!cancelled) setStatus("error");
      }
    }

    gerar();

    return () => {
      cancelled = true;
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  async function handleEnviarEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!payloadRef.current || !email.includes("@")) return;
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, payload: payloadRef.current }),
      });
      if (!res.ok) throw new Error("falha ao enviar");
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center sm:px-8">
      {status === "generating" && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-accent-600" strokeWidth={1.5} aria-hidden="true" />
          <h1 className="mt-5 text-2xl font-bold text-slate-900">Gerando seu relatório...</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Isso leva só um instante — o PDF é montado aqui mesmo no seu navegador.
          </p>
        </>
      )}

      {status === "ready" && blobUrl && (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-700">
            <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">Seu relatório está pronto!</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Baixe agora ou receba uma cópia por e-mail.
          </p>
          <a
            href={blobUrl}
            download="relatorio-calculaclt.pdf"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-accent-700"
          >
            <Download className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Baixar relatório em PDF
          </a>

          <form onSubmit={handleEnviarEmail} className="mt-8 w-full max-w-sm">
            <label htmlFor="email" className="mb-1.5 block text-left text-sm font-semibold text-slate-700">
              Quer receber uma cópia por e-mail?
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
              />
              <button
                type="submit"
                disabled={emailStatus === "sending" || emailStatus === "sent"}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            {emailStatus === "sent" && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-accent-700">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                Enviado! Verifique também a caixa de spam.
              </p>
            )}
            {emailStatus === "error" && (
              <p className="mt-2 text-xs text-red-600">Não foi possível enviar agora. Tente novamente.</p>
            )}
          </form>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-slate-900">Algo deu errado ao gerar o PDF</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Tente atualizar esta página. Se o problema continuar, volte para a calculadora e gere
            o resultado novamente antes de comprar.
          </p>
        </>
      )}

      {status === "not_found" && (
        <>
          <h1 className="text-2xl font-bold text-slate-900">Não encontramos os dados do seu cálculo</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Isso acontece se esta página foi aberta em outra aba ou navegador. Volte para uma
            calculadora, gere seu resultado e clique em &quot;Gerar relatório em PDF&quot; novamente.
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
