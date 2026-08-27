'use client';

import Link from 'next/link';
import { ArrowRight, Check, Clock3, Search, UserRound, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export default function ExceptionsPage() {
  const { loads, resolveLoad, assignLoad } = useDemo();
  const [view, setView] = useState<'All' | 'Blocked' | 'Review'>('All');
  const [query, setQuery] = useState('');
  const open = useMemo(() => loads.filter(load => load.status === 'Blocked' || load.status === 'Review'), [loads]);
  const visible = useMemo(() => open.filter(load => {
    const matchesView = view === 'All' || load.status === view;
    const text = `${load.id} ${load.customer} ${load.issue ?? ''} ${load.owner}`.toLowerCase();
    return matchesView && text.includes(query.toLowerCase());
  }), [open, view, query]);
  const [selectedId, setSelectedId] = useState(open[0]?.id ?? '');
  const selected = visible.find(load => load.id === selectedId) ?? visible[0];
  const exposure = open.reduce((sum, load) => sum + load.risk, 0);
  const stale = open.filter(load => load.ageHours >= 24).length;

  return <>
    <PageHeader eyebrow="Exception control" title="Billing exception inbox" description="Resolve the post-delivery work that still needs a human before the invoice can move."/>

    <section className="metrics-grid">
      <StatCard label="Open exceptions" value={String(open.length)} note={`${open.filter(load => load.status === 'Blocked').length} blocked · ${open.filter(load => load.status === 'Review').length} under review`} icon={X}/>
      <StatCard label="Exception exposure" value={formatMoney(exposure)} note="Potential impact requiring review" icon={Clock3}/>
      <StatCard label="24h+ unresolved" value={String(stale)} note="Prioritize before the next billing cycle" icon={Clock3} tone="warning"/>
    </section>

    <section className="exception-layout">
      <article className="card exception-list-card">
        <div className="exception-toolbar">
          <div className="filter-pills">{(['All', 'Blocked', 'Review'] as const).map(item => <button key={item} className={view === item ? 'is-active' : ''} onClick={() => setView(item)}>{item}</button>)}</div>
          <label className="search-field search-field--compact"><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search queue"/></label>
        </div>
        <div className="exception-queue">
          {visible.map(load => (
            <button className={`exception-queue-item ${selected?.id === load.id ? 'is-selected' : ''}`} key={load.id} onClick={() => setSelectedId(load.id)}>
              <span className="exception-queue-icon"><Clock3 size={16}/></span>
              <span className="exception-queue-copy"><strong>{load.issue ?? 'Manual review'}</strong><small>{load.id} · {load.customer}</small></span>
              <span className="exception-queue-meta"><strong>{formatMoney(load.risk)}</strong><small>{load.ageHours}h open</small></span>
            </button>
          ))}
          {!visible.length && <div className="empty-state"><span>0</span><strong>No exceptions here</strong><p>Try another filter or switch the demo scenario.</p></div>}
        </div>
      </article>

      <aside className="card exception-inspector">
        {selected ? <>
          <div className="inspector-head">
            <div><span className="eyebrow">Selected exception</span><h2>{selected.id}</h2><p>{selected.customer} · {selected.lane}</p></div>
            <StatusPill status={selected.status}/>
          </div>
          <div className="inspector-alert"><Clock3 size={18}/><div><strong>{selected.issue}</strong><span>{selected.ageHours} hours since delivery · {formatMoney(selected.risk)} exposure</span></div></div>
          <div className="inspector-grid">
            <div><span>Owner</span><strong>{selected.owner}</strong></div>
            <div><span>Customer amount</span><strong>{formatMoney(selected.amount)}</strong></div>
            <div><span>POD</span><strong>{selected.pod ? 'Verified' : 'Missing'}</strong></div>
            <div><span>Rate con</span><strong>{selected.rateCon ? 'Verified' : 'Missing'}</strong></div>
          </div>
          <div className="inspector-actions">
            <button className="button button--ghost" onClick={() => assignLoad(selected.id, 'Michael')}><UserRound size={15}/>Assign to me</button>
            <button className="button button--dark" onClick={() => resolveLoad(selected.id)}><Check size={15}/>Resolve exception</button>
          </div>
          <Link className="inspector-link" href={`/loads/${selected.id}`}>Open full load detail <ArrowRight size={14}/></Link>
        </> : <div className="empty-state"><span>—</span><strong>Select an exception</strong><p>The inspector will show the decision context here.</p></div>}
      </aside>
    </section>
  </>;
}
