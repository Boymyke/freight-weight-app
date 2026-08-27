'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, CircleHelp, Copy, Mail, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useDemo } from '@/lib/demo-store';

const labels: Record<string, string> = {
  loads: 'Loads',
  exceptions: 'Exceptions',
  revenue: 'Revenue',
  analytics: 'Analytics',
  audit: 'Revenue audit',
  admin: 'Demo controls',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { companyName } = useDemo();
  const [toast, setToast] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const segment = pathname.split('/').filter(Boolean)[0];
  const current = segment ? labels[segment] ?? 'Workspace' : 'Dashboard';

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast('Demo link copied');
    } catch {
      setToast('Copy the URL from your browser');
    }
  };

  return <div className="appFrame">
    <Sidebar/>
    <div className="appContent">
      <header className="globalTopbar">
        <div className="crumbs">
          <div className="historyButtons">
            <button onClick={() => router.back()} aria-label="Go back">‹</button>
            <button onClick={() => router.forward()} aria-label="Go forward">›</button>
          </div>
          <span>{companyName}</span><b>›</b><strong>{current}</strong>
        </div>
        <div className="globalActions">
          <button className="topIcon" title="Help" onClick={() => setToast('Demo tip: use /admin to change the scenario')}><CircleHelp size={17}/></button>
          <button className="topIcon" title="Messages" onClick={() => setToast('No unread demo messages')}><Mail size={17}/></button>
          <div className="notificationWrap">
            <button className="topIcon" title="Notifications" onClick={() => setNotificationsOpen(value => !value)}><Bell size={17}/><i/></button>
            {notificationsOpen && <div className="notificationMenu">
              <strong>Revenue alerts</strong>
              <p>3 accessorials need review.</p>
              <p>2 blocked loads are older than 24 hours.</p>
              <button onClick={() => { setNotificationsOpen(false); router.push('/exceptions'); }}>Open exception queue</button>
            </div>}
          </div>
          <button className="profileButton" onClick={() => router.push('/admin')}><span>FD</span><ChevronDown size={14}/></button>
          <button className="shareButton" onClick={share}><Share2 size={16}/> Share</button>
        </div>
      </header>
      <main className="mainContent">{children}</main>
    </div>
    {toast && <div className="toast"><Copy size={15}/>{toast}</div>}
  </div>;
}
