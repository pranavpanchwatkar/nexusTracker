'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { createSubmission } from '@/actions/submissions';
import { logoutAction } from '@/actions/auth';
import { Camera, Send, LogOut, CheckCircle2 } from 'lucide-react';

const initialState: any = { error: null, success: false };

export default function SubmissionForm({ teamName, colleges = [] }: { teamName: string, colleges?: string[] }) {
  const [state, formAction, isPending] = useActionState(createSubmission as any, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // When server action returns success, mark as submitted
  useEffect(() => {
    if (state?.success) {
      setSubmitted(true);
    }
  }, [state]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleReset = () => {
    setSubmitted(false);
    setPreview(null);
    formRef.current?.reset();
  };

  if (submitted && state?.success) {
    return (
      <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 text-center space-y-4 shadow-2xl">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12 transition-transform">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white">Submission Successful!</h2>
        <p className="text-neutral-400">
          Your activity at <span className="text-neutral-200 font-medium">{state.submission?.collegeName}</span> for{' '}
          <span className="text-neutral-200 font-medium">{state.submission?.approachedCount}</span> students has been recorded.
        </p>
        <button
          onClick={handleReset}
          className="mt-8 w-full font-medium bg-neutral-800 hover:bg-neutral-700 text-white py-4 px-4 rounded-xl transition-all"
        >
          Submit Another Activity
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white">Activity Form</h2>
          <p className="text-neutral-400 text-sm mt-1 flex items-center gap-2">
            Team: <span className="px-3 py-1 bg-blue-600/10 text-blue-400 font-medium rounded-md">{teamName}</span>
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-neutral-400 hover:text-red-400 p-3 rounded-xl hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
          </button>
        </form>
      </div>

      <form ref={formRef} action={formAction} className="space-y-6 text-left">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">College ID / Name</label>
          <div className="relative">
            <select
              name="collegeName"
              required
              defaultValue=""
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            >
              <option value="" disabled>Select a college...</option>
              {colleges.length > 0 ? (
                colleges.map((c: string, idx: number) => <option key={idx} value={c}>{c}</option>)
              ) : (
                <option value="" disabled>No colleges allotted. Contact admin.</option>
              )}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Number of Students Approached/Interested</label>
          <input
            type="number"
            name="approachedCount"
            required
            min="1"
            className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-neutral-600 placeholder:font-normal"
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Site Image</label>
          <div className="relative group block">
            <input
              type="file"
              name="image"
              accept="image/*"
              capture="environment"
              required
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full border-2 border-dashed rounded-xl overflow-hidden transition-all flex flex-col items-center justify-center p-2 ${preview ? 'border-transparent bg-neutral-950/20' : 'border-neutral-700 bg-neutral-950 group-hover:bg-neutral-900 group-hover:border-neutral-500 py-10'}`}>
              {preview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <p className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full"><Camera size={16} /> Tap to Retake</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={28} />
                  </div>
                  <p className="text-white font-medium mb-1">Take Photo or Upload</p>
                  <p className="text-neutral-500 text-sm">PNG, JPG up to 20MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {state?.error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium flex justify-center items-center gap-2 py-4 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all mt-4"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            <span className="flex items-center gap-2"><Send size={18} /> Submit Activity</span>
          )}
        </button>
      </form>
    </div>
  );
}
