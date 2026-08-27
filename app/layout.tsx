import './globals.css';
import './redesign.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import { DemoProvider } from '@/lib/demo-store';

export const metadata: Metadata = {
  title: 'Relay — Freight Revenue Control',
  description: 'Interactive delivery-to-cash exception control for freight brokerages.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><DemoProvider><AppShell>{children}</AppShell></DemoProvider></body></html>;
}
