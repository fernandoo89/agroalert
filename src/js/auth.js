import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { registrarEvento } from './tracking';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkPendingRegistration();
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkPendingRegistration();
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkPendingRegistration = () => {
    const pendingReg = localStorage.getItem('pending_registro_completado');
    if (pendingReg) {
      try {
        const data = JSON.parse(pendingReg);
        registrarEvento('registro_completado', data);
        localStorage.removeItem('pending_registro_completado');
      } catch (e) {
        console.error(e);
      }
    }
  };

  return { session, profile, loading };
}

export const signOut = async () => {
  await supabase.auth.signOut();
};
