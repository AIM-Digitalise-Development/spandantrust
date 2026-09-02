'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserPlus,
  Truck,
  Inbox,
  GitFork,
  FileText,
  UserCircle,
  Activity,
} from 'lucide-react';

export default function Sidebar({ user, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const role = user?.role || 'ADMIN';

  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Coordinators', href: '/dashboard/coordinators', icon: UserCheck },
          { name: 'All Users', href: '/dashboard/users', icon: Users },
          { name: 'Supply Medicine', href: '/dashboard/supplies/send', icon: Truck },
          { name: 'Hierarchy Tree', href: '/dashboard/tree', icon: GitFork },
          { name: 'Work Reports', href: '/dashboard/reports', icon: FileText },
          { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle },
        ];
      case 'COORDINATOR':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Supervisors', href: '/dashboard/supervisors', icon: UserPlus },
          { name: 'Received Supplies', href: '/dashboard/supplies/received', icon: Inbox },
          { name: 'Supply Medicine', href: '/dashboard/supplies/send', icon: Truck },
          { name: 'Hierarchy Tree', href: '/dashboard/tree', icon: GitFork },
          { name: 'Work Reports', href: '/dashboard/reports', icon: FileText },
          { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle },
        ];
      case 'SUPERVISOR':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'OPD Agents', href: '/dashboard/agents', icon: Users },
          { name: 'Received Supplies', href: '/dashboard/supplies/received', icon: Inbox },
          { name: 'Supply Medicine', href: '/dashboard/supplies/send', icon: Truck },
          { name: 'Hierarchy Tree', href: '/dashboard/tree', icon: GitFork },
          { name: 'Work Reports', href: '/dashboard/reports', icon: FileText },
          { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle },
        ];
      case 'DIGITAL_OPD_AGENT':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Patient Management', href: '/dashboard/patients', icon: Activity },
          { name: 'Received Supplies', href: '/dashboard/supplies/received', icon: Inbox },
          { name: 'My Work Reports', href: '/dashboard/reports', icon: FileText },
          { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 w-64 shadow-xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 bg-slate-950/40">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Activity className="h-6 w-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight leading-none">SpandanTrust</h1>
          <span className="text-[11px] text-teal-400 font-medium tracking-wide uppercase">Digital OPD System</span>
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
        <span className="text-xs font-semibold text-slate-400 block mb-1">Current Portal Role</span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
          {role.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen?.(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>SpandanTrust v1.0</p>
        <p className="text-[10px] text-slate-600 mt-0.5">Vercel Ready Architecture</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
