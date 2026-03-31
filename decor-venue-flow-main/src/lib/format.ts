export function brl(v: number | null | undefined) {
  const n = typeof v === "number" && Number.isFinite(v) ? v : 0;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

export function fmtDate(input?: string | null) {
  if (!input) return "—";
  const dateOnly = input.split("T")[0].split(" ")[0];
  const parts = dateOnly.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return input;
}

