export interface KiwifyWebhookPayload {
  order_id?: string;
  order_ref?: string;
  order_status?: string;
  payment_method?: string;
  Customer?: {
    full_name?: string;
    email?: string;
  };
  Product?: {
    product_id?: string;
    product_name?: string;
  };
  TrackingParameters?: {
    s1?: string;
    s2?: string;
    s3?: string;
    src?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
  token?: string;
  [key: string]: unknown;
}

const APPROVED_STATUSES = new Set(["paid", "approved", "compra_aprovada"]);

export function isOrderApproved(payload: KiwifyWebhookPayload): boolean {
  const status = (payload.order_status ?? "").toString().toLowerCase();
  return APPROVED_STATUSES.has(status);
}

/** The record id we generated in /api/save-calculo, echoed back via the `s1` checkout tracking param. */
export function extractReportId(payload: KiwifyWebhookPayload): string | null {
  return payload.TrackingParameters?.s1 ?? null;
}

export function extractCustomer(payload: KiwifyWebhookPayload): { name: string | null; email: string | null } {
  return {
    name: payload.Customer?.full_name ?? null,
    email: payload.Customer?.email ?? null,
  };
}

function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Kiwify's exact token-transport mechanism isn't fully documented publicly.
 * The best-documented convention (used across most Kiwify integration
 * tutorials) is appending `?token=SEU_TOKEN` to the webhook URL you
 * register in the dashboard, but some integrations also see it as a header
 * or a body field. We defensively accept a match in any of those spots so
 * the integration doesn't silently break depending on which one Kiwify
 * actually uses — confirm the real mechanism against Kiwify's sandbox test
 * tool before relying on this in production, and narrow this down once
 * confirmed.
 */
export function isValidKiwifyRequest(params: {
  querySecret: string | null;
  headerSecret: string | null;
  bodySecret: string | null;
  expectedSecret: string | undefined;
}): boolean {
  const { querySecret, headerSecret, bodySecret, expectedSecret } = params;
  if (!expectedSecret) return false;
  return [querySecret, headerSecret, bodySecret].some(
    (candidate): candidate is string => candidate !== null && timingSafeStringEqual(candidate, expectedSecret)
  );
}
