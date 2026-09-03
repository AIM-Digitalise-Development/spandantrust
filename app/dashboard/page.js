'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  UserPlus,
  Truck,
  Inbox,
  Activity,
  Calendar,
  IndianRupee,
  PackageCheck,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [meRes, statsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/stats'),
        ]);

        const meData = await meRes.json();
        const statsData = await statsRes.json();

        if (meData.success) setUser(meData.user);
        if (statsData.success) setStats(statsData.stats);
      } catch (err) {
        console.error('Error loading dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const role = user?.role;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 lg:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-3">
            System Active • Role Scope: {role?.replace(/_/g, ' ')}
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Welcome to SpandanTrust
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Real-time trackable OPD patient registrations, medicine supply distribution chain, and organizational downline performance metrics.
          </p>
        </div>
      </div>

      {/* ADMIN Stats */}
      {role === 'ADMIN' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Coordinators"
            value={stats?.totalCoordinators || 0}
            icon={UserCheck}
            color="bg-blue-500/10 text-blue-500"
            href="/dashboard/coordinators"
          />
          <StatCard
            title="Supervisors"
            value={stats?.totalSupervisors || 0}
            icon={UserPlus}
            color="bg-purple-500/10 text-purple-500"
            href="/dashboard/users?role=SUPERVISOR"
          />
          <StatCard
            title="Digital OPD Agents"
            value={stats?.totalAgents || 0}
            icon={Users}
            color="bg-emerald-500/10 text-emerald-500"
            href="/dashboard/users?role=DIGITAL_OPD_AGENT"
          />
          <StatCard
            title="Total Patient Entries"
            value={stats?.totalPatients || 0}
            icon={Activity}
            color="bg-teal-500/10 text-teal-500"
            href="/dashboard/reports"
          />
          <StatCard
            title="Medicine Supply Records"
            value={stats?.totalSuppliesCount || 0}
            icon={Truck}
            color="bg-indigo-500/10 text-indigo-500"
            href="/dashboard/supplies/send"
          />
          <StatCard
            title="Total Quantity Distributed"
            value={stats?.totalQuantitySupplied || 0}
            icon={PackageCheck}
            color="bg-amber-500/10 text-amber-500"
          />
          <StatCard
            title="Total Supply Value"
            value={`₹${(stats?.totalSupplyAmount || 0).toLocaleString('en-IN')}`}
            icon={IndianRupee}
            color="bg-emerald-500/10 text-emerald-500"
          />
        </div>
      )}

      {/* COORDINATOR Stats */}
      {role === 'COORDINATOR' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="My Supervisors"
            value={stats?.totalSupervisors || 0}
            icon={UserPlus}
            color="bg-purple-500/10 text-purple-500"
            href="/dashboard/supervisors"
          />
          <StatCard
            title="Downline OPD Agents"
            value={stats?.totalAgents || 0}
            icon={Users}
            color="bg-emerald-500/10 text-emerald-500"
            href="/dashboard/reports"
          />
          <StatCard
            title="Total Downline Patients"
            value={stats?.totalPatients || 0}
            icon={Activity}
            color="bg-teal-500/10 text-teal-500"
            href="/dashboard/reports"
          />
          <StatCard
            title="Supplies Received (from Admin)"
            value={stats?.medicineReceivedCount || 0}
            icon={Inbox}
            color="bg-teal-500/10 text-teal-500"
            href="/dashboard/supplies/received"
          />
          <StatCard
            title="Supplies Distributed (to Supervisors)"
            value={stats?.medicineSuppliedCount || 0}
            icon={Truck}
            color="bg-blue-500/10 text-blue-500"
            href="/dashboard/supplies/send"
          />
        </div>
      )}

      {/* SUPERVISOR Stats */}
      {role === 'SUPERVISOR' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="My Digital OPD Agents"
            value={stats?.totalAgents || 0}
            icon={Users}
            color="bg-emerald-500/10 text-emerald-500"
            href="/dashboard/agents"
          />
          <StatCard
            title="Total Downline Patients"
            value={stats?.totalPatients || 0}
            icon={Activity}
            color="bg-teal-500/10 text-teal-500"
            href="/dashboard/reports"
          />
          <StatCard
            title="Supplies Received (from Coordinator)"
            value={stats?.medicineReceivedCount || 0}
            icon={Inbox}
            color="bg-teal-500/10 text-teal-500"
            href="/dashboard/supplies/received"
          />
          <StatCard
            title="Supplies Distributed (to Agents)"
            value={stats?.medicineSuppliedCount || 0}
            icon={Truck}
            color="bg-indigo-500/10 text-indigo-500"
            href="/dashboard/supplies/send"
          />
        </div>
      )}

      {/* DIGITAL OPD AGENT Stats */}
      {role === 'DIGITAL_OPD_AGENT' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              title="Total Patients Registered"
              value={stats?.totalPatients || 0}
              icon={Activity}
              color="bg-teal-500/10 text-teal-500"
              href="/dashboard/patients"
            />
            <StatCard
              title="Today's Patient Entries"
              value={stats?.todayPatients || 0}
              icon={Calendar}
              color="bg-emerald-500/10 text-emerald-500"
              href="/dashboard/patients"
            />
          </div>

          {/* Recent Patient Entries */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-500" /> Recent Patient Registrations
              </h3>
              <Link
                href="/dashboard/patients"
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                View All Patients <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {stats?.recentPatients && stats.recentPatients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Gender / Age</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Visit Date</th>
                      <th className="px-4 py-3">OPD Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {stats.recentPatients.map((pt) => (
                      <tr key={pt._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{pt.patientName}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{pt.gender} • {pt.dobOrAge}</td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">{pt.mobile}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(pt.visitDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{pt.opdDetails || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">No patient records entered yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, href }) {
  const content = (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">{value}</p>
        </div>
        <div className={`p-3.5 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 stroke-[2]" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
