import { AlertTriangle, TrendingDown, Info, Share2 } from 'lucide-react';

export default function AlertCard({ alerta }) {
  const { tipo, mensaje, fecha, cultivos } = alerta;
  
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

  const handleShare = () => {
    const text = `⚠️ AgroAlert: ${mensaje}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const formattedDate = new Date(fecha).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

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

      <button 
        onClick={handleShare}
        className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#128C7E] transition-colors w-full justify-center sm:w-auto"
      >
        <Share2 className="h-4 w-4" />
        Compartir por WhatsApp
      </button>
    </div>
  );
}
