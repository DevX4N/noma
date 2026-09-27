const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const brlCents = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

export const price = (v: number) => brl.format(v).replace(/ /g, ' ');
export const priceCents = (v: number) => brlCents.format(v).replace(/ /g, ' ');

export const MAX_INSTALLMENTS = 10;
export const installments = (v: number) => `${MAX_INSTALLMENTS}x de ${priceCents(v / MAX_INSTALLMENTS)} sem juros`;

export const FREE_SHIPPING = 1500;
export const SHIPPING_FEE = 39;
export const PIX_DISCOUNT = 0.05;
