import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { AlertTriangle, TrendingDown, Info, Share2 } from 'lucide-react';

export default function AlertCard({ alerta }) {
  const { id, tipo, mensaje, fecha, cultivos } = alerta;
  const [feedback, setFeedback] = useState(null);
  
  let badgeColor = 'bg-gray-100 text-gray-800 border-gray-200';
  let Icon = Info;
  let tipoText = 'General';

  if (tipo === 'sobreoferta') {
    badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
    Icon = AlertTriangle;
    tipoText = 'Sobreoferta';
  } else if (tipo === 'caida_precio') {
    badgeColor = 'bg-red-100 text-red-800 border-red-200';
    Icon = TrendingDown;
    tipoText = 'Caída de Precio';
  } else if (tipo === 'general') {
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
    Icon = Info;
  }

  useEffect(() => {
    const savedFeedback = localStorage.getItem(`feedback_alerta_${id}`);
    if (savedFeedback) {
      setFeedback(savedFeedback);
    }
  }, [id]);

  const handleFeedback = async (val) => {
    setFeedback(val);
    localStorage.setItem(`feedback_alerta_${id}`, val);
    
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

  const handleShare = () => {
    const cropText = cultivos?.nombre ? ` en el cultivo de ${cultivos.nombre.toUpperCase()}` : '';
    const text = `⚠️ *AgroAlert - Alerta de Mercado* ⚠️\n\nSe ha reportado una situación de *${tipoText.toUpperCase()}*${cropText}.\n\n*Mensaje:* ${mensaje}\n\n📅 _Fecha:_ ${formattedDate}\n\nConsulta precios y recomendaciones en tiempo real aquí: ${window.location.origin}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${badgeColor} shadow-sm bg-white`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="font-semibold text-sm uppercase tracking-wider">{tipoText}</span>
          {cultivos && cultivos.nombre && (
            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-medium border">
              {cultivos.nombre}
            </span>
          )}
        </div>
        <span className="text-xs font-medium opacity-75">{formattedDate}</span>
      </div>
      
      <p className="text-gray-800 text-lg mb-4 mt-2">
        {mensaje}
      </p>

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-lg font-bold hover:bg-[#128C7E] transition-colors w-full justify-center"
        >
          <Share2 className="h-5 w-5" />
          Compartir alerta por WhatsApp
        </button>

        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-sm font-medium text-gray-500">¿Te sirvió esta alerta?</span>
          {feedback ? (
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 w-fit">
              {feedback === 'si' ? '👍 ¡Gracias! Nos alegra que sirva.' : '👎 Gracias, mejoraremos el reporte.'}
            </span>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback('si')}
                className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all font-semibold"
              >
                👍 Sí, útil
              </button>
              <button
                onClick={() => handleFeedback('no')}
                className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all font-semibold"
              >
                👎 No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
