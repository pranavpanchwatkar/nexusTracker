import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import SubmissionForm from '@/components/SubmissionForm';
import dbConnect from '@/lib/db';
import { Submission, ProcessedData, User } from '@/lib/models';
import { Users, Award, Clock } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default async function CoordinatorPage() {
  const session = await getSession();

  if (!session || session.role !== 'coordinator') {
    redirect('/login');
  }

  await dbConnect();

  // Get allotted colleges for this specific user
  const userDoc = await User.findById(session.id).lean() as any;
  const allottedColleges = userDoc?.allottedColleges || [];

  // Fetch their specific submissions
  const mySubmissions = await Submission.find({ teamName: session.teamName }).sort({ timestamp: -1 }).lean();
  const totalApproached = mySubmissions.reduce((acc: number, sub: any) => acc + sub.approachedCount, 0);

  // Use the officially allotted colleges (from Admin config) to credit Paid conversions
  const normalize = (str: string) =>
    (str || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/,.*$/g, '').replace(/[^a-z0-9]/g, '');

  // Only keep strings that are at least 10 chars (filter out city-only entries like "nagpur")
  const normAllotted = allottedColleges.map(normalize).filter((s: string) => s.length >= 10);

  const allPaid = await ProcessedData.find({
    paymentStatus: { $regex: /^paid$/i }
  }).lean();

  const myPaidCount = allPaid.filter((row: any) => {
    const normRow = normalize(row.collegeName || '');
    return normAllotted.some((a: string) => normRow.includes(a) || a.includes(normRow));
  }).length;

  return (
    <main className="min-h-screen bg-neutral-950 p-4 py-8 md:p-8 md:py-10 antialiased">
      {/* Brand Header */}
      <header className="max-w-6xl mx-auto flex items-center gap-3 mb-8 pb-6 border-b border-neutral-800">
        <img src="/nexus-logo.png" alt="Nexus Logo" className="w-10 h-10 rounded-full object-cover shadow-lg" />
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">Team Nexus</h2>
          <p className="text-xs text-neutral-500 font-medium tracking-wide">Coordinator Portal</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <div className="mb-8 pl-2">
            <div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 font-medium text-xs rounded-full mb-4 border border-green-500/20 tracking-wide uppercase">Live Event</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Daily Update</h1>
            <p className="text-neutral-400">Log your on-ground promotion metrics accurately.</p>
          </div>

          <SubmissionForm teamName={session.teamName} colleges={allottedColleges} />
        </div>

        {/* Right Column: Progress Dashboard */}
        <div className="lg:col-span-5 space-y-6 lg:mt-6">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2 className="text-2xl font-bold text-white">Team Performance</h2>
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl w-fit mb-4"><Users size={24} /></div>
              <p className="text-neutral-400 text-sm font-medium">Students Approached/Interested</p>
              <h4 className="text-4xl font-bold text-white mt-1">{totalApproached}</h4>
            </div>

            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl w-fit mb-4"><Award size={24} /></div>
              <p className="text-neutral-400 text-sm font-medium">Paid Conversions</p>
              <h4 className="text-4xl font-bold text-green-400 mt-1">{myPaidCount}</h4>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl max-h-[600px] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold text-white mb-6">Past Activity</h3>
            {mySubmissions.length === 0 ? (
              <p className="text-neutral-500 text-sm text-center py-10 bg-neutral-950 rounded-2xl border border-neutral-800">No activities logged yet.</p>
            ) : (
              <div className="space-y-4">
                {mySubmissions.map((sub: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center bg-neutral-950/80 hover:bg-neutral-800 p-4 rounded-2xl border border-neutral-800 transition-colors cursor-default">
                    <img src={sub.imageUrl} alt="Proof" className="w-16 h-16 rounded-xl object-cover bg-neutral-800 shrink-0 border border-neutral-700" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{sub.collegeName}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                        <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">{sub.approachedCount} Appr.</span>
                        <span className="text-neutral-500 flex items-center gap-1 font-medium" suppressHydrationWarning>
                          <Clock size={12} /> {new Date(sub.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
