import type { RelatorioPayload } from "@/lib/relatorio/types";

const PENDING_KEY = "calculaclt:pending-report";
const LAST_ORDER_KEY = "calculaclt:last-order-id";

export function salvarRelatorioPendente(payload: RelatorioPayload) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage indisponível (modo privado, etc.) — segue sem persistir
  }
}

export function lerRelatorioPendente(): RelatorioPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as RelatorioPayload) : null;
  } catch {
    return null;
  }
}

export function salvarUltimoPedidoId(id: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_ORDER_KEY, id);
  } catch {
    // localStorage indisponível — segue sem persistir
  }
}

export function lerUltimoPedidoId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}
