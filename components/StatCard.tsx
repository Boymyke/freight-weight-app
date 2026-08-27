import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function StatCard({
  label,
  value,
  note,
  accent = false,
  trend,
}: {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
  trend?: { value: string; positive?: boolean };
}) {
  const TrendIcon = trend?.positive === false ? ArrowDownRight : ArrowUpRight;
  return <div className={`statCard ${accent ? 'accent' : ''}`}>
    <div className="statCardTop"><span>{label}</span><button aria-label={`More options for ${label}`}>•••</button></div>
    <strong>{value}</strong>
    <div className="statCardFooter"><small>{note}</small>{trend && <em className={trend.positive === false ? 'negative' : ''}><TrendIcon size={12}/>{trend.value}</em>}</div>
  </div>;
}
