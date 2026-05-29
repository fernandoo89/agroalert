import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Prices() {
  const [cultivos, setCultivos] = useState([]);
  const [cultivoActivo, setCultivoActivo] = useState('');
  const [dias, setDias] = useState(30);
  const [datosGrafica, setDatosGrafica] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar cultivos para el selector
  useEffect(() => {
    async function loadCultivos() {
      const { data } = await supabase.from('cultivos').select('id, nombre').order('nombre');
      if (data && data.length > 0) {
        setCultivos(data);
        setCultivoActivo(data[0].id.toString());
      }
    }
    loadCultivos();
  }, []);

  // Cargar precios según filtros
  useEffect(() => {
    if (!cultivoActivo) return;

    async function loadPrecios() {
      setLoading(true);
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - dias);

      const { data } = await supabase
        .from('precios')
        .select('*')
        .eq('cultivo_id', cultivoActivo)
        .gte('fecha', fechaLimite.toISOString().split('T')[0])
        .order('fecha', { ascending: true });

      if (data) {
        const chartData = data.map(p => ({
          fecha: new Date(p.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
          precio: parseFloat(p.precio_kg),
          mercado: p.mercado,
          fechaRaw: p.fecha,
        }));
        setDatosGrafica(chartData);
      }
      setLoading(false);
    }
    loadPrecios();
  }, [cultivoActivo, dias]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-agro-dark">Historial de Precios</h1>
        <p className="text-gray-600 mt-1">Analiza la tendencia del mercado para tomar mejores decisiones.</p>
      </header>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cultivo</label>
          <select 
            value={cultivoActivo} 
            onChange={(e) => setCultivoActivo(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-agro-primary outline-none"
          >
            {cultivos.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rango de tiempo</label>
          <select 
            value={dias} 
            onChange={(e) => setDias(Number(e.target.value))}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-agro-primary outline-none"
          >
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={60}>Últimos 60 días</option>
          </select>
        </div>
      </div>

      {/* Gráfica */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">Cargando gráfica...</div>
        ) : datosGrafica.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafica} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(val) => `S/ ${val}`} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`S/ ${value}`, 'Precio']} labelStyle={{ color: '#333', fontWeight: 'bold' }} />
              <Legend />
              <Line type="monotone" dataKey="precio" name="Precio (S/ por kg)" stroke="#1D9E75" strokeWidth={3} dot={{ r: 4, fill: '#1D9E75' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No hay datos suficientes para mostrar la gráfica de este cultivo.
          </div>
        )}
      </div>

      {/* Tabla de historial detallado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Historial Detallado</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando datos...</div>
        ) : datosGrafica.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Precio (S/ x kg)</th>
                  <th className="px-6 py-3 text-left">Mercado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...datosGrafica].reverse().map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {new Date(p.fechaRaw).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-bold text-agro-dark text-base">S/ {p.precio.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{p.mercado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No hay registros para mostrar en este rango de tiempo.
          </div>
        )}
      </div>
    </div>
  );
}
