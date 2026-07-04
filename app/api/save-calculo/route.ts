import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { RelatorioPayload } from "@/lib/relatorio/types";

function isValidPayload(body: unknown): body is RelatorioPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (b.tipo !== "fgts" && b.tipo !== "ferias") return false;
  if (!b.input || typeof b.input !== "object") return false;
  if (!b.resultado || typeof b.resultado !== "object") return false;
  const resultado = b.resultado as Record<string, unknown>;
  if (typeof resultado.totalEstimado !== "number" || !Number.isFinite(resultado.totalEstimado)) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Payload de cálculo inválido." }, { status: 422 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("pending_reports")
      .insert({ tipo: body.tipo, payload: body })
      .select("id")
      .single();

    if (error || !data) {
      console.error("save-calculo insert error", error);
      return NextResponse.json({ error: "Não foi possível salvar o cálculo." }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("save-calculo error", err);
    return NextResponse.json({ error: "Serviço indisponível no momento." }, { status: 503 });
  }
}
