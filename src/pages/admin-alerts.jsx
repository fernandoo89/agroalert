import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import { AlertTriangle, Trash2, Plus, ToggleLeft } from 'lucide-react';

export default function AdminAlerts() {
  const { profile } = useAuth();
  const [cultivos, setCultivos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  // Formulario
  const [cultivoId, setCultivoId] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('sobreoferta');
  const [mensaje, setMensaje] = useState('');

  const tiposAlerta = [
    { value: 'sobreoferta', label: 'Sobreoferta', color: 'bg-red-100 border-red-300 text-red-800' },
    { value: 'caida_precio', label: 'Caída de Precio', color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { value: 'general', label: 'General', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' }
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

      // Cargar alertas ordenadas por activa primero, luego por fecha
      const { data: alertasData } = await supabase
        .from('alertas')
        .select('*, cultivos(nombre)')
        .order('activa', { ascending: false })
        .order('created_at', { ascending: false });

      if (alertasData) setAlertas(alertasData);
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

    if (!mensaje.trim()) {
      setMsg('Escribe un mensaje para la alerta.');
      setMsgType('error');
      return;
    }

    if (mensaje.length > 200) {
      setMsg('El mensaje no puede exceder 200 caracteres.');
      setMsgType('error');
      return;
    }

    try {
      const { error } = await supabase.from('alertas').insert({
        cultivo_id: parseInt(cultivoId),
        tipo: tipoAlerta,
        mensaje: mensaje.trim(),
        activa: true,
        fecha: new Date().toISOString()
      });

      if (error) {
        setMsg('Error al crear: ' + error.message);
        setMsgType('error');
      } else {
        setMsg('✅ Alerta creada correctamente.');
        setMsgType('ok');
        setMensaje('');
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
        .from('alertas')
        .update({ activa: !activa })
        .eq('id', id);

      if (!error) {
        setMsg(`✅ Alerta ${!activa ? 'activada' : 'desactivada'}.`);
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
    if (!confirm('¿Estás seguro de que deseas eliminar esta alerta?')) return;

    try {
      const { error } = await supabase.from('alertas').delete().eq('id', id);
      if (!error) {
        setMsg('✅ Alerta eliminada.');
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

  const getTipoBadge = (tipo) => {
    const found = tiposAlerta.find(t => t.value === tipo);
    return found || tiposAlerta[0];
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-agro-dark">Gestionar Alertas</h1>
        <p className="text-gray-600 mt-2">Crea alertas para avisar a los agricultores sobre cambios importantes en el mercado: sobreoferta, caída de precios u otros eventos.</p>
      </header>

      {/* Formulario */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nueva Alerta</h2>

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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Alerta</label>
              <div className="flex gap-3">
                {tiposAlerta.map(tipo => (
                  <label key={tipo.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={tipo.value}
                      checked={tipoAlerta === tipo.value}
                      onChange={e => setTipoAlerta(e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">{tipo.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensaje <span className="text-xs text-gray-500">(máximo 200 caracteres)</span>
            </label>
            <textarea
              value={mensaje}
              onChange={e => setMensaje(e.target.value.slice(0, 200))}
              placeholder="Ej. El precio del tomate bajó 25% en La Hermelinda. Espera antes de vender si es posible."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary focus:border-transparent outline-none resize-none"
              rows="3"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{mensaje.length}/200 caracteres</p>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" /> Crear Alerta
          </button>
        </form>
      </div>

      {/* Lista de alertas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Todas las Alertas ({alertas.length})</h2>
          <p className="text-sm text-gray-600 mt-1">Las alertas activas aparecen primero</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-3">Cargando alertas...</span>
          </div>
        ) : alertas.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {alertas.map(alerta => {
              const tipoBadge = getTipoBadge(alerta.tipo);
              return (
                <div key={alerta.id} className={`p-6 border-l-4 ${alerta.activa ? 'border-l-orange-500 bg-white' : 'border-l-gray-300 bg-gray-50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{alerta.cultivos?.nombre}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tipoBadge.color}`}>
                          {tiposAlerta.find(t => t.value === alerta.tipo)?.label}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${alerta.activa ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                          {alerta.activa ? '🟢 Activa' : '⚪ Inactiva'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{alerta.mensaje}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alerta.fecha).toLocaleDateString('es-PE')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(alerta.id, alerta.activa)}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                          alerta.activa
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <ToggleLeft className="h-4 w-4" />
                        {alerta.activa ? 'Desact.' : 'Activ.'}
                      </button>
                      <button
                        onClick={() => handleEliminar(alerta.id)}
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
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No hay alertas creadas aún.</p>
            <p className="text-sm mt-1">Crea la primera alerta usando el formulario arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
}
