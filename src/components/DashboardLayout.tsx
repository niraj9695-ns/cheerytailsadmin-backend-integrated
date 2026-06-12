import { useState } from 'react';
import Sidebar, { NavItemKey } from './Sidebar';
import TopNavbar from './TopNavbar';

const pageTitles: Record<NavItemKey, string> = {
  dashboard: 'Dashboard',
  owners: 'Manage Owners',
  centers: 'Manage Centers',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeItem: NavItemKey;
  onNavigate: (key: NavItemKey) => void;
  onLogout: () => void;
}

export default function DashboardLayout({ children, activeItem, onNavigate, onLogout }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 flex">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-sky-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-100/25 blur-3xl" />
      </div>

      <Sidebar
        activeItem={activeItem}
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopNavbar
          pageTitle={pageTitles[activeItem]}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={onLogout}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
