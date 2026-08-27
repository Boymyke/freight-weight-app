'use client';

import { FileCheck2, ReceiptText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LoadsTable } from '@/components/LoadsTable';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export default function InvoicesPage() {
  const { loads } = useDemo();
  const [view, setView] = useState<'All' | 'Ready to invoice' | 'Invoiced'>('All');
  const invoiceLoads = useMemo(() => loads.filter(load => load.status === 'Ready to invoice' || load.status === 'Invoiced'), [loads]);
  const visible = view === 'All' ? invoiceLoads : invoiceLoads.filter(load => load.status === view);
  const ready = invoiceLoads.filter(load => load.status === 'Ready to invoice');
  const invoiced = invoiceLoads.filter(load => load.status === 'Invoiced');

  return <>
    <PageHeader eyebrow="Invoice control" title="Invoices" description="Review invoice-ready loads separately from revenue-recovery opportunities."/>
    <section className="metrics-grid">
      <StatCard label="Ready to invoice" value={formatMoney(ready.reduce((sum, load) => sum + load.amount, 0))} note={`${ready.length} loads ready for billing`} icon={FileCheck2} tone="dark"/>
      <StatCard label="Invoiced" value={formatMoney(invoiced.reduce((sum, load) => sum + load.amount, 0))} note={`${invoiced.length} completed invoices`} icon={ReceiptText}/>
      <StatCard label="Invoice records" value={String(invoiceLoads.length)} note="Ready and completed records" icon={ReceiptText}/>
    </section>
    <section className="card loads-card">
      <div className="loads-toolbar"><div className="filter-pills">
        {(['All', 'Ready to invoice', 'Invoiced'] as const).map(item => <button key={item} className={view === item ? 'is-active' : ''} onClick={() => setView(item)}>{item}</button>)}
      </div></div>
      <div className="list-summary"><div><span className="eyebrow">Current view</span><strong>{visible.length} invoices</strong></div><span>{view}</span></div>
      <LoadsTable loads={visible}/>
    </section>
  </>;
}
