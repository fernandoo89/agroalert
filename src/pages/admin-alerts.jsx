import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import { AlertTriangle, Trash2, Plus, ToggleLeft, Loader2, CheckCircle, AlertCircle, Inbox } from 'lucide-react';

export default function AdminAlerts() {
  const { profile } = useAuth();
  const [cultivos, setCultivos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const [cultivoId, setCultivoId] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('sobreoferta');
  const [mensaje, setMensaje] = useState('');

  // Sistema de colores consistente:
  // sobreoferta → amarillo (atención)
  // caida_precio → rojo (peligro)
  // general → azul (información)
  const tiposAlerta = [
    { value: 'sobreoferta',  label: 'Sobreoferta',     color: 'bg-yellow-50 border-yellow-300 text-yellow-900' },
    { value: 'caida_precio', label: 'Caída de Precio', color: 'bg-red-50 border-red-300 text-red-900' },
    { value: 'general',      label: 'General',         color: 'bg-blue-50 border-blue-300 text-blue-900' },
  ];

  const loadData = async () => {
    try {
      const { data: cultivosData } = await supabase.from('cultivos').select('id, nombre').order('nombre');
      if (cultivosData) {
        setCultivos(cultivosData);
        if (cultivosData.length > 0 && !cultivoId) setCultivoId(cultivosData[0].id.toString());
      }
      const { data: alertasData } = await supabase
        .from('alertas').select('*, cultivos(nombre)')
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
    if (!cultivoId) { setMsg('Selecciona un cultivo.'); setMsgType('error'); return; }
    if (!mensaje.trim()) { setMsg('Escribe un mensaje para la alerta.'); setMsgType('error'); return; }
    if (mensaje.length > 200) { setMsg('El mensaje no puede exceder 200 caracteres.'); setMsgType('error'); return; }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('alertas').insert({
        cultivo_id: parseInt(cultivoId),
        tipo: tipoAlerta,
        mensaje: mensaje.trim(),
        activa: true,
        fecha: new Date().toISOString(),
      });
      if (error) throw error;
      setMsg('Alerta creada correctamente.');
      setMsgType('ok');
      setMensaje('');
      loadData();
    } catch (err) {
      setMsg('Error al crear: ' + err.message);
      setMsgType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id, activa) => {
    try {
      const { error } = await supabase.from('alertas').update({ activa: !activa }).eq('id', id);
      if (!error) {
        setMsg(`Alerta ${!activa ? 'activada' : 'desactivada'} correctamente.`);
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
        setMsg('Alerta eliminada correctamente.');
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

  const getTipoBadge = (tipo) => tiposAlerta.find(t => t.value === tipo) || tiposAlerta[0];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-agro-dark tracking-tight">Gestionar Alertas</h1>
        <p className="text-slate-600 mt-2">Crea alertas para avisar a los agricultores sobre cambios importantes: sobreoferta, caída de precios u otros eventos críticos.</p>
      </header>

      {/* Formulario */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Nueva Alerta</h2>

        {msg && (
          <div className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-2.5 ${msgType === 'ok' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-950'}`} role="alert" aria-live="polite">
            {msgType === 'ok'
              ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              : <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            }
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="alert-cultivo" className="block text-sm font-bold text-slate-700 mb-2">Cultivo</label>
              <select
                id="alert-cultivo"
                value={cultivoId}
                onChange={e => setCultivoId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-medium text-slate-800"
                required
              >
                <option value="">Selecciona un cultivo</option>
                {cultivos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div>
              <fieldset>
                <legend className="block text-sm font-bold text-slate-700 mb-2">Tipo de Alerta</legend>
                <div className="flex gap-3 flex-wrap">
                  {tiposAlerta.map(tipo => (
                    <label key={tipo.value} htmlFor={`alert-tipo-${tipo.value}`} className="flex items-center gap-2 cursor-pointer">
                      <input
                        id={`alert-tipo-${tipo.value}`}
                        type="radio"
                        value={tipo.value}
                        checked={tipoAlerta === tipo.value}
                        onChange={e => setTipoAlerta(e.target.value)}
                        className="w-4 h-4 accent-agro-primary cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-700">{tipo.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <div>
            <label htmlFor="alert-mensaje" className="block text-sm font-bold text-slate-700 mb-2">
              Mensaje <span className="text-xs text-slate-400 font-normal">(máx. 200 caracteres)</span>
            </label>
            <textarea
              id="alert-mensaje"
              value={mensaje}
              onChange={e => setMensaje(e.target.value.slice(0, 200))}
              placeholder="Ej. El precio del tomate bajó 25% en La Hermelinda. Espera antes de vender si es posible."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none resize-none transition-all font-medium text-slate-800"
              rows="3"
              required
            />
            <p className={`text-xs mt-1 font-semibold ${mensaje.length > 180 ? 'text-red-600' : 'text-slate-400'}`}>
              {mensaje.length}/200 caracteres
            </p>
          </div>

          {/* Botón primario */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-agro-primary hover:bg-agro-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-agro-primary/20 active:scale-[0.98]"
          >
            {submitting
              ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /><span>Creando alerta...</span></>
              : <><Plus className="h-5 w-5" aria-hidden="true" /><span>Crear Alerta</span></>
            }
          </button>
        </form>
      </div>

      {/* Lista de alertas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-xl font-bold text-slate-800">Todas las Alertas ({alertas.length})</h2>
          <p className="text-sm text-slate-500 mt-1">Las alertas activas aparecen primero</p>
        </div>

        {loading ? (
          <div className="p-10 space-y-4" aria-label="Cargando lista de alertas">
            {[1,2,3].map(n => (
              <div key={n} className="skeleton-card">
                <div className="flex justify-between">
                  <div className="h-5 w-32 skeleton" />
                  <div className="flex gap-2"><div className="h-8 w-20 skeleton rounded-lg" /><div className="h-8 w-20 skeleton rounded-lg" /></div>
                </div>
                <div className="h-4 w-full skeleton" />
                <div className="h-4 w-2/3 skeleton" />
              </div>
            ))}
          </div>
        ) : alertas.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {alertas.map(alerta => {
              const tipoBadge = getTipoBadge(alerta.tipo);
              return (
                <div key={alerta.id} className={`p-6 border-l-4 ${alerta.activa ? 'border-l-agro-primary bg-white' : 'border-l-slate-200 bg-slate-50/50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-800">{alerta.cultivos?.nombre}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${tipoBadge.color}`}>
                          {tiposAlerta.find(t => t.value === alerta.tipo)?.label}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${alerta.activa ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                          {alerta.activa ? '🟢 Activa' : '⚪ Inactiva'}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium mb-2">{alerta.mensaje}</p>
                      <p className="text-xs text-slate-400">{new Date(alerta.fecha).toLocaleDateString('es-PE')}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {/* Botón secundario — toggle */}
                      <button
                        onClick={() => handleToggle(alerta.id, alerta.activa)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all active:scale-95 ${
                          alerta.activa
                            ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                        aria-label={alerta.activa ? 'Desactivar alerta' : 'Activar alerta'}
                      >
                        <ToggleLeft className="h-4 w-4" aria-hidden="true" />
                        {alerta.activa ? 'Desact.' : 'Activar'}
                      </button>
                      {/* Botón destructivo — eliminar */}
                      <button
                        onClick={() => handleEliminar(alerta.id)}
                        className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
                        aria-label="Eliminar alerta"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-14 text-center text-slate-400">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p className="text-base font-semibold text-slate-500">No hay alertas creadas aún.</p>
            <p className="text-sm mt-1">Crea la primera alerta usando el formulario de arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
}
