import { useState, useEffect } from 'react';

const KEY = 'inmobiliaria_favorites';

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const toggle = (id: string) =>
    setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const isFav = (id: string) => ids.includes(id);

  return { ids, toggle, isFav, count: ids.length };
}
