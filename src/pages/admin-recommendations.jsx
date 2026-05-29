import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import { Lightbulb, Trash2, Plus, ToggleLeft } from 'lucide-react';

export default function AdminRecommendations() {
  const { profile } = useAuth();
  const [cultivos, setCultivos] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  // Formulario
  const [cultivoId, setCultivoId] = useState('');
  const [estado, setEstado] = useState('recomendado');
  const [motivo, setMotivo] = useState('');

  const estados = [
    { value: 'recomendado', label: '✅ Recomendado', color: 'bg-green-100 border-green-300 text-green-800' },
    { value: 'precaucion', label: '⚠️ Precaución', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { value: 'evitar', label: '❌ Evitar', color: 'bg-red-100 border-red-300 text-red-800' }
  ];

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

      // Cargar recomendaciones ordenadas por activa primero
      const { data: recsData } = await supabase
        .from('recomendaciones')
        .select('*, cultivos(nombre)')
        .order('activa', { ascending: false })
        .order('created_at', { ascending: false });

      if (recsData) setRecomendaciones(recsData);
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

    if (!motivo.trim()) {
      setMsg('Escribe el motivo de la recomendación.');
      setMsgType('error');
      return;
    }

    try {
      // Verificar si ya existe una recomendación activa para este cultivo
      const { data: existente } = await supabase
        .from('recomendaciones')
        .select('id')
        .eq('cultivo_id', parseInt(cultivoId))
        .eq('activa', true)
        .single();

      // Si existe, desactivarla primero
      if (existente) {
        await supabase
          .from('recomendaciones')
          .update({ activa: false })
          .eq('id', existente.id);
      }

      // Crear nueva recomendación
      const { error } = await supabase.from('recomendaciones').insert({
        cultivo_id: parseInt(cultivoId),
        estado: estado,
        motivo: motivo.trim(),
        activa: true,
        created_at: new Date().toISOString()
      });

      if (error) {
        setMsg('Error al crear: ' + error.message);
        setMsgType('error');
      } else {
        setMsg('✅ Recomendación guardada correctamente.');
        setMsgType('ok');
        setMotivo('');
        loadData();
      }
    } catch (err) {
      setMsg('Error inesperado: ' + err.message);
      setMsgType('error');
    }
  };

  const handleToggle = async (id, activa) => {
    try {
      const { error } = await supabase
        .from('recomendaciones')
        .update({ activa: !activa })
        .eq('id', id);

      if (!error) {
        setMsg(`✅ Recomendación ${!activa ? 'activada' : 'desactivada'}.`);
        setMsgType('ok');
        loadData();
      } else {
        setMsg('Error al actualizar: ' + error.message);
        setMsgType('error');
      }
    } catch (err) {
      setMsg('Error inesperado: ' + err.message);
      setMsgType('error');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta recomendación?')) return;

    try {
      const { error } = await supabase.from('recomendaciones').delete().eq('id', id);
      if (!error) {
        setMsg('✅ Recomendación eliminada.');
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

  const getEstadoBadge = (est) => {
    const found = estados.find(s => s.value === est);
    return found || estados[0];
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-agro-dark">Gestionar Recomendaciones</h1>
        <p className="text-gray-600 mt-2">Define qué cultivos se deben sembrar, cuáles requieren precaución y cuáles es mejor evitar según el estado actual del mercado.</p>
      </header>

      {/* Formulario */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nueva Recomendación</h2>

        {msg && (
          <div className={`mb-6 p-4 rounded-lg text-sm border ${msgType === 'ok' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
              <div className="flex gap-2 flex-wrap">
                {estados.map(est => (
                  <label key={est.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={est.value}
                      checked={estado === est.value}
                      onChange={e => setEstado(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">{est.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo</label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Ej. Precio estable, buena demanda en mercado mayorista, baja competencia en La Hermelinda."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary focus:border-transparent outline-none resize-none"
              rows="3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" /> Guardar Recomendación
          </button>
        </form>
      </div>

      {/* Lista de recomendaciones */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Recomendaciones por Cultivo ({recomendaciones.length})</h2>
          <p className="text-sm text-gray-600 mt-1">Las recomendaciones activas aparecen primero. Solo una puede ser activa por cultivo.</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Cargando recomendaciones...</span>
          </div>
        ) : recomendaciones.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recomendaciones.map(rec => {
              const estadoBadge = getEstadoBadge(rec.estado);
              return (
                <div key={rec.id} className={`p-6 border-l-4 ${rec.activa ? 'border-l-blue-500 bg-white' : 'border-l-gray-300 bg-gray-50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{rec.cultivos?.nombre}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoBadge.color}`}>
                          {estados.find(e => e.value === rec.estado)?.label}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rec.activa ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                          {rec.activa ? '🟢 Activa' : '⚪ Inactiva'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{rec.motivo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(rec.created_at).toLocaleDateString('es-PE')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(rec.id, rec.activa)}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                          rec.activa
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <ToggleLeft className="h-4 w-4" />
                        {rec.activa ? 'Desact.' : 'Activ.'}
                      </button>
                      <button
                        onClick={() => handleEliminar(rec.id)}
                        className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No hay recomendaciones creadas aún.</p>
            <p className="text-sm mt-1">Crea la primera recomendación usando el formulario arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
}
