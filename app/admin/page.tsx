'use client';

import { FormEvent, useState } from 'react';
import { Check, Plus, RotateCcw, ShieldAlert, Sparkles, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { FreightLoad, LoadStatus, formatMoney, statusClass } from '@/lib/data';
import { useDemo } from '@/lib/demo-store';

export default function AdminPage() {
  const { companyName, setCompanyName, loads, addLoad, removeLoad, resetDemo, seedScenario } = useDemo();
  const [workspace, setWorkspace] = useState(companyName);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    id: 'LD-99001',
    customer: 'Prospect Demo Account',
    lane: 'Nashville, TN → Atlanta, GA',
    amount: '4200',
    issue: 'Missing signed POD',
    risk: '4200',
    owner: 'Billing team',
    status: 'Blocked' as LoadStatus,
  });

  const saveWorkspace = () => {
    setCompanyName(workspace);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const amount = Math.max(0, Number(form.amount) || 0);
    const risk = Math.max(0, Number(form.risk) || 0);
    const load: FreightLoad = {
      id: form.id.trim().toUpperCase() || `LD-${Math.floor(99000 + Math.random() * 900)}`,
      customer: form.customer.trim() || 'Demo customer',
      lane: form.lane.trim() || 'Origin → Destination',
      deliveredAt: 'Today · just now',
      ageHours: 1,
      amount,
      status: form.status,
      issue: form.status === 'Ready to invoice' || form.status === 'Invoiced' ? undefined : form.issue.trim() || 'Manual review required',
      risk: form.status === 'Ready to invoice' || form.status === 'Invoiced' ? 0 : risk,
      owner: form.owner.trim() || 'Operations',
      pod: !form.issue.toLowerCase().includes('pod'),
      rateCon: !form.issue.toLowerCase().includes('rate'),
      carrierInvoice: true,
      customerRequirements: !form.issue.toLowerCase().includes('customer'),
      accessorials: form.issue.toLowerCase().includes('detention') ? [{ label: 'Detention', carrier: risk || 300, customer: 0, evidence: true }] : [],
    };
    addLoad(load);
    setForm(current => ({ ...current, id: `LD-${Math.floor(99000 + Math.random() * 900)}` }));
  };

  return <>
    <PageHeader
      eyebrow="DEMO CONTROLS"
      title="Build the story before the sales call"
      description="This route is intentionally URL-accessible for the sales demo. It uses browser storage, so you can change the scenario without creating another account."
      actions={<button className="secondaryButton compact" onClick={resetDemo}><RotateCcw size={15}/> Reset everything</button>}
    />

    <div className="adminNotice"><ShieldAlert size={18}/><div><strong>Demo-only access</strong><span>/admin has no authentication by design. Add real auth and database policies before using this with sensitive customer data.</span></div></div>

    <section className="adminGrid pagePanel">
      <div className="panel" id="settings">
        <div className="panelHeader"><div><p className="eyebrow">WORKSPACE</p><h2>Prospect branding</h2></div></div>
        <p className="panelText">Rename the workspace before recording an audit so the demo feels relevant to the prospect.</p>
        <label className="fieldLabel">Company / workspace name<input value={workspace} onChange={event => setWorkspace(event.target.value)} placeholder="e.g. GH Logistics"/></label>
        <button className="primaryButton fullButton" onClick={saveWorkspace}><Check size={15}/>{saved ? 'Saved' : 'Save workspace'}</button>
      </div>

      <div className="panel">
        <div className="panelHeader"><div><p className="eyebrow">SCENARIOS</p><h2>Switch the demo state</h2></div><Sparkles size={18}/></div>
        <p className="panelText">Use baseline for most demos, high-risk for the “money stuck” story, and clean ops to show the desired future state.</p>
        <div className="scenarioList">
          <button onClick={() => seedScenario('baseline')}><strong>Baseline</strong><span>Mixed exceptions and ready loads</span></button>
          <button onClick={() => seedScenario('high-risk')}><strong>High leakage</strong><span>More blocked loads and manual review</span></button>
          <button onClick={() => seedScenario('clean')}><strong>Clean operations</strong><span>Most loads invoice-ready or invoiced</span></button>
        </div>
      </div>
    </section>

    <section className="panel pagePanel" id="new-load">
      <div className="panelHeader"><div><p className="eyebrow">LOAD BUILDER</p><h2>Add a custom prospect scenario</h2></div><span className="countPill">Stored in this browser</span></div>
      <form className="loadForm" onSubmit={submit}>
        <label className="fieldLabel">Load number<input value={form.id} onChange={event => setForm({ ...form, id: event.target.value })}/></label>
        <label className="fieldLabel">Customer<input value={form.customer} onChange={event => setForm({ ...form, customer: event.target.value })}/></label>
        <label className="fieldLabel formWide">Lane<input value={form.lane} onChange={event => setForm({ ...form, lane: event.target.value })}/></label>
        <label className="fieldLabel">Customer amount<input type="number" value={form.amount} onChange={event => setForm({ ...form, amount: event.target.value })}/></label>
        <label className="fieldLabel">Revenue at risk<input type="number" value={form.risk} onChange={event => setForm({ ...form, risk: event.target.value })}/></label>
        <label className="fieldLabel formWide">Exception / issue<input value={form.issue} onChange={event => setForm({ ...form, issue: event.target.value })}/></label>
        <label className="fieldLabel">Owner<input value={form.owner} onChange={event => setForm({ ....form, owner: event.target.value })}/></label>
        <label className="fieldLabel">Status<select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as LoadStatus })}><option>Blocked</option><option>Review</option><option>Ready to invoice</option><option>Invoiced</option></select></label>
        <div className="formSubmit"><button className="primaryButton" type="submit"><Plus size={15}/> Add load to demo</button></div>
      </form>
    </section>

    <section className="panel pagePanel">
      <div className="panelHeader"><div><p className="eyebrow">DEMO DATA</p><h2>Current loads</h2></div><span className="countPill">{loads.length} loads</span></div>
      <div className="adminLoadList">{loads.map(load => <div key={load.id}>
        <div><strong>{load.id}</strong><span>{load.customer} · {load.lane}</span></div>
        <span className={`status ${statusClass(load.status)}`}>{load.status}</span>
        <strong>{formatMoney(load.risk)}</strong>
        <button aria-label={`Remove ${load.id}`} onClick={() => removeLoad(load.id)}><Trash2 size={15}/></button>
      </div>)}</div>
    </section>
  </>;
}
