import { useState, useEffect } from 'react';
import { useAuth, signOut } from '../js/auth';
import { supabase } from '../js/supabase';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

export default function Profile() {
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  
  const [nombre, setNombre] = useState('');
  const [region, setRegion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '');
      setRegion(profile.region || '');
      setTelefono(profile.telefono || '');
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nombre, region, telefono })
        .eq('id', session.user.id);
        
      if (error) throw error;
      setMsg('Perfil actualizado correctamente.');
    } catch (err) {
      setMsg('Error actualizando perfil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header className="text-center mb-8">
        <UserCircle className="h-20 w-20 mx-auto text-agro-primary mb-2" />
        <h1 className="text-3xl font-bold text-agro-dark">Mi Perfil</h1>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-center text-sm">{msg}</div>}
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
            <input 
              type="text" 
              value={region} 
              onChange={e => setRegion(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              value={telefono} 
              onChange={e => setTelefono(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-primary outline-none"
              placeholder="Ej. 987654321"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-agro-primary text-white font-bold py-3 rounded-lg hover:bg-agro-dark transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>

      <button 
        onClick={handleSignOut}
        className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors border"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
