import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import { Trash2, Plus } from 'lucide-react';

export default function AdminPrices() {
  const { profile } = useAuth();
  const [cultivos, setCultivos] = useState([]);
  const [ultimosPrecios, setUltimosPrecios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState(''); // 'ok' | 'error'

  // Formulario
  const [cultivoId, setCultivoId] = useState('');
  const [precioKg, setPrecioKg] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [mercado, setMercado] = useState('Mercado La Hermelinda');

  const mercados = ['Mercado La Hermelinda', 'Mayorista Lima', 'Otro'];

  const loadData = async () => {
    try {
      const { data: cultivosData } = await supabase
        .from('cultivos')
        .select('id, nombre')
        .order('nombre');
      
      if (cultivosData) {
        setCultivos(cultivosData);
        if (cultivosData.length > 0 && !cultivoId) {
          setCultivoId(cultivosData[0].id.toString());
        }
      }

      const { data: preciosData } = await supabase
        .from('precios')
        .select('*, cultivos(nombre)')
        .order('fecha', { ascending: false })
        .limit(20);
      
      if (preciosData) setUltimosPrecios(preciosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!cultivoId) {
      setMsg('Selecciona un cultivo.');
      setMsgType('error');
      return;
    }

    if (!precioKg || parseFloat(precioKg) <= 0) {
      setMsg('Ingresa un precio válido mayor a 0.');
      setMsgType('error');
      return;
    }

    try {
      const { error } = await supabase.from('precios').insert({
        cultivo_id: parseInt(cultivoId),
        precio_kg: parseFloat(precioKg),
        fecha,
        mercado,
        fuente: 'Admin AgroAlert',
      });

      if (error) {
        setMsg('Error al guardar: ' + error.message);
        setMsgType('error');
      } else {
        setMsg('✅ Precio registrado correctamente.');
        setMsgType('ok');
        setPrecioKg('');
        setFecha(new Date().toISOString().split('T')[0]);
        loadData();
      }
    } catch (err) {
      setMsg('Error inesperado: ' + err.message);
      setMsgType('error');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este precio?')) return;
    
    try {
      const { error } = await supabase.from('precios').delete().eq('id', id);
      if (!error) {
        setMsg('✅ Precio eliminado.');
        setMsgType('ok');
        loadData();
      } else {
        setMsg('Error al eliminar: ' + error.message);
        setMsgType('error');
      }
    } catch (err) {
      setMsg('Error inesperado: ' + err.message);
      setMsgType('error');
    }
  };

  if (!profile?.es_admin) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-agro-dark">Cargar Precios del Día</h1>
        <p className="text-gray-600 mt-2">Registra los precios diarios de los cultivos en los principales mercados. Este es el dato más importante de la plataforma.</p>
      </header>

      {/* Formulario */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Precio</h2>

        {msg && (
          <div className={`mb-6 p-4 rounded-lg text-sm border ${msgType === 'ok' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cultivo</label>
            <select
              value={cultivoId}
              onChange={e => setCultivoId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary focus:border-transparent outline-none"
              required
            >
              <option value="">Selecciona un cultivo</option>
              {cultivos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Precio (S/ por kg)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={precioKg}
              onChange={e => setPrecioKg(e.target.value)}
              placeholder="Ej. 2.50"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mercado</label>
            <select
              value={mercado}
              onChange={e => setMercado(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary focus:border-transparent outline-none"
            >
              {mercados.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-agro-primary text-white font-bold py-3 rounded-lg hover:bg-agro-dark transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" /> Registrar Precio
            </button>
          </div>
        </form>
      </div>

      {/* Tabla últimos 20 precios */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Últimos 20 Precios Cargados</h2>
          <p className="text-sm text-gray-600 mt-1">Ordenados por fecha más reciente</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-primary"></div>
            <span className="ml-3">Cargando precios...</span>
          </div>
        ) : ultimosPrecios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">Cultivo</th>
                  <th className="px-6 py-4 text-left">Precio</th>
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-left">Mercado</th>
                  <th className="px-6 py-4 text-left">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ultimosPrecios.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{p.cultivos?.nombre}</td>
                    <td className="px-6 py-4 font-bold text-agro-dark text-lg">S/ {parseFloat(p.precio_kg).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(p.fecha).toLocaleDateString('es-PE', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{p.mercado}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEliminar(p.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded transition-colors text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No hay precios registrados aún.</p>
            <p className="text-sm mt-1">Carga el primer precio usando el formulario arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
}
