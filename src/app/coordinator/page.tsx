import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import SubmissionForm from '@/components/SubmissionForm';

export default async function CoordinatorPage() {
  const session = await getSession();

  if (!session || session.role !== 'coordinator') {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-4 py-8 md:p-8 md:py-16 antialiased">
      <div className="max-w-xl mx-auto">
        <div className="mb-10 pl-2">
          <div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 font-medium text-xs rounded-full mb-4 border border-green-500/20 tracking-wide uppercase">Live Event</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Daily Update</h1>
          <p className="text-neutral-400">Log your on-ground promotion metrics accurately.</p>
        </div>
        
        <SubmissionForm teamName={session.teamName} />
      </div>
    </main>
  );
}
