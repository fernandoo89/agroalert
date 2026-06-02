import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import AlertCard from '../components/AlertCard';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

export default function Alerts() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadAlertas() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('alertas')
        .select('*, cultivos(nombre)')
        .order('activa', { ascending: false })
        .order('fecha', { ascending: false });
      
      if (sbError) throw sbError;
      setAlertas(data || []);
    } catch (err) {
      console.error("Error al cargar las alertas:", err);
      setError("No pudimos conectar con el servidor. Por favor, revisa tu conexión a Internet e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlertas();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-agro-dark tracking-tight">Centro de Alertas</h1>
        <p className="text-slate-600 mt-1">Comparte estas alertas con otros agricultores para evitar pérdidas conjuntas en La Libertad.</p>
      </header>

      {loading ? (
        <div className="grid gap-6" aria-label="Cargando alertas">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card">
              <div className="flex justify-between">
                <div className="h-5 w-24 skeleton" />
                <div className="h-4 w-16 skeleton" />
              </div>
              <div className="h-5 w-full skeleton" />
              <div className="h-5 w-5/6 skeleton" />
              <div className="h-10 w-full skeleton rounded-lg pt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto" role="alert">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-red-950 mb-2">Error de conexión</h2>
          <p className="text-sm text-red-800 mb-5">{error}</p>
          <button
            onClick={loadAlertas}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm active:scale-95"
          >
            <RefreshCw className="h-4 w-4 animate-spin-hover" aria-hidden="true" />
            <span>Reintentar</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {alertas.length > 0 ? (
            alertas.map(a => (
              <div key={a.id} className={!a.activa ? 'opacity-60 transition-opacity' : ''}>
                <AlertCard alerta={a} />
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-md mx-auto">
              <Inbox className="h-12 w-12 text-slate-300 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">Sin alertas registradas</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                No hay alertas de mercado activas en tu zona en este momento. ¡Todo se encuentra estable!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
