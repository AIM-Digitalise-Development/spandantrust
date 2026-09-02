'use client';

import { useState, useEffect } from 'react';
import { Inbox, Search, Mail, Phone, Calendar } from 'lucide-react';

export default function ReceivedSuppliesPage() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReceivedSupplies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/supplies/received?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setSupplies(data.supplies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedSupplies();
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Inbox className="h-7 w-7 text-teal-500" /> Received Medicine Supplies
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View medicine inventory supplies dispatched to you by your direct upline.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by medicine name..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading Received Supplies...</div>
        ) : supplies.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No received medicine supplies found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Supply Date</th>
                  <th className="px-4 py-3.5">Medicine Name</th>
                  <th className="px-4 py-3.5">Supplied By (Sender)</th>
                  <th className="px-4 py-3.5">Quantity Received</th>
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
                      {s.sender ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{s.sender.name}</p>
                          <p className="text-xs font-mono text-teal-600 dark:text-teal-400">
                            {s.sender.userId} ({s.sender.role.replace(/_/g, ' ')})
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
    </div>
  );
}
