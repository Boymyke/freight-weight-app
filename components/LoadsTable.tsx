'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, UserRound } from 'lucide-react';
import { FreightLoad, formatMoney } from '@/lib/data';
import { StatusPill } from '@/components/StatusPill';
import { useDemo } from '@/lib/demo-store';

export function LoadsTable({ loads, compact = false }: { loads: FreightLoad[]; compact?: boolean }) {
  const { resolveLoad, assignLoad } = useDemo();

  if (!loads.length) {
    return <div className="empty-state"><span>0</span><strong>No loads in this view</strong><p>Change the filters or add a new demo load from Demo controls.</p></div>;
  }

  return (
    <div className={`data-table-wrap ${compact ? 'data-table-wrap--compact' : ''}`}>
      <table className="data-table">
        <thead><tr><th>Load</th><th>Customer</th><th>Status</th><th>Amount</th><th>Exposure</th><th>Owner</th><th/></tr></thead>
        <tbody>
          {loads.map(load => (
            <tr key={load.id}>
              <td><Link href={`/loads/${load.id}`} className="load-link"><strong>{load.id}</strong><small>{load.deliveredAt}</small></Link></td>
              <td><div className="customer-cell"><strong>{load.customer}</strong><small>{load.lane}</small></div></td>
              <td><div className="status-cell"><StatusPill status={load.status}/><small>{load.issue ?? 'Ready for billing'}</small></div></td>
              <td className="money-cell">{formatMoney(load.amount)}</td>
              <td className={load.risk ? 'money-cell money-cell--risk' : 'money-cell'}>{formatMoney(load.risk)}</td>
              <td>
                {(load.status === 'Blocked' || load.status === 'Review') ? (
                  <button className="owner-chip" onClick={() => assignLoad(load.id, 'Michael')} title="Assign to me"><UserRound size={13}/>{load.owner}</button>
                ) : <span className="owner-text">{load.owner}</span>}
              </td>
              <td><div className="row-actions">
                {(load.status === 'Blocked' || load.status === 'Review') && <button className="row-icon row-icon--success" onClick={() => resolveLoad(load.id)} title="Mark invoice ready"><Check size={15}/></button>}
                <Link href={`/loads/${load.id}`} className="row-icon" title="Open load"><ArrowUpRight size={15}/></Link>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
