const rubleFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

/** 4500 -> "4 500 ₽" */
export function formatPrice(price: number): string {
  return `${rubleFormatter.format(price)} ₽`;
}

/** (5900, 4500) -> 24 (процент скидки, округлённый) */
export function discountPercent(oldPrice: number, price: number): number {
  if (oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
