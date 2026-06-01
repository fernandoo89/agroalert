import { useState, useEffect } from 'react';
import { supabase } from '../js/supabase';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PriceCard({ nombre, precioActual, tendencia }) {
  const [feedback, setFeedback] = useState(null);
  
  let icon = <Minus className="h-6 w-6 text-gray-400" />;
  let colorClass = "text-gray-600";
  
  if (tendencia === 'sube') {
    icon = <TrendingUp className="h-6 w-6 text-green-500" />;
    colorClass = "text-green-600";
  } else if (tendencia === 'baja') {
    icon = <TrendingDown className="h-6 w-6 text-red-500" />;
    colorClass = "text-red-600";
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{nombre}</h3>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Precio Promedio</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-agro-dark">S/ {precioActual}</span>
            <span className="text-sm font-medium text-gray-500">x kg</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500">¿Dato útil?</span>
        {feedback ? (
          <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            {feedback === 'si' ? '👍 Sí' : '👎 No'}
          </span>
        ) : (
          <div className="flex gap-1.5">
            <button
              onClick={() => handleFeedback('si')}
              className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all font-semibold"
            >
              👍 Sí
            </button>
            <button
              onClick={() => handleFeedback('no')}
              className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all font-semibold"
            >
              👎 No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
