import type { LoadStatus } from '@/lib/data';

export function StatusPill({ status }: { status: LoadStatus }) {
  const klass = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status-pill status-pill--${klass}`}><i/>{status}</span>;
}
