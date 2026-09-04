'use client';

import { useState, useEffect } from 'react';
import { Truck, Plus, Search, Calendar, PackageCheck, IndianRupee, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SendMedicineSupplyPage() {
  const [downlineUsers, setDownlineUsers] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [receiverId, setReceiverId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async (searchTerm = search) => {
    try {
      setLoading(true);
      const [usersRes, suppliesRes] = await Promise.all([
        fetch('/api/users?supplyReceivers=true'),
        fetch(`/api/supplies?search=${encodeURIComponent(searchTerm)}`),
      ]);

      const usersData = await usersRes.json();
      const suppliesData = await suppliesRes.json();

      if (usersData.success) setDownlineUsers(usersData.users || []);
      if (suppliesData.success) setSupplies(suppliesData.supplies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSendSupply = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/supplies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId,
          medicineName,
          description,
          totalAmount,
          totalQuantity,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to record medicine supply');
      } else {
        setSuccessMsg('Medicine supply recorded successfully!');
        loadData();
        setReceiverId('');
        setMedicineName('');
        setDescription('');
        setTotalAmount('');
        setTotalQuantity('');
        setTimeout(() => setShowModal(false), 1500);
      }
    } catch (err) {
      setError('Network or server error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="h-7 w-7 text-teal-500" /> Supply Medicine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Record medicine distribution to your direct downline members.
          </p>
        </div>
        <button
          onClick={() => {
            setError('');
            setSuccessMsg('');
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-md hover:from-teal-400 hover:to-emerald-400 transition-all cursor-pointer"
        >
          <Plus className="h-5 w-5" /> Supply Medicine Entry
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by medicine name..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
        />
      </div>

      {/* Supplies Sent History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-800 dark:text-slate-200">
          Sent Supply History
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading Supply Records...</div>
        ) : supplies.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No medicine supplies sent yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Medicine Name</th>
                  <th className="px-4 py-3.5">Receiver</th>
                  <th className="px-4 py-3.5">Quantity</th>
                  <th className="px-4 py-3.5">Total Amount</th>
                  <th className="px-4 py-3.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {supplies.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-medium">
                      {new Date(s.supplyDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">{s.medicineName}</td>
                    <td className="px-4 py-3.5">
                      {s.receiver ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{s.receiver.name}</p>
                          <p className="text-xs font-mono text-teal-600 dark:text-teal-400">
                            {s.receiver.userId} ({s.receiver.role.replace(/_/g, ' ')})
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{s.totalQuantity} units</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{s.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate">{s.description || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Supply Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Truck className="h-6 w-6 text-teal-500" /> Record Medicine Supply
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendSupply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Receiver (Direct Downline Member)
                </label>
                <select
                  required
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500"
                >
                  <option value="">-- Choose Receiver --</option>
                  {downlineUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.userId} - {u.role.replace(/_/g, ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Medicine Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Batch #402, Expiry 2028"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                *Date automatically generated by system. This records a supply transaction record (No payment processing).
              </p>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:from-teal-400 hover:to-emerald-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Submit Supply Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
