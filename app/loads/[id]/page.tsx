import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, FileText, ShieldAlert, XCircle } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { formatMoney, loads } from '@/lib/data';

export default async function LoadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const load = loads.find(l => l.id === id);
  if (!load) notFound();
  return <div className="shell"><Sidebar/><main><header className="detailHeader"><Link href="/" className="back"><ArrowLeft size={16}/> Control center</Link><div className="detailTitle"><div><p className="eyebrow">LOAD EXCEPTION</p><h1>{load.id}</h1><p>{load.customer} · {load.lane}</p></div><span className={`status ${load.status.toLowerCase().replaceAll(' ', '-')}`}>{load.status}</span></div></header>
    <section className="detailGrid"><div className="panel"><div className="panelHeader"><div><p className="eyebrow">DOCUMENT READINESS</p><h2>Billing packet</h2></div></div>
      <div className="checklist">{[
        ['Signed proof of delivery', load.pod], ['Rate confirmation', load.rateCon], ['Carrier invoice', load.carrierInvoice], ['Customer billing requirements', load.customerRequirements]
      ].map(([label, ok]) => <div className="checkRow" key={label as string}>{ok ? <CheckCircle2/> : <XCircle/>}<span>{label}</span><strong>{ok ? 'Verified' : 'Missing'}</strong></div>)}</div>
    </div><div className="panel alertPanel"><ShieldAlert size={24}/><p className="eyebrow">REVENUE AT RISK</p><div className="moneyNumber">{formatMoney(load.risk)}</div><h3>{load.issue ?? 'No active issue'}</h3><p>This load should not move to billing until the exception is cleared or approved.</p><button className="primaryButton">Assign exception</button></div></section>

    <section className="panel"><div className="panelHeader"><div><p className="eyebrow">RECONCILIATION</p><h2>Financial checks</h2></div></div><div className="reconGrid"><div><span>Customer amount</span><strong>{formatMoney(load.amount)}</strong></div><div><span>Exception exposure</span><strong>{formatMoney(load.risk)}</strong></div><div><span>Exception owner</span><strong>{load.owner}</strong></div><div><span>Delivered</span><strong>{load.deliveredAt}</strong></div></div>
      {load.accessorials.length > 0 && <div className="accessorial"><div><FileText size={18}/><strong>Accessorial review</strong></div>{load.accessorials.map(a => <div className="accessorialRow" key={a.label}><span>{a.label}</span><span>Carrier billed <strong>{formatMoney(a.carrier)}</strong></span><span>Customer billed <strong>{formatMoney(a.customer)}</strong></span><span>{a.evidence ? 'Evidence attached' : 'Evidence missing'}</span></div>)}</div>}
    </section>
  </main></div>;
}
