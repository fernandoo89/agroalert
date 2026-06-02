import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, signOut } from '../js/auth';
import { Sprout, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoginPage = location.pathname === '/login';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = session ? (
    <>
      <Link to="/dashboard" className="block px-3 py-2 rounded-md hover:bg-agro-dark">Inicio</Link>
      <Link to="/prices" className="block px-3 py-2 rounded-md hover:bg-agro-dark">Precios</Link>
      <Link to="/alerts" className="block px-3 py-2 rounded-md hover:bg-agro-dark">Alertas</Link>
      <Link to="/recommendations" className="block px-3 py-2 rounded-md hover:bg-agro-dark">Recomendaciones</Link>
      {profile?.es_admin && (
        <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700">Admin Panel</Link>
      )}
    </>
  ) : null;

  return (
    <nav className="bg-agro-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={session ? "/dashboard" : "/"} className="flex items-center gap-2">
              <Sprout className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">AgroAlert</span>
            </Link>
          </div>
          {session ? (
            <div className="hidden md:block flex-1">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks}
                <div className="relative group ml-4">
                  <button className="flex items-center gap-2 hover:text-gray-200">
                    <User className="h-5 w-5" />
                    <span className="max-w-[100px] truncate">{profile?.nombre || 'Perfil'}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl hidden group-hover:block z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</Link>
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar Sesión</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <Link to="/login?mode=login" className="block px-4 py-2 rounded-md bg-white text-agro-primary hover:bg-gray-100 font-medium">Iniciar sesión</Link>
                <Link to="/login?mode=register" className="block px-4 py-2 rounded-md bg-white text-agro-dark hover:bg-gray-100 font-medium">Registrarse</Link>
              </div>
            </div>
          )}
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-agro-dark focus:outline-none"
              aria-label={menuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-agro-primary border-t border-agro-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {session ? (
              <>
                {navLinks}
                <Link to="/profile" className="block px-3 py-2 rounded-md hover:bg-agro-dark">Mi Perfil</Link>
                <button onClick={handleSignOut} className="block w-full text-left px-3 py-2 rounded-md hover:bg-agro-dark">Cerrar Sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md bg-white text-agro-primary hover:bg-gray-100">Iniciar sesión</Link>
                <Link to="/login?mode=register" className="block px-3 py-2 rounded-md bg-white text-agro-dark hover:bg-gray-100">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
