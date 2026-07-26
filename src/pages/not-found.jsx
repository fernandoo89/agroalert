import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="bg-amber-50 dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 p-6 rounded-3xl mb-6 shadow-sm animate-bounce">
        <Compass className="h-16 w-16 text-amber-500" aria-hidden="true" />
      </div>
      
      <h1 className="text-6xl font-black text-agro-dark dark:text-slate-100 tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">¿Te has perdido en los cultivos?</h2>
      
      <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 font-medium leading-relaxed">
        Lo sentimos, la página que buscas no existe o ha sido movida temporalmente. Vuelve al camino principal para consultar los precios y alertas.
      </p>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2.5 bg-agro-primary hover:bg-agro-dark text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-agro-primary/20 hover:shadow-lg active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        <span>Volver al Inicio</span>
      </Link>
    </div>
  );
}
