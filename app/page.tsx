'use client';

import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LoadsTable } from '@/components/LoadsTable';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

const weeklySeries = [46, 39, 58, 74, 61, 82, 68];
const monthlySeries = [54, 69, 62, 79, 71, 88, 76];
const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Dashboard() {
  const { loads, resetDemo } = useDemo();
  const [range, setRange] = useState<'Week' | 'Month'>('Week');

  const metrics = useMemo(() => {
    const open = loads.filter(load => load.status === 'Blocked' || load.status === 'Review');
    const ready = loads.filter(load => load.status === 'Ready to invoice');
    const invoiced = loads.filter(load => load.status === 'Invoiced');
    const deliveredValue = loads.reduce((sum, load) => sum + load.amount, 0);
    const invoiceReadyValue = [...ready, ...invoiced].reduce((sum, load) => sum + load.amount, 0);
    const blockedInvoiceValue = open.reduce((sum, load) => sum + load.amount, 0);
    const revenueRisk = open.reduce((sum, load) => sum + load.risk, 0);
    const accessorialGap = loads.flatMap(load => load.accessorials).reduce((sum, item) => sum + Math.max(0, item.carrier - item.customer), 0);
    const readiness = deliveredValue ? Math.round((invoiceReadyValue / deliveredValue) * 100) : 0;
    return { open, invoiceReadyValue, blockedInvoiceValue, revenueRisk, accessorialGap, readiness };
  }, [loads]);

  const mix = useMemo(() => {
    const groups: Record<string, number> = { 'Missing documents': 0, 'Accessorial review': 0, 'Rate / invoice mismatch': 0, 'Customer requirements': 0 };
    metrics.open.forEach(load => {
      const issue = (load.issue ?? '').toLowerCase();
      if (issue.includes('pod') || issue.includes('receipt')) groups['Missing documents'] += 1;
      else if (issue.includes('detention') || issue.includes('layover') || issue.includes('tonu') || issue.includes('lumper')) groups['Accessorial review'] += 1;
      else if (issue.includes('rate') || issue.includes('invoice')) groups['Rate / invoice mismatch'] += 1;
      else groups['Customer requirements'] += 1;
    });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [metrics.open]);

  const series = range === 'Week' ? weeklySeries : monthlySeries;
  const max = Math.max(...series);

  return <>
    <PageHeader
      eyebrow="OVERVIEW"
      title="Delivery-to-cash control"
      description="See what is ready to bill, what is blocked, and which exceptions need attention before they delay cash."
      actions={<>
        <button className="secondaryButton compact" onClick={resetDemo}><RotateCcw size={15}/> Reset data</button>
        <Link className="primaryButton" href="/audit">Run revenue audit <ArrowUpRight size={15}/></Link>
      </>}
    />

    <section className="kpiGrid">
      <StatCard label="Invoice-ready value" value={formatMoney(metrics.invoiceReadyValue)} note={`${metrics.readiness}% of delivered value`} accent trend={{ value: '8.4%' }}/>
      <StatCard label="Blocked invoice value" value={formatMoney(metrics.blockedInvoiceValue)} note={`${metrics.open.length} loads need intervention`} trend={{ value: '2.1%', positive: false }}/>
      <StatCard label="Accessorial review" value={formatMoney(metrics.accessorialGap)} note="Carrier/customer billing gaps" trend={{ value: '12.6%' }}/>
    </section>

    <section className="dashboardGrid">
      <div className="panel readinessPanel">
        <div className="panelHeader">
          <div><p className="eyebrow">BILLING READINESS</p><h2>What happened after delivery</h2></div>
          <Link href="/loads" className="textLink">View loads <ArrowUpRight size={14}/></Link>
        </div>
        <div className="readinessBody">
          <div className="readinessRing" style={{ '--progress': `${metrics.readiness * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{metrics.readiness}%</strong><span>invoice-ready</span></div>
          </div>
          <div className="readinessLegend">
            <div><i className="greenDot"/><span>Clear for billing</span><strong>{loads.filter(load => load.status === 'Ready to invoice' || load.status === 'Invoiced').length}</strong></div>
            <div><i className="amberDot"/><span>Under review</span><strong>{loads.filter(load => load.status === 'Review').length}</strong></div>
            <div><i className="redDot"/><span>Blocked</span><strong>{loads.filter(load => load.status === 'Blocked').length}</strong></div>
          </div>
        </div>
        <div className="readinessFooter"><span><CheckCircle2 size={15}/> Billing packet checks are interactive in each load.</span><Link href="/exceptions">Open queue</Link></div>
      </div>

      <div className="panel flowPanel">
        <div className="panelHeader">
          <div><p className="eyebrow">REVENUE FLOW</p><h2>{formatMoney(metrics.blockedInvoiceValue)}</h2><span className="panelSubtitle">Delivered value still waiting on an exception</span></div>
          <div className="segmented"><button className={range === 'Week' ? 'active' : ''} onClick={() => setRange('Week')}>Weekly</button><button className={range === 'Month' ? 'active' : ''} onClick={() => setRange('Month')}>Monthly</button></div>
        </div>
        <div className="barChart" aria-label="Revenue flow chart">{series.map((value, index) => <div className="barColumn" key={labels[index]}><div className="barTrack"><i style={{ height: `${Math.max(18, (value / max) * 100)}%` }}><span>{value}%</span></i></div><small>{labels[index]}</small></div>)}</div>
      </div>
    </section>

    <section className="lowerGrid">
      <div className="panel mixPanel">
        <div className="panelHeader"><div><p className="eyebrow">EXCEPTION MIX</p><h2>Why billing is waiting</h2></div><span className="countPill">{metrics.open.length} open</span></div>
        <div className="mixList">{mix.map(([label, count], index) => {
          const width = metrics.open.length ? Math.max(8, Math.round((count / metrics.open.length) * 100)) : 0;
          return <div className="mixRow" key={label}><div><span>{label}</span><strong>{count}</strong></div><div className="mixBar"><i className={`mixColor mixColor${index + 1}`} style={{ width: `${width}%` }}/></div></div>;
        })}</div>
        <div className="riskCallout"><span>Exception exposure</span><strong>{formatMoney(metrics.revenueRisk)}</strong><small>Potential impact requiring review — not confirmed loss.</small></div>
      </div>

      <div className="panel recentPanel">
        <div className="panelHeader"><div><p className="eyebrow">RECENT ACTITITY</p><h2>Loads requiring attention</h2></div><Link href="/exceptions" className="textLink">See all</Link></div>
        <LoadsTable loads={metrics.open.slice(0, 5)} interactive/>
      </div>
    </section>
  </>;
}
