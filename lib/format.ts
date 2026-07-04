export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatDateBR(date: Date): string {
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function parseInputDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function parseCurrencyInput(value: string): number {
  if (!value) return 0;
  const normalized = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3},)/g, "")
    .replace(",", ".");
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}
