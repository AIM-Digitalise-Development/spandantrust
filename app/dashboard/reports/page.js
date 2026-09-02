'use client';

import { useState, useEffect } from 'react';
import { FileText, Filter, Calendar, Users, Truck, Activity, IndianRupee } from 'lucide-react';

export default function DownlineWorkReportsPage() {
  const [reports, setReports] = useState([]);
  const [downlineUsers, setDownlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchDownlineUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setDownlineUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      if (selectedUserId) params.append('userId', selectedUserId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/reports?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownlineUsers();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [roleFilter, selectedUserId, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-7 w-7 text-teal-500" /> Downline Work Reports
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track medicine distribution, patient entries, and activity logs across your organizational downline.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-semibold text-xs text-slate-500 uppercase tracking-wider">
          <Filter className="h-4 w-4 text-teal-500" /> Report Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="">All Roles</option>
              <option value="COORDINATOR">Coordinators</option>
              <option value="SUPERVISOR">Supervisors</option>
              <option value="DIGITAL_OPD_AGENT">Digital OPD Agents</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Filter by User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-teal-500"
            >
              <option value="">All Downline Users</option>
              {downlineUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.userId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Reports Content */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 text-sm">Generating Work Reports...</div>
      ) : reports.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">No report data found matching selected filters.</div>
      ) : (
        <div className="space-y-6">
          {reports.map((item) => (
            <div
              key={item.user.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              {/* User Profile Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.user.name}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold">
                      {item.user.userId}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.user.role.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Email: {item.user.email} • Mobile: {item.user.mobile}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Supplies Sent</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {item.suppliesSentCount} records
                  </p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                    {item.totalSentQuantity} units (₹{item.totalSentAmount.toLocaleString('en-IN')})
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Supplies Received</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {item.suppliesReceivedCount} records
                  </p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {item.totalReceivedQuantity} units (₹{item.totalReceivedAmount.toLocaleString('en-IN')})
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Patient Registrations</p>
                  <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {item.patientCount} patients
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Total Activity Count</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {item.suppliesSentCount + item.suppliesReceivedCount + item.patientCount} actions
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
