export function brl(v: number | string | null | undefined) {
  let n = 0;
  if (typeof v === "number" && Number.isFinite(v)) {
    n = v;
  } else if (typeof v === "string") {
    const parsed = parseFloat(v);
    if (Number.isFinite(parsed)) n = parsed;
  }
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

export function fmtDate(input?: string | null | Date) {
  if (!input) return "—";
  try {
    const d = typeof input === "string" ? new Date(input) : input;
    if (isNaN(d.getTime())) {
       // Tenta tratar string YYYY-MM-DD
       if (typeof input === "string") {
          const parts = input.split("T")[0].split(" ")[0].split("-");
          if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
       }
       return "—";
    }
    // Forçar UTC se for apenas data sem hora para evitar problemas de timezone
    if (typeof input === "string" && !input.includes(":") && !input.includes("T")) {
       const parts = input.split("-");
       return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return d.toLocaleDateString("pt-BR");
  } catch (e) {
    return "—";
  }
}

export function fmtDateTime(input?: string | null | Date) {
  if (!input) return "—";
  try {
    const d = typeof input === "string" ? new Date(input) : input;
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return "—";
  }
}

export function fmtPeriod(start?: string | null | Date, end?: string | null | Date) {
  if (!start) return "—";
  const s = fmtDate(start);
  if (!end) return s;
  const e = fmtDate(end);
  if (s === e) return s;
  return `${s} até ${e}`;
}
