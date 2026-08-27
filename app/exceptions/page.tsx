'use client';

import { AlertTriangle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LoadsTable } from '@/components/LoadsTable';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export default function ExceptionsPage() {
  const { loads } = useDemo();
  const [view, setView] = useState<'All' | 'Blocked' | 'Review'>('All');
  const [query, setQuery] = useState('');
  const open = useMemo(() => loads.filter(load => load.status === 'Blocked' || load.status === 'Review'), [loads]);
  const visible = useMemo(() => open.filter(load => {
    const matchesView = view === 'All' || load.status === view;
    const text = `${load.id} ${load.customer} ${load.issue ?? ''} ${load.owner}`.toLowerCase();
    return matchesView && text.includes(query.toLowerCase());
  }), [open, view, query]);
  const exposure = open.reduce((sum, load) => sum + load.risk, 0);
  const stale = open.filter(load => load.ageHours >= 24).length;

  return <>
    <PageHeader eyebrow="EXCEPTION CONTROL" title="Billing exceptions" description="One operational inbox for delivered loads that still need a human before revenue can move."/>

    <section className="kpiGrid">
      <StatCard label="Open exceptions" value={String(open.length)} note={`${open.filter(load => load.status === 'Blocked').length} blocked · ${open.filter(load => load.status === 'Review').length} under review`} />
      <StatCard label="Exception exposure" value={formatMoney(exposure)} note="Potential impact requiring review" />
      <StatCard label="24h+ unresolved" value={String(stale)} note="Prioritize before the next billing cycle" accent />
    </section>

    <section className="panel tablePanel pagePanel">
      <div className="listToolbar">
        <div className="filterTabs"><button className={view === 'All' ? 'active' : ''} onClick={() => setView('All')}>All</button><button className={view === 'Blocked' ? 'active' : ''} onClick={() => setView('Blocked')}>Blocked</button><button className={view === 'Review' ? 'active' : ''} onClick={() => setView('Review')}>Review</button></div>
        <label className="tableSearch"><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search exceptions…"/></label>
      </div>
      <div className="panelHeader tableHeader"><div><p className="eyebrow">ACTION QUEUE</p><h2>Resolve before billing</h2></div><span className="alertPill"><AlertTriangle size={13}/>{visible.length} visible</span></div>
      <LoadsTable loads={visible} interactive/>
    </section>
  </>;
}
