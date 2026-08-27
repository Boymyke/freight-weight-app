import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  trend,
  tone = 'default',
}: {
  label: string;
  value: string;
  note: string;
  icon?: LucideIcon;
  trend?: { value: string; positive?: boolean };
  tone?: 'default' | 'dark' | 'warning';
}) {
  const TrendIcon = trend?.positive === false ? ArrowDownRight : ArrowUpRight;

  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card-head">
        <div>
          {Icon && <span className="metric-icon"><Icon size={17} strokeWidth={1.8}/></span>}
          <span className="metric-label">{label}</span>
        </div>
        {trend && (
          <span className={`trend-chip ${trend.positive === false ? 'trend-chip--down' : ''}`}>
            <TrendIcon size={12}/>{trend.value}
          </span>
        )}
      </div>
      <strong className="metric-value">{value}</strong>
      <span className="metric-note">{note}</span>
    </article>
  );
}
