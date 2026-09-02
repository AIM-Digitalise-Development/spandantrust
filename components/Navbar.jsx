'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, setIsMobileOpen }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/10 text-purple-600 border-purple-200 dark:text-purple-400 dark:border-purple-800';
      case 'COORDINATOR':
        return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800';
      case 'SUPERVISOR':
        return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:text-amber-400 dark:border-amber-800';
      case 'DIGITAL_OPD_AGENT':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between">
        {/* Mobile Hamburger Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Welcome back, {user?.name || 'User'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              User ID: <span className="font-mono font-medium text-teal-600 dark:text-teal-400">{user?.userId || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* Right Section: Role & Profile Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(
                user?.role
              )}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {user?.role?.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50 transition-colors focus:outline-hidden disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
