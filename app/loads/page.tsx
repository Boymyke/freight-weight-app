'use client';

import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { LoadsTable } from '@/components/LoadsTable';
import { PageHeader } from '@/components/PageHeader';
import { LoadStatus } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

const filters: Array<'All' | LoadStatus> = ['All', 'Blocked', 'Review', 'Ready to invoice', 'Invoiced'];

export default function LoadsPage() {
  const { loads } = useDemo();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');

  const visible = useMemo(() => loads.filter(load => {
    const matchesFilter = filter === 'All' || load.status === filter;
    const haystack = `${load.id} ${load.customer} ${load.lane} ${load.issue ?? ''} ${load.owner}`.toLowerCase();
    return matchesFilter && haystack.includes(query.trim().toLowerCase());
  }), [loads, filter, query]);

  return <>
    <PageHeader
      eyebrow="LOAD CONTROL"
      title="Delivered loads"
      description="Search, filter and open any load to change documents, ownership, accessorials or invoice readiness."
      actions={<Link className="primaryButton" href="/admin#new-load"><Plus size={15}/> Add demo load</Link>}
    />

    <section className="panel tablePanel pagePanel">
      <div className="listToolbar">
        <div className="filterTabs">{filters.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <label className="tableSearch"><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search load, customer, owner…"/></label>
      </div>
      <div className="panelHeader tableHeader"><div><p className="eyebrow">RECENT DELIVERIES</p><h2>{visible.length} loads in this view</h2></div><span className="countPill">Interactive table</span></div>
      <LoadsTable loads={visible} interactive/>
    </section>
  </>;
}
