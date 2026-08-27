import { Sidebar } from '@/components/Sidebar';
import { LoadsTable } from '@/components/LoadsTable';
import { openLoads, formatMoney, revenueAtRisk } from '@/lib/data';

export default function ExceptionsPage() {
  const blocked = openLoads.filter(l => l.status === 'Blocked').length;
  const review = openLoads.filter(l => l.status === 'Review').length;
  return <div className="shell"><Sidebar/><main><header className="topbar"><div><p className="eyebrow">EXCEPTION CONTROL</p><h1>Billing exceptions</h1><p>One queue for the loads that need a human before revenue can move.</p></div></header><section className="stats statsThree"><div className="statCard"><span>Open exceptions</span><strong>{openLoads.length}</strong><small>{blocked} blocked · {review} under review</small></div><div className="statCard"><span>Revenue exposure</span><strong>{formatMoney(revenueAtRisk)}</strong><small>Across current demo exceptions</small></div><div className="statCard accent"><span>Highest-priority issue</span><strong>Missing POD</strong><small>Blocks the full customer invoice</small></div></section><section className="panel tablePanel"><div className="panelHeader"><div><p className="eyebrow">ACTION QUEUE</p><h2>Resolve before billing</h2></div></div><LoadsTable loads={openLoads}/></section></main></div>;
}
