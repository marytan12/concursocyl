'use client';

// =============================================================================
// BotonActualizar — Manual data refresh button
// =============================================================================
// Triggers POST to /api/actualizar-datos and shows loading/success states.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BotonActualizar() {
  const [estado, setEstado] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleRefresh = async () => {
    setEstado('loading');
    try {
      // Trigger GET on the update endpoint (same as cron would)
      const res = await fetch('/api/actualizar-datos');
      if (!res.ok) throw new Error('Error');
      setEstado('success');
      setTimeout(() => setEstado('idle'), 2000);
    } catch {
      setEstado('error');
      setTimeout(() => setEstado('idle'), 3000);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={estado === 'loading'}
      className="boton-actualizar btn-pill btn-secondary"
      aria-label="Actualizar datos"
    >
      <AnimatePresence mode="wait">
        {estado === 'loading' ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ rotate: { repeat: Infinity, duration: 1, ease: 'linear' } }}
            style={{ display: 'inline-flex' }}
          >
            ⟳
          </motion.span>
        ) : estado === 'success' ? (
          <motion.span
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            ✓
          </motion.span>
        ) : estado === 'error' ? (
          <motion.span key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            ✗
          </motion.span>
        ) : (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            🔄
          </motion.span>
        )}
      </AnimatePresence>
      <span>
        {estado === 'loading'
          ? 'Actualizando...'
          : estado === 'success'
          ? '¡Actualizado!'
          : estado === 'error'
          ? 'Error'
          : 'Actualizar datos'}
      </span>

      <style jsx>{`
        .boton-actualizar {
          gap: 8px;
        }
        .boton-actualizar:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}
