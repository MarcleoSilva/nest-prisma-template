export function toCentavos(valor: string): number {
  const normalizado = valor.trim().replace(/\./g, '').replace(',', '.');
  if (!/^-?\d+(\.\d{1,2})?$/.test(normalizado)) {
    throw new Error(`Valor monetário inválido: ${valor}`);
  }
  const negativo = normalizado.startsWith('-');
  const [inteiro, fracao = ''] = normalizado.replace('-', '').split('.');
  const centavos = Number(inteiro) * 100 + Number(fracao.padEnd(2, '0'));
  return negativo ? -centavos : centavos;
}

export function formatBRL(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100);
}