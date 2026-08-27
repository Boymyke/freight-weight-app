'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, Command, Search, Share2, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useDemo } from '@/lib/demo-store';

const labels: Record<string, string> = {
  loads: 'Loads',
  exceptions: 'Exceptions',
  revenue: 'Revenue recovery',
  analytics: 'Analytics',
  audit: 'Revenue audit',
  admin: 'Demo controls',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loads, companyName } = useDemo();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');

  const segment = pathname.split('/').filter(Boolean)[0];
  const page = segment ? labels[segment] ?? 'Workspace' : 'Dashboard';
  const openExceptions = useMemo(() => loads.filter(load => load.status === 'Blocked' || load.status === 'Review'), [loads]);
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return loads.slice(0, 5);
    return loads.filter(load => `${load.id} ${load.customer} ${load.lane} ${load.issue ?? ''}`.toLowerCase().includes(q)).slice(0, 7);
  }, [loads, query]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(value => !value);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast('Demo URL copied');
    } catch {
      setToast('Copy the current URL from the browser');
    }
  };

  const goToLoad = (id: string) => {
    setSearchOpen(false);
    setQuery('');
    router.push(`/loads/${id}`);
  };

  return (
    <div className="app-shell">
      <Sidebar/>
      <section className="workspace-shell">
        <header className="topbar">
          <div className="breadcrumb"><span>{companyName}</span><i>/</i><strong>{page}</strong></div>
          <button className="global-search" onClick={() => setSearchOpen(true)}>
            <Search size={16}/><span>Search loads, customers, exceptions</span><kbd><Command size={12}/> K</kbd>
          </button>
          <div className="topbar-actions">
            <button className="icon-button" onClick={() => setNotificationsOpen(value => !value)} aria-label="Notifications">
              <Bell size={18}/>{openExceptions.length > 0 && <i className="notification-dot"/>}
            </button>
            <button className="profile-chip" onClick={() => router.push('/admin')}><span>FD</span><ChevronDown size={14}/></button>
            <button className="button button--dark button--sm" onClick={share}><Share2 size={15}/>Share demo</button>
          </div>

          {notificationsOpen && (
            <div className="notification-popover">
              <div className="popover-head"><strong>Needs attention</strong><button onClick={() => setNotificationsOpen(false)}><X size={16}/></button></div>
              {openExceptions.slice(0, 3).map(load => (
                <button key={load.id} className="notification-item" onClick={() => { setNotificationsOpen(false); router.push(`/loads/${load.id}`); }}>
                  <span><strong>{load.id}</strong><small>{load.issue ?? 'Billing exception'}</small></span><em>{load.ageHours}h</em>
                </button>
              ))}
              <button className="popover-action" onClick={() => { setNotificationsOpen(false); router.push('/exceptions'); }}>View exception queue</button>
            </div>
          )}
        </header>

        <main className="workspace-main">{children}</main>
      </section>

      {searchOpen && (
        <div className="command-backdrop" onMouseDown={() => setSearchOpen(false)}>
          <div className="command-panel" onMouseDown={event => event.stopPropagation()}>
            <div className="command-input"><Search size={18}/><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search load number, customer, lane or issue…"/><button onClick={() => setSearchOpen(false)}>Esc</button></div>
            <div className="command-section">
              <span className="command-label">Loads</span>
              {searchResults.map(load => (
                <button className="command-result" key={load.id} onClick={() => goToLoad(load.id)}>
                  <span className="command-result-icon"><Sparkles size={15}/></span>
                  <span><strong>{load.id} · {load.customer}</strong><small>{load.lane} · {load.issue ?? 'Billing packet clear'}</small></span>
                  <em>{load.status}</em>
                </button>
              ))}
              {!searchResults.length && <div className="command-empty">No loads match “{query}”.</div>}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
