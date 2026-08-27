'use client';

import { Check, Clipboard, RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDemo } from '@/lib/demo-store';

const categories = [
  { name: 'Delivery documentation', weight: 20, questions: ['PODs are collected automatically', 'Missing or unsigned PODs are flagged automatically', 'Documents attach to the correct load without re-keying'] },
  { name: 'Billing readiness', weight: 20, questions: ['Invoice-ready rules are defined by customer', 'Delivered loads cannot silently sit unresolved', 'Billing sees the blocker without asking operations'] },
  { name: 'Accessorial capture', weight: 20, questions: ['Detention, TONU and lumper events flow to billing', 'Supporting evidence is attached to each charge', 'Carrier charges are compared with customer billing'] },
  { name: 'Invoice reconciliation', weight: 15, questions: ['Carrier invoices are matched to rate confirmations', 'Mismatches enter a visible exception queue', 'Approvals and notes are audit-ready'] },
  { name: 'Systems integration', weight: 15, questions: ['TMS, documents and accounting data are connected', 'Teams do not rely on copy/paste between systems', 'Spreadsheets are not hidden systems of record'] },
  { name: 'Management visibility', weight: 10, questions: ['Leaders see delivered-but-not-billed value', 'Exception aging is visible', 'Revenue recovery is measurable'] },
];

export function AuditTool() {
  const { companyName } = useDemo();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const score = useMemo(() => categories.reduce((total, category) => {
    const passed = category.questions.filter(question => answers[`${category.name}:${question}`]).length;
    const risk = 1 - passed / category.questions.length;
    return total + risk * category.weight;
  }, 0), [answers]);

  const rounded = Math.round(score);
  const label = rounded <= 20 ? 'Strong workflow' : rounded <= 40 ? 'Some friction' : rounded <= 60 ? 'Significant manual workflow' : rounded <= 80 ? 'High leakage risk' : 'Critical workflow risk';
  const checked = Object.values(answers).filter(Boolean).length;
  const totalQuestions = categories.reduce((sum, category) => sum + category.questions.length, 0);
  const recommendations = rounded <= 20
    ? ['Keep measuring delivery-to-invoice time.', 'Focus on edge-case exceptions and reporting quality.']
    : rounded <= 50
      ? ['Create one exception queue shared by operations and billing.', 'Standardize customer billing-readiness rules.', 'Track accessorial gaps before invoice release.']
      : ['Map every post-delivery handoff before automating it.', 'Centralize document and billing exceptions.', 'Quantify the hours spent resolving exceptions.', 'Pilot one high-frequency workflow before a larger build.'];

  const copySummary = async () => {
    const text = `${companyName} Delivery-to-Cash Audit\nRisk score: ${rounded}/100 — ${label}\nControls confirmed: ${checked}/${totalQuestions}\n\nPriority findings:\n${recommendations.map(item => `- ${item}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return <div className="audit-layout">
    <section className="audit-main">
      <article className="card audit-score-card">
        <div className="audit-score-number"><strong>{rounded}</strong><span>/100 risk</span></div>
        <div className="audit-score-copy"><span className="eyebrow">Current audit</span><h2>{label}</h2><p>Unchecked controls increase risk. Use this as a discovery structure, not as proof of financial loss.</p></div>
        <div className="audit-score-progress"><i style={{ width: `${Math.max(3, rounded)}%` }}/></div>
        <div className="audit-score-actions"><button className="button button--ghost" onClick={() => setAnswers({})}><RotateCcw size={15}/>Reset</button><button className="button button--dark" onClick={copySummary}><Clipboard size={15}/>{copied ? 'Copied' : 'Copy summary'}</button></div>
      </article>

      <div className="audit-sections">
        {categories.map((category, categoryIndex) => {
          const complete = category.questions.filter(question => answers[`${category.name}:${question}`]).length;
          return <article className="card audit-category" key={category.name}>
            <div className="audit-category-head"><span className="audit-index">{String(categoryIndex + 1).padStart(2, '0')}</span><div><h2>{category.name}</h2><p>{category.weight} risk points</p></div><span className="completion-chip">{complete}/{category.questions.length}</span></div>
            <div className="audit-question-list">
              {category.questions.map(question => {
                const key = `${category.name}:${question}`;
                const active = !!answers[key];
                return <button className={`audit-question ${active ? 'is-active' : ''}`} key={question} onClick={() => setAnswers(current => ({ ...current, [key]: !current[key] }))}>
                  <span className="audit-check">{active && <Check size={14}/>}</span>
                  <span>{question}</span>
                </button>;
              })}
            </div>
          </article>;
        })}
      </div>
    </section>

    <aside className="card audit-aside">
      <span className="audit-spark"><Sparkles size={18}/></span>
      <span className="eyebrow">Audit output</span>
      <h2>What to investigate next</h2>
      <p>These are workflow hypotheses generated from the controls you confirmed.</p>
      <div className="recommendation-list">
        {recommendations.map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}
      </div>
      <div className="audit-aside-note"><strong>{checked}/{totalQuestions} controls confirmed</strong><span>Keep asking for process evidence before estimating ROI.</span></div>
    </aside>
  </div>;
}
