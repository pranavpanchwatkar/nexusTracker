'use client';

import { Clock, X, ZoomIn } from 'lucide-react';
import { useState } from 'react';

export default function ActivityFeed({ feed }: { feed: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!feed || feed.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
        <p className="text-neutral-500">No recent submissions to display.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 max-h-[800px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
        {feed.map((item, idx) => (
          <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4 hover:border-neutral-700 transition-colors shadow-lg group">
            <div 
              onClick={() => setSelectedImage(item.imageUrl)}
              className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-neutral-950/50 border border-neutral-800 relative cursor-zoom-in"
            >
              <img 
                src={item.imageUrl} 
                alt="Site proof" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn size={20} className="text-white" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-white text-base">{item.teamName}</h4>
                <span className="text-xs text-neutral-500 flex items-center gap-1" suppressHydrationWarning>
                  <Clock size={12}/> {new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: true })}
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setSelectedImage(null)}
          ></div>
          
          <div className="relative z-[101] max-w-5xl w-full max-h-[90vh] flex flex-col items-center animate-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <X size={24} />
            </button>
            <div className="w-full h-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-neutral-900">
              <img 
                src={selectedImage} 
                alt="Full proof" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
