'use client';

import { useRef } from 'react';
import { ShieldCheck, Printer, Award, FileText, Target, TrendingUp, UserCheck } from 'lucide-react';

export default function AgreementCertificate({ user }) {
  const certRef = useRef(null);

  const role = user?.role || 'COORDINATOR';
  const isSupervisor = role === 'SUPERVISOR';
  const isAgent = role === 'DIGITAL_OPD_AGENT';
  const isCoordinator = role === 'COORDINATOR';

  let roleTitle = 'Coordinator';
  let agreementTitle = 'AYURVEDIC DIGITAL OPD COORDINATOR AGREEMENT';

  if (isSupervisor) {
    roleTitle = 'Supervisor';
    agreementTitle = 'AYURVEDIC DIGITAL OPD SUPERVISOR AGREEMENT';
  } else if (isAgent) {
    roleTitle = 'Digital OPD Assistant';
    agreementTitle = 'AYURVEDIC DIGITAL OPD DIGITAL OPD ASSISTANT AGREEMENT';
  }

  const startDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const formattedDate = startDate.toLocaleDateString('bn-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedStartDate = startDate.toLocaleDateString('bn-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedEndDate = endDate.toLocaleDateString('bn-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    const printContent = certRef.current;
    if (!printContent) return;

    const win = window.open('', '', 'height=800,width=1000');
    win.document.write(`
      <html>
        <head>
          <title>${roleTitle} Agreement - ${user?.name || 'Member'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Noto Sans Bengali', sans-serif; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { size: A4; margin: 10mm; }
            }
          </style>
        </head>
        <body class="bg-white p-6">
          ${printContent.outerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 600);
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" /> {agreementTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            অফিসিয়াল স্পন্দন ট্রাস্ট {roleTitle} চুক্তিপত্র (Bengali Official Agreement Document)
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:from-teal-400 hover:to-emerald-400 transition-all flex items-center gap-2 cursor-pointer"
            title="Print Agreement"
          >
            <Printer className="h-4 w-4" /> Print Agreement
          </button>
        </div>
      </div>

      {/* Printable Document Frame */}
      <div className="w-full p-1 overflow-x-auto">
        <div
          ref={certRef}
          className="w-full min-w-[650px] bg-white text-slate-900 border-4 sm:border-8 border-double border-teal-800 p-6 sm:p-10 rounded-lg shadow-inner relative"
          style={{
            backgroundImage: 'radial-gradient(#f0fdf4 1px, transparent 0)',
            backgroundSize: '24px 24px',
            fontFamily: "'Noto Sans Bengali', sans-serif, system-ui",
          }}
        >
          {/* Decorative Corner Accents */}
          <div className="absolute top-3 left-3 border-t-4 border-l-4 border-amber-500 w-10 h-10"></div>
          <div className="absolute top-3 right-3 border-t-4 border-r-4 border-amber-500 w-10 h-10"></div>
          <div className="absolute bottom-3 left-3 border-b-4 border-l-4 border-amber-500 w-10 h-10"></div>
          <div className="absolute bottom-3 right-3 border-b-4 border-r-4 border-amber-500 w-10 h-10"></div>

          {/* Document Header */}
          <div className="text-center space-y-2 border-b-2 border-teal-600/30 pb-6 mb-6">
            <div className="flex justify-center items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-slate-900 uppercase">Spandan Trust</h1>
                <p className="text-xs font-bold text-teal-700 tracking-wider uppercase">Digital Health Mission</p>
              </div>
            </div>

            <div className="mt-4 inline-block bg-teal-800 text-white text-xs sm:text-sm font-bold px-6 py-2 rounded-full shadow-sm tracking-wide">
              {agreementTitle}
            </div>

            <p className="text-xs text-slate-600 mt-2 font-mono">
              রেফারেন্স নং: <span className="font-bold text-slate-800">ST-AGR-{user?.role || 'ROLE'}-{user?.userId || '0000'}</span>
            </p>
          </div>

          {/* Dynamic Opening Clause */}
          <div className="text-sm leading-relaxed text-slate-800 mb-6 bg-teal-50/50 border border-teal-100 p-4 rounded-xl">
            এই চুক্তি (“Agreement”) আজ <strong className="text-teal-900 underline decoration-teal-500 px-1">{formattedDate}</strong> তারিখে নিম্নলিখিত পক্ষদ্বয়ের মধ্যে সম্পাদিত হলো।
          </div>

          {/* Party Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs sm:text-sm">
            {/* First Party (Admin) */}
            <div className="border border-slate-200 bg-white p-4 rounded-xl shadow-xs space-y-2">
              <h4 className="font-bold text-teal-900 text-sm border-b border-teal-100 pb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" /> ১. প্রথম পক্ষ — প্রতিষ্ঠান:
              </h4>
              <p><strong className="text-slate-700">প্রতিষ্ঠানের নাম:</strong> Spandan Trust Digital Health Mission</p>
              <p><strong className="text-slate-700">ঠিকানা:</strong> স্পন্দন ট্রাস্ট হেডকোয়ার্টার, পশ্চিমবঙ্গ, ভারত</p>
              <p><strong className="text-slate-700">প্রতিনিধির নাম:</strong> Spandan Trust</p>
              <p><strong className="text-slate-700">পদ:</strong> Admin</p>
            </div>

            {/* Second Party (Agent / Supervisor / Coordinator) */}
            <div className="border border-teal-200 bg-teal-50/30 p-4 rounded-xl shadow-xs space-y-2">
              <h4 className="font-bold text-teal-900 text-sm border-b border-teal-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-600" /> ২. দ্বিতীয় পক্ষ — {roleTitle}:
              </h4>
              <p><strong className="text-slate-700">নাম:</strong> <span className="font-bold text-slate-900">{user?.name || 'N/A'}</span></p>
              <p><strong className="text-slate-700">ঠিকানা:</strong> <span className="text-slate-900">{user?.address || 'N/A'}</span></p>
              <p><strong className="text-slate-700">মোবাইল:</strong> <span className="font-mono font-bold text-slate-900">{user?.mobile || 'N/A'}</span></p>
              <p><strong className="text-slate-700">ই-মেইল:</strong> <span className="text-slate-900">{user?.email || 'N/A'}</span></p>
              <p><strong className="text-slate-700">ID/Code No.:</strong> <span className="font-mono font-bold text-teal-800">{user?.userId || 'N/A'}</span></p>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-800 italic text-center mb-6">
            উভয় পক্ষ নিম্নলিখিত শর্তাবলিতে সম্মত হলেন।
          </p>

          {/* Terms & Conditions Body */}
          {isAgent ? (
            /* DIGITAL OPD ASSISTANT AGREEMENT CONTENT */
            <div className="space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
              {/* Section 3 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৩. চুক্তির উদ্দেশ্য</h5>
                <p>Digital OPD Assistant-এর মূল উদ্দেশ্য হলো স্থানীয় মানুষের মধ্যে স্বাস্থ্য সচেতনতা বৃদ্ধি, preventive healthcare-এর প্রচার, patient registration এবং Digital Ayurvedic OPD consultation-এর সঙ্গে রোগীকে সংযুক্ত করতে সহায়তা করা।</p>
                <p className="text-slate-600 italic">Digital OPD Assistant কোনো qualified Doctor/Vaidya নন, যদি না তিনি পৃথকভাবে আইনত নিবন্ধিত চিকিৎসক হন।</p>
              </div>

              {/* Section 4 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৪. Digital OPD Assistant-এর প্রধান দায়িত্ব</h5>
                <p>Digital OPD Assistant:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>নিজের নির্ধারিত এলাকায় health awareness activity পরিচালনা করবেন।</li>
                  <li>Diabetes, BP, obesity, joint health, digestive health ও অন্যান্য lifestyle-related health বিষয়ে সচেতনতা তৈরি করবেন।</li>
                  <li>নতুন patient-এর Digital OPD registration-এ সহায়তা করবেন।</li>
                  <li>Patient-এর online Ayurvedic Doctor/Vaidya consultation-এর appointment coordinate করবেন।</li>
                  <li>Patient-এর report/consultation follow-up-এ সহায়তা করবেন।</li>
                  <li>Health screening ও awareness camp-এর জন্য patient mobilization করবেন।</li>
                  <li>প্রতিষ্ঠানের approved membership/health card সম্পর্কে মানুষকে জানাবেন।</li>
                  <li>অনুমোদিত Ayurvedic products ও healthcare services-এর ethical promotion করবেন।</li>
                  <li>Daily/weekly activity এবং business report Supervisor-কে প্রদান করবেন।</li>
                  <li>Patient-এর সঙ্গে ভদ্র, স্বচ্ছ ও professional আচরণ করবেন।</li>
                </ol>
              </div>

              {/* Section 5 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৫. Medical Limitation</h5>
                <p>Digital OPD Assistant:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                  <li>নিজে রোগ নির্ণয় করতে পারবেন না।</li>
                  <li>নিজে prescription লিখতে পারবেন না।</li>
                  <li>Doctor-এর prescription পরিবর্তন করতে পারবেন না।</li>
                  <li>রোগীকে guaranteed cure-এর প্রতিশ্রুতি দিতে পারবেন না।</li>
                  <li>নিজেকে Doctor/Vaidya হিসেবে পরিচয় দিতে পারবেন না।</li>
                  <li>গুরুতর/জরুরি অবস্থায় patient-কে উপযুক্ত qualified medical facility/doctor-এর কাছে যাওয়ার পরামর্শ দেবেন।</li>
                </ul>
                <p className="font-medium text-teal-900">Medical advice শুধুমাত্র প্রতিষ্ঠানের অনুমোদিত qualified Ayurvedic Doctor/Vaidya-এর মাধ্যমে প্রদান করা হবে।</p>
              </div>

              {/* Section 6 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৬. Monthly Business Target</h5>
                <p>Digital OPD Assistant-এর proposed monthly eligible business target:</p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center my-2">
                  <span className="text-base font-black text-emerald-900 flex items-center justify-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600" /> Proposed Monthly Target: ₹50,000/-
                  </span>
                </div>
                <p>Business-এর মধ্যে প্রতিষ্ঠানের approved products/services, eligible membership বা অন্যান্য approved revenue-generating activities অন্তর্ভুক্ত হতে পারে।</p>
                <p className="text-slate-600 text-xs">Eligible business-এর final definition প্রতিষ্ঠান লিখিতভাবে নির্ধারণ করবে।</p>
              </div>

              {/* Section 7 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৭. Performance Incentive</h5>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                  <span className="text-sm font-bold text-amber-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-600" /> 🏆 ₹50,000 Business = ₹5,000 Incentive
                  </span>
                  <p className="text-xs text-amber-800 mt-1">
                    Target পূরণ হলে Digital OPD Assistant ₹5,000 performance incentive পাওয়ার যোগ্য হবেন। (₹50,000 &times; 10% = ₹5,000)
                  </p>
                </div>

                <p className="font-semibold text-slate-800">Illustrative Incentive Chart:</p>
                <div className="overflow-x-auto my-2">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2 border-r border-slate-200">Monthly Eligible Business</th>
                        <th className="p-2">Incentive</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr><td className="p-2 border-r font-mono">₹25,000</td><td className="p-2 font-bold text-teal-800">₹2,500</td></tr>
                      <tr className="bg-teal-50/50"><td className="p-2 border-r font-mono font-bold">₹50,000</td><td className="p-2 font-bold text-teal-900">₹5,000</td></tr>
                      <tr><td className="p-2 border-r font-mono">₹75,000</td><td className="p-2 font-bold text-teal-800">₹7,500</td></tr>
                      <tr><td className="p-2 border-r font-mono">₹1,00,000</td><td className="p-2 font-bold text-teal-800">₹10,000</td></tr>
                      <tr><td className="p-2 border-r font-mono">₹1,50,000</td><td className="p-2 font-bold text-teal-800">₹15,000</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-slate-600 text-xs">উপরের calculation একটি proposed 10% incentive structure। প্রতিষ্ঠানের approved incentive policy অনুযায়ী final rate/conditions প্রযোজ্য হবে।</p>
              </div>

              {/* Section 8 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৮. Incentive-এর শর্ত</h5>
                <p>Incentive calculation-এর ক্ষেত্রে:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                  <li>Business অবশ্যই genuine ও verified হতে হবে।</li>
                  <li>Payment realized হতে হবে।</li>
                  <li>Cancelled/refunded transaction গণনা করা হবে না।</li>
                  <li>Duplicate/fake registration গণনা করা হবে না।</li>
                  <li>Customer dispute থাকলে settlement না হওয়া পর্যন্ত incentive hold করা যেতে পারে।</li>
                  <li>Refund/cancellation হলে পূর্বে প্রদত্ত incentive-এর adjustment করা যেতে পারে।</li>
                </ul>
              </div>

              {/* Section 9 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৯. Patient Registration & Consent</h5>
                <p>Patient-এর registration করার সময়:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                  <li>সঠিক তথ্য নেওয়ার চেষ্টা করতে হবে।</li>
                  <li>Patient-এর consent ছাড়া personal/medical information সংগ্রহ বা share করা যাবে না।</li>
                  <li>Patient-কে consultation-এর nature, applicable charges এবং terms পরিষ্কারভাবে জানাতে হবে।</li>
                  <li>কোনো false medical claim করা যাবে না।</li>
                </ul>
              </div>

              {/* Section 10 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১০. Patient Confidentiality</h5>
                <p>Digital OPD Assistant patient-এর: নাম, মোবাইল নম্বর, ঠিকানা, medical history, diagnostic report, prescription ও consultation details গোপন রাখবেন এবং প্রতিষ্ঠানের অনুমতি/আইনগত প্রয়োজন ছাড়া তৃতীয় পক্ষের কাছে প্রকাশ করবেন না।</p>
              </div>

              {/* Section 11 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১১. Ethical Marketing Policy</h5>
                <p>Digital OPD Assistant শুধুমাত্র company-approved marketing materials ব্যবহার করবেন।</p>
                <p className="font-semibold text-rose-900">নিম্নলিখিত ধরনের প্রচার নিষিদ্ধ:</p>
                <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-rose-900 bg-rose-50/50 border border-rose-100 p-3 rounded-lg">
                  <li>❌ “100% রোগ ভালো হবে”</li>
                  <li>❌ “নিশ্চিত cure”</li>
                  <li>❌ “সব রোগের চিকিৎসা”</li>
                  <li>❌ Fake testimonial</li>
                  <li>❌ Fake discount</li>
                  <li>❌ Fake income guarantee</li>
                  <li>❌ Doctor-এর নাম ব্যবহার করে misleading claim</li>
                </ul>
              </div>

              {/* Section 12 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১২. Payment & Money Collection</h5>
                <p>Customer payment সম্ভব হলে প্রতিষ্ঠানের approved payment channel-এর মাধ্যমে গ্রহণ করতে হবে।</p>
                <p>Digital OPD Assistant ব্যক্তিগত bank account/UPI-তে company/customer-এর টাকা গ্রহণ করবেন না, যদি না প্রতিষ্ঠানের লিখিত অনুমোদন থাকে।</p>
                <p className="text-slate-600 text-xs">সমস্ত collection-এর proper receipt/record রাখতে হবে।</p>
              </div>

              {/* Section 13 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৩. Daily & Monthly Reporting</h5>
                <p>Assistant-এর reporting structure:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
                  <div>
                    <strong className="text-teal-800 block mb-1">Daily Report:</strong>
                    New patient, OPD registration, Consultation lead, Awareness activity, Business generated
                  </div>
                  <div>
                    <strong className="text-teal-800 block mb-1">Weekly Report:</strong>
                    Patient follow-up, Team/area activity, Camp/awareness programme, Pending cases
                  </div>
                  <div>
                    <strong className="text-teal-800 block mb-1">Monthly Report:</strong>
                    Total eligible business, Target achievement, Incentive calculation, Patient engagement, Next-month action plan
                  </div>
                </div>
              </div>

              {/* Section 14 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৪. Training</h5>
                <p>Digital OPD Assistant প্রতিষ্ঠান কর্তৃক নির্ধারিত training গ্রহণ করবেন (Digital OPD workflow, Patient communication, Preventive healthcare, Digital tools/app usage, Privacy & Reporting)।</p>
              </div>

              {/* Section 15 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৫. KPI — Key Performance Indicators</h5>
                <p>Assistant-এর performance নিম্নলিখিত বিষয়ে মূল্যায়ন করা যেতে পারে:</p>
                <ol className="list-decimal list-inside grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <li>Patient awareness</li>
                  <li>Patient registration</li>
                  <li>Consultation coordination</li>
                  <li>Follow-up</li>
                  <li>Health camp participation</li>
                  <li>Eligible business</li>
                  <li>Customer service</li>
                  <li>Reporting discipline</li>
                  <li>Policy compliance</li>
                </ol>
              </div>

              {/* Section 16 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৬. Brand & Marketing Materials</h5>
                <p>Company-এর logo, brand name, brochure, poster, video, software, training materials বা অন্যান্য intellectual property শুধুমাত্র অনুমোদিত কাজে ব্যবহার করা যাবে।</p>
              </div>

              {/* Section 17 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৭. Prohibited Activities</h5>
                <p>নিম্নলিখিত কাজ গুরুতর চুক্তিভঙ্গ হিসেবে বিবেচিত হতে পারে:</p>
                <ol className="list-decimal list-inside grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-rose-900 bg-rose-50/50 border border-rose-100 p-3 rounded-lg">
                  <li>Fake patient registration</li>
                  <li>Fake business reporting</li>
                  <li>Patient data misuse</li>
                  <li>Company fund misuse</li>
                  <li>Unauthorized medical practice</li>
                  <li>False medical claims</li>
                  <li>Fake certificate/identity ব্যবহার</li>
                  <li>Unauthorized sub-franchise</li>
                  <li>Customer fraud</li>
                  <li>Company brand-এর অপব্যবহার</li>
                </ol>
              </div>

              {/* Section 18 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৮. Territory</h5>
                <p>Digital OPD Assistant-এর নির্ধারিত কাজের এলাকা:</p>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
                  <p><strong className="text-slate-700">District:</strong> <span className="font-semibold text-slate-900">{user?.address || 'As assigned'}</span></p>
                  <p><strong className="text-slate-700">Block/Area:</strong> <span className="font-semibold text-slate-900">As assigned by Spandan Trust</span></p>
                </div>
              </div>

              {/* Section 19 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৯. Agreement Period</h5>
                <p>চুক্তির শুরু: <strong className="text-teal-900 underline">{formattedStartDate}</strong> — চুক্তির শেষ: <strong className="text-teal-900 underline">{formattedEndDate}</strong></p>
                <p className="text-slate-600 text-xs">Performance ও mutual consent-এর ভিত্তিতে Agreement নবায়ন করা যেতে পারে।</p>
              </div>

              {/* Section 20 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">২০. Termination</h5>
                <p>যেকোনো পক্ষ <strong className="text-teal-900">৩০ (ত্রিশ) দিনের</strong> written notice দিয়ে Agreement terminate করতে পারবে।</p>
                <p>Fraud, financial misconduct, patient data misuse, unauthorized medical practice বা গুরুতর policy violation-এর ক্ষেত্রে প্রতিষ্ঠান প্রযোজ্য আইন ও policy অনুযায়ী ব্যবস্থা নিতে পারবে।</p>
              </div>

              {/* Section 21 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">২১. Independent Role</h5>
                <p>এই Agreement Assistant-এর role, responsibilities, performance এবং incentive structure নির্ধারণ করে। এটি নিজে থেকে employment, partnership, ownership বা medical practitioner relationship সৃষ্টি করে না।</p>
              </div>

              {/* Section 22 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">২২. Declaration</h5>
                <p className="italic font-medium text-slate-900">আমি ঘোষণা করছি যে: আমি এই Agreement-এর সমস্ত শর্ত পড়েছি ও বুঝেছি; নিজেকে Doctor/Vaidya হিসেবে ভুলভাবে উপস্থাপন করব না; patient-এর privacy রক্ষা করব; company SOP ও ethical marketing policy অনুসরণ করব; fake registration বা false business reporting করব না; incentive পাওয়ার জন্য কোনো অনৈতিক পদ্ধতি ব্যবহার করব না।</p>
              </div>
            </div>
          ) : isSupervisor ? (
            /* SUPERVISOR AGREEMENT CONTENT */
            <div className="space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
              {/* Section 1 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১. চুক্তির উদ্দেশ্য</h5>
                <p>Supervisor প্রতিষ্ঠানের Ayurvedic Digital OPD network-এর নির্ধারিত এলাকায় Digital OPD Assistant-দের পরিচালনা, প্রশিক্ষণ, performance monitoring, patient awareness এবং business development-এর কাজে সহযোগিতা করবেন।</p>
                <p className="text-slate-600 italic">Supervisor কোনোভাবেই নিজেকে qualified Doctor/Vaidya হিসেবে উপস্থাপন করবেন না এবং নিজে diagnosis বা prescription প্রদান করবেন না।</p>
              </div>

              {/* Section 2 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">২. Supervisor-এর Team Structure</h5>
                <p>প্রস্তাবিত structure:</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-1 font-semibold text-amber-900">
                  ১ Coordinator &rarr; ১০ Supervisors &rarr; প্রতি Supervisor-এর অধীনে ১০ Digital OPD Assistants
                </div>
                <p className="text-slate-600 text-xs">প্রতিষ্ঠানের প্রয়োজন অনুযায়ী team size পরিবর্তন করা যেতে পারে।</p>
              </div>

              {/* Section 3 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৩. প্রধান দায়িত্ব</h5>
                <p>Supervisor-এর দায়িত্ব হবে:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Digital OPD Assistant নিয়োগ/সংগঠনে Coordinator-কে সহযোগিতা করা।</li>
                  <li>Team members-কে basic training ও SOP অনুসরণে সহায়তা করা।</li>
                  <li>প্রতিদিন/সাপ্তাহিক patient registration ও business activity monitor করা।</li>
                  <li>Health awareness programme এবং screening activity পরিচালনায় সহযোগিতা করা।</li>
                  <li>Digital OPD consultation-এর জন্য patient coordination নিশ্চিত করা।</li>
                  <li>Assistant-দের performance ও target tracking করা।</li>
                  <li>নতুন patient এবং membership enrollment বৃদ্ধি করা।</li>
                  <li>অনুমোদিত Ayurvedic products/services-এর ethical promotion করা।</li>
                  <li>Daily/weekly/monthly report Coordinator/Company-কে প্রদান করা।</li>
                  <li>Team-এর discipline, customer service এবং company policy compliance নিশ্চিত করা।</li>
                </ol>
              </div>

              {/* Section 4 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৪. Team Performance</h5>
                <p>Supervisor-এর team-এর performance নিয়মিত পর্যবেক্ষণ করতে হবে।</p>
                <p>প্রতিটি Digital OPD Assistant-এর patient engagement, registration, awareness activity, consultation coordination এবং eligible business-এর record রাখতে হবে।</p>
                <p className="font-medium text-teal-900">Supervisor শুধুমাত্র নিজের sales নয়, team development ও sustainable patient service-এর জন্যও দায়বদ্ধ থাকবেন।</p>
              </div>

              {/* Section 5 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৫. Patient Service Responsibility</h5>
                <p>Supervisor নিশ্চিত করবেন যে:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Patient-কে সঠিক information দেওয়া হচ্ছে।</li>
                  <li>Doctor consultation-এর জন্য যথাযথ referral/coordination হচ্ছে।</li>
                  <li>Patient-এর report/prescription গোপন রাখা হচ্ছে।</li>
                  <li>Emergency বা serious medical situation হলে patient-কে appropriate qualified medical facility/doctor-এর কাছে যেতে বলা হচ্ছে।</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৬. No Medical Practice</h5>
                <p>Supervisor:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                  <li>রোগ নির্ণয় করতে পারবেন না।</li>
                  <li>Prescription লিখতে/পরিবর্তন করতে পারবেন না।</li>
                  <li>Doctor-এর prescription-এর dosage নিজের ইচ্ছায় পরিবর্তন করতে পারবেন না।</li>
                  <li>“100% cure” বা guaranteed treatment-এর দাবি করতে পারবেন না।</li>
                  <li>Qualified medical practitioner হিসেবে নিজেকে উপস্থাপন করতে পারবেন না।</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৭. Patient Data Confidentiality</h5>
                <p>Patient-এর নাম, ফোন নম্বর, address, medical history, diagnostic report, prescription বা অন্যান্য personal information অনুমতি ছাড়া প্রকাশ বা third party-এর কাছে দেওয়া যাবে না।</p>
                <p className="text-slate-600 text-xs">চুক্তি শেষ হলেও confidentiality obligation প্রযোজ্য থাকবে, যতদূর আইনত প্রযোজ্য।</p>
              </div>

              {/* Section 8 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৮. Ethical Marketing</h5>
                <p>Supervisor এবং তাঁর team শুধুমাত্র company-approved promotional materials ব্যবহার করবেন।</p>
                <p className="font-semibold text-rose-900">নিম্নলিখিত claims নিষিদ্ধ:</p>
                <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-rose-900 bg-rose-50/50 border border-rose-100 p-3 rounded-lg">
                  <li>Guaranteed cure</li>
                  <li>100% result</li>
                  <li>Doctor-এর নামে false claim</li>
                  <li>Fake testimonial</li>
                  <li>Fake income claim</li>
                  <li>Misleading discount/offer</li>
                </ul>
              </div>

              {/* Section 9 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৯. Money Collection</h5>
                <p>Customer payment company-এর অনুমোদিত payment channel-এর মাধ্যমে নেওয়া হবে।</p>
                <p>Supervisor নিজের ব্যক্তিগত account-এ company/customer-এর টাকা গ্রহণ করবেন না, যদি না প্রতিষ্ঠানের লিখিত অনুমোদন থাকে।</p>
                <p className="text-slate-600 text-xs">Collected amount-এর proper record রাখতে হবে।</p>
              </div>

              {/* Section 10 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১০. Reporting</h5>
                <p>Supervisor নিম্নলিখিত report জমা দেবেন:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
                  <div>
                    <strong className="text-teal-800 block mb-1">Daily:</strong>
                    Patient registration, consultation leads, activity
                  </div>
                  <div>
                    <strong className="text-teal-800 block mb-1">Weekly:</strong>
                    Team performance, new patients, awareness activities
                  </div>
                  <div>
                    <strong className="text-teal-800 block mb-1">Monthly:</strong>
                    Business achievement, incentive calculation, team performance এবং future plan
                  </div>
                </div>
              </div>

              {/* Section 11 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১১. Training & SOP</h5>
                <p>Supervisor company-এর training programme, SOP, code of conduct এবং reporting system মেনে চলবেন এবং তাঁর team-কে তা অনুসরণে সহায়তা করবেন।</p>
              </div>

              {/* Section 12 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১২. Brand & Intellectual Property</h5>
                <p>Company-এর brand name, logo, software, training materials, promotional designs, database এবং অন্যান্য intellectual property অনুমতি ছাড়া copy, modify, sell বা distribute করা যাবে না।</p>
              </div>

              {/* Section 13 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৩. Prohibited Activities</h5>
                <p>নিম্নলিখিত কাজ গুরুতর misconduct হিসেবে বিবেচিত হতে পারে:</p>
                <ol className="list-decimal list-inside grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-rose-900 bg-rose-50/50 border border-rose-100 p-3 rounded-lg">
                  <li>Fake registration</li>
                  <li>Fake business reporting</li>
                  <li>Patient data misuse</li>
                  <li>Company fund misuse</li>
                  <li>Unauthorized medical practice</li>
                  <li>False medical claims</li>
                  <li>Unauthorized sub-franchise</li>
                  <li>Company brand-এর অপব্যবহার</li>
                  <li>Customer fraud</li>
                  <li>Company policy ইচ্ছাকৃতভাবে লঙ্ঘন</li>
                </ol>
              </div>

              {/* Section 14 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৪. Territory</h5>
                <p>Supervisor-এর নির্ধারিত territory:</p>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
                  <p><strong className="text-slate-700">District:</strong> <span className="font-semibold text-slate-900">{user?.address || 'As assigned'}</span></p>
                  <p><strong className="text-slate-700">Block/Area:</strong> <span className="font-semibold text-slate-900">As assigned by Spandan Trust</span></p>
                </div>
                <p className="text-slate-600 text-xs">Territory পরিবর্তন/বৃদ্ধি company-এর operational requirement অনুযায়ী করা যেতে পারে।</p>
              </div>

              {/* Section 15 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৫. Agreement Period</h5>
                <p>চুক্তির মেয়াদ: From: <strong className="text-teal-900 underline">{formattedStartDate}</strong> To: <strong className="text-teal-900 underline">{formattedEndDate}</strong></p>
                <p className="text-slate-600 text-xs">চুক্তি performance ও mutual consent-এর ভিত্তিতে নবায়ন করা যেতে পারে।</p>
              </div>

              {/* Section 16 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৬. Termination</h5>
                <p>যেকোনো পক্ষ <strong className="text-teal-900">৩০ (ত্রিশ) দিনের</strong> written notice দিয়ে Agreement terminate করতে পারে।</p>
                <p>Fraud, financial misconduct, patient data misuse, unauthorized medical practice বা গুরুতর policy violation-এর ক্ষেত্রে company প্রযোজ্য আইন ও policy অনুযায়ী ব্যবস্থা নিতে পারবে।</p>
                <p className="text-slate-600 text-xs">Termination-এর পরে pending incentive/dues/adjustment company verification-এর ভিত্তিতে settlement করা হবে।</p>
              </div>

              {/* Section 17 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৭. Independent Role</h5>
                <p>এই Agreement Supervisor-এর business coordination ও performance role নির্ধারণ করে। এটি নিজে থেকে employment, partnership, agency বা ownership relationship সৃষ্টি করে না, যদি না পৃথক লিখিত চুক্তিতে তা নির্ধারিত থাকে।</p>
              </div>

              {/* Section 18 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৮. Dispute Resolution</h5>
                <p>কোনো dispute হলে প্রথমে mutual discussion-এর মাধ্যমে সমাধানের চেষ্টা করা হবে। সমাধান না হলে প্রযোজ্য ভারতীয় আইন অনুযায়ী উপযুক্ত legal forum/jurisdiction প্রযোজ্য হবে।</p>
              </div>

              {/* Section 19 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৯. Declaration</h5>
                <p className="italic font-medium text-slate-900">Supervisor ঘোষণা করছেন যে তিনি এই Agreement-এর সমস্ত শর্ত পড়েছেন, বুঝেছেন এবং স্বেচ্ছায় এতে সম্মত হয়েছেন।</p>
              </div>
            </div>
          ) : (
            /* COORDINATOR AGREEMENT CONTENT */
            <div className="space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
              {/* Section 1 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১. চুক্তির উদ্দেশ্য</h5>
                <p>Coordinator প্রতিষ্ঠানের Ayurvedic Digital OPD, health awareness, patient registration, digital consultation support, membership এবং অনুমোদিত healthcare products/services-এর প্রচার ও সমন্বয়ের কাজে সহযোগিতা করবেন।</p>
                <p className="text-slate-600 italic">Coordinator স্বাধীনভাবে কোনো রোগ নির্ণয়, চিকিৎসা বা prescription প্রদান করতে পারবেন না।</p>
              </div>

              {/* Section 2 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">২. Coordinator-এর প্রধান দায়িত্ব</h5>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>নির্ধারিত এলাকায় Digital OPD Assistant নিয়োগ ও সমন্বয় করা।</li>
                  <li>Digital OPD Assistant-দের training, motivation এবং performance monitoring করা।</li>
                  <li>Health awareness programme ও patient awareness activity পরিচালনায় সহযোগিতা করা।</li>
                  <li>Patient registration ও Digital OPD consultation-এর workflow পর্যবেক্ষণ করা।</li>
                  <li>Health camp, screening এবং awareness programme-এর জন্য patient mobilization করা।</li>
                  <li>প্রতিষ্ঠানের approved membership, products ও services-এর ethical promotion করা।</li>
                  <li>দৈনিক/সাপ্তাহিক/মাসিক business ও activity report জমা দেওয়া।</li>
                  <li>Patient-এর personal ও medical information গোপন রাখা।</li>
                  <li>প্রতিষ্ঠানের brand name, logo, marketing materials এবং digital platform শুধুমাত্র অনুমোদিত নিয়মে ব্যবহার করা।</li>
                </ol>
              </div>

              {/* Section 3 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৩. Team Structure</h5>
                <p>Coordinator-এর অধীনে সর্বোচ্চ/প্রস্তাবিত:</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-1 font-semibold text-amber-900">
                  ১ Coordinator &rarr; ১০ Supervisors &rarr; প্রতি Supervisor-এর অধীনে ১০ Digital OPD Assistants
                </div>
                <p className="text-slate-600 text-xs">প্রতিষ্ঠানের business requirement অনুযায়ী এই structure পরিবর্তন করা যেতে পারে।</p>
              </div>

              {/* Section 4 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৪. No Medical Authority</h5>
                <p>Coordinator বা তাঁর team-এর কোনো সদস্য নিজেকে Doctor/Vaidya/Medical Practitioner হিসেবে উপস্থাপন করতে পারবেন না, যদি সংশ্লিষ্ট ব্যক্তি আইনত যোগ্য ও registered practitioner না হন। তাঁরা diagnosis, prescription, medicine dosage পরিবর্তন বা emergency medical decision নিতে পারবেন না।</p>
                <p className="font-medium text-teal-900">Medical consultation শুধুমাত্র প্রতিষ্ঠানের অনুমোদিত qualified Ayurvedic Doctor/Vaidya-এর মাধ্যমে সম্পন্ন হবে।</p>
              </div>

              {/* Section 6 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৬. Patient Privacy & Data Protection</h5>
                <p>Coordinator এবং তাঁর team patient-এর নাম, ফোন নম্বর, medical report, prescription, diagnosis বা অন্যান্য ব্যক্তিগত তথ্য অনুমতি ছাড়া প্রকাশ, বিক্রি বা তৃতীয় পক্ষের কাছে প্রদান করতে পারবেন না।</p>
              </div>

              {/* Section 7 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৭. Ethical Marketing</h5>
                <p>Coordinator কোনো false guarantee, “100% cure”, “নিশ্চিত রোগমুক্তি”, misleading income claim বা অনুমোদনহীন medical claim করতে পারবেন না।</p>
                <p>সমস্ত advertisement ও promotional material প্রতিষ্ঠানের approved format অনুযায়ী হতে হবে।</p>
              </div>

              {/* Section 8 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৮. Financial Responsibility</h5>
                <p>Coordinator কর্তৃক সংগৃহীত অর্থ প্রতিষ্ঠানের নির্ধারিত payment system/account-এর মাধ্যমে জমা করতে হবে।</p>
                <p>ব্যক্তিগত account-এ customer payment নেওয়া বা প্রতিষ্ঠানের অনুমতি ছাড়া cash collection করা নিষিদ্ধ/নিয়ন্ত্রিত হবে, যদি না লিখিত অনুমোদন থাকে।</p>
              </div>

              {/* Section 9 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">৯. Training & Compliance</h5>
                <p>Coordinator প্রতিষ্ঠানের নির্ধারিত training programme, SOP, reporting system এবং code of conduct অনুসরণ করবেন।</p>
                <p>Coordinator তাঁর team-এর কার্যকলাপের জন্য যথাযথ supervision করবেন।</p>
              </div>

              {/* Section 10 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১০. Brand & Intellectual Property</h5>
                <p>প্রতিষ্ঠানের নাম, logo, website, software, training materials, brochures, videos, photographs এবং অন্যান্য intellectual property প্রতিষ্ঠানের সম্পত্তি হিসেবে বিবেচিত হবে।</p>
                <p>চুক্তি শেষ হওয়ার পর Coordinator প্রতিষ্ঠানের অনুমতি ছাড়া এসব ব্যবহার করতে পারবেন না।</p>
              </div>

              {/* Section 11 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১১. Prohibited Activities</h5>
                <p>নিম্নলিখিত কাজ গুরুতর চুক্তিভঙ্গ হিসেবে বিবেচিত হতে পারে:</p>
                <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-rose-900 bg-rose-50/50 border border-rose-100 p-3 rounded-lg">
                  <li>Fake patient registration</li>
                  <li>Fake business entry</li>
                  <li>False medical claims</li>
                  <li>Unauthorized prescription</li>
                  <li>Patient data misuse</li>
                  <li>Company money misuse</li>
                  <li>Unauthorized sub-franchise</li>
                  <li>Company brand-এর অপব্যবহার</li>
                  <li>Customer-এর সঙ্গে প্রতারণামূলক আচরণ</li>
                </ul>
              </div>

              {/* Section 12 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১২. Agreement Period</h5>
                <p>এই Agreement-এর মেয়াদ: <strong className="text-teal-900 underline">{formattedStartDate}</strong> থেকে <strong className="text-teal-900 underline">{formattedEndDate}</strong> পর্যন্ত।</p>
                <p className="text-slate-600 text-xs">পারস্পরিক সম্মতির ভিত্তিতে Agreement নবায়ন করা যেতে পারে।</p>
              </div>

              {/* Section 13 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৩. Termination</h5>
                <p>যেকোনো পক্ষ <strong className="text-teal-900">৩০ (ত্রিশ) দিনের</strong> লিখিত notice দিয়ে Agreement terminate করতে পারবে।</p>
                <p>তবে fraud, financial misconduct, data misuse, unauthorized medical practice বা গুরুতর misconduct-এর ক্ষেত্রে প্রতিষ্ঠান প্রযোজ্য নীতি ও আইন অনুযায়ী তাৎক্ষণিক ব্যবস্থা নিতে পারবে।</p>
                <p className="text-slate-600 text-xs">Termination-এর পর Coordinator-এর pending accounts, dues, returns এবং incentive প্রতিষ্ঠানের verification অনুযায়ী settlement করা হবে।</p>
              </div>

              {/* Section 14 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৪. Independent Relationship</h5>
                <p>এই Agreement শুধুমাত্র Coordinator-এর role, performance এবং business coordination-এর শর্ত নির্ধারণ করে। এটি কোনো employment, partnership বা ownership relationship তৈরি করে কি না, তা প্রযোজ্য আইন ও প্রতিষ্ঠানের প্রকৃত কাঠামোর ভিত্তিতে নির্ধারিত হবে।</p>
              </div>

              {/* Section 15 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৫. Dispute Resolution</h5>
                <p>কোনো বিরোধ হলে প্রথমে উভয় পক্ষ আলোচনার মাধ্যমে সমাধানের চেষ্টা করবে। সমাধান না হলে প্রযোজ্য ভারতীয় আইন অনুযায়ী উপযুক্ত forum/court-এর jurisdiction প্রযোজ্য হবে।</p>
              </div>

              {/* Section 16 */}
              <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
                <h5 className="font-bold text-teal-900">১৬. Declaration</h5>
                <p className="italic font-medium text-slate-900">Coordinator ঘোষণা করছেন যে তিনি Agreement-এর সমস্ত শর্ত পড়েছেন, বুঝেছেন এবং স্বেচ্ছায় এতে সম্মত হয়েছেন।</p>
              </div>
            </div>
          )}

          {/* Signatures Section */}
          <div className="mt-12 pt-8 border-t-2 border-slate-300 space-y-8 text-xs sm:text-sm">
            <div className={`grid ${isAgent ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'} gap-6`}>
              {/* First Party Signature */}
              <div className="space-y-2">
                <h5 className="font-bold text-teal-900">For the Organization</h5>
                <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 text-teal-800 font-serif italic text-xs">
                  (Digital Seal & Signature)
                </div>
                <p><strong className="text-slate-700">নাম:</strong> Spandan Trust Digital Health Mission</p>
                <p><strong className="text-slate-700">পদ:</strong> Admin</p>
                <p><strong className="text-slate-700">তারিখ:</strong> {formattedDate}</p>
              </div>

              {/* Second Party Signature */}
              <div className="space-y-2">
                <h5 className="font-bold text-teal-900">{roleTitle}</h5>
                <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 text-slate-900 font-bold italic">
                  {user?.name || '__________________________'}
                </div>
                <p><strong className="text-slate-700">নাম:</strong> {user?.name || '__________________________'}</p>
                <p><strong className="text-slate-700">আইডি:</strong> {user?.userId || '__________________________'}</p>
                <p><strong className="text-slate-700">তারিখ:</strong> {formattedDate}</p>
              </div>

              {/* Supervisor Signature for Agent */}
              {isAgent && (
                <div className="space-y-2">
                  <h5 className="font-bold text-teal-900">Supervisor</h5>
                  <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 text-slate-800 font-bold italic">
                    {user?.parent?.name || 'Assigned Supervisor'}
                  </div>
                  <p><strong className="text-slate-700">নাম:</strong> <span className="font-bold text-slate-900">{user?.parent?.name || 'Assigned Supervisor'}</span></p>
                  {user?.parent?.userId && (
                    <p><strong className="text-slate-700">আইডি:</strong> <span className="font-mono font-bold text-teal-800">{user.parent.userId}</span></p>
                  )}
                  <p><strong className="text-slate-700">তারিখ:</strong> {formattedDate}</p>
                </div>
              )}
            </div>

            {/* Witness signatures if Agent */}
            {isAgent && (
              <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-6 text-xs text-slate-600">
                <div>
                  <strong className="block text-slate-800 font-bold">Witness 1:</strong>
                  <p>নাম: __________________________</p>
                  <p>ঠিকানা: ________________________</p>
                </div>
                <div>
                  <strong className="block text-slate-800 font-bold">Witness 2:</strong>
                  <p>নাম: __________________________</p>
                  <p>ঠিকানা: ________________________</p>
                </div>
              </div>
            )}
          </div>

          {/* Seal / Footer Verification */}
          <div className="mt-10 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Spandan Trust Digital Health Mission</span>
            <span>Document ID: ST-AGR-{role}-{user?.userId || '0000'}</span>
            <span>Verified & System Generated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
