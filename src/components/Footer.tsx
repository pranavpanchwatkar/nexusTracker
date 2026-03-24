'use client';

import Link from 'next/link';
import { MessageSquareText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-950 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img src="/nexus-logo.png" alt="Nexus Logo" className="w-8 h-8 rounded-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
          <p className="text-neutral-500 dark:text-neutral-500 text-sm font-medium">
            © {new Date().getFullYear()} Team Nexus. All rights reserved.
          </p>
        </div>
        
        <Link 
          href="/feedback" 
          className="flex items-center gap-2 text-neutral-400 hover:text-blue-400 transition-colors text-sm font-semibold group bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800"
        >
          <div className="p-1 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
            <MessageSquareText size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          Submit Feedback
        </Link>
      </div>
    </footer>
  );
}
