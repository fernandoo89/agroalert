import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import { Lightbulb, Trash2, Plus, ToggleLeft, Loader2, CheckCircle, AlertCircle, Inbox } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../components/Pagination';

const recSchema = z.object({
  cultivoId: z.string().min(1, 'Selecciona un cultivo'),
  estado: z.enum(['recomendado', 'precaucion', 'evitar']),
  motivo: z.string().min(1, 'El motivo es requerido'),
});

export default function AdminRecommendations() {
  const { profile } = useAuth();
  const [cultivos, setCultivos] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    resolver: zodResolver(recSchema),
    defaultValues: {
      cultivoId: '',
      estado: 'recomendado',
      motivo: ''
    }
  });

  // Sistema de colores consistente:
  // recomendado → verde (bueno)
  // precaucion   → amarillo (atención)
  // evitar       → rojo (peligro)
  const estados = [
    { value: 'recomendado', label: '✅ Recomendado', color: 'bg-green-50 border-green-300 text-green-900' },
    { value: 'precaucion',  label: '⚠️ Precaución',  color: 'bg-yellow-50 border-yellow-300 text-yellow-900' },
    { value: 'evitar',      label: '❌ Evitar',       color: 'bg-red-50 border-red-300 text-red-900' },
  ];

  const loadData = async () => {
    try {
      const { data: cultivosData } = await supabase.from('cultivos').select('id, nombre').order('nombre');
      if (cultivosData) {
        setCultivos(cultivosData);
        if (cultivosData.length > 0) setValue('cultivoId', cultivosData[0].id.toString());
      }
      const { data: recsData } = await supabase
        .from('recomendaciones').select('*, cultivos(nombre)')
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

  const onSubmit = async (data) => {
    setMsg('');

    try {
      // Desactivar recomendación previa activa para este cultivo
      const { data: existente } = await supabase
        .from('recomendaciones').select('id')
        .eq('cultivo_id', parseInt(data.cultivoId)).eq('activa', true).single();
      if (existente) {
        await supabase.from('recomendaciones').update({ activa: false }).eq('id', existente.id);
      }

      const { error } = await supabase.from('recomendaciones').insert({
        cultivo_id: parseInt(data.cultivoId),
        estado: data.estado, 
        motivo: data.motivo.trim(),
        activa: true,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setMsg('Recomendación guardada correctamente.');
      setMsgType('ok');
      reset({ ...data, motivo: '' });
      loadData();
    } catch (err) {
      setMsg('Error al crear: ' + err.message);
      setMsgType('error');
    }
  };

  const handleToggle = async (id, activa) => {
    try {
      const { error } = await supabase.from('recomendaciones').update({ activa: !activa }).eq('id', id);
      if (!error) {
        setMsg(`Recomendación ${!activa ? 'activada' : 'desactivada'} correctamente.`);
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
        setMsg('Recomendación eliminada correctamente.');
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

  const totalPages = Math.ceil(recomendaciones.length / PER_PAGE);
  const paginatedRecs = recomendaciones.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const getEstadoBadge = (est) => estados.find(s => s.value === est) || estados[0];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-agro-dark tracking-tight">Gestionar Recomendaciones</h1>
        <p className="text-slate-600 mt-2">Define qué cultivos se deben sembrar, cuáles requieren precaución y cuáles es mejor evitar según el mercado actual.</p>
      </header>

      {/* Formulario */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Nueva Recomendación</h2>

        {msg && (
          <div className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-2.5 ${msgType === 'ok' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-950'}`} role="alert" aria-live="polite">
            {msgType === 'ok'
              ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              : <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            }
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="rec-cultivo" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Cultivo</label>
              <select
                id="rec-cultivo"
                {...register('cultivoId')}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-medium text-slate-800 dark:text-slate-100"
              >
                <option value="">Selecciona un cultivo</option>
                {cultivos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              {errors.cultivoId && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.cultivoId.message}</p>}
            </div>

            <div>
              <fieldset>
                <legend className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Estado de la Recomendación</legend>
                <div className="flex gap-3 flex-wrap">
                  {estados.map(est => (
                    <label key={est.value} htmlFor={`rec-estado-${est.value}`} className="flex items-center gap-2 cursor-pointer">
                      <input
                        id={`rec-estado-${est.value}`}
                        type="radio"
                        value={est.value}
                        {...register('estado')}
                        className="w-4 h-4 accent-agro-primary cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{est.label}</span>
                    </label>
                  ))}
                </div>
                {errors.estado && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.estado.message}</p>}
              </fieldset>
            </div>
          </div>

          <div>
            <label htmlFor="rec-motivo" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Motivo de la Recomendación</label>
            <textarea
              id="rec-motivo"
              {...register('motivo')}
              placeholder="Ej. Precio estable, buena demanda en mercado mayorista, baja competencia en La Hermelinda."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none resize-none transition-all font-medium text-slate-800 dark:text-slate-100"
              rows="3"
            />
            {errors.motivo && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.motivo.message}</p>}
          </div>

          {/* Botón primario */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-agro-primary hover:bg-agro-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-agro-primary/20 active:scale-[0.98]"
          >
            {isSubmitting
              ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /><span>Guardando...</span></>
              : <><Plus className="h-5 w-5" aria-hidden="true" /><span>Guardar Recomendación</span></>
            }
          </button>
        </form>
      </div>

      {/* Lista de recomendaciones */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-xl font-bold text-slate-800">Recomendaciones por Cultivo ({recomendaciones.length})</h2>
          <p className="text-sm text-slate-500 mt-1">Las recomendaciones activas aparecen primero. Solo una puede estar activa por cultivo. — Página {page} de {totalPages || 1}</p>
        </div>

        {loading ? (
          <div className="p-10 space-y-4" aria-label="Cargando recomendaciones">
            {[1,2,3].map(n => (
              <div key={n} className="skeleton-card">
                <div className="flex justify-between">
                  <div className="h-5 w-32 skeleton" />
                  <div className="flex gap-2"><div className="h-8 w-20 skeleton rounded-lg" /><div className="h-8 w-20 skeleton rounded-lg" /></div>
                </div>
                <div className="h-4 w-full skeleton" />
                <div className="h-4 w-3/4 skeleton" />
              </div>
            ))}
          </div>
        ) : recomendaciones.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            <AnimatePresence>
            {paginatedRecs.map(rec => {
              const estadoBadge = getEstadoBadge(rec.estado);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  key={rec.id} 
                  className={`p-6 border-l-4 ${rec.activa ? 'border-l-agro-primary bg-white dark:bg-slate-800' : 'border-l-slate-200 dark:border-l-slate-600 bg-slate-50/50 dark:bg-slate-800/50'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-800">{rec.cultivos?.nombre}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${estadoBadge.color}`}>
                          {estados.find(e => e.value === rec.estado)?.label}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${rec.activa ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                          {rec.activa ? '🟢 Activa' : '⚪ Inactiva'}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium mb-2">{rec.motivo}</p>
                      <p className="text-xs text-slate-400">{new Date(rec.created_at).toLocaleDateString('es-PE')}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {/* Botón secundario — toggle */}
                      <button
                        onClick={() => handleToggle(rec.id, rec.activa)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all active:scale-95 ${
                          rec.activa
                            ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                        aria-label={rec.activa ? 'Desactivar recomendación' : 'Activar recomendación'}
                      >
                        <ToggleLeft className="h-4 w-4" aria-hidden="true" />
                        {rec.activa ? 'Desact.' : 'Activar'}
                      </button>
                      {/* Botón destructivo — eliminar */}
                      <button
                        onClick={() => handleEliminar(rec.id)}
                        className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
                        aria-label="Eliminar recomendación"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-14 text-center text-slate-400">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p className="text-base font-semibold text-slate-500">No hay recomendaciones creadas aún.</p>
            <p className="text-sm mt-1">Crea la primera recomendación usando el formulario de arriba.</p>
          </div>
        )}
        {recomendaciones.length > PER_PAGE && (
          <div className="border-t border-slate-100">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
