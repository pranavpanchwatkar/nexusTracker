'use client';

import { useActionState } from 'react';
import { loginAction } from '@/actions/auth';
import Link from 'next/link';

const initialState: any = {
  error: null,
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction as any, initialState);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-800">
        <div className="text-center mb-8">
          <img src="/nexus-logo.png" alt="Nexus Logo" className="w-20 h-20 rounded-full object-cover shadow-xl mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-white mb-2">Team Nexus</h1>
          <p className="text-neutral-400">Sign in to your account</p>
          <div className="mt-2">
            <Link 
              href="/stats" 
              className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
            >
              View Public Live Stats →
            </Link>
          </div>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Team ID / Email</label>
            <input
              name="emailOrTeamId"
              type="text"
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-neutral-600"
              placeholder="e.g. team@nexus.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-neutral-600"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {state.error}
            </div>
          )}

          <button
            disabled={isPending}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium flex justify-center py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            {isPending ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
