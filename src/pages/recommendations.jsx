import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

export default function Recommendations() {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadRecomendaciones() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('recomendaciones')
        .select('*, cultivos(nombre)')
        .eq('activa', true)
        .order('created_at', { ascending: false });
      
      if (sbError) throw sbError;
      setRecomendaciones(data || []);
    } catch (err) {
      console.error("Error al cargar recomendaciones:", err);
      setError("No pudimos conectar con el servidor. Revisa tu conexión de datos e inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecomendaciones();
  }, []);

  const getEstiloEstado = (estado) => {
    if (estado === 'recomendado') {
      return {
        card: 'bg-green-50/50 border-green-200 hover:bg-green-50 text-green-950',
        badge: 'bg-green-100 text-green-800 border-green-200/60',
        label: '✅ Recomendado'
      };
    }
    if (estado === 'evitar') {
      return {
        card: 'bg-red-50/50 border-red-200 hover:bg-red-50 text-red-950',
        badge: 'bg-red-100 text-red-800 border-red-200/60',
        label: '❌ Evitar'
      };
    }
    return {
      card: 'bg-yellow-50/50 border-yellow-200 hover:bg-yellow-50 text-yellow-950',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-200/60',
      label: '⚠️ Precaución'
    };
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-agro-dark tracking-tight">Recomendaciones de Siembra</h1>
        <p className="text-slate-600 mt-1">Análisis e indicaciones del mercado para que planifiques tu próxima campaña agrícola.</p>
      </header>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6" aria-label="Cargando recomendaciones">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="skeleton-card">
              <div className="flex justify-between items-center">
                <div className="h-6 w-32 skeleton" />
                <div className="h-5 w-20 skeleton rounded" />
              </div>
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-3/4 skeleton" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto" role="alert">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-red-950 mb-2">Error de conexión</h2>
          <p className="text-sm text-red-800 mb-5">{error}</p>
          <button
            onClick={loadRecomendaciones}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm active:scale-95"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Reintentar</span>
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {recomendaciones.length > 0 ? (
            recomendaciones.map(r => {
              const estilo = getEstiloEstado(r.estado);
              return (
                <div 
                  key={r.id} 
                  className={`p-6 rounded-2xl border-2 ${estilo.card} bg-white shadow-sm transition-all duration-300 hover:shadow`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-extrabold text-slate-800">{r.cultivos?.nombre}</h3>
                    <span className={`uppercase text-xs font-bold tracking-wider px-3 py-1 rounded-lg border ${estilo.badge}`}>
                      {estilo.label}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{r.motivo}</p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm col-span-full max-w-md mx-auto">
              <Inbox className="h-12 w-12 text-slate-300 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">Sin recomendaciones</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                No hay recomendaciones de siembra activas en este momento. Vuelve a consultar en unos días.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
