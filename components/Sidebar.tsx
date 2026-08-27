'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
  BarChart3,
  CircleDollarSign,
  ClipboardCheck,
  FileWarning,
  Gauge,
  Search,
  Settings2,
  SlidersHorizontal,
  Truck,
} from 'lucide-react';
import { useDemo } from '@/lib/demo-store';

const mainItems = [
  { href: '/', label: 'Dashboard', icon: Gauge },
  { href: '/loads', label: 'Loads', icon: Truck },
  { href: '/exceptions', label: 'Exceptions', icon: FileWarning },
  { href: '/revenue', label: 'Revenue', icon: CircleDollarSign },
];

const insightItems = [
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/audit', label: 'Revenue audit', icon: ClipboardCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { loads, companyName } = useDemo();
  const [query, setQuery] = useState('');
  const exceptionCount = loads.filter(load => load.status === 'Blocked' || load.status === 'Review').length;

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/loads?q=${encodeURIComponent(value)}` : '/loads');
  };

  const renderItem = ({ href, label, icon: Icon }: (typeof mainItems)[number]) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return <Link className={`navitem ${active ? 'active' : ''}`} href={href} key={href}>
      <Icon size={17}/><span>{label}</span>
      {href === '/exceptions' && exceptionCount > 0 && <em>{exceptionCount}</em>}
    </Link>;
  };

  return <aside className="sidebar">
    <div className="brand">
      <div className="brandmark"><span>R</span></div>
      <div><strong>Relay</strong><span>Freight revenue control</span></div>
    </div>

    <form className="sidebarSearch" onSubmit={submitSearch}>
      <Search size={16}/>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search loads" aria-label="Search loads"/>
      <kbd>↵</kbd>
    </form>

    <div className="navGroup">
      <p>MAIN MENU</p>
      <nav>{mainItems.map(renderItem)}</nav>
    </div>

    <div className="navGroup">
      <p>INSIGHTS</p>
      <nav>{insightItems.map(renderItem)}</nav>
    </div>

    <div className="navGroup navGroupBottom">
      <p>GENERAL</p>
      <nav>
        <Link className={`navitem ${pathname.startsWith('/admin') ? 'active' : ''}`} href="/admin"><SlidersHorizontal size={17}/><span>Demo controls</span></Link>
        <Link className="navitem" href="/admin#settings"><Settings2 size={17}/><span>Settings</span></Link>
      </nav>
    </div>

    <div className="workspace">
      <span className="avatar">{companyName.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase()}</span>
      <div><strong>{companyName}</strong><small>Interactive demo workspace</small></div>
      <Link href="/admin" aria-label="Open demo controls">•••</Link>
    </div>
  </aside>;
}
