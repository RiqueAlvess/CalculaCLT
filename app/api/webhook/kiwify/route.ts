import { NextResponse } from "next/server";
import { getSupabaseServerClient, type PendingReportRow } from "@/lib/supabase";
import { extractCustomer, extractReportId, isOrderApproved, isValidKiwifyRequest, type KiwifyWebhookPayload } from "@/lib/kiwify";
import { gerarRelatorioPdfBuffer } from "@/lib/pdf/render";
import { enviarRelatorioPorEmail } from "@/lib/resend";
import type { RelatorioPayload } from "@/lib/relatorio/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("token");
  const headerSecret = request.headers.get("x-kiwify-token") ?? request.headers.get("x-webhook-token");

  let body: KiwifyWebhookPayload;
  try {
    body = (await request.json()) as KiwifyWebhookPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const bodySecret = typeof body.token === "string" ? body.token : null;

  const valid = isValidKiwifyRequest({
    querySecret,
    headerSecret,
    bodySecret,
    expectedSecret: process.env.KIWIFY_WEBHOOK_SECRET,
  });

  if (!valid) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  if (!isOrderApproved(body)) {
    // Outros eventos (boleto/pix gerado, recusado, reembolso, etc.) — apenas confirma recebimento.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const reportId = extractReportId(body);
  if (!reportId) {
    console.error("kiwify webhook: pedido aprovado sem s1/reportId", body.order_id);
    return NextResponse.json({ ok: true, warning: "missing report id" });
  }

  const supabase = getSupabaseServerClient();
  const { data: row, error: fetchError } = await supabase
    .from("pending_reports")
    .select("*")
    .eq("id", reportId)
    .maybeSingle<PendingReportRow>();

  if (fetchError || !row) {
    console.error("kiwify webhook: registro não encontrado", reportId, fetchError);
    return NextResponse.json({ error: "Registro de cálculo não encontrado." }, { status: 404 });
  }

  if (row.status === "paid") {
    // Reentrega do webhook — já processado, evita reenviar o e-mail.
    return NextResponse.json({ ok: true, already_processed: true });
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Registro de cálculo expirado." }, { status: 410 });
  }

  const { name, email } = extractCustomer(body);
  if (!email) {
    console.error("kiwify webhook: sem e-mail do comprador", reportId);
    return NextResponse.json({ error: "E-mail do comprador não informado pelo webhook." }, { status: 422 });
  }

  try {
    const pdfBuffer = await gerarRelatorioPdfBuffer(row.payload as RelatorioPayload);
    await enviarRelatorioPorEmail({ to: email, customerName: name, pdfBuffer });

    await supabase
      .from("pending_reports")
      .update({
        status: "paid",
        customer_name: name,
        customer_email: email,
        kiwify_order_ref: body.order_ref ?? body.order_id ?? null,
        paid_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("kiwify webhook: falha ao gerar/enviar relatório", err);
    return NextResponse.json({ error: "Falha ao gerar ou enviar o relatório." }, { status: 500 });
  }
}
