'use client';

import Link from 'next/link';
import { Check, ChevronRight, MoreHorizontal } from 'lucide-react';
import { FreightLoad, formatMoney, statusClass } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export function LoadsTable({ loads, interactive = false }: { loads: FreightLoad[]; interactive?: boolean }) {
  const { resolveLoad, assignLoad } = useDemo();

  if (!loads.length) return <div className="emptyState"><strong>No loads match this view.</strong><span>Try a different search or filter.</span></div>;

  return <div className="tableWrap"><table><thead><tr><th>Load</th><th>Customer / lane</th><th>Status</th><th>Revenue at risk</th><th>Owner</th><th>Action</th></tr></thead><tbody>
    {loads.map(load => <tr key={load.id}>
      <td><Link href={`/loads/${load.id}`} className="loadId">{load.id}</Link><small>{load.deliveredAt}</small></td>
      <td><strong>{load.customer}</strong><small>{load.lane}</small></td>
      <td><span className={`status ${statusClass(load.status)}`}>{load.status}</span><small>{load.issue ?? 'Billing packet clear'}</small></td>
      <td><strong className={load.risk > 0 ? 'risk' : ''}>{formatMoney(load.risk)}</strong></td>
      <td>{interactive && (load.status === 'Blocked' || load.status === 'Review') ? <button className="ownerButton" onClick={() => assignLoad(load.id, 'Michael')} title="Assign to me">{load.owner}</button> : load.owner}</td>
      <td><div className="tableActions">
        {interactive && (load.status === 'Blocked' || load.status === 'Review') && <button className="tableAction success" onClick={() => resolveLoad(load.id)} title="Mark invoice ready"><Check size={14}/></button>}
        <Link className="tableAction" aria-label={`View ${load.id}`} href={`/loads/${load.id}`}><ChevronRight size={16}/></Link>
        {!interactive && <button className="tableAction ghost" aria-label="More"><MoreHorizontal size={16}/></button>}
      </div></td>
    </tr>)}
  </tbody></table></div>;
}
