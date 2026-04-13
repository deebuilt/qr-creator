import { useState, useEffect, useCallback } from 'react';
import type { QRConfig, SavedQRCode } from '@/types/qr';

const STORAGE_KEY = 'qr-code-library';
const MAX_SAVED = 20;

function loadLibrary(): SavedQRCode[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useQRLibrary() {
  const [library, setLibrary] = useState<SavedQRCode[]>(loadLibrary);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  const saveConfig = useCallback((config: QRConfig) => {
    setLibrary(prev => {
      const entry: SavedQRCode = {
        id: crypto.randomUUID(),
        config: { ...config },
        createdAt: new Date().toISOString(),
      };
      const next = [entry, ...prev];
      if (next.length > MAX_SAVED) next.pop();
      return next;
    });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setLibrary(prev => prev.filter(e => e.id !== id));
  }, []);

  return { library, saveConfig, deleteEntry };
}
