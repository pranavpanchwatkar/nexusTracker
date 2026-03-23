'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { TrendingUp, Users, Award } from 'lucide-react';

export default function DashboardStats({ submissions, processedData }: { submissions: any[], processedData: any[] }) {
  // Aggregate data by Team
  const teamStats: Record<string, any> = {};
  
  submissions.forEach(sub => {
    if (!teamStats[sub.teamName]) {
      teamStats[sub.teamName] = { teamName: sub.teamName, approached: 0, paid: 0 };
    }
    teamStats[sub.teamName].approached += sub.approachedCount;
  });

  processedData.forEach(row => {
    if (row.paymentStatus?.toLowerCase() === 'paid') {
      if (!teamStats[row.teamId]) {
         teamStats[row.teamId] = { teamName: row.teamId, approached: 0, paid: 0 };
      }
      teamStats[row.teamId].paid += 1;
    }
  });

  const teamData = Object.values(teamStats).map(t => ({
    ...t,
    conversionNum: t.approached > 0 ? (t.paid / t.approached) * 100 : 0,
    conversionText: t.approached > 0 ? ((t.paid / t.approached) * 100).toFixed(1) + '%' : '0%'
  })).sort((a, b) => b.paid - a.paid);

  // College Stats
  const collegeStats: Record<string, any> = {};
  processedData.forEach(row => {
    if (!collegeStats[row.collegeName]) {
      collegeStats[row.collegeName] = { collegeName: row.collegeName, totalTeams: 0, paidTeams: 0 };
    }
    collegeStats[row.collegeName].totalTeams += 1;
    if (row.paymentStatus?.toLowerCase() === 'paid') {
      collegeStats[row.collegeName].paidTeams += 1;
    }
  });

  const collegeData = Object.values(collegeStats).map(c => ({
    ...c,
    conversionText: c.totalTeams > 0 ? ((c.paidTeams / c.totalTeams) * 100).toFixed(1) + '%' : '0%'
  })).sort((a, b) => b.paidTeams - a.paidTeams);

  const totalApproached = teamData.reduce((acc, curr) => acc + curr.approached, 0);
  const totalPaid = teamData.reduce((acc, curr) => acc + curr.paid, 0);

  return (
    <div className="space-y-6">
      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-2xl"><Users size={28}/></div>
          <div>
            <p className="text-neutral-400 text-sm font-medium">Total Approached</p>
            <h4 className="text-3xl font-bold text-white">{totalApproached}</h4>
          </div>
        </div>
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl"><Award size={28}/></div>
          <div>
            <p className="text-neutral-400 text-sm font-medium">Total Paid Conversions</p>
            <h4 className="text-3xl font-bold text-white">{totalPaid}</h4>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-blue-500"/> Team Performance (Paid)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="teamName" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#262626'}}
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '12px', color: '#fff' }}
              />
              <Bar dataKey="paid" radius={[4, 4, 0, 0]}>
                {teamData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-5 border-b border-neutral-800">
            <h3 className="text-lg font-bold text-white">Top Teams</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950/50 text-neutral-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Team</th>
                  <th className="px-5 py-3 font-medium text-right">Appr.</th>
                  <th className="px-5 py-3 font-medium text-right">Paid</th>
                  <th className="px-5 py-3 font-medium text-right">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-200">
                {teamData.map((t, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium flex items-center gap-2">
                       {idx === 0 && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                       {t.teamName}
                    </td>
                    <td className="px-5 py-4 text-right text-neutral-400">{t.approached}</td>
                    <td className="px-5 py-4 text-right font-semibold text-green-400">{t.paid}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${t.conversionNum > 5 ? 'bg-green-500/10 text-green-400' : 'bg-neutral-800 text-neutral-400'}`}>
                        {t.conversionText}
                      </span>
                    </td>
                  </tr>
                ))}
                {teamData.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-neutral-500">No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* College Table */}
         <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-5 border-b border-neutral-800">
            <h3 className="text-lg font-bold text-white">College Conversions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950/50 text-neutral-400">
                <tr>
                  <th className="px-5 py-3 font-medium">College</th>
                  <th className="px-5 py-3 font-medium text-right">Total Reg.</th>
                  <th className="px-5 py-3 font-medium text-right">Paid</th>
                  <th className="px-5 py-3 font-medium text-right">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-200">
                {collegeData.map((c, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium truncate max-w-[150px]">{c.collegeName}</td>
                    <td className="px-5 py-4 text-right text-neutral-400">{c.totalTeams}</td>
                    <td className="px-5 py-4 text-right font-semibold text-green-400">{c.paidTeams}</td>
                    <td className="px-5 py-4 text-right text-blue-400 font-medium">{c.conversionText}</td>
                  </tr>
                ))}
                 {collegeData.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-neutral-500">No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
