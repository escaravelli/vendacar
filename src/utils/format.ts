export function formatCurrency(value: number): string {
  if (value === 0) {
    return 'Sob consulta';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}