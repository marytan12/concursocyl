'use client';

import { useState } from 'react';

function readFavorites(storageKey: string) {
  if (typeof window === 'undefined') return new Set<string>();

  try {
    const saved = window.localStorage.getItem(storageKey);
    return new Set<string>(saved ? JSON.parse(saved) : []);
  } catch {
    return new Set<string>();
  }
}

export function useFavorites(scope: 'eventos' | 'descuentos') {
  const storageKey = `cyl-favoritos-${scope}`;
  const [favorites, setFavorites] = useState<Set<string>>(() => readFavorites(storageKey));

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      window.localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  return {
    favorites,
    isFavorite: (id: string) => favorites.has(id),
    toggleFavorite,
  };
}
