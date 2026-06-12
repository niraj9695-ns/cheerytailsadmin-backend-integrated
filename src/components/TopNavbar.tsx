import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';

interface TopNavbarProps {
  pageTitle: string;
  onMenuClick: () => void;
  onLogout: () => void;
}

export default function TopNavbar({ pageTitle, onMenuClick, onLogout }: TopNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">{pageTitle}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search…"
              className="w-56 lg:w-64 h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Notification bell */}
          <button
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="User menu"
              aria-haspopup
              aria-expanded={profileOpen}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <span className="hidden lg:block text-sm font-medium text-slate-700">Admin</span>
              <ChevronDown size={14} className="text-slate-400 hidden lg:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-20 mt-1 w-48 origin-top-right animate-fade-in">
                <div className="rounded-lg bg-white shadow-lg shadow-slate-200/60 border border-slate-100 py-1">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <User size={15} />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <Settings size={15} />
                    Settings
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
