import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-pulse">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded-full shadow-lg text-xs font-semibold border border-amber-500/30 backdrop-blur-sm">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Modo Offline (Datos Guardados)</span>
      </div>
    </div>
  );
}
