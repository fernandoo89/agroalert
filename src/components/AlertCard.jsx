import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { registrarEvento } from '../js/tracking';
import { AlertTriangle, TrendingDown, Info, Share2 } from 'lucide-react';

export default function AlertCard({ alerta }) {
  const { id, tipo, mensaje, fecha, cultivos } = alerta;
  const [feedback, setFeedback] = useState(null);
  
  let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
  let Icon = Info;
  let tipoText = 'General';

  if (tipo === 'sobreoferta') {
    badgeColor = 'bg-yellow-50 text-yellow-900 border-yellow-200';
    Icon = AlertTriangle;
    tipoText = 'Sobreoferta';
  } else if (tipo === 'caida_precio') {
    badgeColor = 'bg-red-50 text-red-950 border-red-200';
    Icon = TrendingDown;
    tipoText = 'Caída de Precio';
  } else if (tipo === 'general') {
    badgeColor = 'bg-blue-50 text-blue-900 border-blue-200';
    Icon = Info;
  }

  useEffect(() => {
    const savedFeedback = localStorage.getItem(`feedback_alerta_${id}`);
    if (savedFeedback) {
      setFeedback(savedFeedback);
    }
  }, [id]);

  const handleFeedback = async (e, val) => {
    if (e) e.stopPropagation();
    setFeedback(val);
    localStorage.setItem(`feedback_alerta_${id}`, val);
    
    // Register event tracking
    registrarEvento('alerta_valorada', {
      cultivo: cultivos?.nombre || null,
      alerta_id: id,
      valoracion: val === 'si' ? 'util' : 'no_util'
    });

    try {
      await supabase.from('feedback_alertas').insert({
        alerta_id: id,
        es_util: val === 'si',
        fecha: new Date().toISOString()
      });
    } catch (e) {
      console.warn("No se pudo registrar el feedback en la base de datos (se guardó en local):", e);
    }
  };

  const formattedDate = new Date(fecha).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const handleShare = (e) => {
    if (e) e.stopPropagation();
    
    registrarEvento('alerta_compartida_whatsapp', {
      cultivo: cultivos?.nombre || null,
      alerta_id: id
    });

    const cropText = cultivos?.nombre ? ` en el cultivo de ${cultivos.nombre.toUpperCase()}` : '';
    const text = `⚠️ *AgroAlert - Alerta de Mercado* ⚠️\n\nSe ha reportado una situación de *${tipoText.toUpperCase()}*${cropText}.\n\n*Mensaje:* ${mensaje}\n\n📅 _Fecha:_ ${formattedDate}\n\nConsulta precios y recomendaciones en tiempo real aquí: ${window.location.origin}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCardClick = () => {
    registrarEvento('alerta_consultada', {
      cultivo: cultivos?.nombre || null,
      alerta_id: id,
      tipo_alerta: tipo
    });
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`p-5 rounded-2xl border-2 ${badgeColor} shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="font-bold text-xs uppercase tracking-wider">{tipoText}</span>
          {cultivos && cultivos.nombre && (
            <span className="bg-white text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-slate-200/80">
              {cultivos.nombre}
            </span>
          )}
        </div>
        <span className="text-xs font-medium opacity-80">{formattedDate}</span>
      </div>
      
      <p className="text-slate-800 text-base md:text-lg font-medium mb-4 mt-2 leading-relaxed">
        {mensaje}
      </p>

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-[#128C7E] hover:bg-[#0e6e63] text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 w-full justify-center shadow-sm shadow-[#128C7E]/20 active:scale-[0.98]"
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
          Compartir alerta por WhatsApp
        </button>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <span className="text-sm font-medium text-slate-500">¿Te sirvió esta alerta?</span>
          {feedback ? (
            <span className="text-xs font-bold text-green-800 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200/80 w-fit">
              {feedback === 'si' ? '👍 ¡Gracias! Nos alegra que sirva.' : '👎 Gracias, mejoraremos el reporte.'}
            </span>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={(e) => handleFeedback(e, 'si')}
                className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-green-50 hover:text-green-800 hover:border-green-300 transition-all font-semibold active:scale-95"
              >
                <span>👍 Sí, útil</span>
              </button>
              <button
                onClick={(e) => handleFeedback(e, 'no')}
                className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-950 hover:border-red-300 transition-all font-semibold active:scale-95"
              >
                <span>👎 No</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
