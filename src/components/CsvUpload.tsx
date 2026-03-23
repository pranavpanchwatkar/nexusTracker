'use client';

import { useActionState } from 'react';
import { uploadCSVAction } from '@/actions/admin';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

const initialState: any = { success: false, count: 0, error: null };

export default function CsvUpload() {
  const [state, formAction, isPending] = useActionState(uploadCSVAction as any, initialState);

  return (
    <form action={formAction} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
      
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
        <div className="p-2 bg-blue-500/10 rounded-lg"><UploadCloud size={20} className="text-blue-500"/></div>
        Import Conversion Data
      </h3>
      
      <p className="text-neutral-400 text-sm mb-4 relative z-10">Upload the latest Unstop CSV to update paid conversions. Note: This replaces existing paid data.</p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center relative z-10">
        <input 
          type="file" 
          name="csvFile" 
          accept=".csv" 
          required
          className="bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-xl px-0 py-0 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 hover:file:cursor-pointer file:transition-colors w-full cursor-pointer"
        />
        <button 
          disabled={isPending}
          type="submit" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 whitespace-nowrap shadow-lg shadow-blue-500/20 flex items-center justify-center w-full sm:w-auto"
        >
          {isPending ? 'Processing...' : 'Upload & Sync'}
        </button>
      </div>

      {state?.error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-sm">
          <AlertCircle size={16} className="mt-0.5" />
          <p>{state.error}</p>
        </div>
      )}
      
      {state?.success && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400 text-sm animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} />
          <p>Successfully processed <span className="font-bold">{state.count}</span> valid leader records.</p>
        </div>
      )}
    </form>
  );
}
