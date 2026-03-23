'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

function ThemeButton({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={className}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// Inline button used in desktop headers
export default function ThemeToggle() {
  return (
    <ThemeButton className="p-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-400 dark:text-neutral-300 hover:text-white transition-all shadow-sm" />
  );
}
