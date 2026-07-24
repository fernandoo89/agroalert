import { useState, useEffect } from 'react';
import { useAuth, signOut } from '../js/auth';
import { supabase } from '../js/supabase';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Loader2, CheckCircle, AlertCircle, LogOut, Star } from 'lucide-react';
import { SkeletonForm } from '../components/Skeleton';

const CULTIVOS_DISPONIBLES = ['Papa', 'Cebolla', 'Maíz', 'Arroz', 'Espárrago', 'Caña de azúcar', 'Tomate', 'Zanahoria', 'Lechuga', 'Ají'];

export default function Profile() {
  const { session, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [region, setRegion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '');
      setRegion(profile.region || '');
      setTelefono(profile.telefono || '');
      setFavoritos(profile.cultivos_favoritos || []);
    }
  }, [profile]);

  const toggleFavorito = (cultivo) => {
    setFavoritos(prev =>
      prev.includes(cultivo) ? prev.filter(c => c !== cultivo) : [...prev, cultivo]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nombre, region, telefono, cultivos_favoritos: favoritos })
        .eq('id', session.user.id);

      if (error) throw error;
      setMsg('Perfil actualizado correctamente.');
      setMsgType('ok');
    } catch (err) {
      setMsg('Error al guardar el perfil: ' + err.message);
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-10">
      {authLoading ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <SkeletonForm />
        </div>
      ) : (
      <>
      {/* Encabezado */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-agro-light border-2 border-agro-primary/20 mb-3">
          <UserCircle className="h-14 w-14 text-agro-primary" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-extrabold text-agro-dark tracking-tight">Mi Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">{session?.user?.email}</p>
      </header>

      {/* Formulario */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        {msg && (
          <div
            className={`mb-5 p-3.5 rounded-xl text-sm flex items-start gap-2.5 border ${
              msgType === 'ok'
                ? 'bg-green-50 text-green-900 border-green-200'
                : 'bg-red-50 text-red-950 border-red-200'
            }`}
            role="alert"
            aria-live="polite"
          >
            {msgType === 'ok'
              ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              : <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            }
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="profile-nombre" className="block text-sm font-bold text-slate-700 mb-1.5">
              Nombre Completo
            </label>
            <input
              id="profile-nombre"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
              placeholder="Tu nombre completo"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="profile-region" className="block text-sm font-bold text-slate-700 mb-1.5">
              Provincia de La Libertad
            </label>
            <input
              id="profile-region"
              type="text"
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
              placeholder="Ej. Trujillo"
            />
          </div>

          <div>
            <label htmlFor="profile-telefono" className="block text-sm font-bold text-slate-700 mb-1.5">
              Teléfono / WhatsApp <span className="font-normal text-slate-400 text-xs">(opcional)</span>
            </label>
            <input
              id="profile-telefono"
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-agro-primary focus:bg-white outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
              placeholder="Ej. 987 654 321"
              autoComplete="tel"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span>Cultivos Favoritos</span>
              <span className="font-normal text-slate-400 text-xs">(se muestran primero en precios y dashboard)</span>
            </legend>
            <div className="grid grid-cols-2 gap-2.5">
              {CULTIVOS_DISPONIBLES.map(cultivo => (
                <label
                  key={cultivo}
                  htmlFor={`fav-${cultivo}`}
                  className={`flex items-center gap-2.5 text-sm font-semibold px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    favoritos.includes(cultivo)
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300/50'
                  }`}
                >
                  <input
                    id={`fav-${cultivo}`}
                    type="checkbox"
                    checked={favoritos.includes(cultivo)}
                    onChange={() => toggleFavorito(cultivo)}
                    className="rounded text-amber-500 focus:ring-amber-400 accent-amber-500 w-4 h-4"
                  />
                  {cultivo}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Botón primario */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-agro-primary hover:bg-agro-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-agro-primary/20 active:scale-[0.98]"
          >
            {loading
              ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /><span>Guardando...</span></>
              : <span>Guardar Cambios</span>
            }
          </button>
        </form>
      </div>

      {/* Botón secundario — Cerrar sesión */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2.5 bg-white dark:bg-slate-800 text-red-600 font-bold py-3.5 rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-sm active:scale-[0.98]"
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
        <span>Cerrar Sesión</span>
      </button>
      </>
      )}
    </div>
  );
}
