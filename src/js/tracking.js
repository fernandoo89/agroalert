import { supabase } from './supabase';

// Caché en memoria para evitar duplicados en la misma sesión
const recentEvents = new Map();

// Capturar el canal inmediatamente al cargar el módulo
const params = new URLSearchParams(window.location.search);
let canalUrl = params.get('canal');
if (canalUrl && ['whatsapp', 'directo'].includes(canalUrl.toLowerCase())) {
  sessionStorage.setItem('canal_agroalert', canalUrl.toLowerCase());
}

/**
 * Registra un evento de tracking en Supabase.
 * @param {string} nombreEvento 
 * @param {object} datos 
 */
export async function registrarEvento(nombreEvento, datos = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // No intentamos registrar si no hay usuario

    // Obtener canal desde la sesión (o por defecto)
    const canal = sessionStorage.getItem('canal_agroalert') || 'directo';

    // Protección contra duplicados exactos en un lapso corto (5 segundos)
    const eventKey = `${nombreEvento}_${JSON.stringify(datos)}`;
    const now = Date.now();
    if (recentEvents.has(eventKey)) {
      if (now - recentEvents.get(eventKey) < 5000) {
        return; // Evita el duplicado
      }
    }
    recentEvents.set(eventKey, now);

    // Extraemos cultivo de los datos si existe, para la columna específica
    const cultivo = datos.cultivo || null;
    const datosAdicionales = { ...datos };
    delete datosAdicionales.cultivo; // No duplicar información en el jsonb

    const { error } = await supabase.from('eventos_tracking').insert({
      usuario_id: user.id,
      nombre_evento: nombreEvento,
      cultivo: cultivo,
      canal: canal,
      datos_adicionales: datosAdicionales
    });

    if (error) throw error;

    // Verificar activación si corresponde
    if (['precio_dia_consultado', 'historial_consultado', 'alerta_consultada'].includes(nombreEvento)) {
      await verificarActivacion(user);
    }
  } catch (error) {
    // Manejo de errores silencioso
    console.error(`Error al registrar evento tracking (${nombreEvento}):`, error.message);
  }
}

/**
 * Verifica si el usuario ha completado los 3 eventos clave en sus primeros 7 días.
 * @param {object} user 
 */
async function verificarActivacion(user) {
  try {
    const creationDate = new Date(user.created_at);
    const currentDate = new Date();
    const msInDay = 1000 * 60 * 60 * 24;
    const diasDesdeRegistro = (currentDate - creationDate) / msInDay;

    // Solo verificamos durante los primeros 7 días
    if (diasDesdeRegistro > 7) return;

    // Verificamos si ya está activado
    const { data: activadoData, error: errActivado } = await supabase
      .from('eventos_tracking')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('nombre_evento', 'agricultor_activado')
      .limit(1);

    if (errActivado) throw errActivado;
    if (activadoData && activadoData.length > 0) return; // Ya está activado

    // Verificamos cuáles de los 3 eventos ha completado
    const eventosRequeridos = ['precio_dia_consultado', 'historial_consultado', 'alerta_consultada'];
    const { data: eventos, error: errEventos } = await supabase
      .from('eventos_tracking')
      .select('nombre_evento')
      .eq('usuario_id', user.id)
      .in('nombre_evento', eventosRequeridos);

    if (errEventos) throw errEventos;

    const eventosUnicos = new Set(eventos?.map(e => e.nombre_evento) || []);
    
    // Si ha completado los 3, registramos la activación
    if (eventosUnicos.size === eventosRequeridos.length) {
      await registrarEvento('agricultor_activado', {
        dias_hasta_activacion: parseFloat(diasDesdeRegistro.toFixed(2))
      });
    }
  } catch (error) {
    console.error("Error al verificar activación:", error.message);
  }
}
