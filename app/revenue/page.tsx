'use client';

import Link from 'next/link';
import { Check, FileCheck2 } from 'lucide-react';
import { useMemo } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export default function RevenuePage() {
  const { loads, updateAccessorial } = useDemo();
  const items = useMemo(() => loads.flatMap(load => load.accessorials.map(item => ({ ...item, loadId: load.id, customerName: load.customer }))), [loads]);
  const open = items.filter(item => item.carrier > item.customer);
  const recoverable = open.reduce((sum, item) => sum + (item.carrier - item.customer), 0);
  const missingEvidence = open.filter(item => !item.evidence).length;

  return <>
    <PageHeader eyebrow="MARGIN WATCH" title="Accessorial recovery" description="Review carrier-side charges that have not yet been matched on the customer billing side."/>

    <section className="kpiGrid">
      <StatCard label="Open billing gap" value={formatMoney(recoverable)} note={`${open.length} accessorials need review`} accent />
      <StatCard label="Missing evidence" value={String(missingEvidence)} note="Supporting documentation still required" />
      <StatCard label="Matched charges" value={String(items.length - open.length)} note="Carrier and customer sides aligned" />
    </section>

    <section className="panel pagePanel">
      <div className="panelHeader"><div><p className="eyebrow">ACCESSORIAL REVIEW</p><h2>Carrier vs. customer billing</h2></div><span className="countPill">{open.length} open</span></div>
      <div className="revenueCards">
        {open.map(item => {
          const gap = item.carrier - item.customer;
          return <article className="revenueCard" key={`${item.loadId}-${item.label}`}>
            <div className="revenueCardHead"><div><span className="accessorialType">{item.label}</span><Link href={`/loads/${item.loadId}`}>{item.loadId} ↗</Link></div><strong>{formatMoney(gap)}</strong></div>
            <p>{item.customerName}</p>
            <div className="revenueCompare"><div><span>Carrier billed</span><strong>{formatMoney(item.carrier)}</strong></div><div><span>Customer billed</span><strong>{formatMoney(item.customer)}</strong></div><div><span>Evidence</span><strong>{item.evidence ? 'Attached' : 'Missing'}</strong></div></div>
            <div className="revenueActions">
              {!item.evidence && <button className="secondaryButton compact" onClick={() => updateAccessorial(item.loadId, item.label, { evidence: true })}><FileCheck2 size={14}/> Attach evidence</button>}
              <button className="primaryButton" onClick={() => updateAccessorial(item.loadId, item.label, { customer: item.carrier, evidence: true, approved: true })}><Check size={14}/> Approve rebill</button>
            </div>
          </article>;
        })}
        {!open.length && <div className="emptyState roomy"><strong>All accessorials are matched.</strong><span>Use /admin to load a higher-risk demo scenario.</span></div>}
      </div>
    </section>
    <p className="footnote">“Open billing gap” is a review queue. It does not claim that every dollar is contractually collectible.</p>
  </>;
}
