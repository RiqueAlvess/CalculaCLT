import { createClient } from "@supabase/supabase-js";

/**
 * Server-only client. Uses the service_role key so it bypasses Row Level
 * Security — pending_reports has no permissive anon policies (see
 * supabase/schema.sql), so this is the only way our API routes can read or
 * write it. Never import this file from a "use client" component.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não está configurado: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (recomendado) ou SUPABASE_ANON_KEY."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export interface PendingReportRow {
  id: string;
  tipo: "fgts" | "ferias";
  payload: unknown;
  status: "pending" | "paid" | "expired";
  customer_name: string | null;
  customer_email: string | null;
  kiwify_order_ref: string | null;
  created_at: string;
  expires_at: string;
  paid_at: string | null;
}
