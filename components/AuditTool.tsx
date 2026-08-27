'use client';

import { useMemo, useState } from 'react';

const categories = [
  { name: 'Delivery documentation', weight: 20, questions: ['PODs are collected automatically', 'Missing/unsigned PODs are automatically flagged', 'Documents are attached to the correct load without manual re-keying'] },
  { name: 'Billing readiness', weight: 20, questions: ['Invoice-ready rules are defined by customer', 'Loads cannot silently sit in delivered status', 'Billing can see the exact blocker without asking operations'] },
  { name: 'Accessorial capture', weight: 20, questions: ['Detention/TONU/lumper events flow to billing', 'Supporting evidence is attached to the charge', 'Carrier-side charges are checked against customer-side billing'] },
  { name: 'Invoice reconciliation', weight: 15, questions: ['Carrier invoices are matched to rate confirmations', 'Rate mismatches enter a visible exception queue', 'Approvals and notes are audit-ready'] },
  { name: 'Systems integration', weight: 15, questions: ['TMS, email/documents and accounting data are connected', 'Teams do not rely on copy/paste between systems', 'Operational spreadsheets are not acting as hidden systems of record'] },
  { name: 'Management visibility', weight: 10, questions: ['Leaders can see delivered-but-not-billed value', 'Exception aging is visible', 'Revenue leakage/recovery is measurable'] },
];

export function AuditTool() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const score = useMemo(() => categories.reduce((total, cat) => {
    const bad = cat.questions.filter(q => !answers[`${cat.name}:${q}`]).length;
    return total + (bad / cat.questions.length) * cat.weight;
  }, 0), [answers]);
  const label = score <= 20 ? 'Strong' : score <= 40 ? 'Some friction' : score <= 60 ? 'Significant manual workflow' : score <= 80 ? 'High leakage risk' : 'Critical';

  return <><section className="auditScore"><div><p className="eyebrow">WORKFLOW RISK SCORE</p><strong>{Math.round(score)}<span>/100</span></strong><p>{label}</p></div><small>Unchecked statements increase the risk score. Use this in discovery—not as a claim based on public data.</small></section><div className="auditGrid">{categories.map(cat => <section className="panel auditCard" key={cat.name}><div className="panelHeader"><div><p className="eyebrow">{cat.weight} POINTS</p><h2>{cat.name}</h2></div></div><div className="auditQuestions">{cat.questions.map(q => { const key = `${cat.name}:${q}`; return <label key={q}><input type="checkbox" checked={!!answers[key]} onChange={e => setAnswers(a => ({...a, [key]: e.target.checked}))}/><span>{q}</span></label>; })}</div></section>)}</div></>;
}
