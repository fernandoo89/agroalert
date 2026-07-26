import { useState, useEffect, useRef } from 'react';
import { supabase } from '../js/supabase';
import { registrarEvento } from '../js/tracking';
import { useAuth } from '../js/auth';
import { useTheme } from '../js/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, RefreshCw, Inbox, Calendar, LayoutGrid, Download } from 'lucide-react';

export default function Prices() {
  const { profile } = useAuth();
  const { theme } = useTheme();
  const [cultivos, setCultivos] = useState([]);
  const [cultivoActivo, setCultivoActivo] = useState('');
  const [dias, setDias] = useState(30);
  const [datosGrafica, setDatosGrafica] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const lastTrackedRef = useRef('');

  // Cargar cultivos para el selector
  useEffect(() => {
    async function loadCultivos() {
      try {
        const { data, error: sbError } = await supabase.from('cultivos').select('id, nombre').order('nombre');
        if (sbError) throw sbError;
        if (data && data.length > 0) {
          const favoritos = profile?.cultivos_favoritos || [];
          const sorted = [...data].sort((a, b) => {
            const aFav = favoritos.includes(a.nombre) ? 0 : 1;
            const bFav = favoritos.includes(b.nombre) ? 0 : 1;
            return aFav - bFav;
          });
          setCultivos(sorted);
          setCultivoActivo(sorted[0].id.toString());
        }
      } catch (err) {
        console.error("Error cargando cultivos:", err);
        setError("Error al cargar la lista de cultivos. Inténtalo de nuevo.");
      }
    }
    loadCultivos();
  }, []);

  // Cargar precios según filtros
  useEffect(() => {
    if (!cultivoActivo) return;

    async function loadPrecios() {
      setLoading(true);
      setError(null);
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - dias);

      try {
        const { data, error: sbError } = await supabase
          .from('precios')
          .select('*')
          .eq('cultivo_id', cultivoActivo)
          .gte('fecha', fechaLimite.toISOString().split('T')[0])
          .order('fecha', { ascending: true });

        if (sbError) throw sbError;

        if (data) {
          const chartData = data.map(p => ({
            fecha: new Date(p.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
            precio: parseFloat(p.precio_kg),
            mercado: p.mercado,
            fechaRaw: p.fecha,
          }));
          setDatosGrafica(chartData);
          
          const cultivoSeleccionado = cultivos.find(c => c.id.toString() === cultivoActivo.toString())?.nombre;
          const trackKey = `${cultivoActivo}-${dias}`;
          if (cultivoSeleccionado && lastTrackedRef.current !== trackKey) {
            lastTrackedRef.current = trackKey;
            registrarEvento('historial_consultado', {
              cultivo: cultivoSeleccionado,
              rango_dias: dias
            });
          }
        }
      } catch (err) {
        console.error("Error al cargar precios:", err);
        setError("No pudimos actualizar el historial de precios para este cultivo. Reintenta por favor.");
      } finally {
        setLoading(false);
      }
    }
    loadPrecios();
  }, [cultivoActivo, dias, retryCount]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(prev => prev + 1);
  };

  const handleExportCSV = () => {
    if (datosGrafica.length === 0) return;
    const cultivoNombre = cultivos.find(c => c.id.toString() === cultivoActivo.toString())?.nombre || 'cultivo';
    const header = 'Fecha,Precio (S/ kg),Mercado\n';
    const rows = datosGrafica.map(p =>
      `${new Date(p.fechaRaw).toISOString().split('T')[0]},${p.precio.toFixed(2)},${p.mercado}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `precios_${cultivoNombre.toLowerCase().replace(/\s+/g, '_')}_${dias}d.csv`;
    link.click();
    URL.revokeObjectURL(url);
    registrarEvento('historial_exportado', { cultivo: cultivoNombre, rango_dias: dias, format: 'csv' });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-agro-dark tracking-tight">Historial de Precios</h1>
        <p className="text-slate-600 mt-1">Analiza la tendencia del mercado para tomar mejores decisiones de venta y siembra.</p>
      </header>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap gap-5 items-end">
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-cultivo" className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <LayoutGrid className="h-4 w-4 text-agro-primary" aria-hidden="true" />
            <span>Cultivo</span>
          </label>
          <select 
            id="filter-cultivo"
            value={cultivoActivo} 
            onChange={(e) => setCultivoActivo(e.target.value)}
            className="w-full sm:w-56 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-medium text-slate-800"
          >
            {cultivos.length === 0 && <option value="">Cargando cultivos...</option>}
            {cultivos.map(c => {
              const esFav = (profile?.cultivos_favoritos || []).includes(c.nombre);
              return (
                <option key={c.id} value={c.id}>{esFav ? '★ ' : ''}{c.nombre}</option>
              );
            })}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-tiempo" className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-agro-primary" aria-hidden="true" />
            <span>Rango de tiempo</span>
          </label>
          <select 
            id="filter-tiempo"
            value={dias} 
            onChange={(e) => setDias(Number(e.target.value))}
            className="w-full sm:w-56 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-medium text-slate-800"
          >
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={60}>Últimos 60 días</option>
          </select>
        </div>
        {datosGrafica.length > 0 && (
          <div className="w-full sm:w-auto sm:ml-auto">
            <button
              onClick={handleExportCSV}
              className="w-full sm:w-auto inline-flex items-center gap-2 bg-agro-primary hover:bg-agro-dark text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm active:scale-[0.98]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Descargar CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Sección de visualización */}
      {error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto" role="alert">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-red-950 mb-2">Error de conexión</h2>
          <p className="text-sm text-red-800 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm active:scale-95"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Reintentar</span>
          </button>
        </div>
      ) : (
        <>
          {/* Gráfica */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="h-[300px] w-full skeleton rounded-xl" />
                <span className="text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Cargando gráfica de precios...</span>
              </div>
            ) : datosGrafica.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosGrafica} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="fecha" tick={{fontSize: 12, fill: theme === 'dark' ? '#cbd5e1' : '#64748b'}} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(val) => `S/ ${val.toFixed(1)}`} tick={{fontSize: 12, fill: theme === 'dark' ? '#cbd5e1' : '#64748b'}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    formatter={(value) => [`S/ ${parseFloat(value).toFixed(2)}`, 'Precio Promedio']} 
                    contentStyle={{ borderRadius: '12px', border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', backgroundColor: theme === 'dark' ? '#1e293b' : '#fff' }} 
                    labelStyle={{ color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontWeight: 'bold' }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="precio" 
                    name="Precio (S/ por kg)" 
                    stroke="#15825E" 
                    strokeWidth={4} 
                    dot={{ r: 5, fill: '#15825E', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 7 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Inbox className="h-12 w-12 mb-2 opacity-50" aria-hidden="true" />
                <span className="font-semibold text-slate-500">No hay datos de precios para este cultivo en el rango seleccionado.</span>
              </div>
            )}
          </div>

          {/* Tabla de historial detallado */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Historial Detallado</h2>
            </div>
            
            {loading ? (
              <div className="p-12 space-y-4" aria-label="Cargando tabla de historial">
                <div className="h-8 skeleton w-full rounded" />
                <div className="h-8 skeleton w-full rounded" />
                <div className="h-8 skeleton w-full rounded" />
              </div>
            ) : datosGrafica.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left">Fecha de Registro</th>
                      <th className="px-6 py-4 text-left">Precio Promedio (S/ x kg)</th>
                      <th className="px-6 py-4 text-left">Mercado de Abastecimiento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...datosGrafica].reverse().map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {new Date(p.fechaRaw).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-agro-dark text-base">S/ {p.precio.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{p.mercado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400">
                <span>No hay registros históricos disponibles.</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
