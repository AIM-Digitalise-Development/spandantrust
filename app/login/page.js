'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, KeyRound, Mail, User, ShieldCheck, AlertCircle, ArrowRight, Settings } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [userIdOrEmail, setUserIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Seed Admin Modal state
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [setupSecret, setSetupSecret] = useState('');
  const [seedName, setSeedName] = useState('System Administrator');
  const [seedEmail, setSeedEmail] = useState('admin@medsystem.com');
  const [seedPassword, setSeedPassword] = useState('');
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMsg, setSeedMsg] = useState({ type: '', text: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdOrEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  const handleSeedAdmin = async (e) => {
    e.preventDefault();
    setSeedMsg({ type: '', text: '' });
    setSeedLoading(true);

    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupSecret,
          name: seedName,
          email: seedEmail,
          password: seedPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSeedMsg({ type: 'error', text: data.error || 'Seeding failed' });
      } else {
        setSeedMsg({
          type: 'success',
          text: `Admin created! User ID: ${data.user.userId}. You can now log in.`,
        });
        setUserIdOrEmail(data.user.userId);
      }
    } catch (err) {
      setSeedMsg({ type: 'error', text: 'Network or server error during seeding.' });
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-teal-500/20">
            <Activity className="h-8 w-8 text-slate-950 stroke-[2.5]" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          SpandanTrust
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Digital OPD & Medicine Distribution System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                User ID or Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={userIdOrEmail}
                  onChange={(e) => setUserIdOrEmail(e.target.value)}
                  placeholder="e.g. ADM-1001 or user@medsystem.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 focus:outline-hidden shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Log In to Dashboard'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Seed Admin Trigger Link */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>First time setup?</span>
            <button
              onClick={() => setShowSeedModal(true)}
              className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-semibold focus:outline-hidden cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
              Initialize Admin
            </button>
          </div>
        </div>
      </div>

      {/* Seed Admin Modal */}
      {showSeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-400" /> Initial Admin Setup
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Requires server-side <code className="text-teal-400">SETUP_SECRET</code>. Can only be used once.
            </p>

            {seedMsg.text && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  seedMsg.type === 'error'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                <span>{seedMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSeedAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Setup Secret (SETUP_SECRET)
                </label>
                <input
                  type="password"
                  required
                  value={setupSecret}
                  onChange={(e) => setSetupSecret(e.target.value)}
                  placeholder="Enter SETUP_SECRET from .env.local"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={seedEmail}
                  onChange={(e) => setSeedEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Password (Optional - Defaults to DOB format)
                </label>
                <input
                  type="password"
                  value={seedPassword}
                  onChange={(e) => setSeedPassword(e.target.value)}
                  placeholder="e.g. 01-01-1990"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={seedLoading}
                  className="flex-1 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  {seedLoading ? 'Seeding...' : 'Create Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSeedModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
