import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getDashboardStats, getFeed } from '@/actions/admin';
import { logoutAction } from '@/actions/auth';
import { User } from '@/lib/models';
import DashboardStats from '@/components/DashboardStats';
import CsvUpload from '@/components/CsvUpload';
import ActivityFeed from '@/components/ActivityFeed';
import dbConnect from '@/lib/db';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { getFeedbacks } from '@/actions/feedback';
import { LogOut, Users, MessageSquareText, Clock } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  await dbConnect();
  const { submissions, processedData } = await getDashboardStats();
  const feed = await getFeed();

  const dbUsers = await User.find({}).lean();
  const existingTeams = JSON.parse(JSON.stringify(dbUsers));
  
  // Fetch feedbacks
  const feedbacks = await getFeedbacks();

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 font-sans antialiased text-white pb-20">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-neutral-800 gap-4 md:gap-0">
        <div className="flex items-center gap-3">
          <img src="/nexus-logo.png" alt="Nexus Logo" className="w-12 h-12 rounded-full object-cover shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">Team Nexus</h1>
            <p className="text-sm text-neutral-500 font-medium tracking-wide">Admin Control Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <ThemeToggle />
          <Link
            href="/admin/teams"
            className="flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 font-medium py-2 px-4 rounded-xl transition-all border border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5 hover:bg-purple-500/10 w-full md:w-auto"
          >
            <Users size={16} /> Manage Teams
          </Link>
          <form action={logoutAction} className="w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-400 text-neutral-400 font-medium py-2 px-4 rounded-xl transition-all w-full md:w-auto border border-transparent hover:border-red-500/20">
              <LogOut size={18} /> Logout
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Activity Feed — first on mobile, right column on desktop */}
          <div className="lg:col-span-1 lg:order-2 border border-neutral-800 bg-neutral-900/50 rounded-3xl p-6 shadow-xl relative overflow-hidden h-fit max-h-[1000px]">
            <div className="absolute top-0 flex justify-center w-full mt-[-10px] left-0 pointer-events-none">
              <div className="w-32 h-6 bg-blue-500/20 rounded-full blur-xl"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-2">Live Activity Feed <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span></h3>
            <ActivityFeed feed={feed} />
          </div>

          {/* Main column — Stats first, CSV Upload last on mobile, left column on desktop */}
          <div className="lg:col-span-2 lg:order-1 space-y-8">
            <DashboardStats submissions={submissions} processedData={processedData} activeTeams={existingTeams} />
            <CsvUpload />
            
            {/* Feedback Section (Admin Only) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 font-sans">
                  <MessageSquareText size={20} />
                </div>
                Recent Feedback
              </h3>

              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-4 relative z-10">
                {feedbacks.length === 0 ? (
                  <p className="text-neutral-500 text-center py-8">No feedback submitted yet.</p>
                ) : (
                  feedbacks.map((item: any) => (
                    <div key={item._id} className="bg-white dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">{item.email}</span>
                        <div className="flex items-center gap-1.5 text-neutral-500 text-xs text-sans">
                          <Clock size={12} />
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
