import Link from 'next/link';
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, Search } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { LoadsTable } from '@/components/LoadsTable';
import { formatMoney, loads } from '@/lib/data';

export default function Dashboard() {
  const risk = loads.reduce((sum, load) => sum + load.risk, 0);
  const blocked = loads.filter(l => l.status === 'Blocked' || l.status === 'Review');
  return <div className="shell"><Sidebar/><main>
    <header className="topbar"><div><p className="eyebrow">WEDNESDAY, AUGUST 26</p><h1>Delivery-to-cash control</h1><p>See which delivered loads are ready to bill, which are blocked, and where margin is leaking.</p></div><div className="topActions"><button className="iconButton"><Search size={18}/></button><Link className="primaryButton" href="/audit">Run revenue audit <ArrowUpRight size={16}/></Link></div></header>

    <section className="stats"><StatCard label="Delivered loads" value="437" note="Today · +8.2% vs avg"/><StatCard label="Ready to invoice" value="381" note="87.2% billing-ready"/><StatCard label="Exceptions" value="56" note="12 require action today"/><StatCard label="Revenue at risk" value={formatMoney(risk + 4180)} note="Across open exceptions" accent/></section>

    <section className="twoCol"><div className="panel"><div className="panelHeader"><div><p className="eyebrow">EXCEPTION MIX</p><h2>Why loads are blocked</h2></div><span className="pill">56 open</span></div>
      <div className="bars">{[
        ['Missing POD', 19, 34], ['Accessorial approval', 13, 23], ['Invoice mismatch', 9, 16], ['Customer requirements', 8, 14], ['Rate confirmation', 7, 13]
      ].map(([label,count,width]) => <div className="barRow" key={label as string}><div><strong>{label}</strong><span>{count}</span></div><div className="bar"><i style={{width: `${width}%`}}/></div></div>)}</div>
    </div>
    <div className="panel moneyPanel"><div className="panelHeader"><div><p className="eyebrow">MARGIN WATCH</p><h2>Accessorial recovery</h2></div><AlertTriangle size={20}/></div><div className="moneyNumber">$8,460</div><p>Carrier-side charges detected that still require customer billing review.</p><div className="miniRows"><div><span>Detention</span><strong>$4,280</strong></div><div><span>Lumper</span><strong>$1,885</strong></div><div><span>Layover / TONU</span><strong>$2,295</strong></div></div><button className="secondaryButton">Review recoverable revenue</button></div></section>

    <section className="panel tablePanel"><div className="panelHeader"><div><p className="eyebrow">PRIORITY QUEUE</p><h2>Loads requiring attention</h2></div><div className="health"><CheckCircle2 size={16}/> 381 clear <Clock3 size={16}/> 56 exceptions</div></div><LoadsTable loads={blocked}/></section>
  </main></div>;
}
