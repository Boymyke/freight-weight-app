'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  ClipboardCheck,
  FileWarning,
  LayoutDashboard,
  Settings2,
  SlidersHorizontal,
  Truck,
} from 'lucide-react';
import { useDemo } from '@/lib/demo-store';

const primary = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/loads', label: 'Loads', icon: Truck },
  { href: '/exceptions', label: 'Exceptions', icon: FileWarning },
  { href: '/revenue', label: 'Revenue', icon: CircleDollarSign },
];

const intelligence = [
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/audit', label: 'Revenue audit', icon: ClipboardCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const { loads, companyName } = useDemo();
  const open = loads.filter(load => load.status === 'Blocked' || load.status === 'Review').length;

  const item = ({ href, label, icon: Icon }: (typeof primary)[number]) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return (
      <Link href={href} className={`side-link ${active ? 'is-active' : ''}`} key={href}>
        <Icon size={18} strokeWidth={1.8}/>
        <span>{label}</span>
        {href === '/exceptions' && open > 0 && <em>{open}</em>}
      </Link>
    );
  };

  const initials = companyName.split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() || 'NL';

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-symbol">R</div>
        <div className="brand-copy"><strong>Relay</strong><span>Revenue control</span></div>
      </div>

      <Link href="/admin" className="workspace-card">
        <span className="workspace-avatar">{initials}</span>
        <span><strong>{companyName}</strong><small>Demo workspace</small></span>
        <Boxes size={16}/>
      </Link>

      <nav className="side-group">
        <span className="side-group-label">Workspace</span>
        {primary.map(item)}
      </nav>

      <nav className="side-group">
        <span className="side-group-label">Intelligence</span>
        {intelligence.map(item)}
      </nav>

      <nav className="side-group side-group--bottom">
        <span className="side-group-label">Demo</span>
        <Link href="/admin" className={`side-link ${pathname.startsWith('/admin') ? 'is-active' : ''}`}><SlidersHorizontal size={18}/><span>Demo controls</span></Link>
        <Link href="/admin#settings" className="side-link"><Settings2 size={18}/><span>Settings</span></Link>
      </nav>

      <div className="sidebar-footnote">
        <i/>
        <span><strong>Interactive mode</strong><small>Changes stay in this browser</small></span>
      </div>
    </aside>
  );
}
