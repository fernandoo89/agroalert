import { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default mini-infobar prompt
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show the banner if it has not been dismissed in this session
      const dismissed = sessionStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-install-dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-md border border-agro-light rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 animate-bounce-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-agro-primary rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-inner">
            <Smartphone className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">AgroAlert</h4>
            <p className="text-[11px] sm:text-xs text-slate-500">Instala la app en tu celular para consultar precios offline.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={handleInstall}
            className="bg-agro-primary hover:bg-agro-dark text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Instalar
          </button>
          <button 
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100/50 transition-colors"
            aria-label="Cerrar banner de instalación"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
