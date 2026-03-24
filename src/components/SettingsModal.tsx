'use client';

import { useActionState, useState } from 'react';
import { changePasswordAction } from '@/actions/auth';
import { Settings, X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const initialState: any = { error: null, success: null };

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(changePasswordAction as any, initialState);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium py-2 px-4 rounded-xl transition-all border border-neutral-700"
      >
        <Settings size={18} /> Settings
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                <Lock size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Security Settings</h2>
                <p className="text-sm text-neutral-500">Update your account password</p>
              </div>
            </div>

            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400 ml-1">Current Password</label>
                <div className="relative group">
                  <input 
                    type={showCurrent ? "text" : "password"}
                    name="currentPassword"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400 ml-1">New Password</label>
                  <div className="relative group">
                    <input 
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      required
                      minLength={6}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400 ml-1">Confirm New Password</label>
                  <input 
                    type={showNew ? "text" : "password"}
                    name="confirmPassword"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {state?.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm animate-shake">
                  <AlertCircle size={16} />
                  <p>{state.error}</p>
                </div>
              )}

              {state?.success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle2 size={16} />
                  <p>{state.success}</p>
                </div>
              )}

              <button 
                disabled={isPending}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-4 active:scale-[0.98]"
              >
                {isPending ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
