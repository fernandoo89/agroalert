import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { registrarEvento } from '../js/tracking';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PriceCard({ nombre, precioActual, tendencia }) {
  const [feedback, setFeedback] = useState(null);
  
  let icon = <Minus className="h-6 w-6 text-slate-400" aria-hidden="true" />;
  let trendLabel = "Sin cambio";
  let colorClass = "text-slate-600";
  
  if (tendencia === 'sube') {
    icon = <TrendingUp className="h-6 w-6 text-green-600 animate-pulse" aria-hidden="true" />;
    trendLabel = "Precio en alza";
    colorClass = "text-green-700 bg-green-50 border-green-200";
  } else if (tendencia === 'baja') {
    icon = <TrendingDown className="h-6 w-6 text-red-600" aria-hidden="true" />;
    trendLabel = "Precio en baja";
    colorClass = "text-red-700 bg-red-50 border-red-200";
  }

  useEffect(() => {
    const savedFeedback = localStorage.getItem(`feedback_precio_${nombre}`);
    if (savedFeedback) {
      setFeedback(savedFeedback);
    }
  }, [nombre]);

  const handleFeedback = async (val) => {
    setFeedback(val);
    localStorage.setItem(`feedback_precio_${nombre}`, val);
    
    try {
      await supabase.from('feedback_precios').insert({
        cultivo_nombre: nombre,
        precio_actual: parseFloat(precioActual),
        es_util: val === 'si',
        fecha: new Date().toISOString()
      });
    } catch (e) {
      console.warn("No se pudo registrar el feedback del precio en la base de datos (se guardó en local):", e);
    }
  };

  const handleCardClick = () => {
    registrarEvento('precio_dia_consultado', {
      cultivo: nombre,
      precio: parseFloat(precioActual)
    });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-800">{nombre}</h3>
          <div className={`p-1.5 rounded-lg border ${tendencia ? colorClass : 'border-transparent'}`} title={trendLabel}>
            {icon}
            <span className="sr-only">{trendLabel}</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Precio Promedio</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-agro-dark">S/ {parseFloat(precioActual).toFixed(2)}</span>
            <span className="text-sm font-semibold text-slate-500">x kg</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-500">¿Dato útil?</span>
        {feedback ? (
          <span className="text-xs font-bold text-green-800 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
            {feedback === 'si' ? '👍 Sí' : '👎 No'}
          </span>
        ) : (
          <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => handleFeedback('si')}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-800 hover:border-green-300 transition-all font-semibold active:scale-95"
            >
              <span>👍 Sí</span>
            </button>
            <button
              onClick={() => handleFeedback('no')}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-950 hover:border-red-300 transition-all font-semibold active:scale-95"
            >
              <span>👎 No</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
