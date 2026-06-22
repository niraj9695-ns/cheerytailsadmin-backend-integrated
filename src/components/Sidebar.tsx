import { X, LayoutDashboard, Users, Home, Building2 } from 'lucide-react';
import Logo from './Logo';

export type NavItemKey = 'dashboard' | 'owners' | 'boardingOwners' | 'centers';

interface NavItem {
  key: NavItemKey;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { key: 'owners', label: 'Manage Pet Owner', icon: <Users size={18} /> },
  { key: 'boardingOwners', label: 'Manage Boarding Owners', icon: <Home size={18} /> },
  { key: 'centers', label: 'Manage Centers', icon: <Building2 size={18} /> },
];

interface SidebarProps {
  activeItem: NavItemKey;
  onNavigate: (key: NavItemKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function SidebarContent({
  activeItem,
  onNavigate,
  onCloseMobile,
  showClose,
}: {
  activeItem: NavItemKey;
  onNavigate: (key: NavItemKey) => void;
  onCloseMobile: () => void;
  showClose: boolean;
}) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <Logo size="md" />
        {showClose && (
          <button
            onClick={onCloseMobile}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key);
                onCloseMobile();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 shadow-sm border border-sky-100/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }
              `}
            >
              <span className={isActive ? 'text-sky-500' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} AdminPanel
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({ activeItem, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile drawer — fixed, slides in */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 shadow-xl shadow-slate-200/40 transition-transform duration-300 ease-out lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent
          activeItem={activeItem}
          onNavigate={onNavigate}
          onCloseMobile={onCloseMobile}
          showClose
        />
      </div>

      {/* Desktop sidebar — in-flow, part of flex row */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen">
        <SidebarContent
          activeItem={activeItem}
          onNavigate={onNavigate}
          onCloseMobile={onCloseMobile}
          showClose={false}
        />
      </aside>
    </>
  );
}
