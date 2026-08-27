'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FreightLoad, loads as seedLoads, LoadStatus } from '@/lib/data';

type DocumentKey = 'pod' | 'rateCon' | 'carrierInvoice' | 'customerRequirements';
type AccessorialPatch = Partial<{ carrier: number; customer: number; evidence: boolean; approved: boolean }>;

type DemoContextValue = {
  companyName: string;
  loads: FreightLoad[];
  setCompanyName: (name: string) => void;
  resetDemo: () => void;
  seedScenario: (scenario: 'baseline' | 'clean' | 'high-risk') => void;
  updateLoad: (id: string, patch: Partial<FreightLoad>) => void;
  setLoadStatus: (id: string, status: LoadStatus) => void;
  resolveLoad: (id: string) => void;
  assignLoad: (id: string, owner: string) => void;
  toggleDocument: (id: string, key: DocumentKey) => void;
  updateAccessorial: (loadId: string, label: string, patch: AccessorialPatch) => void;
  addLoad: (load: FreightLoad) => void;
  removeLoad: (id: string) => void;
};

const STORAGE_KEY = 'relay-demo-state-v2';
const DemoContext = createContext<DemoContextValue | null>(null);

const cloneSeed = () => JSON.parse(JSON.stringify(seedLoads)) as FreightLoad[];

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [companyName, setCompanyNameState] = useState('Nexus Logistics');
  const [loads, setLoads] = useState<FreightLoad[]>(cloneSeed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { companyName?: string; loads?: FreightLoad[] };
        if (parsed.companyName) setCompanyNameState(parsed.companyName);
        if (Array.isArray(parsed.loads) && parsed.loads.length) setLoads(parsed.loads);
      }
    } catch {
      // The demo works with seed data even when storage is unavailable.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ companyName, loads }));
    } catch {
      // Ignore storage failures in private browsing environments.
    }
  }, [companyName, loads, hydrated]);

  const value = useMemo<DemoContextValue>(() => ({
    companyName,
    loads,
    setCompanyName: (name) => setCompanyNameState(name.trim() || 'Nexus Logistics'),
    resetDemo: () => {
      setCompanyNameState('Nexus Logistics');
      setLoads(cloneSeed());
    },
    seedScenario: (scenario) => {
      const base = cloneSeed();
      if (scenario === 'clean') {
        setLoads(base.map((load, index) => ({
          ...load,
          status: index % 3 === 0 ? 'Invoiced' : 'Ready to invoice',
          issue: undefined,
          risk: 0,
          owner: 'Automated',
          pod: true,
          rateCon: true,
          carrierInvoice: true,
          customerRequirements: true,
          accessorials: load.accessorials.map(a => ({ ...a, customer: a.carrier, evidence: true, approved: true })),
        })));
        return;
      }
      if (scenario === 'high-risk') {
        setLoads(base.map((load, index) => index < 9 ? {
          ...load,
          status: index % 2 === 0 ? 'Blocked' : 'Review',
          issue: load.issue ?? (index % 2 === 0 ? 'Missing billing document' : 'Manual rate review'),
          risk: load.risk || Math.round(load.amount * 0.35),
          owner: index % 3 === 0 ? 'Finance' : 'Operations',
        } : load));
        return;
      }
      setLoads(base);
    },
    updateLoad: (id, patch) => setLoads(current => current.map(load => load.id === id ? { ...load, ...patch } : load)),
    setLoadStatus: (id, status) => setLoads(current => current.map(load => load.id === id ? { ...load, status } : load)),
    resolveLoad: (id) => setLoads(current => current.map(load => load.id === id ? {
      ...load,
      status: 'Ready to invoice',
      issue: undefined,
      risk: 0,
      owner: 'Automated',
    } : load)),
    assignLoad: (id, owner) => setLoads(current => current.map(load => load.id === id ? { ...load, owner } : load)),
    toggleDocument: (id, key) => setLoads(current => current.map(load => load.id === id ? { ...load, [key]: !load[key] } : load)),
    updateAccessorial: (loadId, label, patch) => setLoads(current => current.map(load => {
      if (load.id !== loadId) return load;
      const accessorials = load.accessorials.map(item => item.label === label ? { ...item, ...patch } : item);
      const gap = accessorials.reduce((sum, item) => sum + Math.max(0, item.carrier - item.customer), 0);
      return {
        ...load,
        accessorials,
        risk: load.issue?.toLowerCase().includes('pod') || load.issue?.toLowerCase().includes('packet') ? load.risk : gap,
      };
    })),
    addLoad: (load) => setLoads(current => [load, ...current.filter(item => item.id !== load.id)]),
    removeLoad: (id) => setLoads(current => current.filter(load => load.id !== id)),
  }), [companyName, loads]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used inside DemoProvider');
  return value;
}
