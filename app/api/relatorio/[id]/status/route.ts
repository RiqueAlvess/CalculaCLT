import { NextResponse } from "next/server";
import { getSupabaseServerClient, type PendingReportRow } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = getSupabaseServerClient();
  const { data: row } = await supabase
    .from("pending_reports")
    .select("status")
    .eq("id", id)
    .maybeSingle<Pick<PendingReportRow, "status">>();

  return NextResponse.json({ status: row?.status ?? "not_found" });
}
