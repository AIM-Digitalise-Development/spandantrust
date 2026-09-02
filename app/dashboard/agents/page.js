'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { Users, Plus, Search, Mail, Phone, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function ManageAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [documentBase64, setDocumentBase64] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [createdResult, setCreatedResult] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users?role=DIGITAL_OPD_AGENT&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setAgents(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [search]);

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'DIGITAL_OPD_AGENT',
          name,
          dob,
          gender,
          email,
          mobile,
          address,
          documentBase64,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error || 'Failed to create Digital OPD Agent');
      } else {
        setCreatedResult({
          userId: data.user.userId,
          name: data.user.name,
          email: data.user.email,
          initialPassword: data.initialPassword,
        });
        fetchAgents();
        setName('');
        setDob('');
        setEmail('');
        setMobile('');
        setAddress('');
        setDocumentBase64('');
      }
    } catch (err) {
      setFormError('Network or server error.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-7 w-7 text-emerald-500" /> Digital OPD Agents
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create and manage Digital OPD Agents assigned to your division.
          </p>
        </div>
        <button
          onClick={() => {
            setCreatedResult(null);
            setFormError('');
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer"
        >
          <Plus className="h-5 w-5" /> Add OPD Agent
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, User ID, email, or mobile..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading OPD Agents...</div>
        ) : agents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No Digital OPD Agents created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">User ID</th>
                  <th className="px-4 py-3.5">Full Name</th>
                  <th className="px-4 py-3.5">Email / Mobile</th>
                  <th className="px-4 py-3.5">DOB / Gender</th>
                  <th className="px-4 py-3.5">Document</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {agents.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{a.userId}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{a.name}</td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 space-y-0.5">
                      <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" />{a.email}</div>
                      <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" />{a.mobile}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                      <div>{new Date(a.dob).toLocaleDateString('en-IN')}</div>
                      <div className="text-xs text-slate-400">{a.gender}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      {a.documentUrl ? (
                        <a
                          href={a.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" /> View Upload
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">No Doc</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {a.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl my-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-500" /> Create Digital OPD Agent
            </h2>

            {createdResult ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="h-6 w-6" /> OPD Agent Created Successfully!
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl space-y-2 text-xs sm:text-sm font-mono border border-emerald-100 dark:border-emerald-900">
                  <p><strong className="text-slate-500">Name:</strong> {createdResult.name}</p>
                  <p><strong className="text-slate-500">Email:</strong> {createdResult.email}</p>
                  <p><strong className="text-slate-500">User ID:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-bold">{createdResult.userId}</span></p>
                  <p><strong className="text-slate-500">Initial Password (DOB):</strong> <span className="text-rose-600 dark:text-rose-400 font-bold">{createdResult.initialPassword}</span></p>
                </div>
                <p className="text-xs text-slate-500">
                  Credentials emailed to <strong>{createdResult.email}</strong>.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateAgent} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Meera Roy"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="opd.agent@example.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Clinic or locality address"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <CloudinaryUpload
                  onFileSelect={(base64) => setDocumentBase64(base64)}
                  label="PAN / Aadhaar Document"
                />

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {formSubmitting ? 'Creating...' : 'Create OPD Agent'}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
