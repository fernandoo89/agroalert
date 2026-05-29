import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../js/supabase';
import { Sprout, Eye, EyeOff } from 'lucide-react';

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

  // Formularios
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
    setIsLogin(params.get('mode') !== 'register');
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
        if (!nombre || cultivos.length === 0) {
          throw new Error("Por favor completa tu nombre y selecciona al menos un cultivo.");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre,
              region,
              cultivos_principales: cultivos
            }
          }
        });
        if (error) throw error;
        // Dependiendo de la configuración de Supabase, podría requerir confirmación de email.
        // Asumimos autoconfirmación para MVP.
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="bg-agro-light p-3 rounded-full">
          <Sprout className="h-10 w-10 text-agro-primary" />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-1 mb-6 rounded-full bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => { setIsLogin(true); setShowPassword(false); setErrorMsg(''); }}
          className={`px-5 py-2 rounded-full font-semibold ${isLogin ? 'bg-white text-agro-dark' : 'text-gray-500 hover:text-agro-dark'}`}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => { setIsLogin(false); setShowPassword(false); setErrorMsg(''); }}
          className={`px-5 py-2 rounded-full font-semibold ${!isLogin ? 'bg-white text-agro-dark' : 'text-gray-500 hover:text-agro-dark'}`}
        >
          Registrarse
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center text-agro-dark mb-4">
        {isLogin ? 'Ingresa a tu cuenta' : 'Regístrate como agricultor'}
      </h2>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                required 
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary outline-none"
                placeholder="Ej. Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provincia (La Libertad)</label>
              <select 
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary outline-none"
              >
                {REGIONES_LA_LIBERTAD.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cultivos Principales</label>
              <div className="grid grid-cols-2 gap-2">
                {CULTIVOS_OPCIONES.map(cultivo => (
                  <label key={cultivo} className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      checked={cultivos.includes(cultivo)}
                      onChange={() => handleCultivoChange(cultivo)}
                      className="rounded text-agro-primary focus:ring-agro-primary"
                    />
                    {cultivo}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary outline-none"
            placeholder="correo@ejemplo.com"
          />
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary outline-none pr-12"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-agro-dark"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-agro-primary text-white font-bold py-3 rounded-lg hover:bg-agro-dark transition-colors mt-6 disabled:opacity-50"
        >
          {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarme')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
          className="text-agro-primary font-medium hover:underline"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Ingresa aquí'}
        </button>
      </div>
    </div>
  );
}
