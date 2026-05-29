import { useEffect, useState } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import PriceCard from '../components/PriceCard';
import AlertCard from '../components/AlertCard';

export default function Dashboard() {
  const { profile } = useAuth();
  const [precios, setPrecios] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [recomendacion, setRecomendacion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Cargar precios recientes
        const { data: preciosData } = await supabase
          .from('precios')
          .select('*, cultivos(nombre)')
          .order('fecha', { ascending: false })
          .limit(6);
        
        if (preciosData) setPrecios(preciosData);

        // Cargar alertas activas (max 3)
        const { data: alertasData } = await supabase
          .from('alertas')
          .select('*, cultivos(nombre)')
          .eq('activa', true)
          .order('fecha', { ascending: false })
          .limit(3);
        
        if (alertasData) setAlertas(alertasData);

        // Cargar recomendación más reciente
        const { data: recData } = await supabase
          .from('recomendaciones')
          .select('*, cultivos(nombre)')
          .eq('activa', true)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (recData && recData.length > 0) setRecomendacion(recData[0]);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando tu resumen...</div>;

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-agro-dark">Hola, {profile?.nombre || 'Agricultor'}</h1>
        <p className="text-gray-600 mt-1">Aquí tienes el resumen del mercado para hoy.</p>
      </header>

      {/* Recomendación Destacada */}
      {recomendacion && (
        <section>
          <div className={`p-6 rounded-2xl shadow-sm border ${
            recomendacion.estado === 'recomendado' ? 'bg-green-50 border-green-200' :
            recomendacion.estado === 'evitar' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              💡 Recomendación Destacada: {recomendacion.cultivos?.nombre}
            </h2>
            <p className="text-gray-800">{recomendacion.motivo}</p>
          </div>
        </section>
      )}

      {/* Precios */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Precios del Día</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {precios.length > 0 ? (
            precios.map(p => (
              <PriceCard 
                key={p.id}
                nombre={p.cultivos?.nombre}
                precioActual={p.precio_kg}
                tendencia="sube" // En un caso real, calcularíamos comparando con el día anterior
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No hay precios registrados recientes.</p>
          )}
        </div>
      </section>

      {/* Alertas */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Alertas Activas</h2>
        </div>
        <div className="grid gap-4">
          {alertas.length > 0 ? (
            alertas.map(a => <AlertCard key={a.id} alerta={a} />)
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 p-8 rounded-xl text-center text-gray-500">
              No hay alertas críticas en este momento.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
