import { NextResponse } from "next/server";
import { gerarRelatorioPdfBuffer } from "@/lib/pdf/render";
import { enviarRelatorioPorEmail } from "@/lib/resend";
import type { RelatorioPayload } from "@/lib/relatorio/types";

export const runtime = "nodejs";

/**
 * Envia uma cópia do relatório por e-mail. Não há persistência nem
 * verificação de pagamento aqui — o payload vem direto do sessionStorage
 * do navegador (a mesma aba que acabou de voltar da Kiwify). Isso mantém a
 * arquitetura sem banco de dados, mas significa que este endpoint não tem
 * proteção contra abuso além da validação de formato abaixo. Se isso virar
 * um problema (spam usando a conta do Resend), a forma mais simples de
 * mitigar é adicionar um rate limit por IP (ex.: Vercel Firewall/Upstash).
 */
function isValidPayload(body: unknown): body is RelatorioPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (b.tipo !== "fgts" && b.tipo !== "ferias") return false;
  if (!b.input || typeof b.input !== "object") return false;
  if (!b.resultado || typeof b.resultado !== "object") return false;
  const resultado = b.resultado as Record<string, unknown>;
  return typeof resultado.totalEstimado === "number" && Number.isFinite(resultado.totalEstimado);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { email, payload } = (body ?? {}) as { email?: unknown; payload?: unknown };

  if (typeof email !== "string" || !email.includes("@") || email.length > 254) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 422 });
  }
  if (!isValidPayload(payload)) {
    return NextResponse.json({ error: "Payload de cálculo inválido." }, { status: 422 });
  }

  try {
    const pdfBuffer = await gerarRelatorioPdfBuffer(payload);
    await enviarRelatorioPorEmail({ to: email, customerName: null, pdfBuffer });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("enviar-email: falha ao gerar/enviar relatório", err);
    return NextResponse.json({ error: "Falha ao enviar o relatório." }, { status: 500 });
  }
}
