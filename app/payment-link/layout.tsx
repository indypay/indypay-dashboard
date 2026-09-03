import { ReactNode } from 'react';
import { fontPayment } from '@/lib/config/fonts';

export default function PaymentLinkLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={`${fontPayment.className} antialiased`}>{children}</div>
  );
}
