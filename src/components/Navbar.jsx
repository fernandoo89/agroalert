import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, signOut } from '../js/auth';
import { 
  Sprout, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutGrid, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar el menú desplegable al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return `px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
      isActive 
        ? 'bg-white/10 text-emerald-300 border border-white/10 shadow-inner' 
        : 'text-slate-100 hover:text-white hover:bg-white/5 border border-transparent'
    }`;
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="bg-gradient-to-r from-[#073628] via-[#0b543e] to-agro-primary text-white shadow-xl relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={session ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <Sprout className="h-6 w-6 text-emerald-300" />
              </div>
              <span className="font-black text-xl tracking-tight bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-200">
                AgroAlert
              </span>
            </Link>
          </div>

          {/* Menú de escritorio */}
          <div className="hidden md:flex items-center gap-6">
            {session && (
              <div className="flex items-center space-x-1.5">
                <Link to="/dashboard" className={getLinkStyle('/dashboard')}>
                  <LayoutGrid className="w-4 h-4" />
                  <span>Inicio</span>
                </Link>
                <Link to="/prices" className={getLinkStyle('/prices')}>
                  <TrendingUp className="w-4 h-4" />
                  <span>Precios</span>
                </Link>
                <Link to="/alerts" className={getLinkStyle('/alerts')}>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Alertas</span>
                </Link>
                <Link to="/recommendations" className={getLinkStyle('/recommendations')}>
                  <Lightbulb className="w-4 h-4" />
                  <span>Recomendaciones</span>
                </Link>
                {profile?.es_admin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="px-3.5 py-2 rounded-xl text-sm font-black bg-amber-600 hover:bg-amber-700 text-white shadow-md border border-amber-500/30 transition-all flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Panel Admin</span>
                  </Link>
                )}
              </div>
            )}

            {session ? (
              /* Menú de Perfil desplegable */
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl transition-all duration-200 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center border border-white/20">
                    {getInitials(profile?.nombre)}
                  </div>
                  <span className="max-w-[120px] truncate text-sm font-bold text-slate-100">{profile?.nombre || 'Mi Perfil'}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 w-52 mt-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs text-slate-400 font-semibold">Sesión iniciada como</p>
                      <p className="text-xs font-bold text-slate-200 truncate mt-0.5">{session.user.email}</p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Mi Perfil</span>
                    </Link>
                    
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-semibold border-t border-slate-800/60 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Botones públicas de sesión */
              <div className="flex items-center gap-3">
                <Link 
                  to="/login?mode=login" 
                  className="px-4 py-2 text-sm font-bold text-slate-200 hover:text-white transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/login?mode=register" 
                  className="px-5 py-2.5 text-sm font-bold bg-white text-agro-dark hover:bg-slate-100 rounded-xl transition-all duration-200 shadow-sm border border-white/10 active:scale-95"
                >
                  Registrarse
                </Link>
              </div>
            )}
            
            <ThemeToggle />
          </div>

          {/* Menú de móvil (Gatillo) */}
          <div className="-mr-2 flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white focus:outline-none transition-all"
              aria-label={menuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Panel móvil colapsable */}
      {menuOpen && (
        <div className="md:hidden bg-[#073628] border-t border-slate-800 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="px-3 pt-3 pb-4 space-y-1.5">
            {session ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/5 text-slate-100"
                >
                  <LayoutGrid className="w-5 h-5 text-slate-300" />
                  <span>Inicio</span>
                </Link>
                <Link 
                  to="/prices" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/5 text-slate-100"
                >
                  <TrendingUp className="w-5 h-5 text-slate-300" />
                  <span>Precios</span>
                </Link>
                <Link 
                  to="/alerts" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/5 text-slate-100"
                >
                  <AlertTriangle className="w-5 h-5 text-slate-300" />
                  <span>Alertas</span>
                </Link>
                <Link 
                  to="/recommendations" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/5 text-slate-100"
                >
                  <Lightbulb className="w-5 h-5 text-slate-300" />
                  <span>Recomendaciones</span>
                </Link>
                {profile?.es_admin && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black bg-amber-600/90 text-white"
                  >
                    <ShieldAlert className="w-5 h-5 text-white" />
                    <span>Panel Admin</span>
                  </Link>
                )}
                
                <div className="border-t border-slate-800/80 my-2 pt-2" />
                
                <Link 
                  to="/profile" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/5 text-slate-100"
                >
                  <User className="w-5 h-5 text-slate-300" />
                  <span>Mi Perfil</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-500/10 text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link 
                  to="/login?mode=login" 
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl text-sm font-bold hover:bg-white/5 text-slate-200 border border-slate-700/60"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/login?mode=register" 
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl text-sm font-bold bg-white text-agro-dark"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
