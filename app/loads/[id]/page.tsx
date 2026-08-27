'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileText,
  Paperclip,
  UserRound,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

const documents = [
  ['pod', 'Signed proof of delivery', 'POD'],
  ['rateCon', 'Rate confirmation', 'Rate con'],
  ['carrierInvoice', 'Carrier invoice', 'Carrier invoice'],
  ['customerRequirements', 'Customer billing requirements', 'Customer rules'],
] as const;

export default function LoadDetailPage() {
  const params = useParams<{ id: string }>();
  const { loads, resolveLoad, assignLoad, toggleDocument, updateAccessorial, updateLoad } = useDemo();
  const load = loads.find(item => item.id === params.id);

  if (!load) {
    return <div className="card not-found-card"><span>404</span><h1>Load not found</h1><p>The demo load may have been removed from Demo controls.</p><Link href="/loads" className="button button--dark">Back to loads</Link></div>;
  }

  const verified = documents.filter(([key]) => load[key]).length;
  const allDocumentsReady = verified === documents.length;
  const accessorialGap = load.accessorials.reduce((sum, item) => sum + Math.max(0, item.carrier - item.customer), 0);
  const workflow = [
    { label: 'Delivered', done: true },
    { label: 'Documents', done: allDocumentsReady },
    { label: 'Reconciled', done: load.risk === 0 || (allDocumentsReady && accessorialGap === 0) },
    { label: 'Invoice ready', done: load.status === 'Ready to invoice' || load.status === 'Invoiced' },
  ];

  return <>
    <Link href="/loads" className="back-link"><ArrowLeft size={15}/>Back to loads</Link>
    <PageHeader
      eyebrow="Load detail"
      title={load.id}
      description={`${load.customer} · ${load.lane}`}
      actions={<StatusPill status={load.status}/>}
    />

    <section className="card load-flow-card">
      <div className="load-flow-head"><div><span>Delivered</span><strong>{load.deliveredAt}</strong></div><div><span>Customer amount</span><strong>{formatMoney(load.amount)}</strong></div><div><span>Owner</span><strong>{load.owner}</strong></div></div>
      <div className="load-flow-steps">
        {workflow.map((step, index) => <div className={`load-flow-step ${step.done ? 'is-done' : ''}`} key={step.label}><span>{step.done ? <Check size={14}/> : index + 1}</span><strong>{step.label}</strong>{index < workflow.length - 1 && <i/>}</div>)}
      </div>
    </section>

    <section className="load-detail-grid">
      <div className="load-detail-main">
        <article className="card document-card">
          <div className="card-head card-head--compact"><div><span className="eyebrow">Billing packet</span><h2>Document readiness</h2></div><span className={`completion-chip ${allDocumentsReady ? 'is-complete' : ''}`}>{verified}/{documents.length} verified</span></div>
          <div className="document-list">
            {documents.map(([key, label, short]) => {
              const done = load[key];
              return <label className={`document-item ${done ? 'is-done' : ''}`} key={key}>
                <span className="document-icon">{done ? <CheckCircle2 size={19}/> : <FileText size={19}/>}</span>
                <span><strong>{label}</strong><small>{done ? 'Verified and attached' : 'Missing or needs review'}</small></span>
                <span className="document-check"><input type="checkbox" checked={done} onChange={() => toggleDocument(load.id, key)} aria-label={`Mark ${label} as verified`}/><i><Check size={13}/></i><em>{done ? 'Checked' : `Check ${short}`}</em></span>
              </label>;
            })}
          </div>
        </article>

        <article className="card reconciliation-card">
          <div className="card-head card-head--compact"><div><span className="eyebrow">Reconciliation</span><h2>Financial checks</h2></div><CircleDollarSign size={18}/></div>
          <div className="reconciliation-summary">
            <div><span>Customer amount</span><strong>{formatMoney(load.amount)}</strong></div>
            <div><span>Exception exposure</span><strong className={load.risk ? 'text-risk' : ''}>{formatMoney(load.risk)}</strong></div>
            <div><span>Accessorial gap</span><strong className={accessorialGap ? 'text-risk' : ''}>{formatMoney(accessorialGap)}</strong></div>
          </div>

          {load.accessorials.length > 0 ? <div className="accessorial-list">
            {load.accessorials.map(item => {
              const gap = Math.max(0, item.carrier - item.customer);
              return <div className="accessorial-item" key={item.label}>
                <span className="accessorial-mark"><Paperclip size={16}/></span>
                <div className="accessorial-copy"><strong>{item.label}</strong><small>{item.evidence ? 'Evidence attached' : 'Evidence missing'}</small></div>
                <div className="accessorial-number"><span>Carrier</span><strong>{formatMoney(item.carrier)}</strong></div>
                <div className="accessorial-number"><span>Customer</span><strong>{formatMoney(item.customer)}</strong></div>
                <div className="accessorial-number"><span>Gap</span><strong className={gap ? 'text-risk' : ''}>{formatMoney(gap)}</strong></div>
                <div className="accessorial-actions">
                  {!item.evidence && <button className="button button--ghost button--sm" onClick={() => updateAccessorial(load.id, item.label, { evidence: true })}><Paperclip size={14}/>Attach</button>}
                  {gap > 0 ? <button className="button button--dark button--sm" onClick={() => updateAccessorial(load.id, item.label, { customer: item.carrier, approved: true })}><Check size={14}/>Approve rebill</button> : <span className="matched-chip"><Check size={13}/>Matched</span>}
                </div>
              </div>;
            })}
          </div> : <div className="clear-state"><FileCheck2 size={20}/><div><strong>No accessorial exceptions</strong><p>This load has no carrier/customer charge differences in the demo.</p></div></div>}
        </article>

        <article className="card notes-card">
          <div className="card-head card-head--compact"><div><span className="eyebrow">Internal note</span><h2>Decision context</h2></div></div>
          <textarea value={load.note ?? `Review ${load.issue ?? 'billing packet'} before invoice release.`} onChange={event => updateLoad(load.id, { note: event.target.value })}/>
          <span>Saved automatically in this browser session.</span>
        </article>
      </div>

      <aside className="load-detail-aside">
        <article className={`card resolution-card ${load.risk === 0 ? 'is-clear' : ''}`}>
          <span className="resolution-icon">{load.risk === 0 ? <CheckCircle2 size={20}/> : <Clock3 size={20}/>}</span>
          <span className="eyebrow">Current exception</span>
          <strong className="resolution-money">{formatMoney(load.risk)}</strong>
          <h2>{load.issue ?? 'Ready to move'}</h2>
          <p>{load.risk === 0 ? 'This load can move into the invoice-ready queue.' : 'Review the missing context, then release or reassign the exception.'}</p>
          <div className="resolution-actions">
            {load.risk > 0 && <button className="button button--dark" onClick={() => resolveLoad(load.id)}><Check size={15}/>Mark invoice ready</button>}
            <button className="button button--ghost" onClick={() => assignLoad(load.id, 'Michael')}><UserRound size={15}/>Assign to me</button>
          </div>
        </article>

        <article className="card activity-card">
          <div className="card-head card-head--compact"><div><span className="eyebrow">Activity</span><h2>Load timeline</h2></div></div>
          <div className="activity-list">
            <div><span><Check size={12}/></span><div><strong>Delivery confirmed</strong><small>{load.deliveredAt}</small></div></div>
            <div><span>{load.pod ? <Check size={12}/> : <X size={12}/>}</span><div><strong>POD check</strong><small>{load.pod ? 'Verified' : 'Action required'}</small></div></div>
            <div><span>{load.risk === 0 ? <Check size={12}/> : <Clock3 size={12}/>}</span><div><strong>Billing exception</strong><small>{load.issue ?? 'No active exception'}</small></div></div>
          </div>
        </article>
      </aside>
    </section>
  </>;
}
