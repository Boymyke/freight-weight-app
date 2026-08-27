import { Sidebar } from '@/components/Sidebar';
import { AuditTool } from '@/components/AuditTool';

export default function AuditPage() {
  return <div className="shell"><Sidebar/><main><header className="topbar"><div><p className="eyebrow">DELIVERY-TO-CASH AUDIT</p><h1>Find the workflow gaps</h1><p>Use this live checklist during discovery to turn vague operational pain into a structured audit.</p></div></header><AuditTool/></main></div>;
}
