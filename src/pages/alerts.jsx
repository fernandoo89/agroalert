import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import AlertCard from '../components/AlertCard';

export default function Alerts() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlertas() {
      const { data } = await supabase
        .from('alertas')
        .select('*, cultivos(nombre)')
        .order('activa', { ascending: false })
        .order('fecha', { ascending: false });
      
      if (data) setAlertas(data);
      setLoading(false);
    }
    loadAlertas();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-agro-dark">Centro de Alertas</h1>
        <p className="text-gray-600 mt-1">Comparte estas alertas con otros agricultores para evitar pérdidas conjuntas.</p>
      </header>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Cargando alertas...</div>
      ) : (
        <div className="grid gap-6">
          {alertas.length > 0 ? (
            alertas.map(a => (
              <div key={a.id} className={!a.activa ? 'opacity-50' : ''}>
                <AlertCard alerta={a} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 bg-white p-8 rounded-xl text-center border">No hay alertas registradas.</p>
          )}
        </div>
      )}
    </div>
  );
}
