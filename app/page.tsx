'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileWarning,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  Truck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { StatusPill } from '@/components/StatusPill';
import { ActionMenu } from '@/components/ActionMenu';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

const monthlyBars = [52, 46, 82, 49, 65, 38, 57];
const yearlyBars = [38, 52, 45, 68, 74, 61, 79];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export default function DashboardPage() {
  const { loads, resetDemo } = useDemo();
  const [period, setPeriod] = useState('This Month');
  const [chartMode, setChartMode] = useState<'Monthly' | 'Yearly'>('Yearly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(2);
  const [activityQuery, setActivityQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<'All' | 'Open' | 'Clear'>('All');

  const metrics = useMemo(() => {
    const open = loads.filter(load => load.status === 'Blocked' || load.status === 'Review');
    const ready = loads.filter(load => load.status === 'Ready to invoice');
    const invoiced = loads.filter(load => load.status === 'Invoiced');
    const readyValue = ready.reduce((sum, load) => sum + load.amount, 0);
    const blockedValue = open.reduce((sum, load) => sum + load.amount, 0);
    const invoicedValue = invoiced.reduce((sum, load) => sum + load.amount, 0);
    const exposure = open.reduce((sum, load) => sum + load.risk, 0);
    const accessorialGap = loads.flatMap(load => load.accessorials).reduce((sum, item) => sum + Math.max(0, item.carrier - item.customer), 0);
    return { open, ready, invoiced, readyValue, blockedValue, invoicedValue, exposure, accessorialGap };
  }, [loads]);

  const wallet = [
    { label: 'Invoice ready', value: metrics.readyValue, count: metrics.ready.length, status: 'Active', href: '/loads?status=Ready%20to%20invoice', icon: FileCheck2 },
    { label: 'Blocked', value: metrics.blockedValue, count: metrics.open.filter(load => load.status === 'Blocked').length, status: 'Attention', href: '/loads?status=Blocked', icon: FileWarning },
    { label: 'Under review', value: metrics.exposure, count: metrics.open.filter(load => load.status === 'Review').length, status: 'Reviewing', href: '/loads?status=Review', icon: Clock3 },
    { label: 'Invoiced', value: metrics.invoicedValue, count: metrics.invoiced.length, status: 'Clear', href: '/loads?status=Invoiced', icon: ReceiptText },
  ];

  const chart = chartMode === 'Yearly' ? yearlyBars : monthlyBars;
  const maxAmount = Math.max(metrics.blockedValue, metrics.readyValue, metrics.invoicedValue, 1000);
  const activityRows = useMemo(() => loads.filter(load => {
    const q = activityQuery.trim().toLowerCase();
    const text = `${load.id} ${load.customer} ${load.issue ?? ''} ${load.lane}`.toLowerCase();
    const matchesSearch = !q || text.includes(q);
    const isOpen = load.status === 'Blocked' || load.status === 'Review';
    const matchesFilter = activityFilter === 'All' || (activityFilter === 'Open' ? isOpen : !isOpen);
    return matchesSearch && matchesFilter;
  }).slice(0, 7), [loads, activityQuery, activityFilter]);

  return (
    <div className="reference-dashboard">
      <div className="overview-toolbar">
        <div><h1>Overview</h1><p>Here is the summary of delivery-to-cash activity</p></div>
        <div className="overview-actions">
          <select value={period} onChange={event => setPeriod(event.target.value)} aria-label="Dashboard period"><option>This Month</option><option>This Week</option><option>This Quarter</option></select>
          <button onClick={resetDemo}><RotateCcw size={15}/>Reset Data</button>
        </div>
      </div>

      <section className="reference-summary-grid">
        <article className="reference-summary-card reference-summary-card--primary">
          <div className="summary-card-top"><div className="summary-title"><span className="summary-icon"><CircleDollarSign size={17}/></span><span><strong>Invoice-ready value</strong><small>Ready for customer billing</small></span></div><ActionMenu items={[{ label: 'View invoices', href: '/invoices' }, { label: 'View ready loads', href: '/loads?status=Ready%20to%20invoice' }]}/></div>
          <div className="summary-value-row"><strong>{formatMoney(metrics.readyValue)}</strong><span><ArrowUpRight size={11}/>8.4%</span></div>
          <Link href="/loads?status=Ready%20to%20invoice">See details <ArrowRight size={15}/></Link>
        </article>

        <article className="reference-summary-card">
          <div className="summary-card-top"><div className="summary-title"><span className="summary-icon"><FileWarning size={17}/></span><span><strong>Blocked invoice value</strong><small>Waiting on an exception</small></span></div><ActionMenu items={[{ label: 'View exceptions', href: '/exceptions' }, { label: 'View blocked loads', href: '/loads?status=Blocked' }]}/></div>
          <div className="summary-value-row"><strong>{formatMoney(metrics.blockedValue)}</strong><span><ArrowUpRight size={11}/>3.2%</span></div>
          <Link href="/exceptions">View exceptions <ArrowRight size={15}/></Link>
        </article>

        <article className="reference-summary-card">
          <div className="summary-card-top"><div className="summary-title"><span className="summary-icon"><ReceiptText size={17}/></span><span><strong>Accessorial review</strong><small>Potential recoverable margin</small></span></div><ActionMenu items={[{ label: 'Open recovery queue', href: '/revenue' }, { label: 'Run revenue audit', href: '/audit' }]}/></div>
          <div className="summary-value-row"><strong>{formatMoney(metrics.accessorialGap)}</strong><span><ArrowUpRight size={11}/>4.7%</span></div>
          <Link href="/revenue">Analyze recovery <ArrowRight size={15}/></Link>
        </article>
      </section>

      <section className="reference-middle-grid">
        <article className="reference-panel wallet-panel">
          <div className="reference-panel-head"><div><h2>Revenue states</h2><p>Live post-delivery positions</p></div><Link href="/admin#new-load"><Plus size={14}/>Add New</Link></div>
          <div className="wallet-grid">
            {wallet.map(item => {
              const Icon = item.icon;
              return <article className="wallet-tile" key={item.label}>
                <div className="wallet-tile-top"><span className="wallet-symbol"><Icon size={17}/></span><ActionMenu label={`${item.label} actions`} items={[{ label: 'View details', href: item.href }, { label: 'Open all loads', href: '/loads' }]}/></div>
                <Link className="wallet-tile-link" href={item.href}><strong>{formatMoney(item.value)}</strong><small>{item.count} loads</small><em className={item.status === 'Attention' ? 'is-attention' : ''}>{item.status}</em></Link>
              </article>;
            })}
          </div>
        </article>

        <article className="reference-panel cashflow-panel">
          <div className="cashflow-heading">
            <div><span>Revenue Flow</span><strong>{formatMoney(metrics.readyValue + metrics.invoicedValue)}</strong></div>
            <div className="chart-toggle"><button className={chartMode === 'Monthly' ? 'is-active' : ''} onClick={() => setChartMode('Monthly')}>Monthly</button><button className={chartMode === 'Yearly' ? 'is-active' : ''} onClick={() => setChartMode('Yearly')}>Yearly</button></div>
          </div>
          <div className="reference-chart">
            <div className="chart-axis"><span>50k</span><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0k</span></div>
            <div className="bar-zone">
              <div className="chart-grid"><i/><i/><i/><i/><i/></div>
              {chart.map((height, index) => {
                const active = hoveredBar === index;
                const illustrativeAmount = Math.round((height / 100) * maxAmount);
                return <div className="chart-column" key={`${chartMode}-${labels[index]}`} onMouseEnter={() => setHoveredBar(index)} onMouseLeave={() => setHoveredBar(null)}>
                  {active && <div className="chart-tooltip"><strong>{labels[index]}, 2026</strong><span>Invoice-ready <b>{formatMoney(illustrativeAmount)}</b></span><span>Exposure <b>-{formatMoney(Math.round(illustrativeAmount * .22))}</b></span></div>}
                  <div className={`reference-bar ${active ? 'is-active' : ''}`} style={{ height: `${height}%` }}><i/></div>
                  <span>{labels[index]}</span>
                </div>;
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="reference-panel recent-activity-panel">
        <div className="recent-activity-head"><h2>Recent Activities</h2><div><label><Search size={15}/><input value={activityQuery} onChange={event => setActivityQuery(event.target.value)} placeholder="Search"/></label><select value={activityFilter} onChange={event => setActivityFilter(event.target.value as 'All' | 'Open' | 'Clear')}><option>All</option><option>Open</option><option>Clear</option></select></div></div>
        <div className="reference-table-wrap">
          <table className="reference-table">
            <thead><tr><th><input type="checkbox" aria-label="Select all"/></th><th>Activity</th><th>Load ID</th><th>Delivered</th><th>Customer</th><th>Price</th><th>Status</th><th/></tr></thead>
            <tbody>
              {activityRows.map(load => <tr key={load.id}>
                <td><input type="checkbox" aria-label={`Select ${load.id}`}/></td>
                <td><div className="activity-name"><span className={`activity-logo ${load.risk ? 'is-risk' : ''}`}>{load.risk ? <FileWarning size={14}/> : <CheckCircle2 size={14}/>}</span><div><strong>{load.issue ?? 'Billing packet cleared'}</strong><small>{load.lane}</small></div></div></td>
                <td><Link href={`/loads/${load.id}`}>{load.id}</Link></td>
                <td>{load.deliveredAt}</td>
                <td>{load.customer}</td>
                <td>{formatMoney(load.amount)}</td>
                <td><StatusPill status={load.status}/></td>
                <td><ActionMenu label={`Actions for ${load.id}`} items={[{ label: 'Open load', href: `/loads/${load.id}` }, { label: 'View invoice queue', href: '/invoices' }]}/></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
