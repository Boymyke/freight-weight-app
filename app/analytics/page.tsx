'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

const buckets = [
  { label: '0–12h', min: 0, max: 12 },
  { label: '12–24h', min: 12, max: 24 },
  { label: '24–48h', min: 24, max: 48 },
  { label: '48h+', min: 48, max: Infinity },
];

export default function AnalyticsPage() {
  const { loads } = useDemo();
  const [metric, setMetric] = useState<'Loads' | 'Value'>('Loads');
  const open = useMemo(() => loads.filter(load => load.status === 'Blocked' || load.status === 'Review'), [loads]);
  const ready = loads.filter(load => load.status === 'Ready to invoice' || load.status === 'Invoiced').length;
  const readinessRate = loads.length ? Math.round((ready / loads.length) * 100) : 0;
  const avgAge = open.length ? Math.round(open.reduce((sum, load) => sum + load.ageHours, 0) / open.length) : 0;
  const exposure = open.reduce((sum, load) => sum + load.risk, 0);
  const data = buckets.map(bucket => {
    const rows = open.filter(load => load.ageHours >= bucket.min && load.ageHours < bucket.max);
    return { ...bucket, count: rows.length, value: rows.reduce((sum, load) => sum + load.amount, 0) };
  });
  const max = Math.max(1, ...data.map(item => metric === 'Loads' ? item.count : item.value));

  return <>
    <PageHeader eyebrow="ANALYTICS" title="Delivery-to-cash performance" description="Measure how quickly delivered loads become invoice-ready and where exceptions are aging."/>

    <section className="kpiGrid">
      <StatCard label="Billing readiness" value={`${readinessRate}%`} note={`${ready} of ${loads.length} demo loads are clear`} accent />
      <StatCard label="Average exception age" value={`${avgAge}h`} note={`${open.filter(load => load.ageHours >= 24).length} exceptions are 24h+`} />
      <StatCard label="Exception exposure" value={formatMoney(exposure)} note="Potential impact requiring review" />
    </section>

    <section className="analyticsGrid pagePanel">
      <div className="panel agingPanel">
        <div className="panelHeader"><div><p className="eyebrow">EXCEPTION AGING</p><h2>How long delivered revenue stays blocked</h2></div><div className="segmented"><button className={metric === 'Loads' ? 'active' : ''} onClick={() => setMetric('Loads')}>Loads</button><button className={metric === 'Value' ? 'active' : ''} onClick={() => setMetric('Value')}>Value</button></div></div>
        <div className="agingChart">{data.map(item => {
          const raw = metric === 'Loads' ? item.count : item.value;
          const width = Math.max(raw ? 8 : 0, (raw / max) * 100);
          return <div className="agingRow" key={item.label}><span>{item.label}</span><div><i style={{ width: `${width}%` }}/></div><strong>{metric === 'Loads' ? `${item.count} loads` : formatMoney(item.value)}</strong></div>;
        })}</div>
      </div>

      <div className="panel analyticsAside">
        <p className="eyebrow">OPERATING SIGNALS</p><h2>What to watch</h2>
        <div className="signalList"><div><span>24h SLA</span><strong>{open.filter(load => load.ageHours < 24).length}/{open.length || 0}</strong><small>open exceptions still inside 24 hours</small></div><div><span>Document blockers</span><strong>{open.filter(load => !load.pod || !load.rateCon || !load.carrierInvoice || !load.customerRequirements).length}</strong><small>loads missing at least one billing packet item</small></div><div><span>Accessorial gaps</span><strong>{loads.flatMap(load => load.accessorials).filter(item => item.carrier > item.customer).length}</strong><small>carrier/customer amounts not yet aligned</small></div></div>
      </div>
    </section>
  </>;
}
