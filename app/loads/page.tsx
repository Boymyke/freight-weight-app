'use client';

import Link from 'next/link';
import { Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { LoadsTable } from '@/components/LoadsTable';
import { PageHeader } from '@/components/PageHeader';
import type { LoadStatus } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

const filters: Array<'All' | LoadStatus> = ['All', 'Blocked', 'Review', 'Ready to invoice', 'Invoiced'];

export default function LoadsPage() {
  const { loads } = useDemo();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status');
  const safeStatus = filters.includes(initialStatus as (typeof filters)[number]) ? initialStatus as (typeof filters)[number] : 'All';
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [filter, setFilter] = useState<(typeof filters)[number]>(safeStatus);

  const visible = useMemo(() => loads.filter(load => {
    const matchesFilter = filter === 'All' || load.status === filter;
    const haystack = `${load.id} ${load.customer} ${load.lane} ${load.issue ?? ''} ${load.owner}`.toLowerCase();
    return matchesFilter && haystack.includes(query.trim().toLowerCase());
  }), [loads, filter, query]);

  return <>
    <PageHeader
      eyebrow="Load control"
      title="Delivered loads"
      description="Inspect every post-delivery record, billing packet and exception from one place."
      actions={<Link className="button button--dark" href="/admin#new-load"><Plus size={15}/>Add demo load</Link>}
    />

    <section className="card loads-card">
      <div className="loads-toolbar">
        <div className="filter-pills">
          {filters.map(item => <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <div className="loads-toolbar-right">
          <label className="search-field"><Search size={16}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search load, customer, lane or owner"/></label>
          <button className="icon-button icon-button--border" title="Filter options"><Filter size={16}/></button>
          <button className="icon-button icon-button--border" title="View settings"><SlidersHorizontal size={16}/></button>
        </div>
      </div>
      <div className="list-summary"><div><span className="eyebrow">Current view</span><strong>{visible.length} loads</strong></div><span>{filter === 'All' ? 'All delivery states' : filter}</span></div>
      <LoadsTable loads={visible}/>
    </section>
  </>;
}
