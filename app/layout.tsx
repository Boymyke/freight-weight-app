import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Relay — Freight Revenue Control',
  description: 'Delivery-to-cash exception control for freight brokerages.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
