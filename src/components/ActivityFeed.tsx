import { Clock } from 'lucide-react';

export default function ActivityFeed({ feed }: { feed: any[] }) {
  if (!feed || feed.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
        <p className="text-neutral-500">No recent submissions to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
      {feed.map((item, idx) => (
        <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4 hover:border-neutral-700 transition-colors shadow-lg">
          <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-neutral-950/50 border border-neutral-800">
            <img 
              src={item.imageUrl} 
              alt="Site proof" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-white text-base">{item.teamName}</h4>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Clock size={12}/> {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-2 truncate max-w-[200px] sm:max-w-[300px]">{item.collegeName}</p>
            <div>
              <span className="inline-block px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-lg">
                +{item.approachedCount} Students
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
