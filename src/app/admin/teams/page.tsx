import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/actions/auth';
import { User } from '@/lib/models';
import ManageTeams from '@/components/ManageTeams';
import dbConnect from '@/lib/db';
import { LogOut, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

export default async function ManageTeamsPage() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  await dbConnect();
  const dbUsers = await User.find({}).lean();
  const existingTeams = JSON.parse(JSON.stringify(dbUsers));

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 font-sans antialiased text-white pb-20">
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-neutral-800 gap-4 md:gap-0">
        <div className="flex items-center gap-3">
          <img src="/nexus-logo.png" alt="Nexus Logo" className="w-12 h-12 rounded-full object-cover shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">Team Management</h1>
            <p className="text-sm text-neutral-500 font-medium tracking-wide">Create, edit and delete coordinator teams</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <ThemeToggle />
          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 text-neutral-400 hover:text-white font-medium py-2 px-4 rounded-xl transition-all border border-neutral-800 hover:border-neutral-600 w-full md:w-auto"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <form action={logoutAction} className="w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-400 text-neutral-400 font-medium py-2 px-4 rounded-xl transition-all w-full md:w-auto border border-transparent hover:border-red-500/20">
              <LogOut size={18} /> Logout
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <ManageTeams existingTeams={existingTeams} />
      </main>
    </div>
  );
}
