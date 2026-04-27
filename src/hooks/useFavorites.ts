'use client';

import { useEffect, useState } from 'react';

export function useFavorites(scope: 'eventos' | 'descuentos') {
  const storageKey = `cyl-favoritos-${scope}`;
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      setFavorites(new Set(saved ? JSON.parse(saved) : []));
    } catch {
      setFavorites(new Set());
    }
  }, [storageKey]);

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
