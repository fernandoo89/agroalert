import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PriceCard({ nombre, precioActual, tendencia }) {
  let icon = <Minus className="h-6 w-6 text-gray-400" />;
  let colorClass = "text-gray-600";
  
  if (tendencia === 'sube') {
    icon = <TrendingUp className="h-6 w-6 text-green-500" />;
    colorClass = "text-green-600";
  } else if (tendencia === 'baja') {
    icon = <TrendingDown className="h-6 w-6 text-red-500" />;
    colorClass = "text-red-600";
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
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
  );
}
