export function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 2 }).format(amount);
  } catch (e) {
    return `R${Number(amount || 0).toFixed(2)}`;
  }
}
