import { Sidebar } from '@/components/Sidebar';
import { LoadsTable } from '@/components/LoadsTable';
import { loads } from '@/lib/data';

export default function LoadsPage() {
  return <div className="shell"><Sidebar/><main><header className="topbar"><div><p className="eyebrow">LOAD CONTROL</p><h1>Delivered loads</h1><p>Track billing readiness from delivery through invoice release.</p></div></header><section className="panel tablePanel pagePanel"><div className="panelHeader"><div><p className="eyebrow">ALL LOADS</p><h2>Recent delivery-to-cash activity</h2></div><span className="pill">{loads.length} demo loads</span></div><LoadsTable loads={loads}/></section></main></div>;
}
