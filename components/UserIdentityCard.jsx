'use client';

import { useRef } from 'react';
import { IdCard, Printer, Shield, QrCode } from 'lucide-react';

export default function UserIdentityCard({ user }) {
  const cardRef = useRef(null);

  const formattedDob = user?.dob
    ? new Date(user.dob).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'N/A';

  const issueDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : 'CURRENT';

  const roleTitle = user?.role ? user.role.replace(/_/g, ' ') : 'MEMBER';

  const handlePrint = () => {
    const printContent = cardRef.current;
    if (!printContent) return;

    const win = window.open('', '', 'height=700,width=800');
    win.document.write(`
      <html>
        <head>
          <title>ID Card - ${user?.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="bg-white flex justify-center items-center min-h-screen p-8">
          ${printContent.outerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <IdCard className="h-5 w-5 text-teal-500" /> Member Identity Card
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official identification badge issued by Spandan Trust.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:from-teal-400 hover:to-emerald-400 transition-all flex items-center gap-2 cursor-pointer"
            title="Print ID Card"
          >
            <Printer className="h-4 w-4" /> Print ID Card
          </button>
        </div>
      </div>

      {/* ID Card Visual Container */}
      <div className="flex justify-center p-2">
        <div
          ref={cardRef}
          className="w-[360px] bg-slate-950 text-white rounded-2xl overflow-hidden border-2 border-teal-500/40 shadow-2xl relative font-sans flex flex-col justify-between"
          style={{ minHeight: '520px' }}
        >
          {/* Card Top Brand Header */}
          <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 p-4 text-center relative">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-white fill-white/20" />
              <div>
                <h4 className="text-base font-black tracking-wider text-white uppercase leading-tight">
                  Spandan Trust
                </h4>
                <p className="text-[10px] font-bold text-teal-100 tracking-widest uppercase">
                  Digital Health Mission
                </p>
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow-md tracking-wider">
              Official Identity Badge
            </div>
          </div>

          {/* User Photo & Main Info */}
          <div className="px-5 pt-7 pb-4 text-center space-y-3 flex-1 flex flex-col justify-center">
            {/* Avatar / Photo */}
            <div className="relative mx-auto w-24 h-24 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 border-4 border-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-950 font-black text-3xl">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>

            {/* Name & Role Badge */}
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">{user?.name}</h3>
              <div className="mt-1 inline-block bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold uppercase px-3 py-0.5 rounded-full">
                {roleTitle}
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-left text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400 text-[11px]">User ID No:</span>
                <span className="font-mono font-bold text-teal-400 text-xs">{user?.userId}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400 text-[11px]">Mobile:</span>
                <span className="font-semibold text-slate-200 text-xs">{user?.mobile}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400 text-[11px]">DOB / Gender:</span>
                <span className="font-semibold text-slate-200 text-xs">
                  {formattedDob} ({user?.gender?.[0] || 'M'})
                </span>
              </div>
              <div className="flex justify-between items-start pt-0.5">
                <span className="text-slate-400 text-[11px] shrink-0 mr-2">Address:</span>
                <span className="font-semibold text-slate-300 text-[10px] text-right line-clamp-2">
                  {user?.address}
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer Security Bar */}
          <div className="bg-slate-900 border-t border-slate-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="h-8 w-8 text-teal-400 shrink-0" />
              <div className="text-[9px] text-slate-400 font-mono">
                <p className="text-slate-200 font-bold">ISSUED: {issueDate}</p>
                <p>STATUS: ACTIVE</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[8px] font-mono text-slate-500 tracking-tighter">
                ||| | |||| | ||||| |||
              </div>
              <p className="text-[9px] text-teal-500 font-bold">SPANDAN HEALTH</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
