'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { TrendingUp, Users, Award } from 'lucide-react';

export default function DashboardStats({ submissions, processedData, activeTeams = [] }: { submissions: any[], processedData: any[], activeTeams?: any[] }) {
  // Aggregate data by Team
  const teamStats: Record<string, any> = {};
  const collegeToPromoterMap: Record<string, string> = {};
  const canonicalCollegeMap: Record<string, string> = {}; // Used to merge duplicate variations together

  // Strip acronyms in brackets, strip trailing Cities after commas, then strip spaces
  const normalize = (str: string) => {
    return (str || '')
      .toLowerCase()
      .replace(/\(.*?\)/g, '')  // Remove (NIT), (YCCE), etc.
      .replace(/,.*$/g, '')     // Remove ", Nagpur", etc.
      .replace(/[^a-z0-9]/g, ''); // Convert to pure alphanumeric string
  };

  // Track valid active teams
  const activeTeamNames = new Set(activeTeams.filter(t => t.role === 'coordinator').map(t => t.teamName));

  // Pre-load officially allotted colleges
  activeTeams.forEach(team => {
    if (team.role === 'coordinator') {
      teamStats[team.teamName] = { teamName: team.teamName, approached: 0, paid: 0 };

      if (team.allottedColleges && team.allottedColleges.length > 0) {
        team.allottedColleges.forEach((c: string) => {
          const norm = normalize(c);
          if (norm.length < 10) return; // Skip short/city-only entries
          collegeToPromoterMap[norm] = team.teamName;
          canonicalCollegeMap[norm] = c;
        });
      }
    }
  });

  // 1. Tally approach counts & fallback mapping
  submissions.forEach(sub => {
    const teamName = activeTeamNames.has(sub.teamName) ? sub.teamName : 'Unassigned/Organic';
    if (!teamStats[teamName]) {
      teamStats[teamName] = { teamName: teamName, approached: 0, paid: 0 };
    }
    teamStats[teamName].approached += sub.approachedCount;
    collegeToPromoterMap[normalize(sub.collegeName)] = teamName;
  });

  // Process Unstop rows: Evaluate Teams AND Generate deduplicated College Table Data
  const collegeStats: Record<string, any> = {};
  const seenNormals: Record<string, string> = {}; // Memory for Organic variations

  processedData.forEach(row => {
    const rawRowCollege = row.collegeName || 'Unknown';
    const normCollege = normalize(rawRowCollege);

    // Find canonical grouping string for deduplication
    let canonicalCollege = rawRowCollege;
    let foundCanonical = false;

    // 1. Is it matching an official team's beautifully typed string?
    for (const [normAllotted, cleanlySpelled] of Object.entries(canonicalCollegeMap)) {
      if (normCollege.includes(normAllotted) || normAllotted.includes(normCollege)) {
        canonicalCollege = cleanlySpelled; // Merge into the clean version!
        foundCanonical = true;
        break;
      }
    }

    // 2. If it is Organic (NOT allotted), merge its spelling to the FIRST time we saw this specific organic variation!
    if (!foundCanonical) {
      if (seenNormals[normCollege]) {
        canonicalCollege = seenNormals[normCollege]; // Collapse onto the earliest encountered raw string 
      } else {
        seenNormals[normCollege] = rawRowCollege; // Register it exactly as it appeared this first time
      }
    }

    // Accumulate total registrations for this cleanly-spelled college
    if (!collegeStats[canonicalCollege]) {
      collegeStats[canonicalCollege] = { collegeName: canonicalCollege, totalTeams: 0, paidTeams: 0 };
    }
    collegeStats[canonicalCollege].totalTeams += 1;

    // Evaluate Team & Paid Stats
    if (row.paymentStatus?.toLowerCase() === 'paid') {
      collegeStats[canonicalCollege].paidTeams += 1; // Add to college paid counter

      let promoterTeam = collegeToPromoterMap[normCollege];

      // If exact string doesn't match, do fuzzy verify for team attribution
      if (!promoterTeam) {
        for (const [allottedCollege, assignedTeam] of Object.entries(collegeToPromoterMap)) {
          if (normCollege.includes(allottedCollege) || allottedCollege.includes(normCollege)) {
            promoterTeam = assignedTeam;
            break;
          }
        }
      }

      if (!promoterTeam || !activeTeamNames.has(promoterTeam)) {
        promoterTeam = 'Unassigned/Organic';
      }

      if (!teamStats[promoterTeam]) {
        teamStats[promoterTeam] = { teamName: promoterTeam, approached: 0, paid: 0 };
      }
      teamStats[promoterTeam].paid += 1;
    }
  });

  const teamData = Object.values(teamStats).map(t => ({
    ...t,
    conversionNum: t.approached > 0 ? (t.paid / t.approached) * 100 : 0,
    conversionText: t.approached > 0 ? ((t.paid / t.approached) * 100).toFixed(1) + '%' : '0%'
  })).sort((a, b) => b.paid - a.paid);

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
          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-2xl"><Users size={28} /></div>
          <div>
            <p className="text-neutral-400 text-sm font-medium">Total Approached</p>
            <h4 className="text-3xl font-bold text-white">{totalApproached}</h4>
          </div>
        </div>
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl"><Award size={28} /></div>
          <div>
            <p className="text-neutral-400 text-sm font-medium">Total Paid Conversions</p>
            <h4 className="text-3xl font-bold text-white">{totalPaid}</h4>
          </div>
        </div>
      </div>

      {/* Team Comparison Chart: Approached vs Paid */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-500" /> 
            Team Activity Comparison
          </h3>
          <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
            <div className="flex items-center gap-2 text-neutral-400">
              <div className="w-3 h-3 border-2 border-purple-500 rounded-sm"></div>
              Approached
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
              Paid
            </div>
          </div>
        </div>
        <div className="w-full overflow-hidden" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={320} minWidth={0}>
            <BarChart data={teamData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="teamName" 
                stroke="#737373" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: '#262626', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '12px', color: '#fff' }}
              />
              <Bar 
                dataKey="approached" 
                name="Approached"
                fill="transparent" 
                stroke="#a855f7" 
                strokeWidth={2}
                radius={[4, 4, 0, 0]} 
                barSize={24}
              />
              <Bar 
                dataKey="paid" 
                name="Paid"
                fill="#a855f7" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
              />
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
                      {idx === 0 && t.paid > 0 && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
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
