import { useState, useEffect } from 'react';

const KEY = 'inmobiliaria_recently_viewed';
const MAX = 6;

export function useRecentlyViewed(currentId?: string) {
  const [ids, setIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    if (!currentId) return;
    setIds((prev) => {
      const next = [currentId, ...prev.filter((id) => id !== currentId)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, [currentId]);

  const recentIds = ids.filter((id) => id !== currentId);
  return { recentIds };
}
