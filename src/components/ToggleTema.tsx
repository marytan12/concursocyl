'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconSun, IconMoon } from '@/components/Icons';

export default function ToggleTema() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('cyl-theme') as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initial);
    if (initial !== theme) {
      const frame = window.requestAnimationFrame(() => setTheme(initial));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('cyl-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="toggle-tema"
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex' }}
          >
            <IconMoon size={24} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex' }}
          >
            <IconSun size={24} />
          </motion.span>
        )}
      </AnimatePresence>

      <style jsx>{`
        .toggle-tema {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 68px;
          height: 40px;
          padding: 0 14px;
          border-radius: var(--radius-pill);
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: all var(--duration-fast) var(--ease-spring);
          -webkit-tap-highlight-color: transparent;
        }

        .toggle-tema:hover {
          background: var(--bg-glass-hover);
          border-color: var(--border-active);
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        .toggle-tema:active {
          transform: scale(0.96);
        }
      `}</style>
    </button>
  );
}
