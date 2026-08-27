'use client';

import Link from 'next/link';
import { Check, CircleDollarSign, FileCheck2, Paperclip, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export default function RevenuePage() {
  const { loads, updateAccessorial } = useDemo();
  const [query, setQuery] = useState('');
  const opportunities = useMemo(() => loads.flatMap(load => load.accessorials.map(item => ({ ...item, loadId: load.id, customerName: load.customer, lane: load.lane }))).filter(item => item.carrier > item.customer), [loads]);
  const visible = opportunities.filter(item => `${item.loadId} ${item.customerName} ${item.label}`.toLowerCase().includes(query.toLowerCase()));
  const totalGap = opportunities.reduce((sum, item) => sum + Math.max(0, item.carrier - item.customer), 0);
  const evidenceReady = opportunities.filter(item => item.evidence).length;
  const average = opportunities.length ? Math.round(totalGap / opportunities.length) : 0;

  return <>
    <PageHeader eyebrow="Revenue recovery" title="Accessorial review" description="Compare carrier-side charges with the customer billing side before margin slips through the handoff."/>

    <section className="metrics-grid">
      <StatCard label="Open billing gap" value={formatMoney(totalGap)} note={`${opportunities.length} charges need review`} icon={CircleDollarSign} tone="dark"/>
      <StatCard label="Evidence ready" value={`${evidenceReady}/${opportunities.length || 0}`} note="Supporting documentation attached" icon={FileCheck2}/>
      <StatCard label="Average gap" value={formatMoney(average)} note="Per open accessorial" icon={CircleDollarSign}/>
    </section>

    <section className="card revenue-workspace">
      <div className="revenue-toolbar">
        <div><span className="eyebrow">Recovery queue</span><h2>Carrier/customer differences</h2></div>
        <label className="search-field"><Search size={16}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search load, customer or charge"/></label>
      </div>

      <div className="revenue-list">
        {visible.map(item => {
          const gap = Math.max(0, item.carrier - item.customer);
          return <article className="revenue-item" key={`${item.loadId}-${item.label}`}>
            <div className="revenue-item-main">
              <span className="revenue-type">{item.label}</span>
              <div><Link href={`/loads/${item.loadId}`}>{item.loadId} · {item.customerName}</Link><small>{item.lane}</small></div>
            </div>
            <div className="revenue-values">
              <div><span>Carrier billed</span><strong>{formatMoney(item.carrier)}</strong></div>
              <div><span>Customer billed</span><strong>{formatMoney(item.customer)}</strong></div>
              <div><span>Gap</span><strong className="text-risk">{formatMoney(gap)}</strong></div>
            </div>
            <div className="evidence-chip"><Paperclip size={13}/>{item.evidence ? 'Evidence attached' : 'Evidence missing'}</div>
            <div className="revenue-item-actions">
              {!item.evidence && <button className="button button--ghost button--sm" onClick={() => updateAccessorial(item.loadId, item.label, { evidence: true })}><Paperclip size={14}/>Attach evidence</button>}
              <button className="button button--dark button--sm" onClick={() => updateAccessorial(item.loadId, item.label, { customer: item.carrier, approved: true })}><Check size={14}/>Approve rebill</button>
            </div>
          </article>;
        })}
        {!visible.length && <div className="empty-state"><span>$0</span><strong>No open accessorial gaps</strong><p>Try another search or switch the demo to a higher-risk scenario.</p></div>}
      </div>
    </section>
  </>;
}
