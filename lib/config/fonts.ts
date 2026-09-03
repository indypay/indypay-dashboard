import {
  Fira_Code as FontMono,
  Lato as FontSans,
  Plus_Jakarta_Sans as FontPayment,
} from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

/** Used on payment-link checkout for a more distinctive, modern look */
export const fontPayment = FontPayment({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-payment',
});
