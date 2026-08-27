import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FreightLoad, formatMoney } from '@/lib/data';

export function LoadsTable({ loads }: { loads: FreightLoad[] }) {
  return <div className="tableWrap"><table><thead><tr><th>Load</th><th>Customer / lane</th><th>Issue</th><th>Revenue at risk</th><th>Owner</th><th></th></tr></thead><tbody>
    {loads.map(load => <tr key={load.id}>
      <td><Link href={`/loads/${load.id}`} className="loadId">{load.id}</Link><small>{load.deliveredAt}</small></td>
      <td><strong>{load.customer}</strong><small>{load.lane}</small></td>
      <td><span className={`status ${load.status.toLowerCase().replaceAll(' ', '-')}`}>{load.status}</span><small>{load.issue ?? 'No exception detected'}</small></td>
      <td><strong className={load.risk > 0 ? 'risk' : ''}>{formatMoney(load.risk)}</strong></td>
      <td>{load.owner}</td>
      <td><Link aria-label={`View ${load.id}`} href={`/loads/${load.id}`}><ChevronRight size={18}/></Link></td>
    </tr>)}
  </tbody></table></div>
}
