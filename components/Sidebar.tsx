'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CircleDollarSign,
  CircleHelp,
  ClipboardCheck,
  Command,
  FileWarning,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  ReceiptText,
  RotateCcw,
  Search,
  Settings2,
  Truck,
} from 'lucide-react';
import { useDemo } from '@/lib/demo-store';

const mainMenu = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/loads', label: 'Loads', icon: Truck },
  { href: '/invoices', label: 'Invoices', icon: ReceiptText },
];

const features = [
  { href: '/exceptions', label: 'Exceptions', icon: FileWarning },
  { href: '/revenue', label: 'Revenue recovery', icon: CircleDollarSign },
  { href: '/audit', label: 'Revenue audit', icon: ClipboardCheck },
];

export function Sidebar({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname();
  const { loads, resetDemo } = useDemo();
  const open = loads.filter(load => load.status === 'Blocked' || load.status === 'Review').length;

  const renderItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return (
      <Link href={href} className={`side-link ${active ? 'is-active' : ''}`} key={`${href}-${label}`}>
        <Icon size={17} strokeWidth={1.8}/>
        <span>{label}</span>
        {href === '/exceptions' && open > 0 && <em>{open}</em>}
      </Link>
    );
  };

  return (
    <aside className="sidebar reference-sidebar">
      <div className="brand-row reference-brand-row">
        <div className="brand-symbol reference-brand-symbol">R</div>
        <div className="brand-copy"><strong>Relay</strong><span>Freight revenue control</span></div>
      </div>

      <button className="sidebar-search" onClick={onSearch}>
        <Search size={16}/><span>Search</span><kbd><Command size={11}/>K</kbd>
      </button>

      <nav className="side-group">
        <span className="side-group-label">Main menu</span>
        {mainMenu.map(renderItem)}
      </nav>

      <nav className="side-group">
        <span className="side-group-label">Features</span>
        {features.map(renderItem)}
        <Link href="/admin" className={`side-link ${pathname.startsWith('/admin') ? 'is-active' : ''}`}><MessageSquareText size={17}/><span>Demo controls</span></Link>
      </nav>

      <nav className="side-group side-group--bottom reference-general-links">
        <span className="side-group-label">General</span>
        <Link href="/admin#settings" className="side-link"><Settings2 size={17}/><span>Settings</span></Link>
        <button className="side-link side-button" onClick={onSearch}><CircleHelp size={17}/><span>Help desk</span></button>
        <button className="side-link side-button" onClick={resetDemo}><LogOut size={17}/><span>Reset demo</span></button>
      </nav>

      <div className="sidebar-promo">
        <strong>Interactive demo ✨</strong>
        <p>Switch scenarios and tailor the workspace for each prospect.</p>
        <div><Link href="/admin">Configure</Link><button onClick={resetDemo}><RotateCcw size={13}/>Reset</button></div>
      </div>
    </aside>
  );
}
