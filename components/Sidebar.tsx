'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, CircleDollarSign, ClipboardCheck, FileWarning, Gauge, Settings2, Truck } from 'lucide-react';

const items = [
  { href: '/', label: 'Control center', icon: Gauge },
  { href: '/loads', label: 'Loads', icon: Truck },
  { href: '/exceptions', label: 'Exceptions', icon: FileWarning, badge: '6' },
  { href: '/revenue', label: 'Revenue', icon: CircleDollarSign },
  { href: '/audit', label: 'Revenue audit', icon: ClipboardCheck },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  return <aside className="sidebar">
    <div className="brand"><div className="brandmark">R</div><div><strong>Relay</strong><span>Revenue Control</span></div></div>
    <nav>{items.map(({ href, label, icon: Icon, badge }) => {
      const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
      return <Link className={`navitem ${active ? 'active' : ''}`} href={href} key={label}><Icon size={18}/><span>{label}</span>{badge && <em>{badge}</em>}</Link>;
    })}</nav>
    <div className="sidebarBottom"><button className="navitem"><Settings2 size={18}/><span>Settings</span></button><div className="workspace"><span className="avatar">NL</span><div><strong>Nexus Logistics</strong><small>Demo workspace</small></div></div></div>
  </aside>;
}
