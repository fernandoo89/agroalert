import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';

export default function Recommendations() {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecomendaciones() {
      const { data } = await supabase
        .from('recomendaciones')
        .select('*, cultivos(nombre)')
        .eq('activa', true)
        .order('created_at', { ascending: false });
      
      if (data) setRecomendaciones(data);
      setLoading(false);
    }
    loadRecomendaciones();
  }, []);

  const getEstiloEstado = (estado) => {
    if (estado === 'recomendado') return 'bg-green-100 text-green-800 border-green-200';
    if (estado === 'evitar') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-agro-dark">Recomendaciones de Siembra</h1>
        <p className="text-gray-600 mt-1">Nuestros análisis para que planifiques tu próxima campaña.</p>
      </header>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Cargando recomendaciones...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {recomendaciones.length > 0 ? (
            recomendaciones.map(r => (
              <div key={r.id} className={`p-6 rounded-xl border-2 ${getEstiloEstado(r.estado)} bg-white shadow-sm`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold">{r.cultivos?.nombre}</h3>
                  <span className="uppercase text-xs font-bold tracking-wider px-2 py-1 rounded bg-white bg-opacity-50">
                    {r.estado}
                  </span>
                </div>
                <p className="text-gray-800">{r.motivo}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full bg-white p-8 rounded-xl text-center border">
              No hay recomendaciones activas en este momento.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
