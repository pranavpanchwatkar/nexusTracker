import { getPublicStats } from '@/actions/admin';
import DashboardStats from '@/components/DashboardStats';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export default async function PublicStatsPage() {
  const { submissions, processedData } = await getPublicStats();

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 font-sans antialiased text-white">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-neutral-800 gap-6">
        <div className="flex items-center gap-4">
          <div className="">
            <img src="/nexus-logo.png" alt="Nexus Logo" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              Nexus Live Stats
            </h1>
            <p className="text-sm text-neutral-500 font-medium tracking-wide flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Public Activity Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <ThemeToggle />
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white px-5 py-2.5 rounded-xl transition-all font-medium flex-1 md:flex-none shadow-sm"
          >
            <LayoutDashboard size={18} />
            Member Login
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-[32px] p-6 md:p-10 shadow-3xl">
          <div className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              Global Performance Metrics
            </h2>
            <p className="text-neutral-500 mt-2">Aggregated real-time promotion data across all teams.</p>
          </div>

          <DashboardStats
            submissions={submissions}
            processedData={processedData}
          />
        </div>
      </main>
    </div>
  );
}
