'use client';

import { useActionState, useState, useEffect } from 'react';
import { createTeamAction, updateTeamAction, deleteTeamAction } from '@/actions/teams';
import { ShieldAlert, CheckCircle2, Trash2, Edit2, X } from 'lucide-react';

const initialState: any = { error: null, success: false };

export default function ManageTeams({ existingTeams }: { existingTeams: any[] }) {
  const [createState, createAction, isCreating] = useActionState(createTeamAction as any, initialState);
  const [updateState, updateAction, isUpdating] = useActionState(updateTeamAction as any, initialState);
  
  const [editingTeam, setEditingTeam] = useState<any>(null);

  // Clear states when toggling views
  useEffect(() => {
    if (editingTeam) {
      updateState.success = false;
      updateState.error = null;
    } else {
      createState.success = false;
      createState.error = null;
    }
  }, [editingTeam]);

  const activeAction = editingTeam ? updateAction : createAction;
  const isPending = editingTeam ? isUpdating : isCreating;
  const state = editingTeam ? updateState : createState;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl mt-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ShieldAlert className="text-blue-500" size={20} /> Team Management
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-neutral-300 font-medium text-sm uppercase tracking-wider">
              {editingTeam ? 'Edit Coordinator Team' : 'Create New Coordinator Team'}
            </h4>
            {editingTeam && (
              <button onClick={() => setEditingTeam(null)} className="text-xs text-red-400 flex items-center gap-1 hover:text-red-300 transition-colors bg-red-500/10 px-2 py-1 rounded">
                <X size={12}/> Cancel Edit
              </button>
            )}
          </div>

          <form action={activeAction} className="space-y-4">
            {editingTeam && <input type="hidden" name="teamId" value={editingTeam._id} />}
            
            <div>
              <input type="text" name="teamName" defaultValue={editingTeam?.teamName || ''} placeholder="Team Name (e.g. Team Delta)" required className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <input type="email" name="email" defaultValue={editingTeam?.email || ''} placeholder="Login Email" required className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <input type="password" name="password" placeholder={editingTeam ? 'New Password (leave blank to keep current)' : 'Account Password'} required={!editingTeam} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <textarea name="colleges" defaultValue={editingTeam?.allottedColleges?.join('\n') || ''} placeholder="Allotted Colleges (put one college per line)" rows={4} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"></textarea>
              <p className="text-xs text-neutral-500 mt-2">Ensure college names match the Unstop CSV precisely. Press Enter after each one.</p>
            </div>
            
            {state?.error && <p className="text-red-400 text-sm mt-2">{state.error}</p>}
            {state?.success && <p className="text-green-400 text-sm mt-2 flex items-center gap-1"><CheckCircle2 size={16}/> {editingTeam ? 'Team Updated!' : 'Team created & colleges allotted!'}</p>}

            <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 mt-4">
              {isPending ? 'Saving...' : (editingTeam ? 'Save Changes' : 'Create Team & Allot')}
            </button>
          </form>
        </div>

        <div>
          <h4 className="text-neutral-300 font-medium mb-4 text-sm uppercase tracking-wider">Active Coordinator Teams</h4>
          <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
            {existingTeams.filter(t => t.role === 'coordinator').map((team, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors relative group">
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                  <button onClick={() => setEditingTeam(team)} className="text-neutral-500 hover:text-blue-400 transition-colors" title="Edit Team">
                    <Edit2 size={16} />
                  </button>
                  <form action={async (formData) => { await deleteTeamAction(formData); }} className="inline">
                    <input type="hidden" name="teamId" value={team._id} />
                    <button type="submit" className="text-neutral-500 hover:text-red-400 transition-colors" title="Delete Team" onClick={(e) => !window.confirm(`Are you sure you want to delete ${team.teamName}?`) && e.preventDefault()}>
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>

                <p className="font-bold text-white text-sm">{team.teamName} <span className="text-neutral-500 font-normal text-xs ml-1">({team.email})</span></p>
                <div className="mt-3 flex flex-wrap gap-2 pr-12">
                  {team.allottedColleges?.length > 0 ? team.allottedColleges.map((c: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-md border border-blue-500/20">{c}</span>
                  )) : (
                    <span className="text-neutral-500 text-xs bg-neutral-900 px-2 py-1 rounded">No colleges allotted</span>
                  )}
                </div>
              </div>
            ))}
            {existingTeams.filter(t => t.role === 'coordinator').length === 0 && (
              <p className="text-neutral-500 text-sm">No coordinator teams exist yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
