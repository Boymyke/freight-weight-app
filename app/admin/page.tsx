'use client';

import { FormEvent, useState } from 'react';
import { Check, Plus, RotateCcw, ShieldAlert, Sparkles, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';
import type { FreightLoad, LoadStatus } from '@/lib/data';
import { formatMoney } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export default function AdminPage() {
  const { companyName, setCompanyName, loads, addLoad, removeLoad, resetDemo, seedScenario } = useDemo();
  const [workspace, setWorkspace] = useState(companyName);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    id: 'LD-99001', customer: 'Prospect Demo Account', lane: 'Nashville, TN → Atlanta, GA', amount: '4200', issue: 'Missing signed POD', risk: '4200', owner: 'Billing team', status: 'Blocked' as LoadStatus,
  });

  const saveWorkspace = () => {
    setCompanyName(workspace);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const amount = Math.max(0, Number(form.amount) || 0);
    const risk = Math.max(0, Number(form.risk) || 0);
    const clear = form.status === 'Ready to invoice' || form.status === 'Invoiced';
    const issue = form.issue.trim();
    const load: FreightLoad = {
      id: form.id.trim().toUpperCase() || `LD-${Math.floor(99000 + Math.random() * 900)}`,
      customer: form.customer.trim() || 'Demo customer',
      lane: form.lane.trim() || 'Origin → Destination',
      deliveredAt: 'Today · just now',
      ageHours: 1,
      amount,
      status: form.status,
      issue: clear ? undefined : issue || 'Manual review required',
      risk: clear ? 0 : risk,
      owner: form.owner.trim() || 'Operations',
      pod: !issue.toLowerCase().includes('pod'),
      rateCon: !issue.toLowerCase().includes('rate'),
      carrierInvoice: true,
      customerRequirements: !issue.toLowerCase().includes('customer'),
      accessorials: issue.toLowerCase().includes('detention') ? [{ label: 'Detention', carrier: risk || 300, customer: 0, evidence: true }] : [],
    };
    addLoad(load);
    setForm(current => ({ ...current, id: `LD-${Math.floor(99000 + Math.random() * 900)}` }));
  };

  return <>
    <PageHeader eyebrow="Demo controls" title="Shape the story before the call" description="Customize the workspace, switch scenarios and add prospect-specific demo loads without touching code." actions={<button className="button button--ghost" onClick={resetDemo}><RotateCcw size={15}/>Reset all data</button>}/>

    <div className="demo-warning"><ShieldAlert size={18}/><div><strong>Demo-only workspace</strong><span>This route is intentionally open and stores changes in localStorage. Do not put real customer data here until authentication and database policies are added.</span></div></div>

    <section className="admin-grid">
      <article className="card admin-card" id="settings">
        <div className="card-head card-head--compact"><div><span className="eyebrow">Workspace</span><h2>Prospect branding</h2></div></div>
        <p className="admin-copy">Rename the workspace before you record an audit so the product feels tailored to the prospect.</p>
        <label className="form-field"><span>Company / workspace name</span><input value={workspace} onChange={event => setWorkspace(event.target.value)} placeholder="e.g. GH Logistics"/></label>
        <button className="button button--dark button--full" onClick={saveWorkspace}><Check size={15}/>{saved ? 'Saved' : 'Save workspace'}</button>
      </article>

      <article className="card admin-card">
        <div className="card-head card-head--compact"><div><span className="eyebrow">Scenarios</span><h2>Switch the demo state</h2></div><Sparkles size={18}/></div>
        <p className="admin-copy">Use a scenario to change the story in seconds while you are pitching.</p>
        <div className="scenario-grid">
          <button onClick={() => seedScenario('baseline')}><span>01</span><div><strong>Baseline</strong><small>Mixed exceptions and ready loads</small></div></button>
          <button onClick={() => seedScenario('high-risk')}><span>02</span><div><strong>High leakage</strong><small>More blocked loads and manual review</small></div></button>
          <button onClick={() => seedScenario('clean')}><span>03</span><div><strong>Clean operations</strong><small>Desired future-state workflow</small></div></button>
        </div>
      </article>
    </section>

    <section className="card load-builder" id="new-load">
      <div className="card-head"><div><span className="eyebrow">Load builder</span><h2>Add a prospect-specific exception</h2><p>This makes the demo easier to personalize before an outreach video.</p></div><span className="storage-chip">Stored in this browser</span></div>
      <form className="load-builder-form" onSubmit={submit}>
        <label className="form-field"><span>Load number</span><input value={form.id} onChange={event => setForm({ ...form, id: event.target.value })}/></label>
        <label className="form-field"><span>Customer</span><input value={form.customer} onChange={event => setForm({ ...form, customer: event.target.value })}/></label>
        <label className="form-field form-field--wide"><span>Lane</span><input value={form.lane} onChange={event => setForm({ ...form, lane: event.target.value })}/></label>
        <label className="form-field"><span>Customer amount</span><input type="number" value={form.amount} onChange={event => setForm({ ...form, amount: event.target.value })}/></label>
        <label className="form-field"><span>Revenue at risk</span><input type="number" value={form.risk} onChange={event => setForm({ ...form, risk: event.target.value })}/></label>
        <label className="form-field form-field--wide"><span>Exception</span><input value={form.issue} onChange={event => setForm({ ...form, issue: event.target.value })}/></label>
        <label className="form-field"><span>Owner</span><input value={form.owner} onChange={event => setForm({ ...form, owner: event.target.value })}/></label>
        <label className="form-field"><span>Status</span><select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as LoadStatus })}><option>Blocked</option><option>Review</option><option>Ready to invoice</option><option>Invoiced</option></select></label>
        <div className="load-builder-submit"><button className="button button--dark" type="submit"><Plus size={15}/>Add load</button></div>
      </form>
    </section>

    <section className="card demo-data-card">
      <div className="card-head card-head--compact"><div><span className="eyebrow">Current data</span><h2>Demo loads</h2></div><span className="count-badge">{loads.length}</span></div>
      <div className="demo-load-list">
        {loads.map(load => <div className="demo-load-row" key={load.id}><div><strong>{load.id}</strong><small>{load.customer} · {load.lane}</small></div><StatusPill status={load.status}/><strong>{formatMoney(load.risk)}</strong><button onClick={() => removeLoad(load.id)} title={`Remove ${load.id}`}><Trash2 size={15}/></button></div>)}
      </div>
    </section>
  </>;
}
