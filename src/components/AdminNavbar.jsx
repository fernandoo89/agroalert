import { Link, useNavigate } from 'react-router-dom';
import { useAuth, signOut } from '../js/auth';
import { Sprout, Menu, X, LogOut, Home } from 'lucide-react';
import { useState } from 'react';

export default function AdminNavbar() {
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleBackToSite = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="bg-yellow-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Sprout className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">AgroAlert Admin</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md hover:bg-yellow-700">Dashboard</Link>
              <Link to="/admin/prices" className="block px-3 py-2 rounded-md hover:bg-yellow-700">Precios</Link>
              <Link to="/admin/alerts" className="block px-3 py-2 rounded-md hover:bg-yellow-700">Alertas</Link>
              <Link to="/admin/recommendations" className="block px-3 py-2 rounded-md hover:bg-yellow-700">Recomendaciones</Link>
              
              <div className="relative group ml-4 pl-4 border-l border-yellow-500 flex items-center gap-3">
                <span className="text-sm max-w-[120px] truncate">{profile?.nombre || 'Admin'}</span>
                
                <button onClick={handleBackToSite} className="flex items-center gap-1 hover:bg-yellow-700 px-2 py-1 rounded transition-colors" title="Volver al sitio">
                  <Home className="h-5 w-5" />
                  <span className="text-xs">Ir a sitio</span>
                </button>
                
                <button onClick={handleSignOut} className="flex items-center gap-1 hover:bg-yellow-700 px-2 py-1 rounded transition-colors" title="Cerrar sesión">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-yellow-700 focus:outline-none">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-yellow-600 border-t border-yellow-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md hover:bg-yellow-700">Dashboard</Link>
            <Link to="/admin/prices" className="block px-3 py-2 rounded-md hover:bg-yellow-700">Precios</Link>
            <Link to="/admin/alerts" className="block px-3 py-2 rounded-md hover:bg-yellow-700">Alertas</Link>
            <Link to="/admin/recommendations" className="block px-3 py-2 rounded-md hover:bg-yellow-700">Recomendaciones</Link>
            <div className="px-3 py-2 border-t border-yellow-700 mt-2">
              <button onClick={handleBackToSite} className="w-full text-left flex items-center gap-2 hover:bg-yellow-700 px-2 py-1 rounded">
                <Home className="h-4 w-4" /> Ir a sitio
              </button>
              <button onClick={handleSignOut} className="w-full text-left flex items-center gap-2 hover:bg-yellow-700 px-2 py-1 rounded mt-1">
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
