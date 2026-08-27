'use client';

import { CheckCircle2, Clipboard, RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDemo } from '@/lib/demo-store';

const categories = [
  { name: 'Delivery documentation', weight: 20, questions: ['PODs are collected automatically', 'Missing or unsigned PODs are automatically flagged', 'Documents are attached to the correct load without manual re-keying'] },
  { name: 'Billing readiness', weight: 20, questions: ['Invoice-ready rules are defined by customer', 'Loads cannot silently sit in delivered status', 'Billing can see the exact blocker without asking operations'] },
  { name: 'Accessorial capture', weight: 20, questions: ['Detention, TONU and lumper events flow to billing', 'Supporting evidence is attached to each charge', 'Carrier-side charges are checked against customer-side billing'] },
  { name: 'Invoice reconciliation', weight: 15, questions: ['Carrier invoices are matched to rate confirmations', 'Rate mismatches enter a visible exception queue', 'Approvals and notes are audit-ready'] },
  { name: 'Systems integration', weight: 15, questions: ['TMS, email/documents and accounting data are connected', 'Teams do not rely on copy/paste between systems', 'Operational spreadsheets are not hidden systems of record'] },
  { name: 'Management visibility', weight: 10, questions: ['Leaders can see delivered-but-not-billed value', 'Exception aging is visible', 'Revenue leakage and recovery are measurable'] },
];

export function AuditTool() {
  const { companyName } = useDemo();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const score = useMemo(() => categories.reduce((total, category) => {
    const gaps = category.questions.filter(question => !answers[`${category.name}:${question}`]).length;
    return total + (gaps / category.questions.length) * category.weight;
  }, 0), [answers]);

  const label = score <= 20 ? 'Strong workflow' : score <= 40 ? 'Some friction' : score <= 60 ? 'Significant manual workflow' : score <= 80 ? 'High leakage risk' : 'Critical workflow risk';
  const recommendations = score <= 20
    ? ['Measure delivery-to-invoice time before adding more software.', 'Focus on edge-case exceptions and reporting quality.']
    : score <= 50
      ? ['Create one exception queue shared by operations and billing.', 'Standardize customer billing-readiness rules.', 'Track accessorial gaps before invoice release.']
      : ['Map every post-delivery handoff before automating it.', 'Centralize document and billing exceptions.', 'Quantify weekly hours spent resolving exceptions.', 'Pilot one high-frequency workflow before a larger build.'];

  const copySummary = async () => {
    const text = `${companyName} Delivery-to-Cash Audit\nRisk score: ${Math.round(score)}/100 — ${label}\n\nPriority findings:\n${recommendations.map(item => `- ${item}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return <>
    <section className="auditScoreCard">
      <div className="scoreDial" style={{ '--score': `${Math.round(score) * 3.6}deg` } as React.CSSProperties}>
        <div><strong>{Math.round(score)}</strong><span>/100</span></div>
      </div>
      <div className="auditScoreCopy">
        <p className="eyebrow">WORKFLOW RISK SCORE</p>
        <h2>{label}</h2>
        <p>Unchecked controls increase the score. Use this during discovery to structure the conversation, not to make claims from public information alone.</p>
      </div>
      <div className="auditScoreActions">
        <button className="secondaryButton" onClick={() => setAnswers({})}><RotateCcw size={15}/> Reset</button>
        <button className="primaryButton" onClick={copySummary}><Clipboard size={15}/>{copied ? 'Copied' : 'Copy summary'}</button>
      </div>
    </section>

    <div className="auditLayout">
      <div className="auditGrid">{categories.map(category => {
        const complete = category.questions.filter(question => answers[`${category.name}:${question}`]).length;
        return <section className="panel auditCard" key={category.name}>
          <div className="panelHeader"><div><p className="eyebrow">{category.weight} POINTS</p><h2>{category.name}</h2></div><span className="completionPill">{complete}/{category.questions.length}</span></div>
          <div className="auditQuestions">{category.questions.map(question => {
            const key = `${category.name}:${question}`;
            return <label key={question} className={answers[key] ? 'checked' : ''}>
              <input type="checkbox" checked={!!answers[key]} onChange={event => setAnswers(current => ({ ...current, [key]: event.target.checked }))}/>
              <span className="fakeCheck">{answers[key] && <CheckCircle2 size={16}/>}</span>
              <span>{question}</span>
            </label>;
          })}</div>
        </section>;
      })}</div>

      <aside className="panel recommendationPanel">
        <div className="recommendationIcon"><Sparkles size={18}/></div>
        <p className="eyebrow">AUDIT OUTPUT</p>
        <h2>What to investigate next</h2>
        <p>These are workflow hypotheses generated from the current answers.</p>
        <div className="recommendationList">{recommendations.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>)}</div>
      </aside>
    </div>
  </>;
}
