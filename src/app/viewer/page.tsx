import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getDashboardStats, getFeed } from '@/actions/admin';
import { logoutAction } from '@/actions/auth';
import DashboardStats from '@/components/DashboardStats';
import ActivityFeed from '@/components/ActivityFeed';
import { LogOut, Eye } from 'lucide-react';

export default async function ViewerDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'viewer') {
    redirect('/login');
  }

  const { submissions, processedData } = await getDashboardStats();
  const feed = await getFeed();

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 font-sans antialiased text-white">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-neutral-800 gap-4 md:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-500 rounded-xl"><Eye size={24}/></div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">Nexus Trackpad</h1>
            <p className="text-sm text-neutral-500 font-medium tracking-wide">Principal View</p>
          </div>
        </div>
        <form action={logoutAction} className="w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 hover:bg-neutral-800 text-neutral-400 font-medium py-2 px-4 rounded-xl transition-all w-full md:w-auto">
            <LogOut size={18} /> Logout
          </button>
        </form>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardStats submissions={submissions} processedData={processedData} />
        </div>
        <div className="lg:col-span-1 border border-neutral-800 bg-neutral-900/50 rounded-3xl p-6 shadow-xl h-fit max-h-[1000px]">
          <h3 className="text-xl font-bold text-white mb-6">Live Events</h3>
          <ActivityFeed feed={feed} />
        </div>
      </main>
    </div>
  );
}
