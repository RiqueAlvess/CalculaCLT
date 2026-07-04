import type { RelatorioPayload } from "@/lib/relatorio/types";

const PENDING_KEY = "calculaclt:pending-report";

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
