'use client';

import { useRef } from 'react';
import { ShieldCheck, Printer, Award } from 'lucide-react';

export default function AgreementCertificate({ user }) {
  const certRef = useRef(null);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  const formattedDob = user?.dob
    ? new Date(user.dob).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'N/A';

  const roleTitle = user?.role ? user.role.replace(/_/g, ' ') : 'MEMBER';

  const handlePrint = () => {
    const printContent = certRef.current;
    if (!printContent) return;

    const win = window.open('', '', 'height=800,width=1000');
    win.document.write(`
      <html>
        <head>
          <title>Agreement Certificate - ${user?.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="bg-white p-8">
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
            <Award className="h-5 w-5 text-amber-500" /> Agreement Certificate
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official Spandan Trust membership & service authorization certificate.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:from-teal-400 hover:to-emerald-400 transition-all flex items-center gap-2 cursor-pointer"
            title="Print Certificate"
          >
            <Printer className="h-4 w-4" /> Print Certificate
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="w-full p-1">
        <div
          ref={certRef}
          className="w-full bg-white text-slate-900 border-4 sm:border-8 border-double border-teal-700 p-4 sm:p-6 md:p-8 rounded-lg shadow-inner relative font-serif"
          style={{ backgroundImage: 'radial-gradient(#f0fdf4 1px, transparent 0)', backgroundSize: '24px 24px' }}
        >
          {/* Decorative Corner Accents */}
          <div className="absolute top-2 left-2 border-t-2 border-l-2 border-amber-500 w-8 h-8"></div>
          <div className="absolute top-2 right-2 border-t-2 border-r-2 border-amber-500 w-8 h-8"></div>
          <div className="absolute bottom-2 left-2 border-b-2 border-l-2 border-amber-500 w-8 h-8"></div>
          <div className="absolute bottom-2 right-2 border-b-2 border-r-2 border-amber-500 w-8 h-8"></div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 border-b-2 border-teal-600/30 pb-6 mb-6">
            <div className="flex justify-center items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div className="text-left font-sans">
                <h1 className="text-2xl font-black tracking-wide text-slate-900 uppercase">Spandan Trust</h1>
                <p className="text-xs font-semibold text-teal-700 tracking-wider uppercase">Digital Health Mission</p>
              </div>
            </div>
            <div className="mt-3 inline-block bg-teal-50 text-teal-800 text-xs font-semibold font-sans px-4 py-1 rounded-full border border-teal-200 uppercase tracking-widest">
              Authorized Service Agreement Certificate
            </div>
            <p className="text-[11px] font-sans text-slate-500 tracking-widest uppercase">
              Ref No: <span className="font-mono font-bold text-slate-700">ST-AGR-{user?.userId || '0000'}</span>
            </p>
          </div>

          {/* Certificate Content Body */}
          <div className="text-center space-y-5 px-4">
            <p className="text-sm italic text-slate-600">
              This is to officially certify and record that
            </p>

            <h2 className="text-2xl font-bold text-teal-900 font-sans tracking-wide uppercase underline decoration-amber-400 underline-offset-8">
              {user?.name || 'User Name'}
            </h2>

            <p className="text-xs text-slate-700 leading-relaxed max-w-xl mx-auto font-sans">
              holding User Identification Number <strong className="font-mono text-teal-800">{user?.userId}</strong>, residing at{' '}
              <strong className="text-slate-900">{user?.address || 'Registered Address'}</strong>, has been officially appointed and authorized as a
            </p>

            <div className="inline-block bg-amber-50 border-2 border-amber-300 rounded-xl px-6 py-2">
              <span className="text-lg font-black font-sans text-amber-900 tracking-wider uppercase">
                {roleTitle}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-xl mx-auto font-sans">
              The undersigned is granted full authorization to facilitate health services, OPD coordination, record keeping, and community support under the terms and operational guidelines specified by <strong>Spandan Trust Digital Health Mission</strong>.
            </p>

            {/* User Meta Data Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-xl p-3 text-left font-sans text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Mobile</span>
                <span className="font-bold text-slate-800">{user?.mobile}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Date of Birth</span>
                <span className="font-bold text-slate-800">{formattedDob}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Date of Issue</span>
                <span className="font-bold text-slate-800">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal Section */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 items-end font-sans">
            <div className="text-left space-y-1">
              <div className="h-10 w-24 border-b-2 border-slate-400 flex items-center justify-center text-teal-800 font-serif italic text-sm font-bold">
                Spandan Trust
              </div>
              <p className="text-xs font-bold text-slate-800">Authorized Signatory</p>
              <p className="text-[10px] text-slate-500 uppercase">Spandan Digital Health Mission</p>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="h-14 w-14 rounded-full border-4 border-dashed border-teal-600/40 flex items-center justify-center text-teal-700 font-bold text-[9px] text-center uppercase tracking-tighter p-1 bg-teal-50">
                Official Seal Verified
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Verification Code: {user?.userId}-OK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
