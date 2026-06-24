import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../js/supabase';
import { Sprout, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const REGIONES_LA_LIBERTAD = [
  'Trujillo', 'Ascope', 'Bolívar', 'Chepén', 'Julcán', 
  'Otuzco', 'Pacasmayo', 'Pataz', 'Sánchez Carrión', 
  'Santiago de Chuco', 'Gran Chimú', 'Virú'
];

const CULTIVOS_OPCIONES = [
  'Papa', 'Cebolla', 'Maíz', 'Arroz', 'Espárrago', 'Caña de azúcar'
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [region, setRegion] = useState(REGIONES_LA_LIBERTAD[0]);
  const [cultivos, setCultivos] = useState([]);

  const handleCultivoChange = (cultivo) => {
    if (cultivos.includes(cultivo)) {
      setCultivos(cultivos.filter(c => c !== cultivo));
    } else {
      setCultivos([...cultivos, cultivo]);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') setIsLogin(false);
    else setIsLogin(true);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        if (!nombre.trim()) throw new Error('Por favor ingresa tu nombre completo.');
        if (cultivos.length === 0) throw new Error('Selecciona al menos un cultivo principal.');
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nombre, region, cultivos_principales: cultivos }
          }
        });
        if (error) throw error;
        
        localStorage.setItem('pending_registro_completado', JSON.stringify({ 
          provincia: region, 
          cantidad_cultivos: cultivos.length 
        }));
        
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-12">
      {/* Card */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-agro-light p-4 rounded-2xl border border-emerald-100">
            <Sprout className="h-10 w-10 text-agro-primary" aria-hidden="true" />
          </div>
        </div>

        {/* Tabs — solo si no hay parámetro mode en la URL */}
        {!location.search && (
          <div className="flex items-center justify-center gap-1 mb-6 rounded-full bg-slate-100 p-1.5">
            <button
              type="button"
              id="tab-login"
              role="tab"
              aria-selected={isLogin}
              onClick={() => { setIsLogin(true); setShowPassword(false); setErrorMsg(''); }}
              className={`flex-1 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-white text-agro-dark shadow-sm' : 'text-slate-500 hover:text-agro-dark'}`}
            >
              Ingresar
            </button>
            <button
              type="button"
              id="tab-register"
              role="tab"
              aria-selected={!isLogin}
              onClick={() => { setIsLogin(false); setShowPassword(false); setErrorMsg(''); }}
              className={`flex-1 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-agro-dark shadow-sm' : 'text-slate-500 hover:text-agro-dark'}`}
            >
              Registrarse
            </button>
          </div>
        )}

        <h1 className="text-2xl font-extrabold text-center text-agro-dark mb-5 tracking-tight">
          {isLogin ? 'Ingresa a tu cuenta' : 'Regístrate como agricultor'}
        </h1>

        {/* Error message */}
        {errorMsg && (
          <div
            className="bg-red-50 border border-red-200 text-red-950 p-3.5 rounded-xl text-sm mb-5 flex items-start gap-2.5"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Campos solo para registro */}
          {!isLogin && (
            <>
              <div>
                <label htmlFor="register-nombre" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Nombre Completo
                </label>
                <input
                  id="register-nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary focus:bg-white outline-none transition-all font-medium placeholder:text-slate-400 text-slate-800"
                  placeholder="Ej. Juan Pérez"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="register-region" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Provincia (La Libertad)
                </label>
                <select
                  id="register-region"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary focus:bg-white outline-none transition-all font-medium text-slate-800"
                >
                  {REGIONES_LA_LIBERTAD.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <fieldset>
                <legend className="block text-sm font-bold text-slate-700 mb-2">
                  Cultivos Principales <span className="font-normal text-slate-400 text-xs">(elige al menos uno)</span>
                </legend>
                <div className="grid grid-cols-2 gap-2.5">
                  {CULTIVOS_OPCIONES.map(cultivo => (
                    <label
                      key={cultivo}
                      htmlFor={`cultivo-${cultivo}`}
                      className={`flex items-center gap-2.5 text-sm font-semibold px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        cultivos.includes(cultivo)
                          ? 'bg-emerald-50 border-agro-primary text-agro-dark'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-agro-primary/50'
                      }`}
                    >
                      <input
                        id={`cultivo-${cultivo}`}
                        type="checkbox"
                        checked={cultivos.includes(cultivo)}
                        onChange={() => handleCultivoChange(cultivo)}
                        className="rounded text-agro-primary focus:ring-agro-primary accent-agro-primary w-4 h-4"
                      />
                      {cultivo}
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-bold text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary focus:bg-white outline-none transition-all font-medium placeholder:text-slate-400 text-slate-800"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label htmlFor="login-password" className="block text-sm font-bold text-slate-700 mb-1.5">
              Contraseña
            </label>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary focus:bg-white outline-none transition-all font-medium placeholder:text-slate-400 text-slate-800 pr-12"
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute bottom-3 right-3.5 text-slate-400 hover:text-agro-dark transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword
                ? <EyeOff className="h-5 w-5" aria-hidden="true" />
                : <Eye className="h-5 w-5" aria-hidden="true" />
              }
            </button>
          </div>

          {/* Botón principal (primario) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-agro-primary hover:bg-agro-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-agro-primary/30 active:scale-[0.98]"
          >
            {loading
              ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /><span>Procesando...</span></>
              : <span>{isLogin ? 'Ingresar' : 'Registrarme'}</span>
            }
          </button>
        </form>

        {/* Enlace alternativo */}
        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setShowPassword(false); }}
            className="text-agro-primary font-bold text-sm hover:text-agro-dark hover:underline transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Ingresa aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}
