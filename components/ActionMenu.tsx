'use client';

import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

export type ActionMenuItem = { label: string; href?: string; onClick?: () => void };

export function ActionMenu({ items, label = 'More options' }: { items: ActionMenuItem[]; label?: string }) {
  return <details className="action-menu" onClick={event => event.stopPropagation()}>
    <summary aria-label={label}><MoreHorizontal size={17}/></summary>
    <div className="action-menu-popover">
      {items.map(item => item.href
        ? <Link href={item.href} key={item.label}>{item.label}</Link>
        : <button type="button" key={item.label} onClick={item.onClick}>{item.label}</button>)}
    </div>
  </details>;
}
