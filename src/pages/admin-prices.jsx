import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { useAuth } from '../js/auth';
import { Trash2, Plus, Loader2, CheckCircle, AlertCircle, Inbox } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Pagination from '../components/Pagination';

const priceSchema = z.object({
  cultivoId: z.string().min(1, 'Selecciona un cultivo'),
  precioKg: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  mercado: z.string().min(1, 'Selecciona un mercado'),
});

export default function AdminPrices() {
  const { profile } = useAuth();
  const [cultivos, setCultivos] = useState([]);
  const [ultimosPrecios, setUltimosPrecios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const mercados = ['Mercado La Hermelinda', 'Mayorista Lima', 'Otro'];

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      cultivoId: '',
      precioKg: '',
      fecha: new Date().toISOString().split('T')[0],
      mercado: 'Mercado La Hermelinda'
    }
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: cultivosData } = await supabase
        .from('cultivos').select('id, nombre').order('nombre');
      if (cultivosData) {
        setCultivos(cultivosData);
        if (cultivosData.length > 0)
          setValue('cultivoId', cultivosData[0].id.toString());
      }
      const { data: preciosData } = await supabase
        .from('precios').select('*, cultivos(nombre)')
        .order('fecha', { ascending: false }).limit(20);
      if (preciosData) setUltimosPrecios(preciosData);
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
      const { error } = await supabase.from('precios').insert({
        cultivo_id: parseInt(data.cultivoId),
        precio_kg: data.precioKg,
        fecha: data.fecha,
        mercado: data.mercado,
        fuente: 'Admin AgroAlert',
      });
      if (error) throw error;
      setMsg('Precio registrado correctamente.');
      setMsgType('ok');
      reset({ ...data, precioKg: '' });
      loadData();
    } catch (err) {
      setMsg('Error al guardar: ' + err.message);
      setMsgType('error');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este precio?')) return;
    try {
      const { error } = await supabase.from('precios').delete().eq('id', id);
      if (!error) {
        setMsg('Precio eliminado correctamente.');
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

  const totalPages = Math.ceil(ultimosPrecios.length / PER_PAGE);
  const paginatedPrecios = ultimosPrecios.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-agro-dark tracking-tight">Cargar Precios del Día</h1>
        <p className="text-slate-600 mt-2">Registra los precios diarios por cultivo y mercado. Es el dato más importante de la plataforma.</p>
      </header>

      {/* Formulario */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Nuevo Precio</h2>

        {msg && (
          <div className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-2.5 ${msgType === 'ok' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-950'}`} role="alert" aria-live="polite">
            {msgType === 'ok'
              ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              : <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            }
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="price-cultivo" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Cultivo</label>
            <select
              id="price-cultivo"
              {...register('cultivoId')}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-medium text-slate-800 dark:text-slate-100"
            >
              <option value="">Selecciona un cultivo</option>
              {cultivos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            {errors.cultivoId && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.cultivoId.message}</p>}
          </div>

          <div>
            <label htmlFor="price-precio" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Precio (S/ por kg)</label>
            <input
              id="price-precio"
              type="number"
              step="0.01"
              {...register('precioKg')}
              placeholder="Ej. 2.50"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-medium text-slate-800 dark:text-slate-100"
            />
            {errors.precioKg && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.precioKg.message}</p>}
          </div>

          <div>
            <label htmlFor="price-fecha" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Fecha</label>
            <input
              id="price-fecha"
              type="date"
              {...register('fecha')}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-medium text-slate-800 dark:text-slate-100"
            />
            {errors.fecha && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fecha.message}</p>}
          </div>

          <div>
            <label htmlFor="price-mercado" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Mercado</label>
            <select
              id="price-mercado"
              {...register('mercado')}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-agro-primary outline-none transition-all font-medium text-slate-800 dark:text-slate-100"
            >
              {mercados.map(m => <option key={m}>{m}</option>)}
            </select>
            {errors.mercado && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.mercado.message}</p>}
          </div>

          <div className="sm:col-span-2">
            {/* Botón primario */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-agro-primary hover:bg-agro-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-agro-primary/20 active:scale-[0.98]"
            >
              {isSubmitting
                ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /><span>Registrando...</span></>
                : <><Plus className="h-5 w-5" aria-hidden="true" /><span>Registrar Precio</span></>
              }
            </button>
          </div>
        </form>
      </div>

      {/* Tabla últimos 20 precios */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-xl font-bold text-slate-800">Precios Cargados ({ultimosPrecios.length})</h2>
          <p className="text-sm text-slate-500 mt-1">Ordenados por fecha más reciente — Página {page} de {totalPages || 1}</p>
        </div>

        {loading ? (
          <div className="p-10 space-y-3" aria-label="Cargando lista de precios">
            {[1,2,3,4,5].map(n => <div key={n} className="h-10 skeleton rounded-lg" />)}
          </div>
        ) : ultimosPrecios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left">Cultivo</th>
                  <th className="px-6 py-4 text-left">Precio</th>
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-left">Mercado</th>
                  <th className="px-6 py-4 text-left">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPrecios.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{p.cultivos?.nombre}</td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-agro-dark text-base">S/ {parseFloat(p.precio_kg).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(p.fecha).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{p.mercado}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEliminar(p.id)}
                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-bold active:scale-95"
                        aria-label={`Eliminar precio de ${p.cultivos?.nombre}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-14 text-center text-slate-400">
            <Inbox className="h-12 w-12 mx-auto mb-3 opacity-40" aria-hidden="true" />
            <p className="text-base font-semibold text-slate-500">No hay precios registrados aún.</p>
            <p className="text-sm mt-1">Usa el formulario de arriba para ingresar el primer precio del día.</p>
          </div>
        )}
        {ultimosPrecios.length > PER_PAGE && (
          <div className="border-t border-slate-100">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
