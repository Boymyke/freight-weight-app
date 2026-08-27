export function StatCard({ label, value, note, accent = false }: { label: string; value: string; note: string; accent?: boolean }) {
  return <div className={`statCard ${accent ? 'accent' : ''}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}
