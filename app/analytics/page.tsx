'use client';

import { Activity, Clock3, FileWarning, Gauge, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

const weekly = [58, 62, 68, 66, 72, 77, 81, 79, 84, 87, 85, 89];
const monthly = [49, 53, 57, 61, 64, 67, 70, 74, 77, 79, 83, 87];

export default function AnalyticsPage() {
  const { loads } = useDemo();
  const [range, setRange] = useState<'Week' | 'Month'>('Week');
  const open = useMemo(() => loads.filter(load => load.status === 'Blocked' || load.status === 'Review'), [loads]);
  const ready = loads.filter(load => load.status === 'Ready to invoice' || load.status === 'Invoiced');
  const readiness = loads.length ? Math.round((ready.length / loads.length) * 100) : 0;
  const avgAge = open.length ? Math.round(open.reduce((sum, load) => sum + load.ageHours, 0) / open.length) : 0;
  const exposure = open.reduce((sum, load) => sum + load.risk, 0);
  const series = range === 'Week' ? weekly : monthly;
  const points = series.map((value, index) => `${(index / (series.length - 1)) * 100},${100 - value}`).join(' ');

  const aging = [
    { label: '0–12h', count: open.filter(load => load.ageHours < 12).length },
    { label: '12–24h', count: open.filter(load => load.ageHours >= 12 && load.ageHours < 24).length },
    { label: '24–48h', count: open.filter(load => load.ageHours >= 24 && load.ageHours < 48).length },
    { label: '48h+', count: open.filter(load => load.ageHours >= 48).length },
  ];
  const maxAging = Math.max(1, ...aging.map(item => item.count));

  return <>
    <PageHeader eyebrow="Analytics" title="Delivery-to-cash performance" description="See whether post-delivery work is getting faster, cleaner and easier to control."/>

    <section className="metrics-grid">
      <StatCard label="Billing readiness" value={`${readiness}%`} note={`${ready.length} of ${loads.length} loads are clear`} icon={Gauge} tone="dark"/>
      <StatCard label="Average exception age" value={`${avgAge}h`} note={`${open.filter(load => load.ageHours >= 24).length} exceptions are 24h+`} icon={Clock3}/>
      <StatCard label="Exception exposure" value={formatMoney(exposure)} note="Potential impact requiring review" icon={FileWarning}/>
    </section>

    <section className="analytics-grid">
      <article className="card performance-chart-card">
        <div className="card-head">
          <div><span className="eyebrow">Readiness trend</span><h2>Loads becoming invoice-ready</h2><p>Illustrative trend line for the demo conversation.</p></div>
          <div className="segmented-control"><button className={range === 'Week' ? 'is-active' : ''} onClick={() => setRange('Week')}>Weekly</button><button className={range === 'Month' ? 'is-active' : ''} onClick={() => setRange('Month')}>Monthly</button></div>
        </div>
        <div className="chart-summary"><strong>{series.at(-1)}%</strong><span><TrendingUp size={14}/>+11.2% from baseline</span></div>
        <div className="line-chart">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Invoice readiness trend">
            <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#111" stopOpacity=".12"/><stop offset="100%" stopColor="#111" stopOpacity="0"/></linearGradient></defs>
            <polyline points={`0,100 ${points} 100,100`} fill="url(#area)" stroke="none"/>
            <polyline points={points} fill="none" stroke="#111" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
          </svg>
          <div className="chart-grid-lines"><i/><i/><i/><i/></div>
        </div>
      </article>

      <article className="card aging-card">
        <div className="card-head card-head--compact"><div><span className="eyebrow">Exception aging</span><h2>Time waiting</h2></div><Activity size={18}/></div>
        <div className="aging-bars">
          {aging.map(item => <div className="aging-row" key={item.label}><span>{item.label}</span><div><i style={{ width: `${Math.max(item.count ? 8 : 0, (item.count / maxAging) * 100)}%` }}/></div><strong>{item.count}</strong></div>)}
        </div>
        <div className="analytics-note"><strong>Best demo question</strong><p>“What percentage of delivered loads still need someone to intervene before billing?”</p></div>
      </article>
    </section>
  </>;
}
