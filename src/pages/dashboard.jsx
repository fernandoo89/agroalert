import { useEffect, useState } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import PriceCard from '../components/PriceCard';
import AlertCard from '../components/AlertCard';
import { AlertCircle, RefreshCw, Info } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const [precios, setPrecios] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [recomendacion, setRecomendacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadDashboardData() {
    setLoading(true);
    setError(null);
    try {
      // Cargar precios recientes
      const { data: preciosData, error: preciosError } = await supabase
        .from('precios')
        .select('*, cultivos(nombre)')
        .order('fecha', { ascending: false })
        .limit(20);
      
      if (preciosError) throw preciosError;
      // Ordenar: cultivos favoritos primero, luego por fecha
      const favoritos = profile?.cultivos_favoritos || [];
      const preciosOrdenados = (preciosData || []).sort((a, b) => {
        const aFav = favoritos.includes(a.cultivos?.nombre) ? 0 : 1;
        const bFav = favoritos.includes(b.cultivos?.nombre) ? 0 : 1;
        if (aFav !== bFav) return aFav - bFav;
        return new Date(b.fecha) - new Date(a.fecha);
      }).slice(0, 6);
      setPrecios(preciosOrdenados);

      // Cargar alertas activas (max 3)
      const { data: alertasData, error: alertasError } = await supabase
        .from('alertas')
        .select('*, cultivos(nombre)')
        .eq('activa', true)
        .order('fecha', { ascending: false })
        .limit(3);
      
      if (alertasError) throw alertasError;
      setAlertas(alertasData || []);

      // Cargar recomendación más reciente
      const { data: recData, error: recError } = await supabase
        .from('recomendaciones')
        .select('*, cultivos(nombre)')
        .eq('activa', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (recError) throw recError;
      if (recData && recData.length > 0) setRecomendacion(recData[0]);

    } catch (err) {
      console.error("Error al cargar los datos del dashboard:", err);
      setError("No pudimos actualizar los datos del mercado en este momento. Por favor, reintenta.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-agro-dark tracking-tight">
          Hola, {profile?.nombre || 'Agricultor'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Aquí tienes el resumen del mercado para hoy en La Libertad.</p>
      </header>

      {loading ? (
        <div className="space-y-8" aria-label="Cargando tu resumen">
          {/* Skeleton de recomendación destacada */}
          <div className="skeleton h-28 w-full rounded-2xl" />
          
          {/* Skeletons de precios */}
          <section>
            <div className="h-6 w-48 skeleton mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="skeleton-card h-40" />
              ))}
            </div>
          </section>

          {/* Skeletons de alertas */}
          <section>
            <div className="h-6 w-48 skeleton mb-4" />
            <div className="skeleton h-24 w-full rounded-2xl" />
          </section>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto" role="alert">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-red-950 mb-2">Error al cargar datos</h2>
          <p className="text-sm text-red-800 mb-5">{error}</p>
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm active:scale-95"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Reintentar</span>
          </button>
        </div>
      ) : (
        <>
          {/* Recomendación Destacada */}
          {recomendacion && (
            <section aria-labelledby="dashboard-rec-title">
              <div className={`p-6 rounded-2xl border-2 transition-all hover:shadow-md ${
                recomendacion.estado === 'recomendado' ? 'bg-green-50 border-green-200 text-green-950' :
                recomendacion.estado === 'evitar' ? 'bg-red-50 border-red-200 text-red-950' :
                'bg-yellow-50 border-yellow-200 text-yellow-950'
              }`}>
                <h2 id="dashboard-rec-title" className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>Recomendación Destacada: {recomendacion.cultivos?.nombre}</span>
                  <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white bg-opacity-70 border border-current ml-auto">
                    {recomendacion.estado === 'recomendado' ? 'Recomendado' : recomendacion.estado === 'evitar' ? 'Evitar' : 'Precaución'}
                  </span>
                </h2>
                <p className="font-medium text-slate-800 leading-relaxed">{recomendacion.motivo}</p>
              </div>
            </section>
          )}

          {/* Precios */}
          <section aria-labelledby="dashboard-prices-title">
            <h2 id="dashboard-prices-title" className="text-2xl font-bold text-slate-800 mb-4">Precios del Día</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {precios.length > 0 ? (
                precios.map(p => (
                  <PriceCard 
                    key={p.id}
                    nombre={p.cultivos?.nombre}
                    precioActual={p.precio_kg}
                    tendencia="sube" // Comparación simplificada para MVP
                  />
                ))
              ) : (
                <div className="col-span-full bg-white p-8 rounded-2xl text-center border border-slate-100 text-slate-500">
                  No hay precios registrados recientes hoy.
                </div>
              )}
            </div>
          </section>

          {/* Alertas */}
          <section aria-labelledby="dashboard-alerts-title">
            <h2 id="dashboard-alerts-title" className="text-2xl font-bold text-slate-800 mb-4">Alertas Activas</h2>
            <div className="grid gap-4">
              {alertas.length > 0 ? (
                alertas.map(a => <AlertCard key={a.id} alerta={a} />)
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-10 rounded-2xl text-center text-slate-500">
                  No hay alertas críticas reportadas hoy en La Libertad. Todo marcha en orden.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
