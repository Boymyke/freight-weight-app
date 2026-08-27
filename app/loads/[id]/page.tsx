'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Check, CheckCircle2, FileText, UserRound, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { formatMoney, statusClass } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

const docs = [
  ['pod', 'Signed proof of delivery'],
  ['rateCon', 'Rate confirmation'],
  ['carrierInvoice', 'Carrier invoice'],
  ['customerRequirements', 'Customer billing requirements'],
] as const;

export default function LoadPage() {
  const params = useParams<{ id: string }>();
  const { loads, resolveLoad, assignLoad, toggleDocument, updateAccessorial, updateLoad } = useDemo();
  const load = loads.find(item => item.id === params.id);

  if (!load) return <section className="panel notFoundPanel"><h1>Load not found</h1><p>This demo load may have been removed from the admin screen.</p><Link className="primaryButton" href="/loads">Back to loads</Link></section>;

  const allDocsReady = docs.every(([key]) => load[key]);

  return <>
    <Link href="/loads" className="backLink"><ArrowLeft size={15}/> Back to loads</Link>
    <PageHeader
      eyebrow="LOAD DETAIL"
      title={load.id}
      description={`${load.customer} · ${load.lane}`}
      actions={<span className={`status large ${statusClass(load.status)}`}>{load.status}</span>}
    />

    <section className="loadSummaryGrid">
      <div className="panel documentPanel">
        <div className="panelHeader"><div><p className="eyebrow">DOCUMENT READINESS</p><h2>Billing packet</h2></div><span className={`countPill ${allDocsReady ? 'good' : ''}`}>{docs.filter(([key]) => load[key]).length}/{docs.length} verified</span></div>
        <div className="documentList">{docs.map(([key, label]) => {
          const ready = load[key];
          return <button key={key} className={`documentRow ${ready ? 'ready' : ''}`} onClick={() => toggleDocument(load.id, key)}>
            <span className="documentIcon">{ready ? <CheckCircle2 size={18}/> : <XCircle size={18}/>}</span>
            <span><strong>{label}</strong><small>{ready ? 'Verified and attached' : 'Missing or needs review'}</small></span>
            <em>{ready ? 'Verified' : 'Fix now'}</em>
          </button>;
        })}</div>
      </div>

      <div className={`panel exceptionCard ${load.risk === 0 ? 'clear' : ''}`}>
        <div className="exceptionIcon">{load.risk === 0 ? <CheckCircle2 size={20}/> : <FileText size={20}/>}</div>
        <p className="eyebrow">EXCEPTION EXPOSURE</p>
        <strong className="bigMoney">{formatMoney(load.risk)}</strong>
        <h3>{load.issue ?? 'No active billing exception'}</h3>
        <p>{load.risk === 0 ? 'This load is clear to move to invoicing.' : 'Resolve or approve the exception before releasing the customer invoice.'}</p>
        <div className="stackedActions">
          {load.risk > 0 && <button className="primaryButton" onClick={() => resolveLoad(load.id)}><Check size={15}/> Mark invoice ready</button>}
          <button className="secondaryButton compact" onClick={() => assignLoad(load.id, 'Michael')}><UserRound size={15}/> Assign to me</button>
        </div>
      </div>
    </section>

    <section className="panel financialPanel">
      <div className="panelHeader"><div><p className="eyebrow">RECONCILIATION</p><h2>Financial checks</h2></div></div>
      <div className="reconGrid">
        <div><span>Customer amount</span><strong>{formatMoney(load.amount)}</strong></div>
        <div><span>Exception exposure</span><strong>{formatMoney(load.risk)}</strong></div>
        <div><span>Exception owner</span><strong>{load.owner}</strong></div>
        <div><span>Delivered</span><strong>{load.deliveredAt}</strong></div>
      </div>

      {load.accessorials.length > 0 && <div className="accessorialBlock">
        <div className="accessorialTitle"><FileText size={17}/><div><strong>Accessorial review</strong><span>Compare carrier-side charges against the customer billing side.</span></div></div>
        {load.accessorials.map(item => {
          const gap = Math.max(0, item.carrier - item.customer);
          return <div className="accessorialRow" key={item.label}>
            <div><span>Type</span><strong>{item.label}</strong></div>
            <div><span>Carrier billed</span><strong>{formatMoney(item.carrier)}</strong></div>
            <div><span>Customer billed</span><strong>{formatMoney(item.customer)}</strong></div>
            <div><span>Gap</span><strong className={gap > 0 ? 'risk' : ''}>{formatMoney(gap)}</strong></div>
            <div className="accessorialActions">
              {!item.evidence && <button onClick={() => updateAccessorial(load.id, item.label, { evidence: true })}>Attach evidence</button>}
              {gap > 0 && <button className="approveButton" onClick={() => updateAccessorial(load.id, item.label, { customer: item.carrier, approved: true })}>Approve rebill</button>}
              {gap === 0 && <span className="status ready-to-invoice">Matched</span>}
            </div>
          </div>;
        })}
      </div>}

      <div className="loadNotes">
        <label>Internal note</label>
        <textarea value={load.note ?? `Review ${load.issue ?? 'billing packet'} before invoice release.`} onChange={event => updateLoad(load.id, { note: event.target.value })}/>
        <small>Demo note updates the current browser session.</small>
      </div>
    </section>
  </>;
}
