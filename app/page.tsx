'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileWarning,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';
import { LoadsTable } from '@/components/LoadsTable';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export default function DashboardPage() {
  const { loads, resetDemo, companyName } = useDemo();

  const metrics = useMemo(() => {
    const open = loads.filter(load => load.status === 'Blocked' || load.status === 'Review');
    const ready = loads.filter(load => load.status === 'Ready to invoice' || load.status === 'Invoiced');
    const deliveredValue = loads.reduce((sum, load) => sum + load.amount, 0);
    const readyValue = ready.reduce((sum, load) => sum + load.amount, 0);
    const blockedValue = open.reduce((sum, load) => sum + load.amount, 0);
    const exposure = open.reduce((sum, load) => sum + load.risk, 0);
    const accessorialGap = loads.flatMap(load => load.accessorials).reduce((sum, item) => sum + Math.max(0, item.carrier - item.customer), 0);
    const readiness = deliveredValue ? Math.round((readyValue / deliveredValue) * 100) : 0;
    const stale = open.filter(load => load.ageHours >= 24).length;
    return { open, ready, deliveredValue, readyValue, blockedValue, exposure, accessorialGap, readiness, stale };
  }, [loads]);

  const steps = [
    { label: 'Delivered', value: loads.length, icon: TrendingUp },
    { label: 'Documents clear', value: loads.filter(load => load.pod && load.rateCon && load.carrierInvoice && load.customerRequirements).length, icon: FileCheck2 },
    { label: 'Needs review', value: metrics.open.length, icon: FileWarning },
    { label: 'Invoice ready', value: metrics.ready.length, icon: CircleDollarSign },
  ];

  const exceptions = useMemo(() => {
    const groups: Record<string, number> = {};
    metrics.open.forEach(load => {
      const issue = load.issue ?? 'Manual review';
      const key = issue.toLowerCase().includes('pod') || issue.toLowerCase().includes('receipt') ? 'Missing documents'
        : issue.toLowerCase().includes('detention') || issue.toLowerCase().includes('layover') || issue.toLowerCase().includes('tonu') || issue.toLowerCase().includes('lumper') ? 'Accessorial review'
        : issue.toLowerCase().includes('rate') || issue.toLowerCase().includes('invoice') ? 'Rate / invoice mismatch'
        : 'Customer requirements';
      groups[key] = (groups[key] ?? 0) + 1;
    });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [metrics.open]);

  return (
    <>
      <PageHeader
        eyebrow="Delivery-to-cash"
        title={`Good afternoon, ${companyName.split(' ')[0]}`}
        description="A live view of what happened after delivery and what still needs action before revenue can move."
        actions={<>
          <button className="button button--ghost" onClick={resetDemo}><RotateCcw size={15}/>Reset demo</button>
          <Link className="button button--dark" href="/exceptions">Open exception queue <ArrowRight size={15}/></Link>
        </>}
      />

      <section className="metrics-grid">
        <StatCard label="Invoice-ready value" value={formatMoney(metrics.readyValue)} note={`${metrics.readiness}% of delivered value`} icon={FileCheck2} trend={{ value: '8.4%' }} tone="dark"/>
        <StatCard label="Blocked invoice value" value={formatMoney(metrics.blockedValue)} note={`${metrics.open.length} loads need intervention`} icon={Clock3} trend={{ value: '2.1%', positive: false }}/>
        <StatCard label="Accessorial review" value={formatMoney(metrics.accessorialGap)} note="Carrier/customer billing gaps" icon={CircleDollarSign} trend={{ value: '12.6%' }}/>
      </section>

      <section className="dashboard-main-grid">
        <article className="card workflow-card">
          <div className="card-head">
            <div><span className="eyebrow">Live workflow</span><h2>From delivered to invoice ready</h2><p>Click a stage to inspect the real demo records behind it.</p></div>
            <span className="health-badge"><i/>{metrics.readiness}% healthy</span>
          </div>
          <div className="workflow-track">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const href = index === 2 ? '/exceptions' : '/loads';
              return <Link href={href} className="workflow-step" key={step.label}>
                <span className="workflow-icon"><Icon size={18}/></span>
                <span><small>0{index + 1}</small><strong>{step.label}</strong><em>{step.value} loads</em></span>
                {index < steps.length - 1 && <b/>}
              </Link>;
            })}
          </div>
          <div className="workflow-callout">
            <span className="callout-icon"><Sparkles size={18}/></span>
            <div><strong>{formatMoney(metrics.exposure)} needs a decision</strong><p>This is exception exposure, not confirmed loss. Open a load to verify documents, approve accessorials or release it to billing.</p></div>
            <Link href="/exceptions">Review now <ArrowRight size={14}/></Link>
          </div>
        </article>

        <article className="card priority-card">
          <div className="card-head card-head--compact"><div><span className="eyebrow">Priority</span><h2>What needs attention</h2></div><span className="count-badge">{metrics.open.length}</span></div>
          <div className="priority-list">
            <Link href="/exceptions" className="priority-item"><span className="priority-icon priority-icon--dark"><Clock3 size={16}/></span><div><strong>{metrics.stale} aging exceptions</strong><small>Older than 24 hours</small></div><ArrowRight size={15}/></Link>
            <Link href="/revenue" className="priority-item"><span className="priority-icon"><CircleDollarSign size={16}/></span><div><strong>{formatMoney(metrics.accessorialGap)} accessorial gap</strong><small>Review evidence and customer-side billing</small></div><ArrowRight size={15}/></Link>
            <Link href="/audit" className="priority-item"><span className="priority-icon"><Sparkles size={16}/></span><div><strong>Run a workflow audit</strong><small>Turn the demo into a discovery conversation</small></div><ArrowRight size={15}/></Link>
          </div>
        </article>
      </section>

      <section className="dashboard-secondary-grid">
        <article className="card exception-mix-card">
          <div className="card-head card-head--compact"><div><span className="eyebrow">Exception mix</span><h2>Why billing is waiting</h2></div><Link className="text-link" href="/exceptions">View all <ArrowRight size={14}/></Link></div>
          <div className="exception-bars">
            {exceptions.map(([label, count], index) => {
              const max = Math.max(1, ...exceptions.map(item => item[1]));
              return <div className="exception-bar-row" key={label}>
                <div><span>{label}</span><strong>{count}</strong></div>
                <div className="exception-bar"><i data-index={index} style={{ width: `${Math.max(8, (count / max) * 100)}%` }}/></div>
              </div>;
            })}
            {!exceptions.length && <div className="empty-inline">No open exceptions in the current scenario.</div>}
          </div>
        </article>

        <article className="card table-card">
          <div className="card-head card-head--compact"><div><span className="eyebrow">Recent exceptions</span><h2>Operational inbox</h2></div><Link className="text-link" href="/loads">All loads <ArrowRight size={14}/></Link></div>
          <LoadsTable loads={metrics.open.slice(0, 5)} compact/>
        </article>
      </section>
    </>
  );
}
