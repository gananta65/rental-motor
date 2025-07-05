// utils/rupiahFormatter.ts

export function formatRupiah(value: string | number): string {
  const number = typeof value === "string" ? parseNumber(value) : value;
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(number);
}

export function parseNumber(formatted: string): number {
  return Number(formatted.replace(/[^0-9]/g, ""));
}
