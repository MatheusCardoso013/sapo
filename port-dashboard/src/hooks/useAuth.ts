import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Role } from '../pages/Auth';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setAuthState({ user: null, profile: null, loading: false });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setAuthState({ user: null, profile: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      
      setAuthState({
        user: user,
        profile: data,
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setAuthState({ user: null, profile: null, loading: false });
    }
  };

  const signUp = async (email: string, password: string, name: string, area: string, role: Role = 'cliente') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            name,
            area,
            role,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            name,
            area,
            role,
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
        }
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    user: authState.user,
    profile: authState.profile,
    loading: authState.loading,
    signUp,
    signIn,
    signOut,
  };
};
