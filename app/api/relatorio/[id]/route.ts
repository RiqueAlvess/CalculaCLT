import { NextResponse } from "next/server";
import { getSupabaseServerClient, type PendingReportRow } from "@/lib/supabase";
import { gerarRelatorioPdfBuffer } from "@/lib/pdf/render";
import type { RelatorioPayload } from "@/lib/relatorio/types";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = getSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("pending_reports")
    .select("*")
    .eq("id", id)
    .maybeSingle<PendingReportRow>();

  if (error || !row) {
    return NextResponse.json({ error: "Relatório não encontrado." }, { status: 404 });
  }

  if (row.status !== "paid") {
    return NextResponse.json(
      { error: "Pagamento ainda não confirmado. Tente novamente em instantes." },
      { status: 402 }
    );
  }

  try {
    const pdfBuffer = await gerarRelatorioPdfBuffer(row.payload as RelatorioPayload);
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="relatorio-calculaclt.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("relatorio download: falha ao gerar pdf", err);
    return NextResponse.json({ error: "Falha ao gerar o relatório." }, { status: 500 });
  }
}
