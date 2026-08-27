import './globals.css';
import './reference.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import { DemoProvider } from '@/lib/demo-store';

export const metadata: Metadata = {
  title: 'Relay — Delivery-to-Cash Control',
  description: 'Interactive freight delivery-to-cash demo for billing exceptions and revenue recovery.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><DemoProvider><AppShell>{children}</AppShell></DemoProvider></body></html>;
}
