import { Link } from 'react-router-dom';
import { Globe, Share2, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 xl:grid-cols-[1.4fr,1fr,1fr,1fr]">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">AgroAlert</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Revolucionando la agricultura en La Libertad con precios reales,
              alertas de mercado y recomendaciones prácticas para que tomes mejores decisiones.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-4">Plataforma</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/" className="hover:text-white">Cómo funciona</Link></li>
              <li><Link to="/prices" className="hover:text-white">Precios</Link></li>
              <li><Link to="/recommendations" className="hover:text-white">Beneficios</Link></li>
              <li><Link to="/alerts" className="hover:text-white">Seguridad</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-4">Empresa</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/" className="hover:text-white">Sobre nosotros</Link></li>
              <li><Link to="/" className="hover:text-white">Carreras</Link></li>
              <li><Link to="/" className="hover:text-white">Prensa</Link></li>
              <li><Link to="/" className="hover:text-white">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/" className="hover:text-white">Términos de servicio</Link></li>
              <li><Link to="/" className="hover:text-white">Política de privacidad</Link></li>
              <li><Link to="/" className="hover:text-white">Libro de reclamaciones</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} AgroAlert La Libertad. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" aria-label="Sitio web" className="hover:text-white"><Globe className="h-5 w-5" /></a>
            <a href="#" aria-label="Compartir" className="hover:text-white"><Share2 className="h-5 w-5" /></a>
            <a href="#" aria-label="Mensajes" className="hover:text-white"><MessageSquare className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
