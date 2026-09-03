'use client';

import { useState, useEffect } from 'react';
import { FileText, Filter, Calendar, Users, Truck, Activity, IndianRupee, X, Search, Inbox, PackageCheck } from 'lucide-react';

export default function DownlineWorkReportsPage() {
  const [reports, setReports] = useState([]);
  const [downlineUsers, setDownlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal States
  const [activePatientModal, setActivePatientModal] = useState(null);
  const [activeSentModal, setActiveSentModal] = useState(null);
  const [activeReceivedModal, setActiveReceivedModal] = useState(null);
  const [modalSearch, setModalSearch] = useState('');

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

  // Modal Search Filters
  const filteredModalPatients = (activePatientModal?.patients || []).filter((p) => {
    if (!modalSearch) return true;
    const term = modalSearch.toLowerCase();
    return (
      p.patientName?.toLowerCase().includes(term) ||
      p.mobile?.includes(term) ||
      p.address?.toLowerCase().includes(term) ||
      p.opdDetails?.toLowerCase().includes(term) ||
      p.agent?.name?.toLowerCase().includes(term) ||
      p.agent?.userId?.toLowerCase().includes(term) ||
      p.agent?.parent?.name?.toLowerCase().includes(term) ||
      p.agent?.parent?.userId?.toLowerCase().includes(term)
    );
  });

  const filteredModalSentSupplies = (activeSentModal?.supplies || []).filter((s) => {
    if (!modalSearch) return true;
    const term = modalSearch.toLowerCase();
    return (
      s.medicineName?.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term) ||
      s.receiver?.name?.toLowerCase().includes(term) ||
      s.receiver?.userId?.toLowerCase().includes(term)
    );
  });

  const filteredModalReceivedSupplies = (activeReceivedModal?.supplies || []).filter((s) => {
    if (!modalSearch) return true;
    const term = modalSearch.toLowerCase();
    return (
      s.medicineName?.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term) ||
      s.sender?.name?.toLowerCase().includes(term) ||
      s.sender?.userId?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-7 w-7 text-teal-500" /> Downline Work Reports
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track cumulative medicine distribution, patient entries, and activity logs across your organizational downline.
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Supplies Sent Card (Clickable Popup Trigger) */}
                <div
                  onClick={() => {
                    setModalSearch('');
                    setActiveSentModal({ user: item.user, supplies: item.suppliesSentList || [] });
                  }}
                  className="bg-teal-500/10 border border-teal-500/30 p-3.5 rounded-xl cursor-pointer group hover:bg-teal-500/20 hover:border-teal-500 transition-all shadow-xs"
                  title="Click to view supplies sent details"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">Supplies Sent</p>
                    <span className="text-[10px] bg-teal-600 text-white font-bold px-1.5 py-0.5 rounded-md group-hover:scale-105 transition-transform">
                      Click to View 🔍
                    </span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {item.suppliesSentCount} records
                  </p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium underline mt-0.5">
                    {item.totalSentQuantity} units (₹{item.totalSentAmount.toLocaleString('en-IN')}) →
                  </p>
                </div>

                {/* Supplies Received Card (Clickable Popup Trigger) */}
                <div
                  onClick={() => {
                    setModalSearch('');
                    setActiveReceivedModal({ user: item.user, supplies: item.suppliesReceivedList || [] });
                  }}
                  className="bg-indigo-500/10 border border-indigo-500/30 p-3.5 rounded-xl cursor-pointer group hover:bg-indigo-500/20 hover:border-indigo-500 transition-all shadow-xs"
                  title="Click to view supplies received details"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Supplies Received</p>
                    <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded-md group-hover:scale-105 transition-transform">
                      Click to View 🔍
                    </span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {item.suppliesReceivedCount} records
                  </p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium underline mt-0.5">
                    {item.totalReceivedQuantity} units (₹{item.totalReceivedAmount.toLocaleString('en-IN')}) →
                  </p>
                </div>

                {/* Patient Registrations Card (Clickable Popup Trigger) */}
                <div
                  onClick={() => {
                    setModalSearch('');
                    setActivePatientModal({ user: item.user, patients: item.patients || [] });
                  }}
                  className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl cursor-pointer group hover:bg-emerald-500/20 hover:border-emerald-500 transition-all shadow-xs"
                  title="Click to view downline patient records"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Patient Registrations</p>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-md group-hover:scale-105 transition-transform">
                      Click to View 🔍
                    </span>
                  </div>
                  <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {item.patientCount} patients
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium underline mt-0.5">
                    View hierarchy patient details →
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Supplies Sent Modal Popup */}
      {activeSentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-4xl shadow-2xl my-8 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="h-6 w-6 text-teal-500" /> Supplies Sent Report
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sender:{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeSentModal.user.name}</span> (
                  {activeSentModal.user.role.replace(/_/g, ' ')}) • Total:{' '}
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                    {activeSentModal.supplies.length} Record{activeSentModal.supplies.length === 1 ? '' : 's'}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setActiveSentModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search inside sent supplies (medicine name, receiver name/ID, description)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              {filteredModalSentSupplies.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No supplies sent records found.</div>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3">Supply Date</th>
                      <th className="px-4 py-3">Medicine Name</th>
                      <th className="px-4 py-3">Receiver (Downline)</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Total Amount</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredModalSentSupplies.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">
                          {new Date(s.supplyDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{s.medicineName}</td>
                        <td className="px-4 py-3">
                          {s.receiver ? (
                            <div>
                              <span className="font-semibold text-teal-600 dark:text-teal-400">{s.receiver.name}</span>
                              <span className="block text-[11px] font-mono text-slate-400">
                                ({s.receiver.userId} - {s.receiver.role.replace(/_/g, ' ')})
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{s.totalQuantity} units</td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{s.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{s.description || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveSentModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supplies Received Modal Popup */}
      {activeReceivedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-4xl shadow-2xl my-8 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Inbox className="h-6 w-6 text-indigo-500" /> Supplies Received Report
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Receiver:{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeReceivedModal.user.name}</span> (
                  {activeReceivedModal.user.role.replace(/_/g, ' ')}) • Total:{' '}
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {activeReceivedModal.supplies.length} Record{activeReceivedModal.supplies.length === 1 ? '' : 's'}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setActiveReceivedModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search inside received supplies (medicine name, sender name/ID, description)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              {filteredModalReceivedSupplies.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No supplies received records found.</div>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3">Supply Date</th>
                      <th className="px-4 py-3">Medicine Name</th>
                      <th className="px-4 py-3">Sender (Upline)</th>
                      <th className="px-4 py-3">Quantity Received</th>
                      <th className="px-4 py-3">Total Amount</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredModalReceivedSupplies.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">
                          {new Date(s.supplyDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{s.medicineName}</td>
                        <td className="px-4 py-3">
                          {s.sender ? (
                            <div>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{s.sender.name}</span>
                              <span className="block text-[11px] font-mono text-slate-400">
                                ({s.sender.userId} - {s.sender.role.replace(/_/g, ' ')})
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{s.totalQuantity} units</td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{s.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{s.description || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveReceivedModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Records Modal Popup */}
      {activePatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-4xl shadow-2xl my-8 relative max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-6 w-6 text-emerald-500" /> Patient Registrations Report
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Hierarchy Line:{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activePatientModal.user.name}
                  </span>{' '}
                  ({activePatientModal.user.role.replace(/_/g, ' ')}) • Total:{' '}
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {activePatientModal.patients.length} Patient{activePatientModal.patients.length === 1 ? '' : 's'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setActivePatientModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="py-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search inside patient records (name, mobile, address, OPD details, agent)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Patient Records Table */}
            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              {filteredModalPatients.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No patient records found.</div>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3">Visit Date</th>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Gender / Age</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Address</th>
                      <th className="px-4 py-3">OPD Details</th>
                      <th className="px-4 py-3">Registered By (Agent)</th>
                      <th className="px-4 py-3">Supervisor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredModalPatients.map((pt) => (
                      <tr key={pt._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">
                          {new Date(pt.visitDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{pt.patientName}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{pt.gender} • {pt.dobOrAge}</td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">{pt.mobile}</td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{pt.address}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                          {pt.opdDetails || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          {pt.agent ? (
                            <div>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {pt.agent.name}
                              </span>
                              <span className="block text-[11px] font-mono text-slate-400">({pt.agent.userId})</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {pt.agent?.parent ? (
                            <div>
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                {pt.agent.parent.name}
                              </span>
                              <span className="block text-[11px] font-mono text-slate-400">
                                ({pt.agent.parent.userId})
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActivePatientModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
