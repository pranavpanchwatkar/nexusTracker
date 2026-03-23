'use client';

import { useActionState } from 'react';
import { submitFeedbackAction } from '@/actions/feedback';
import { MessageSquareText, Send, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const initialState: any = { success: false, error: null };

export default function FeedbackPage() {
  const [state, formAction, isPending] = useActionState(submitFeedbackAction as any, initialState);

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-4 md:p-8 flex items-center justify-center font-sans antialiased">
      <div className="max-w-md w-full">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <MessageSquareText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Feedback</h1>
              <p className="text-neutral-500 text-sm">Help us improve Team Nexus</p>
            </div>
          </div>

          {state?.success ? (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2">Thank You!</h2>
              <p className="text-neutral-400 mb-6">Your feedback has been submitted successfully.</p>
              <Link 
                href="/" 
                className="inline-block bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Return Home
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  name="message"
                  required
                  placeholder="Share your suggestions, report bugs, or give a shout-out..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-white placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all min-h-[150px] resize-none"
                />
              </div>

              {state?.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <p>{state.error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isPending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={18} />
                    Send Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
